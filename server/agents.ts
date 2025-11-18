import { invokeLLM } from "./_core/llm";

/**
 * Agent types in the AURA system
 */
export type AgentType = "orchestrator" | "code" | "research" | "ui" | "qa" | "devops" | "bizops";

/**
 * Agent message structure
 */
export interface AgentMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

/**
 * Agent response structure
 */
export interface AgentResponse {
  agentType: AgentType;
  content: string;
  metadata?: Record<string, any>;
}

/**
 * System prompts for each specialized agent
 */
const AGENT_PROMPTS: Record<AgentType, string> = {
  orchestrator: `You are the OrchestratorAgent, the Lead Systems Architect of AURA. You coordinate a team of specialized AI agents to accomplish complex development tasks.

Your responsibilities:
1. Decompose user requests into discrete, manageable tasks
2. Delegate tasks to the most appropriate specialized agent
3. Synthesize results from all agents into coherent responses
4. Manage inter-agent communication and context

Available agents:
- CodeAgent: Code generation, refactoring, debugging
- ResearchAgent: Information gathering, documentation analysis
- UIAgent: UI/UX design, component creation
- QAAgent: Testing, quality assurance
- DevOpsAgent: Deployment, infrastructure
- BizOpsAgent: Project management, documentation

Respond with clear task delegation and coordination plans.`,

  code: `You are the CodeAgent, a master developer fluent in multiple languages. You write clean, efficient, and maintainable code.

Your responsibilities:
1. Write, refactor, and debug code with deep project context
2. Follow coding standards and best practices
3. Prioritize security, performance, and readability
4. Integrate with external APIs and SDKs

Languages: TypeScript, JavaScript, Python, Go, Rust, Java, C#, PHP
Frameworks: React, Vue, Next.js, Express, FastAPI, and more

Provide production-ready code with clear explanations.`,

  research: `You are the ResearchAgent, a brilliant analyst with access to the world's information.

Your responsibilities:
1. Find the most current and relevant information
2. Analyze new technologies, libraries, and APIs
3. Perform competitive analysis and best practices research
4. Synthesize knowledge for development decisions

Always cite sources and provide actionable insights.`,

  ui: `You are the UIAgent, a pixel-perfect UI/UX designer with a keen eye for aesthetics and user experience.

Your responsibilities:
1. Translate wireframes or descriptions into responsive components
2. Ensure consistency with design systems
3. Create reusable, accessible components
4. Advise on UX best practices and accessibility standards

Focus on modern, clean designs with excellent user experience.`,

  qa: `You are the QAAgent, a meticulous Quality Assurance engineer who believes "untested code is broken code."

Your responsibilities:
1. Generate unit, integration, and end-to-end tests
2. Set up automated testing pipelines
3. Perform static analysis and identify bugs
4. Validate features meet requirements

Provide comprehensive test coverage and quality metrics.`,

  devops: `You are the DevOpsAgent, a pragmatic DevOps professional who lives and breathes infrastructure-as-code.

Your responsibilities:
1. Create and manage CI/CD pipelines
2. Provision and configure cloud infrastructure
3. Manage environment variables and secrets
4. Monitor application performance and costs

Focus on reliability, scalability, and automation.`,

  bizops: `You are the BizOpsAgent, an efficient business assistant tailored for solo developers and freelancers.

Your responsibilities:
1. Generate project proposals and estimates
2. Draft client communications and reports
3. Manage project timelines and scheduling
4. Assist with time tracking and invoicing

Provide professional, business-focused assistance.`,
};

/**
 * Orchestrator Agent - Routes requests to appropriate specialized agents
 */
export async function orchestrateRequest(userMessage: string, context?: string): Promise<AgentResponse> {
  const messages: AgentMessage[] = [
    { role: "system", content: AGENT_PROMPTS.orchestrator },
  ];

  if (context) {
    messages.push({ role: "system", content: `Context: ${context}` });
  }

  messages.push({ role: "user", content: userMessage });

  const response = await invokeLLM({
    messages: messages.map(m => ({ role: m.role, content: m.content })),
  });

  const content = response.choices[0].message.content;
  return {
    agentType: "orchestrator",
    content: typeof content === "string" ? content : "",
    metadata: {
      model: response.model,
      usage: response.usage,
    },
  };
}

/**
 * Code Agent - Handles code generation and development tasks
 */
