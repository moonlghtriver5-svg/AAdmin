import fs from 'fs';
import path from 'path';

const OPENROUTER_API_KEY = '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';
const API_URL = 'https://openrouter.ai/api/v1/chat/completions';

// Mix of enterprise and everyday work prompts
const promptTemplates = [
  // Heavy enterprise stuff
  'Analyze our enterprise AI deployment strategy for {industry} clients. What are the key compliance considerations for {regulation} when implementing LLM-based {usecase}?',
  'Design a multi-modal RAG architecture for enterprise {domain}. Need to handle {scale} of unstructured data. Focus on minimizing hallucination.',
  'Prepare investor pitch deck talking points for Series {round}. Focus on: {metric1}, {metric2}, {metric3}.',
  'ROI analysis: Enterprise client spends ${cost}/year on {problem}. Our AI solution costs ${solution_cost}/year. Calculate breakeven.',
  'Design an enterprise-grade model governance framework for {company_type}. Include model versioning, A/B testing, and rollback strategies.',

  // Code & technical work
  'Code review: Our client wants real-time streaming responses for their {application}. Evaluate {tech1} vs {tech2}.',
  'Help me debug this Python error: "TypeError: unsupported operand type(s) for +: \'int\' and \'str\'". Here\'s my code context.',
  'Write a SQL query to find top 10 customers by revenue in the last quarter, grouped by region.',
  'Explain the difference between async/await and Promises in JavaScript with examples.',
  'How do I properly handle environment variables in a Next.js app for different deployment environments?',
  'Best practices for structuring a FastAPI project with multiple microservices?',

  // Data & ML work
  'Data pipeline for fine-tuning: We have {volume} {datatype} (anonymized). Design preprocessing pipeline.',
  'How should I split my dataset for training a classification model? I have 50k samples with class imbalance.',
  'Explain batch normalization vs layer normalization - when should I use each?',
  'My model is overfitting. What are the top 5 techniques I should try first?',
  'Compare different embedding models for semantic search: sentence-transformers vs OpenAI embeddings.',

  // Business & planning
  'Draft an email to our client explaining why we need to delay the feature release by 2 weeks.',
  'Create a project timeline for building a customer support chatbot. Break down into sprints.',
  'What are the key metrics we should track for our B2B SaaS product analytics dashboard?',
  'Help me write a job description for a Senior ML Engineer with 5+ years experience.',
  'Summarize this 30-page technical whitepaper into 3 key bullet points.',

  // Quick questions
  'What\'s the best way to visualize time-series data with multiple variables in Python?',
  'Recommend a CI/CD setup for a small team (5 devs) working on a Next.js + FastAPI stack.',
  'How do I calculate token costs for different LLM providers? Need a comparison spreadsheet.',
  'What\'s the difference between docker-compose and Kubernetes? When should I use each?',
  'Quick: what\'s the regex pattern to validate email addresses?',

  // Light-hearted / casual
  'Explain transformers like I\'m 5 years old.',
  'What\'s a good analogy to explain embeddings to a non-technical stakeholder?',
  'Write a funny commit message for fixing a bug that was caused by a typo.',
  'Coffee vs tea for late-night coding sessions? Give me the pros and cons.',
  'Suggest a team name for our hackathon project - we\'re building an AI code reviewer.',
  'What\'s the most common mistake junior devs make when learning React?',

  // Documentation & learning
  'Explain how RAG (Retrieval Augmented Generation) works with a simple example.',
  'Create a cheat sheet for Git commands I use daily.',
  'What are the differences between GPT-4, Claude, and Gemini? Which should I use for what?',
  'Write documentation for this API endpoint: POST /api/users - creates a new user.',
  'Summarize the key points from the latest OpenAI DevDay announcements.',
];

const users = [
  { id: '1', name: 'Sarah Chen', department: 'Executive' },
  { id: '2', name: 'Marcus Williams', department: 'Data Science' },
  { id: '3', name: 'Priya Patel', department: 'AI Research' },
  { id: '4', name: 'James Morrison', department: 'Executive' },
  { id: '5', name: 'Lisa Zhang', department: 'Data Science' },
  { id: '6', name: 'Alex Kumar', department: 'AI Research' },
  { id: '7', name: 'Emma Rodriguez', department: 'Data Science' },
  { id: '8', name: 'David Okonkwo', department: 'AI Research' },
];

