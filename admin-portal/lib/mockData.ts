// Mock data service for ALICE Admin Portal

export interface User {
  id: string;
  name: string;
  email: string;
  department: string;
  assignedModels: string[];
  tokenLimit: number;
  tokenUsed: number;
}

export interface Model {
  id: string;
  name: string;
  provider: string;
  enabled: boolean;
}

export interface ProxyLog {
  id: string;
  userId: string;
  userName: string;
  modelId: string;
  prompt: string;
  response: string;
  timestamp: Date;
  tokensUsed: number;
  flagged?: boolean;
  flagReason?: string;
}

export interface UsageStats {
  date: string;
  totalMessages: number;
  gpt4Messages: number;
  claudeMessages: number;
  geminiMessages: number;
  mistralMessages: number;
}

// Mock users
export const mockUsers: User[] = [
  {
    id: '1',
    name: 'S*** C***',
    email: '***@apexe3.com',
    department: 'Executive',
    assignedModels: ['gpt-4.1', 'claude-sonnet-4', 'gemini-2.5-pro'],
    tokenLimit: 2000000,
    tokenUsed: 1456789,
  },
  {
    id: '2',
    name: 'M*** W***',
    email: '***@apexe3.com',
    department: 'Data Science',
    assignedModels: ['qwen-2.5-vl-72b', 'claude-sonnet-4', 'gemini-2.5-pro'],
    tokenLimit: 3000000,
    tokenUsed: 2134567,
  },
  {
    id: '3',
    name: 'P*** P***',
    email: '***@apexe3.com',
    department: 'AI Research',
    assignedModels: ['gpt-4.1', 'claude-sonnet-4', 'qwen-3-8b', 'qwen-2.5-vl-72b'],
    tokenLimit: 5000000,
    tokenUsed: 3789234,
  },
  {
    id: '4',
    name: 'J*** M***',
    email: '***@apexe3.com',
    department: 'Executive',
    assignedModels: ['gpt-4.1', 'claude-sonnet-4', 'gemini-2.5-pro'],
    tokenLimit: 1500000,
    tokenUsed: 823456,
  },
  {
    id: '5',
    name: 'L*** Z***',
    email: '***@apexe3.com',
    department: 'Data Science',
    assignedModels: ['qwen-2.5-vl-72b', 'qwen-3-8b', 'claude-sonnet-4'],
    tokenLimit: 2500000,
    tokenUsed: 1987654,
  },
  {
    id: '6',
    name: 'A*** K***',
    email: '***@apexe3.com',
    department: 'AI Research',
    assignedModels: ['gpt-4.1', 'claude-sonnet-4', 'gemini-2.5-pro', 'qwen-2.5-vl-72b'],
    tokenLimit: 4000000,
    tokenUsed: 2654321,
  },
  {
    id: '7',
    name: 'E*** R***',
    email: '***@apexe3.com',
    department: 'Data Science',
    assignedModels: ['qwen-3-8b', 'gemini-2.5-pro', 'claude-sonnet-4'],
    tokenLimit: 2000000,
    tokenUsed: 1234567,
  },
  {
    id: '8',
    name: 'D*** O***',
    email: '***@apexe3.com',
    department: 'AI Research',
    assignedModels: ['gpt-4.1', 'claude-sonnet-4', 'qwen-2.5-vl-72b'],
    tokenLimit: 3500000,
    tokenUsed: 2345678,
  },
];

// Mock models
export const mockModels: Model[] = [
  { id: 'gpt-4.1', name: 'GPT-4.1', provider: 'OpenAI', enabled: true },
  { id: 'claude-sonnet-4', name: 'Claude Sonnet 4', provider: 'Anthropic', enabled: true },
  { id: 'qwen-2.5-vl-72b', name: 'Qwen 2.5 VL Instruct 72B', provider: 'Alibaba', enabled: true },
  { id: 'qwen-3-8b', name: 'Qwen 3 8B', provider: 'Alibaba', enabled: true },
  { id: 'gemini-2.5-pro', name: 'Gemini 2.5 Pro', provider: 'Google', enabled: true },
];

