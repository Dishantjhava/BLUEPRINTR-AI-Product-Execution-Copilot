require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { OpenAI } = require('openai');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth.routes');
const supportRoutes = require('./routes/support.routes');
const projectRoutes = require('./routes/project.routes');
const blueprintRoutes = require('./routes/blueprint.routes');

const app = express();
const port = 5000;

// Connect to MongoDB
connectDB();

// Enable CORS for all routes with credentials
app.use(cors({
  origin: process.env.FRONTEND_URL || ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true
}));

// Parse JSON request bodies
app.use(express.json());

// Parse Cookies
app.use(cookieParser());

// Initialize default OpenRouter client
const defaultOpenai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.GEMINI_API_KEY, 
  defaultHeaders: {
    "HTTP-Referer": "http://localhost:3000",
    "X-Title": "BLUEPRINTR",
  }
});

// Main API endpoint
app.get('/api/status', (req, res) => {
  res.json({ message: 'Frontend and Backend are connected successfully!' });
});

// Authentication Routes
app.use('/api/auth', authRoutes);

// Support Routes
app.use('/api/support', supportRoutes);

// Project Routes (protected + ownership-checked)
app.use('/api/projects', projectRoutes);

// Blueprint Routes (protected + ownership-checked)
app.use('/api/blueprints', blueprintRoutes);

app.post('/api/askAI', async (req, res) => {
  const { idea, customApiKey } = req.body;
  if (!idea) {
    return res.status(400).json({ error: 'Idea is required' });
  }

  const openai = customApiKey ? new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: customApiKey,
    defaultHeaders: {
      "HTTP-Referer": "http://localhost:3000",
      "X-Title": "BLUEPRINTR",
    }
  }) : defaultOpenai;

  try {
    const prompt = `You are an expert software architect and full-stack engineer. Your task is to convert a raw product idea into a complete, structured, developer-ready blueprint.

STRICT INSTRUCTIONS:
- Return ONLY valid JSON (no explanation, no markdown, no text before or after)
- The JSON must be clean and directly parseable
- Do NOT include backticks or comments

Output format:
{
  "product_summary": {
    "title": "",
    "description": ""
  },
  "features": [
    {
      "name": "",
      "description": "",
      "priority": "high | medium | low"
    }
  ],
  "tasks": [
    {
      "title": "",
      "description": "",
      "priority": "high | medium | low",
      "estimated_time": ""
    }
  ],
  "apis": [
    {
      "method": "GET | POST | PUT | DELETE",
      "endpoint": "",
      "description": ""
    }
  ],
  "database_schema": {
    "collections": [
      {
        "name": "",
        "fields": [
          {
            "field_name": "",
            "type": "",
            "required": true
          }
        ]
      }
    ]
  },
  "starter_code": {
    "backend": "",
    "routes": "",
    "models": ""
  },
  "project_structure": {
    "structure": "String containing the exact ASCII folder tree representation (e.g. ├── backend/\\n│   ├── src/...)",
    "setupCommands": ["Command 1", "Command 2"],
    "envVariables": [
      { "key": "", "description": "", "example": "" }
    ],
    "techStack": {
      "frontend": ["React", "Tailwind"],
      "backend": ["Node", "Express"],
      "database": ["MongoDB"],
      "devops": ["Docker"]
    }
  }
}

GUIDELINES:
- Features should cover core product functionality
- Tasks should be actionable development steps
- APIs should follow REST principles
- Schema should be MongoDB-style
- Code should be basic Express.js starter code
- Structure MUST be a raw ASCII string that visually resembles the standard file tree output
- Keep output structured, concise, and production-oriented`;

    const response = await openai.chat.completions.create({
      model: "google/gemini-2.5-flash",
      messages: [
        { role: "system", content: prompt },
        { role: "user", content: `Input Idea: "${idea}"` }
      ],
      response_format: { type: "json_object" }, // Enforce JSON if supported
      max_tokens: 8000
    });

    const responseText = response.choices[0].message.content.trim();
    
    // Improved cleaning logic
    let cleanText = responseText;
    if (responseText.includes('```')) {
      cleanText = responseText.replace(/```json\n?|```/g, '').trim();
    }
    
    const solution = JSON.parse(cleanText);
    res.json({ success: true, solution });
  } catch (error) {
    console.error("AI Error:", error);
    if (error?.status === 429 || error?.message?.includes('quota')) {
      res.status(429).json({ error: 'AI API quota exceeded. Please check your OpenRouter credits.' });
    } else {
      res.status(500).json({ error: error.message || 'Failed to analyze idea' });
    }
  }
});

app.post('/api/chat', async (req, res) => {
  const { messages, blueprint, customApiKey } = req.body;
  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'Messages array is required' });
  }

  const openai = customApiKey ? new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: customApiKey,
    defaultHeaders: {
      "HTTP-Referer": "http://localhost:3000",
      "X-Title": "BLUEPRINTR",
    }
  }) : defaultOpenai;

  try {
    const systemPrompt = `You are an AI Product Execution Copilot. You help developers refine, build, and debug their software architecture blueprints.
Current blueprint context:
${blueprint ? JSON.stringify(blueprint, null, 2) : "No blueprint generated yet."}

CRITICAL RULES:
- Reference actual feature names, task titles, and API paths from the provided blueprint context. Never give generic advice that could apply to any project.
- Do NOT generate a formal document with headers like "Executive Summary" or "Implementation Plan" unless the user explicitly asks for a document or report.
- If the user says "continue working on X", look at the blueprint's incomplete tasks/roadmap and suggest the next 2-3 concrete actions.
- Keep responses conversational, specific, and actionable — like a senior engineer reviewing the actual codebase, not a consultant writing a proposal.
- Use markdown lists, bold text, and code blocks for readability where appropriate.`;

    const apiMessages = [
      { role: "system", content: systemPrompt },
      ...messages.map(m => ({ role: m.role, content: m.content }))
    ];

    const response = await openai.chat.completions.create({
      model: "google/gemini-2.5-flash",
      messages: apiMessages,
      max_tokens: 4000,
      temperature: 0.6
    });

    res.json({ success: true, reply: response.choices[0].message.content });
  } catch (error) {
    console.error("Chat Error:", error);
    res.status(500).json({ error: error.message || 'Failed to chat with AI' });
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
