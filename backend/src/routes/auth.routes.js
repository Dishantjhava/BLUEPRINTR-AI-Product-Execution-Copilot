const express = require('express');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const User = require('../models/User.model');
const { protect } = require('../middleware/auth.middleware');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_for_development';
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Sign Up
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Please provide all required fields' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists with this email' });
    }

    const user = new User({ name, email, password });
    await user.save();

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '7d' });

    res.cookie('blueprintr_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.status(201).json({
      success: true,
      user: { id: user._id, name: user.name, email: user.email }
    });
  } catch (error) {
    console.error('Signup Error:', error);
    res.status(500).json({ error: 'Failed to create account' });
  }
});

// Sign In
router.post('/signin', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Please provide email and password' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '7d' });

    res.cookie('blueprintr_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.json({
      success: true,
      user: { id: user._id, name: user.name, email: user.email }
    });
  } catch (error) {
    console.error('Signin Error:', error);
    res.status(500).json({ error: 'Failed to sign in' });
  }
});

// Google OAuth Integration
router.post('/google', async (req, res) => {
  try {
    const { credential } = req.body;
    
    if (!credential) {
      return res.status(400).json({ error: 'Google credential is required' });
    }

    // Verify the Google JWT token
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    
    const payload = ticket.getPayload();
    const { email, name, sub: googleId } = payload;

    // Check if user already exists
    let user = await User.findOne({ email });

    if (user) {
      // Update googleId if not present
      if (!user.googleId) {
        user.googleId = googleId;
        await user.save();
      }
    } else {
      // Create new user
      user = new User({
        name,
        email,
        googleId,
        // Password is not required per our schema for OAuth users
      });
      await user.save();
    }

    // Generate our app's JWT
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '7d' });

    res.cookie('blueprintr_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.json({
      success: true,
      user: { id: user._id, name: user.name, email: user.email }
    });

  } catch (error) {
    console.error('Google OAuth Error:', error);
    res.status(500).json({ error: 'Failed to authenticate with Google' });
  }
});

// GitHub OAuth Integration
router.post('/github', async (req, res) => {
  try {
    const { code } = req.body;
    
    if (!code) {
      return res.status(400).json({ error: 'GitHub authorization code is required' });
    }

    // 1. Exchange code for access token
    const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
      }),
    });
    
    const tokenData = await tokenResponse.json();
    console.log('GitHub Token Response:', tokenData);
    const accessToken = tokenData.access_token;
    
    if (!accessToken) {
      return res.status(400).json({ error: 'Failed to retrieve GitHub access token' });
    }

    // 2. Fetch User Profile
    const userResponse = await fetch('https://api.github.com/user', {
      headers: { 
        Authorization: `Bearer ${accessToken}`,
        'User-Agent': 'BLUEPRINTR-App'
      },
    });
    const githubUser = await userResponse.json();

    // 3. Fetch User Emails (since email might be private in profile)
    const emailResponse = await fetch('https://api.github.com/user/emails', {
      headers: { 
        Authorization: `Bearer ${accessToken}`,
        'User-Agent': 'BLUEPRINTR-App'
      },
    });
    const emails = await emailResponse.json();
    
    if (!Array.isArray(emails)) {
      console.error('GitHub Emails API Error:', emails);
      return res.status(400).json({ error: 'Failed to retrieve emails from GitHub' });
    }
    const primaryEmailObj = emails.find(e => e.primary) || emails[0];
    const email = primaryEmailObj?.email;

    if (!email) {
      return res.status(400).json({ error: 'No email found linked to this GitHub account' });
    }

    const name = githubUser.name || githubUser.login;
    const githubId = githubUser.id.toString();

    // 4. Find or Create User in MongoDB
    let user = await User.findOne({ email });

    if (user) {
      if (!user.githubId) {
        user.githubId = githubId;
        await user.save();
      }
    } else {
      user = new User({
        name,
        email,
        githubId,
      });
      await user.save();
    }

    // 5. Generate app JWT
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '7d' });

    res.cookie('blueprintr_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.json({
      success: true,
      user: { id: user._id, name: user.name, email: user.email }
    });

  } catch (error) {
    console.error('GitHub OAuth Error:', error);
    res.status(500).json({ error: 'Failed to authenticate with GitHub' });
  }
});

// Get current user
router.get('/me', protect, (req, res) => {
  res.json({
    success: true,
    user: { id: req.user._id, name: req.user.name, email: req.user.email }
  });
});

// Logout
router.post('/logout', (req, res) => {
  res.cookie('blueprintr_token', '', {
    httpOnly: true,
    expires: new Date(0),
  });
  res.json({ success: true, message: 'Logged out successfully' });
});

module.exports = router;