// Exact OpenRouter model IDs
const models = [
  'openai/gpt-4.1',
  'anthropic/claude-sonnet-4',
  'google/gemini-2.5-pro',
  'qwen/qwen2.5-vl-72b-instruct',
  'qwen/qwen3-8b',
];

const modelIdMap: Record<string, string> = {
  'openai/gpt-4.1': 'gpt-4.1',
  'anthropic/claude-sonnet-4': 'claude-sonnet-4',
  'google/gemini-2.5-pro': 'gemini-2.5-pro',
  'qwen/qwen2.5-vl-72b-instruct': 'qwen-2.5-vl-72b',
  'qwen/qwen3-8b': 'qwen-3-8b',
};

// Fill in template variables
function fillTemplate(template: string): string {
  const replacements: Record<string, string[]> = {
    '{industry}': ['healthcare', 'fintech', 'retail', 'manufacturing', 'insurance'],
    '{regulation}': ['HIPAA', 'SOC2', 'GDPR', 'PCI-DSS', 'ISO 27001'],
    '{usecase}': ['diagnostic support tools', 'fraud detection', 'customer service automation', 'risk assessment'],
    '{domain}': ['knowledge management', 'document processing', 'customer support', 'legal research'],
    '{scale}': ['50TB+', '100TB+', '10TB+', '500GB+'],
    '{round}': ['B', 'C', 'A'],
    '{metric1}': ['300% YoY growth', '$12M ARR', '98.5% uptime SLA'],
    '{metric2}': ['50+ enterprise clients', '10M+ API calls/day', '99.9% accuracy'],
    '{metric3}': ['AI governance platform', '$2M cost savings for clients', '15+ Fortune 500 customers'],
    '{application}': ['customer support chatbot', 'document processing system', 'analytics dashboard'],
    '{tech1}': ['SSE (Server-Sent Events)', 'WebSockets', 'HTTP/2 Server Push'],
    '{tech2}': ['WebSockets', 'gRPC streaming', 'Long polling'],
    '{volume}': ['500k', '1M', '100k', '50k'],
    '{datatype}': ['customer support tickets', 'legal documents', 'medical records', 'financial transactions'],
    '{cost}': ['500k', '1M', '250k', '750k'],
    '{solution_cost}': ['80k', '120k', '60k', '100k'],
    '{company_type}': ['Fortune 500 enterprises', 'mid-market SaaS companies', 'healthcare providers'],
    '{problem}': ['customer support', 'data processing', 'manual document review'],
  };

  let result = template;
  for (const [key, values] of Object.entries(replacements)) {
    if (result.includes(key)) {
      const randomValue = values[Math.floor(Math.random() * values.length)];
      result = result.replace(key, randomValue);
    }
  }
  return result;
}

// Call OpenRouter API
async function callOpenRouter(prompt: string, model: string): Promise<{ response: string; tokens: number }> {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://apex-ai-admin.com',
        'X-Title': 'APEX AI Admin Portal',
      },
      body: JSON.stringify({
        model: model,
        messages: [
          {
            role: 'system',
            content: 'You are an expert AI consultant helping an enterprise AI startup. Provide detailed, technical responses focused on production deployment, compliance, and ROI.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        max_tokens: 1000,
      }),
    });

    const data = await response.json();

    if (data.error) {
      console.error('API Error:', data.error);
      return { response: 'Error generating response', tokens: 0 };
    }

    const responseText = data.choices[0]?.message?.content || 'No response';
    const tokens = (data.usage?.prompt_tokens || 0) + (data.usage?.completion_tokens || 0);

    return { response: responseText, tokens };
  } catch (error) {
    console.error('Request failed:', error);
    return { response: 'Error generating response', tokens: 0 };
  }
}

