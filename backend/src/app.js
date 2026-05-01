require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { OpenAI } = require('openai');

const app = express();
const port = 5000;

// Enable CORS for all routes
app.use(cors());

// Parse JSON request bodies
app.use(express.json());

// Initialize OpenRouter client
const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.GEMINI_API_KEY, // Using the same env variable name for consistency
  defaultHeaders: {
    "HTTP-Referer": "http://localhost:3000", // Optional, for OpenRouter analytics
    "X-Title": "BLUEPRINTR", // Optional
  }
});

// Main API endpoint
app.get('/api/status', (req, res) => {
  res.json({ message: 'Frontend and Backend are connected successfully!' });
});

app.post('/api/askAI', async (req, res) => {
  const { idea } = req.body;
  if (!idea) {
    return res.status(400).json({ error: 'Idea is required' });
  }

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
  }
}

GUIDELINES:
- Features should cover core product functionality
- Tasks should be actionable development steps
- APIs should follow REST principles
- Schema should be MongoDB-style
- Code should be basic Express.js starter code
- Keep output structured, concise, and production-oriented`;

    const response = await openai.chat.completions.create({
      model: "google/gemini-2.0-flash-001",
      messages: [
        { role: "system", content: prompt },
        { role: "user", content: `Input Idea: "${idea}"` }
      ],
      response_format: { type: "json_object" } // Enforce JSON if supported
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

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