// Mock usage stats (last 30 days)
export const mockUsageStats: UsageStats[] = Array.from({ length: 30 }, (_, i) => {
  const date = new Date();
  date.setDate(date.getDate() - (29 - i));

  // Growing usage trend showing adoption
  const growthFactor = 1 + (i / 30) * 0.5;
  const totalMessages = Math.floor((Math.random() * 300 + 400) * growthFactor);

  const gpt4 = Math.floor(totalMessages * (Math.random() * 0.25 + 0.25));
  const claude = Math.floor(totalMessages * (Math.random() * 0.25 + 0.30));
  const gemini = Math.floor(totalMessages * (Math.random() * 0.15 + 0.15));
  const mistral = totalMessages - gpt4 - claude - gemini;

  return {
    date: date.toISOString().split('T')[0],
    totalMessages,
    gpt4Messages: gpt4,
    claudeMessages: claude,
    geminiMessages: gemini,
    mistralMessages: mistral,
  };
});

// Generate realistic logs over the past 90 days
function generateMockLogs(): ProxyLog[] {
  const logs: ProxyLog[] = [];
  const now = new Date();

  const prompts = [
    { text: 'Analyze our enterprise AI deployment strategy for Fortune 500 healthcare clients. What are the key compliance considerations for HIPAA when implementing LLM-based diagnostic support tools?', response: 'For Fortune 500 healthcare clients, HIPAA compliance in LLM deployments requires: 1) End-to-end encryption for PHI data, 2) On-premise or private cloud deployment options, 3) Comprehensive audit trails (which this system provides), 4) Business Associate Agreements with all AI providers, 5) Data anonymization before model training...', tokens: 2450, flagged: false },
    { text: 'Design a multi-modal RAG architecture for enterprise knowledge management. Need to handle 50TB+ of unstructured data including PDFs, videos, and internal wikis. Focus on minimizing hallucination.', response: 'For a 50TB+ enterprise RAG system with hallucination mitigation, I recommend: 1) Hybrid search combining dense (embeddings) and sparse (BM25) retrieval, 2) Chunk size optimization (512-1024 tokens), 3) Multi-stage reranking pipeline, 4) Citation verification layer, 5) Confidence scoring for each response...', tokens: 3200, flagged: true, reason: 'Proprietary architecture discussion' },
    { text: 'Analyze this product demo video and extract key UI/UX patterns. Compare against top 10 enterprise SaaS dashboards. Include accessibility scoring.', response: 'Analyzing the demo video, I identified the following UI/UX patterns: 1) Left-nav sidebar (92% of enterprise SaaS use this), 2) Card-based layout for data visualization (87%), 3) Blue primary color scheme (healthcare/fintech standard)...', tokens: 4580, flagged: false },
    { text: 'Build a prompt injection detection system for our enterprise clients. Need to catch jailbreak attempts, PII extraction, and competitive intelligence gathering attempts.', response: 'For enterprise-grade prompt injection detection, implement a multi-layer defense: 1) Input validation using regex patterns for common jailbreaks, 2) Semantic analysis to detect out-of-scope queries, 3) PII detection using NER models, 4) Competitive intelligence flags based on keyword clustering...', tokens: 2890, flagged: true, reason: 'Security system architecture' },
    { text: 'Prepare investor pitch deck talking points for Series B. Focus on: 1) 300% YoY growth in enterprise contracts, 2) $12M ARR, 3) 98.5% uptime SLA, 4) This AI governance platform.', response: 'Series B pitch talking points:\n\nTRACTION:\n- 300% YoY growth demonstrates product-market fit\n- $12M ARR with strong enterprise logos (Fortune 500 healthcare, fintech)\n- 98.5% uptime SLA shows operational excellence\n\nMOAT:\n- Proprietary AI governance platform (demo this dashboard)\n- Compliance-first approach (HIPAA, SOC2, GDPR ready)\n- Multi-model orchestration (5+ providers integrated)...', tokens: 2420, flagged: false },
    { text: 'Code review: Our enterprise client wants real-time streaming responses for their customer support chatbot. Evaluate this SSE implementation vs WebSockets. Consider 10k+ concurrent users.', response: 'For 10k+ concurrent users in enterprise customer support:\n\nSSE (Server-Sent Events):\n+ Simpler implementation, auto-reconnect\n+ Works through corporate proxies\n+ Lower overhead for one-way streaming\n- No client-to-server messaging\n\nWebSockets:\n+ Full duplex communication\n+ Lower latency\n- Complex infrastructure, proxy issues\n\nRecommendation: Use SSE for LLM streaming responses. Add Redis pub/sub for horizontal scaling...', tokens: 1950, flagged: false },
    { text: 'Data pipeline for fine-tuning: We have 500k customer support tickets (anonymized). Design preprocessing pipeline to create training data for domain-specific model. Budget: 200k tokens for fine-tuning.', response: 'For 500k support tickets → 200k fine-tuning tokens:\n\n1. FILTERING (500k → 100k):\n- Quality score >0.7 (remove low-quality/spam)\n- Resolution time <2hrs (positive examples)\n- Customer satisfaction >4/5\n\n2. CLUSTERING (100k → 50k):\n- Topic modeling (20-30 clusters)\n- Sample diverse examples per cluster\n\n3. FORMATTING (50k → training set):\n- Convert to instruction-following format\n- Include metadata (urgency, category)...', tokens: 2670, flagged: false },
    { text: 'ROI analysis: Enterprise client spends $500k/year on customer support. Our AI solution costs $80k/year. Calculate breakeven based on: 40% ticket deflection rate, avg ticket cost $25, 100k tickets/year.', response: 'ROI Analysis:\n\nCURRENT STATE:\n- 100k tickets/year × $25 = $2.5M total cost\n- Human agents handle 100% = $500k labor cost\n\nWITH AI SOLUTION:\n- 40% deflection = 40k tickets automated\n- Cost savings: 40k × $25 = $1M potential\n- Realistic labor savings: 40% × $500k = $200k/year\n- AI solution cost: $80k/year\n- NET SAVINGS: $120k/year\n- ROI: 150%\n- Payback period: 4.8 months...', tokens: 1820, flagged: false },
  ];

  const models = ['gpt-4.1', 'claude-sonnet-4', 'qwen-2.5-vl-72b', 'qwen-3-8b', 'gemini-2.5-pro'];

  // Generate logs for the past 90 days with increasing volume
  for (let daysAgo = 90; daysAgo >= 0; daysAgo--) {
    const date = new Date(now);
    date.setDate(date.getDate() - daysAgo);

    // Increasing activity over time (simulating growth)
    const growthFactor = 1 + ((90 - daysAgo) / 90) * 1.5;
    const logsPerDay = Math.floor((3 + Math.random() * 5) * growthFactor);

    for (let i = 0; i < logsPerDay; i++) {
      const user = mockUsers[Math.floor(Math.random() * mockUsers.length)];
      const prompt = prompts[Math.floor(Math.random() * prompts.length)];
      const model = models[Math.floor(Math.random() * models.length)];

      const hour = Math.floor(Math.random() * 10) + 8; // 8am - 6pm
      const minute = Math.floor(Math.random() * 60);
      date.setHours(hour, minute, 0, 0);

      logs.push({
        id: `log-${daysAgo}-${i}`,
        userId: user.id,
        userName: user.name,
        modelId: model,
        prompt: prompt.text,
        response: prompt.response,
        timestamp: new Date(date),
        tokensUsed: prompt.tokens + Math.floor(Math.random() * 500 - 250),
        flagged: prompt.flagged || false,
        flagReason: prompt.flagged ? prompt.reason : undefined,
      });
    }
  }

  return logs.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
}

// Mock proxy logs
export const mockProxyLogs: ProxyLog[] = generateMockLogs();

// Helper functions
export function getUserById(userId: string): User | undefined {
  return mockUsers.find(u => u.id === userId);
}

export function getLogsByUser(userId: string): ProxyLog[] {
  return mockProxyLogs.filter(log => log.userId === userId);
}

export function getFlaggedLogs(): ProxyLog[] {
  return mockProxyLogs.filter(log => log.flagged);
}

export function getTotalMessagesByDate(date: string): number {
  const stat = mockUsageStats.find(s => s.date === date);
  return stat ? stat.totalMessages : 0;
}
