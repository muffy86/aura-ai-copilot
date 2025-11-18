# AURA AI Copilot

**Autonomous Unified Reality Architect** - An enterprise-grade AI development platform with multi-agent orchestration, RAG, and full-stack capabilities.

![AURA AI Copilot](https://img.shields.io/badge/AI-Multi--Agent-purple) ![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue) ![React](https://img.shields.io/badge/React-19-blue) ![tRPC](https://img.shields.io/badge/tRPC-11-blue)

## 🚀 Features

### Multi-Agent AI System
AURA coordinates a team of specialized AI agents to tackle complex development tasks:

- **🎯 OrchestratorAgent** - Lead architect that coordinates all agents
- **💻 CodeAgent** - Code generation, refactoring, and debugging
- **🔍 ResearchAgent** - Information gathering and analysis
- **🎨 UIAgent** - UI/UX design and component creation
- **✅ QAAgent** - Testing and quality assurance
- **🚀 DevOpsAgent** - Deployment and infrastructure
- **📊 BizOpsAgent** - Project management and business operations

### Core Capabilities

- **Intelligent Chat Interface** - Natural language conversations with context-aware agent routing
- **Project Management** - Create and manage AI-powered development projects
- **Knowledge Base** - RAG-powered document storage with semantic search
- **Task Tracking** - Monitor agent activities and task execution
- **Real-time Streaming** - Live AI responses with markdown rendering
- **Dark/Light Theme** - Beautiful purple-themed UI with theme switching

## 🛠️ Tech Stack

### Frontend
- **React 19** with TypeScript
- **Tailwind CSS 4** for styling
- **tRPC** for type-safe API calls
- **Wouter** for routing
- **Shadcn/ui** components
- **Streamdown** for markdown rendering

### Backend
- **Node.js** with Express
- **tRPC 11** for API layer
- **Drizzle ORM** for database
- **MySQL/TiDB** database
- **OpenAI API** for LLM integration

### Infrastructure
- **Manus OAuth** for authentication
- **S3** for file storage
- **Vector embeddings** for RAG (planned)
- **MCP protocol** support (planned)

## 📦 Installation

### Prerequisites
- Node.js 22+
- pnpm
- MySQL or TiDB database

### Setup

1. Clone the repository:
```bash
git clone https://github.com/muffy86/aura-ai-copilot.git
cd aura-ai-copilot
```

2. Install dependencies:
```bash
pnpm install
```

3. Set up environment variables (managed by Manus platform):
- `DATABASE_URL` - MySQL connection string
- `JWT_SECRET` - Session signing secret
- `BUILT_IN_FORGE_API_KEY` - LLM API key
- Other platform-provided variables

4. Push database schema:
```bash
pnpm db:push
```

5. Start development server:
```bash
pnpm dev
```

The application will be available at `http://localhost:3000`

## 🎯 Usage

### Starting a Conversation

1. Navigate to the **Dashboard**
2. Click **New Chat**
3. Select an AI agent (or use Orchestrator for automatic routing)
4. Start asking questions or requesting assistance

### Creating a Project

1. Go to **Projects** page
2. Click **New Project**
3. Enter project name and description
4. The AI agents can now help with project-specific tasks

### Adding Knowledge

1. Visit **Knowledge Base** page
2. Click **Add Document**
3. Paste documentation, code, or any reference material
4. AI agents will use this context in their responses

## 🏗️ Architecture

### Database Schema

- **users** - Authentication and user management
- **projects** - User projects with specifications
- **conversations** - Chat conversations
- **messages** - Individual messages with agent tracking
- **tasks** - Agent task execution tracking
- **knowledgeBase** - RAG document storage
- **toolCalls** - MCP tool usage logging

### Agent System

Each agent has a specialized system prompt and expertise:

```typescript
type AgentType = 
  | "orchestrator"  // Coordinates all agents
  | "code"          // Code generation
  | "research"      // Information gathering
  | "ui"            // UI/UX design
  | "qa"            // Testing
  | "devops"        // Deployment
  | "bizops";       // Project management
```

### API Structure

All API endpoints are type-safe tRPC procedures:

- `projects.*` - Project CRUD operations
- `conversations.*` - Conversation management
- `chat.send` - Send messages to AI agents
- `tasks.*` - Task tracking
- `knowledge.*` - Knowledge base management

## 🔮 Roadmap

### Phase 1: RAG System ✨
- [ ] Vector database integration
- [ ] Document chunking and embedding
- [ ] Semantic search functionality
- [ ] Context retrieval for agents

### Phase 2: MCP Protocol 🔗
- [ ] Model Context Protocol implementation
- [ ] Tool registry system
- [ ] Context passing between agents
- [ ] Tool call tracking

### Phase 3: Advanced Features 🚀
- [ ] Voice transcription support
- [ ] Image generation for UI mockups
- [ ] Collaborative editing
- [ ] Workflow automation
- [ ] Analytics and monitoring

## 📝 Development

### Project Structure

```
aura-ai-copilot/
├── client/              # Frontend React application
│   ├── src/
│   │   ├── pages/      # Page components
│   │   ├── components/ # Reusable UI components
│   │   └── lib/        # tRPC client setup
├── server/              # Backend Node.js server
│   ├── agents.ts       # AI agent logic
│   ├── db.ts           # Database queries
│   └── routers.ts      # tRPC procedures
├── drizzle/            # Database schema
└── shared/             # Shared types and constants
```

### Key Commands

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm db:push` - Push database schema changes
- `pnpm type-check` - Run TypeScript checks

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT License - see LICENSE file for details

## 🙏 Acknowledgments

- Built with [Manus](https://manus.im) platform
- Powered by OpenAI's language models
- UI components from [shadcn/ui](https://ui.shadcn.com)

## 📧 Contact

For questions or support, please open an issue on GitHub.

---

**AURA AI Copilot** - Empowering developers with AI-powered multi-agent assistance 🚀
