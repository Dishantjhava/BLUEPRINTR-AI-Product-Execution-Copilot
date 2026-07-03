const express = require('express');
const nodemailer = require('nodemailer');

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { firstName, lastName, email, subject, message } = req.body;

    if (!email || !message) {
      return res.status(400).json({ error: 'Email and Message are required' });
    }

    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      return res.status(500).json({ error: 'Email configuration is missing on the server' });
    }

    // Configure Nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"${firstName || 'User'} ${lastName || ''}" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER, // Sending to yourself
      replyTo: email,
      subject: `[BLUEPRINTR Support] ${subject || 'New Message'}`,
      text: `
You have received a new support request from BLUEPRINTR.

From: ${firstName || 'Unknown'} ${lastName || ''}
Email: ${email}
Subject: ${subject}

Message:
${message}
      `,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #4f46e5;">New Support Request</h2>
          <p><strong>From:</strong> ${firstName || 'Unknown'} ${lastName || ''}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Subject:</strong> ${subject}</p>
          <hr style="border: none; border-top: 1px solid #eaeaea; margin: 20px 0;" />
          <p style="white-space: pre-wrap; color: #333;">${message}</p>
        </div>
      `,
    };

    try {
      await transporter.sendMail(mailOptions);
      res.json({ success: true, message: 'Email sent successfully' });
    } catch (emailError) {
      console.warn('SMTP Send Failed. Falling back to Console Logging:', emailError.message);
      console.log('--- DEMO / FALLBACK SUPPORT TICKET ---');
      console.log(`From: ${firstName || 'Unknown'} ${lastName || ''} <${email}>`);
      console.log(`Subject: ${subject || 'New Message'}`);
      console.log('Message:', message);
      console.log('--------------------------------------');
      res.json({ success: true, message: 'Email logged to server console (SMTP fallback)' });
    }
  } catch (error) {
    console.error('Support Route Error:', error);
    res.status(500).json({ error: 'Failed to process support request' });
  }
});

module.exports = router;