export async function codeAgent(task: string, context?: string): Promise<AgentResponse> {
  const messages: AgentMessage[] = [
    { role: "system", content: AGENT_PROMPTS.code },
  ];

  if (context) {
    messages.push({ role: "system", content: `Project Context: ${context}` });
  }

  messages.push({ role: "user", content: task });

  const response = await invokeLLM({
    messages: messages.map(m => ({ role: m.role, content: m.content })),
  });

  const content = response.choices[0].message.content;
  return {
    agentType: "code",
    content: typeof content === "string" ? content : "",
    metadata: {
      model: response.model,
      usage: response.usage,
    },
  };
}

/**
 * Research Agent - Handles information gathering and analysis
 */
export async function researchAgent(query: string, context?: string): Promise<AgentResponse> {
  const messages: AgentMessage[] = [
    { role: "system", content: AGENT_PROMPTS.research },
  ];

  if (context) {
    messages.push({ role: "system", content: `Context: ${context}` });
  }

  messages.push({ role: "user", content: query });

  const response = await invokeLLM({
    messages: messages.map(m => ({ role: m.role, content: m.content })),
  });

  const content = response.choices[0].message.content;
  return {
    agentType: "research",
    content: typeof content === "string" ? content : "",
    metadata: {
      model: response.model,
      usage: response.usage,
    },
  };
}

/**
 * UI Agent - Handles UI/UX design and component creation
 */
export async function uiAgent(task: string, context?: string): Promise<AgentResponse> {
  const messages: AgentMessage[] = [
    { role: "system", content: AGENT_PROMPTS.ui },
  ];

  if (context) {
    messages.push({ role: "system", content: `Design Context: ${context}` });
  }

  messages.push({ role: "user", content: task });

  const response = await invokeLLM({
    messages: messages.map(m => ({ role: m.role, content: m.content })),
  });

  const content = response.choices[0].message.content;
  return {
    agentType: "ui",
    content: typeof content === "string" ? content : "",
    metadata: {
      model: response.model,
      usage: response.usage,
    },
  };
}

/**
 * QA Agent - Handles testing and quality assurance
 */
export async function qaAgent(task: string, context?: string): Promise<AgentResponse> {
  const messages: AgentMessage[] = [
    { role: "system", content: AGENT_PROMPTS.qa },
  ];

  if (context) {
    messages.push({ role: "system", content: `Testing Context: ${context}` });
  }

  messages.push({ role: "user", content: task });

  const response = await invokeLLM({
    messages: messages.map(m => ({ role: m.role, content: m.content })),
  });

  const content = response.choices[0].message.content;
  return {
    agentType: "qa",
    content: typeof content === "string" ? content : "",
    metadata: {
      model: response.model,
      usage: response.usage,
    },
  };
}

/**
 * DevOps Agent - Handles deployment and infrastructure
 */
export async function devopsAgent(task: string, context?: string): Promise<AgentResponse> {
  const messages: AgentMessage[] = [
    { role: "system", content: AGENT_PROMPTS.devops },
  ];

  if (context) {
    messages.push({ role: "system", content: `Infrastructure Context: ${context}` });
  }

  messages.push({ role: "user", content: task });

  const response = await invokeLLM({
    messages: messages.map(m => ({ role: m.role, content: m.content })),
  });

  const content = response.choices[0].message.content;
  return {
    agentType: "devops",
    content: typeof content === "string" ? content : "",
    metadata: {
      model: response.model,
      usage: response.usage,
    },
  };
}

/**
 * BizOps Agent - Handles business operations and project management
 */
export async function bizopsAgent(task: string, context?: string): Promise<AgentResponse> {
  const messages: AgentMessage[] = [
    { role: "system", content: AGENT_PROMPTS.bizops },
  ];

  if (context) {
    messages.push({ role: "system", content: `Business Context: ${context}` });
  }

  messages.push({ role: "user", content: task });

  const response = await invokeLLM({
    messages: messages.map(m => ({ role: m.role, content: m.content })),
  });

  const content = response.choices[0].message.content;
  return {
    agentType: "bizops",
    content: typeof content === "string" ? content : "",
    metadata: {
      model: response.model,
      usage: response.usage,
    },
  };
}

/**
 * Route a request to the appropriate agent based on the agent type
 */
export async function routeToAgent(
  agentType: AgentType,
  task: string,
  context?: string
): Promise<AgentResponse> {
  switch (agentType) {
    case "orchestrator":
      return orchestrateRequest(task, context);
    case "code":
      return codeAgent(task, context);
    case "research":
      return researchAgent(task, context);
    case "ui":
      return uiAgent(task, context);
    case "qa":
      return qaAgent(task, context);
    case "devops":
      return devopsAgent(task, context);
    case "bizops":
      return bizopsAgent(task, context);
    default:
      throw new Error(`Unknown agent type: ${agentType}`);
  }
}
