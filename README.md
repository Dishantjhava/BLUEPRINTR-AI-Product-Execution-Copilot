# 🚀 BLUEPRINTR — AI Product Execution Copilot

Turn your product ideas into **developer-ready blueprints in seconds** using an **agentic AI system**.

![AI](https://img.shields.io/badge/AI-LLM-blue)
![Backend](https://img.shields.io/badge/Backend-Node.js-green)
![Frontend](https://img.shields.io/badge/Frontend-React-blueviolet)
![Database](https://img.shields.io/badge/Database-MongoDB-green)
![Cache](https://img.shields.io/badge/Cache-Redis-red)
![DevOps](https://img.shields.io/badge/DevOps-Docker-black)

🔗 **Live Demo:** [Coming Soon]  
📂 **Source Code:** [GitHub Repo Link]

---

## 📖 What is BLUEPRINTR?

BLUEPRINTR is a full-stack AI-powered product planning system that converts raw user ideas into **structured engineering blueprints**.

It generates:
- Features  
- Tasks  
- REST APIs  
- Database schema  
- Starter backend code  

All powered by a **multi-stage LLM pipeline**.

---

## ⚡ Key Highlights

- 🧠 Agentic AI (multi-step reasoning pipeline)  
- 📊 Structured JSON output (not raw text)  
- ⚡ Redis caching for performance optimization  
- 🐳 Dockerized full-stack deployment  
- 💬 Context-aware AI assistant  

---

## ✨ Features

### 🧠 AI Blueprint Generation
- Feature list  
- Task breakdown  
- API endpoints  
- Database schema  
- Starter backend code  

---

### ⚙️ Agentic AI Pipeline
Idea → Features → Tasks → APIs → Schema → Code

---

## 📊 Interactive Dashboard

- Feature panel  
- Task board  
- API list  
- Schema view  
- Code preview  

---

## 💬 Ask AI Assistant

- Context-aware responses  
- Explains features & APIs  
- Suggests next steps  

---

## ⚡ Redis Caching

- Cached responses using hashed keys  
- Faster repeated queries  
- Reduced LLM cost  

---

## ⏱️ Task Intelligence

- Priority assignment (High / Medium / Low)  
- Effort estimation (time + complexity)  

---

## 🐳 Dockerized Deployment

- Backend  
- Frontend  
- MongoDB  
- Redis  

---

## 📸 Screenshots

Add your screenshots in `/assets` folder

![Dashboard](./assets/dashboard.png)  
![Tasks](./assets/tasks.png)

---

## 🛠️ Tech Stack

| Category | Technology |
|---------|----------|
| Frontend | React.js, Tailwind CSS, Zustand |
| Backend | Node.js, Express.js (MVC) |
| Database | MongoDB, Mongoose |
| Caching | Redis |
| AI | OpenAI API (LLM Pipeline) |
| DevOps | Docker, Docker Compose |
| APIs | REST APIs |

---

## 🚀 Getting Started

### 📌 Prerequisites

- Node.js 18+  
- MongoDB Atlas  
- OpenAI API Key  
- Redis (local or Docker)  
- Docker (optional)  

---

### 🔧 Installation

git clone https://github.com/your-username/BLUEPRINTR.git  
cd BLUEPRINTR  

---

## 📦 Backend Setup

cd backend  
npm install  

---

## 💻 Frontend Setup

cd frontend  
npm install  

---

## 🔑 Environment Variables

Create `.env` inside backend:

PORT=5000  
MONGO_URI=your_mongodb_uri  
OPENAI_API_KEY=your_openai_key  
REDIS_URL=redis://localhost:6379  

---

## ▶️ Run Locally

# backend  
npm run dev  

# frontend  
npm run dev  

---

## 🐳 Run with Docker

docker-compose up --build  

---

## 📂 Project Structure

ai-copilot/  
├── backend/  
│   ├── src/  
│   │   ├── controllers/  
│   │   ├── services/  
│   │   ├── models/  
│   │   ├── routes/  
│   │   ├── middleware/  
│   │   └── config/  
├── frontend/  
│   ├── src/  
│   │   ├── components/  
│   │   ├── hooks/  
│   │   ├── store/  
│   │   └── services/  
├── docker-compose.yml  
└── README.md  

---

## 🔄 Core Flow

1. User inputs product idea  
2. Backend triggers AI pipeline  
3. LLM generates structured JSON  
4. Cached in Redis + stored in MongoDB  
5. Frontend dashboard renders output  
6. User interacts via Ask AI  

---

## 🚀 Future Improvements

- Tool calling (true agent execution)  
- GitHub repo auto-generation  
- Multi-user collaboration  
- Versioning system  

---

## 📄 License

For educational and demonstration purposes.

---

## ⭐ Support

If you like this project, give it a ⭐ on GitHub!
