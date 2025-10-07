import fs from 'fs';
import path from 'path';

const OPENROUTER_API_KEY = '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';
const API_URL = 'https://openrouter.ai/api/v1/chat/completions';

// Focused prompts for recent work (Sept 10 - Oct 7)
const promptTemplates = [
  // SENSITIVE DATA LEAKS (should be flagged)
  'I need to update my bank account. My passport number is P87654321 and my SSN is 123-45-6789. Can you help me draft an email to the bank?',
  'Here are my credit card details for the subscription: 4532-1234-5678-9010, exp 12/26, CVV 123. How do I set up auto-renewal?',
  'My employee ID is EMP-2847 and my salary is $185,000. Can you help me calculate my tax withholding for this year?',
  'I\'m locked out of my account. My username is jmorrison@apex-ai.com and my temporary password is TempPass2024!. Can you help me reset it?',
  'Need to book travel for the investor meeting. My DOB is 03/15/1982 and passport expires on 08/20/2027. What documents do I need?',
  'Can you review this contract? My address is 742 Evergreen Terrace, Springfield, IL 62701 and my phone is 555-0123.',
  'Help me file an expense report. Transaction on my Amex ending in 9876 for $4,250 at the Ritz Carlton.',
  'I need to update my emergency contact: Sarah Morrison, spouse, DOB 07/22/1985, phone 555-0198, same address.',
  'Setting up direct deposit. Routing number 021000021, account number 1234567890. Is this the right format?',
  'Can you help with my background check form? Driver\'s license CA-D1234567, issued 2020, expires 2028.',

  // Coding agents & AI development tools
  'How do I use coding agents effectively in my development workflow?',
  'What are the best practices for running a coding agent internally within our company?',
  'How can we deploy coding agents privately without sending code to external services?',
  'Compare different coding agent tools - which one is best for enterprise use?',
  'How do I set up a self-hosted coding agent for our team?',
  'What are the security considerations when using AI coding assistants?',
  'How to integrate coding agents with our existing CI/CD pipeline?',
  'Best practices for prompt engineering with coding agents?',

  // Confluence & documentation
  'How do I use Confluence for technical documentation?',
  'What\'s the best way to organize Confluence spaces for an AI startup?',
  'How to create effective templates in Confluence for product requirements?',
  'How do I migrate our existing docs to Confluence?',
  'Best practices for Confluence page hierarchy and organization?',
  'How to set up permissions and access control in Confluence?',
  'How do I integrate Confluence with Jira for seamless documentation?',

  // JIRA & project management
  'How to use JIRA effectively for sprint planning?',
  'What\'s the best way to create a Kanban board in JIRA?',
  'How do I complete tasks in JIRA and link them to pull requests?',
  'How to set up JIRA workflows for an AI/ML product team?',
  'What are JIRA best practices for tracking technical debt?',
  'How to create custom fields in JIRA for tracking model experiments?',
  'How do I generate reports in JIRA for stakeholder updates?',
  'What\'s the difference between JIRA epics, stories, and tasks?',
  'How to estimate story points for ML/AI projects in JIRA?',
  'How to use JIRA automation rules to streamline our workflow?',

  // Git & pull requests
  'How to submit a clean pull request with proper commit messages?',
  'What should I include in a PR description for ML code changes?',
  'How to handle merge conflicts in a PR?',
  'Best practices for code review in pull requests?',
  'How do I rebase my branch before submitting a PR?',
  'What\'s the proper Git workflow for feature branches?',
  'How to write good commit messages that explain the why, not just the what?',
  'How do I squash commits before merging a PR?',

  // Pitch decks & fundraising
  'How to write a compelling pitch deck for a Series B round?',
  'What should I include in a pitch deck for AI/ML investors?',
  'How many slides should a pitch deck have?',
  'What metrics do VCs care most about in an AI startup pitch deck?',
  'How to structure the problem-solution slides in a pitch deck?',
  'What financial projections should I include in a Series B pitch deck?',
  'How to present our AI technology in a pitch deck without getting too technical?',
  'What\'s the ideal pitch deck flow for enterprise AI startups?',
  'How to showcase our competitive advantage in a pitch deck?',
  'Should I include customer testimonials in my pitch deck?',

  // Compliance & SOC2
  'How to become SOC2 compliant as an AI startup?',
  'What are the key requirements for SOC2 Type 2 certification?',
  'How long does it take to get SOC2 certified?',
  'What documentation do I need for SOC2 compliance?',
  'How much does SOC2 compliance cost for a startup?',
  'What\'s the difference between SOC2 Type 1 and Type 2?',
  'How to prepare for a SOC2 audit?',
  'What security controls are required for SOC2?',
  'How does SOC2 differ from ISO 27001?',
  'Do we need SOC2 to sell to enterprise customers?',

  // Text-to-SQL & data
  'How to implement text-to-SQL for our analytics dashboard?',
  'What are the best models for text-to-SQL conversion?',
  'How to fine-tune a model for text-to-SQL on our database schema?',
  'What are common challenges with text-to-SQL and how to solve them?',
  'How to validate SQL queries generated by LLMs?',
  'What\'s the accuracy rate of current text-to-SQL models?',
  'How to handle complex joins and subqueries in text-to-SQL?',
  'Security considerations for text-to-SQL in production?',

  // Bonds & financial analysis
  'How to understand bonds and fixed income securities?',
  'What should I look for when reading a bond prospectus?',
  'How to analyze a bond prospectus for investment decisions?',
  'What are the key sections of a bond prospectus?',
  'How are bond prospectuses currently analyzed by financial institutions?',
  'What metrics matter most when analyzing bonds?',
  'How to assess credit risk from a bond prospectus?',
  'What\'s the typical structure of a corporate bond prospectus?',
  'How to extract key terms and covenants from bond documents?',
  'What are the red flags to look for in a bond prospectus?',

  // RL & model training for bonds
  'What is the reward function for analyzing bond prospectuses using RL?',
  'How to design a reward function for document analysis with reinforcement learning?',
  'Can we use RLHF to improve bond prospectus analysis?',
  'What would a good reward signal look like for financial document understanding?',
  'How to evaluate if an RL model is correctly analyzing bond documents?',

  // GRPO & advanced training
  'Can we use GRPO for finetuning Qwen 3 MoE?',
  'What is GRPO and how does it differ from PPO?',
  'How to implement GRPO for large mixture-of-experts models?',
  'What are the computational requirements for GRPO training?',
  'GRPO vs DPO - which is better for instruction tuning?',
  'How to set up GRPO training infrastructure?',
  'What hyperparameters matter most for GRPO?',
  'Can GRPO scale to 70B+ parameter models?',

  // MoE models
  'How does Qwen 3 MoE architecture work?',
  'What are the benefits of mixture-of-experts models?',
  'How to efficiently serve MoE models in production?',
  'What\'s the difference between dense and MoE models?',
  'How much memory does Qwen 3 MoE require for inference?',

  // Follow-up questions (realistic conversation flow)
  'Can you elaborate on that last point about the risk assessment framework?',
  'What would be the timeline for implementing this?',
  'How much would this cost to build vs buy?',
  'Can you show me an example of what that code would look like?',
  'What are the potential downsides of this approach?',
  'How do our competitors handle this problem?',
  'What if we need to scale this to 10x the volume?',
  'Is there a simpler way to do this?',
  'What tools or libraries would you recommend for this?',
  'How do I get started with this - what\'s step 1?',
  'Can you break this down into a step-by-step implementation plan?',
  'What are the common mistakes people make with this?',
  'How long would it take to implement this?',
  'Do we have the right team to build this?',
  'What would the ROI look like for this initiative?',
  'How does this align with our Q4 roadmap?',
  'What dependencies does this have?',
  'What\'s the maintenance burden for this solution?',
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

// Generate random timestamp between Sept 10 and Oct 7, 2025
function randomTimestamp(): Date {
  const start = new Date('2025-09-10T08:00:00');
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
async function generateSingleLog(i: number, existingCount: number): Promise<any> {
  const prompt = promptTemplates[Math.floor(Math.random() * promptTemplates.length)];
  const user = users[Math.floor(Math.random() * users.length)];
  const model = pickWeightedModel();

  console.log(`[${i}] ${user.name} → ${model}`);

  const { response, tokens } = await callOpenRouter(prompt, model);

  // Enhanced flagging for sensitive data
  const sensitivePatterns = [
    /passport number|ssn|social security/i,
    /credit card|cvv|card number/i,
    /password|username.*password/i,
    /routing number|account number/i,
    /driver'?s? license|license number/i,
    /\b\d{3}-\d{2}-\d{4}\b/, // SSN pattern
    /\b\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}\b/, // Credit card pattern
  ];

  const flagKeywords = ['proprietary', 'confidential', 'competitive', 'internal', 'secret', 'strategic', 'salary'];

  const hasSensitiveData = sensitivePatterns.some(pattern =>
    pattern.test(prompt) || pattern.test(response)
  );

  const hasKeyword = flagKeywords.some(kw =>
    prompt.toLowerCase().includes(kw) || response.toLowerCase().includes(kw)
  );

  const flagged = hasSensitiveData || (Math.random() < 0.15 && hasKeyword);
  const flagReason = hasSensitiveData
    ? 'Personal identifiable information (PII) detected'
    : (flagged ? 'Potential sensitive information disclosure' : undefined);

  return {
    id: `log-${existingCount + i}`,
    userId: user.id,
    userName: user.name,
    modelId: modelIdMap[model] || model,
    prompt: prompt,
    response: response,
    timestamp: randomTimestamp().toISOString(),
    tokensUsed: tokens,
    flagged: flagged,
    flagReason: flagReason,
  };
}

// Main generation function with parallelism
async function generateRecentLogs(count: number = 112, parallelism: number = 10) {
  console.log(`🚀 Generating ${count} recent logs (Sept 10 - Oct 7) with ${parallelism} parallel requests...`);

  // Load existing logs
  const existingLogsPath = path.join(process.cwd(), 'data', 'generatedLogs.json');
  let existingLogs: any[] = [];
  let existingCount = 0;

  if (fs.existsSync(existingLogsPath)) {
    const fileContent = fs.readFileSync(existingLogsPath, 'utf-8');
    existingLogs = JSON.parse(fileContent);
    existingCount = existingLogs.length;
    console.log(`📊 Found ${existingCount} existing logs`);
  }

  const newLogs: any[] = [];

  // Process in batches
  for (let i = 0; i < count; i += parallelism) {
    const batchSize = Math.min(parallelism, count - i);
    const promises = Array.from({ length: batchSize }, (_, j) =>
      generateSingleLog(i + j, existingCount)
    );

    const batchResults = await Promise.all(promises);
    newLogs.push(...batchResults);

    console.log(`✅ Completed ${newLogs.length}/${count} new logs`);

    // Small delay between batches
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  // Combine with existing logs and sort by timestamp descending
  const allLogs = [...existingLogs, ...newLogs];
  allLogs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  // Save combined logs
  const outputPath = path.join(process.cwd(), 'data', 'generatedLogs.json');
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, JSON.stringify(allLogs, null, 2));

  console.log(`\n✨ Successfully generated ${count} new logs and combined with existing ${existingCount}!`);
  console.log(`📁 Total logs: ${allLogs.length}`);
  console.log(`📁 Saved to: ${outputPath}`);
  console.log(`📊 New logs stats:`);
  console.log(`   - Total tokens: ${newLogs.reduce((sum, l) => sum + l.tokensUsed, 0).toLocaleString()}`);
  console.log(`   - Flagged: ${newLogs.filter(l => l.flagged).length}`);
  console.log(`   - Date range: ${new Date(newLogs[newLogs.length - 1].timestamp).toLocaleDateString()} - ${new Date(newLogs[0].timestamp).toLocaleDateString()}`);
}

// Run the script
const count = parseInt(process.argv[2] || '112');
const parallelism = parseInt(process.argv[3] || '10');
generateRecentLogs(count, parallelism).catch(console.error);