// Generate random timestamp between July 15 and Oct 7, 2025
function randomTimestamp(): Date {
  const start = new Date('2025-07-15T08:00:00');
  const end = new Date('2025-10-07T18:00:00');

  const timestamp = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));

  // Business hours: 8am - 6pm on weekdays
  const hour = Math.floor(Math.random() * 10) + 8;
  timestamp.setHours(hour, Math.floor(Math.random() * 60), 0, 0);

  // Skip weekends
  if (timestamp.getDay() === 0) timestamp.setDate(timestamp.getDate() + 1);
  if (timestamp.getDay() === 6) timestamp.setDate(timestamp.getDate() + 2);

  return timestamp;
}

// Helper function to pick weighted model
function pickWeightedModel(): string {
  const rand = Math.random();
  if (rand < 0.45) return 'qwen/qwen2.5-vl-72b-instruct';  // 45%
  if (rand < 0.80) return 'openai/gpt-4.1';                 // 35%
  if (rand < 0.90) return 'anthropic/claude-sonnet-4';      // 10%
  if (rand < 0.95) return 'google/gemini-2.5-pro';          // 5%
  return 'qwen/qwen3-8b';                                    // 5%
}

// Generate single log
async function generateSingleLog(i: number): Promise<any> {
  const template = promptTemplates[Math.floor(Math.random() * promptTemplates.length)];
  const prompt = fillTemplate(template);
  const user = users[Math.floor(Math.random() * users.length)];
  const model = pickWeightedModel();

  console.log(`[${i}] ${user.name} → ${model}`);

  const { response, tokens } = await callOpenRouter(prompt, model);

  const flagKeywords = ['proprietary', 'confidential', 'competitive', 'internal', 'secret', 'strategic'];
  const shouldFlag = Math.random() < 0.15;
  const flagged = shouldFlag && flagKeywords.some(kw =>
    prompt.toLowerCase().includes(kw) || response.toLowerCase().includes(kw)
  );

  return {
    id: `log-${i}`,
    userId: user.id,
    userName: user.name,
    modelId: modelIdMap[model] || model,
    prompt: prompt,
    response: response,
    timestamp: randomTimestamp().toISOString(),
    tokensUsed: tokens,
    flagged: flagged,
    flagReason: flagged ? 'Potential sensitive information disclosure' : undefined,
  };
}

// Main generation function with parallelism
async function generateData(count: number = 652, parallelism: number = 10) {
  console.log(`🚀 Generating ${count} logs with ${parallelism} parallel requests...`);

  const logs: any[] = [];

  // Process in batches
  for (let i = 0; i < count; i += parallelism) {
    const batchSize = Math.min(parallelism, count - i);
    const promises = Array.from({ length: batchSize }, (_, j) => generateSingleLog(i + j));

    const batchResults = await Promise.all(promises);
    logs.push(...batchResults);

    console.log(`✅ Completed ${logs.length}/${count} logs`);

    // Save every 50 logs
    if (logs.length % 50 === 0 || logs.length === count) {
      const outputPath = path.join(process.cwd(), 'data', 'generatedLogs.json');
      fs.mkdirSync(path.dirname(outputPath), { recursive: true });
      const sortedLogs = [...logs].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      fs.writeFileSync(outputPath, JSON.stringify(sortedLogs, null, 2));
      console.log(`💾 Saved ${logs.length} logs`);
    }

    // Small delay between batches
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  // Sort by timestamp descending (most recent first)
  logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  // Final save
  const outputPath = path.join(process.cwd(), 'data', 'generatedLogs.json');
  fs.writeFileSync(outputPath, JSON.stringify(logs, null, 2));

  console.log(`\n✨ Successfully generated ${count} logs!`);
  console.log(`📁 Saved to: ${outputPath}`);
  console.log(`📊 Stats:`);
  console.log(`   - Total tokens: ${logs.reduce((sum, l) => sum + l.tokensUsed, 0).toLocaleString()}`);
  console.log(`   - Flagged: ${logs.filter(l => l.flagged).length}`);
  console.log(`   - Date range: ${new Date(logs[logs.length - 1].timestamp).toLocaleDateString()} - ${new Date(logs[0].timestamp).toLocaleDateString()}`);
}

// Run the script
const count = parseInt(process.argv[2] || '652');
const parallelism = parseInt(process.argv[3] || '10');
generateData(count, parallelism).catch(console.error);
