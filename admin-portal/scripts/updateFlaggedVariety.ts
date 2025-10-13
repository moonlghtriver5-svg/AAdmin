import 'dotenv/config';
import { query } from '../lib/db';

async function updateFlaggedVariety() {
  console.log('🔄 Updating flagged entries for variety...\n');

  // Get all flagged logs
  const result = await query(`
    SELECT id, prompt, timestamp
    FROM proxy_logs
    WHERE flagged = true
    ORDER BY timestamp DESC
  `);

  const flaggedLogs = result.rows;
  console.log(`Found ${flaggedLogs.length} flagged logs\n`);

  // Update the duplicates to have different PII variations
  const updates = [
    {
      oldPrompt: 'Need to book travel for the investor meeting. My DOB is 03/15/1982 and passport expires on 08/20/2027. What documents do I need?',
      newPrompt: 'Planning a business trip to London. My DOB is 07/22/1985 and I need to renew my passport (expires 11/30/2025). What forms do I need?',
      reason: 'Contains date of birth and passport information'
    },
    {
      oldPrompt: 'I need to update my bank account. My passport number is P87654321 and my SSN is 123-45-6789. Can you help me draft an email to the bank?',
      newPrompt: 'Setting up direct deposit. Here\'s my info: SSN 987-65-4321, bank routing 021000021, account 4567891234. Can you draft the authorization form?',
      reason: 'Contains SSN and banking information'
    }
  ];

  // Track which prompts we've already updated (keep first occurrence, update duplicates)
  const seenPrompts = new Set();

  for (const log of flaggedLogs) {
    const updateInfo = updates.find(u => u.oldPrompt === log.prompt);

    if (updateInfo) {
      if (seenPrompts.has(log.prompt)) {
        // This is a duplicate, update it
        console.log(`Updating duplicate: "${log.prompt.substring(0, 60)}..."`);
        await query(`
          UPDATE proxy_logs
          SET prompt = $1, flag_reason = $2
          WHERE id = $3
        `, [updateInfo.newPrompt, updateInfo.reason, log.id]);
        seenPrompts.add(updateInfo.newPrompt); // Mark new prompt as seen
      } else {
        // First occurrence, keep it
        seenPrompts.add(log.prompt);
      }
    }
  }

  console.log('\n📝 Adding 5 new flagged entries...\n');

  // Get some users from existing proxy logs
  const usersResult = await query(`
    SELECT DISTINCT ON (user_id) user_id, user_name
    FROM proxy_logs
    ORDER BY user_id, RANDOM()
    LIMIT 8
  `);
  const users = usersResult.rows;

  if (users.length < 5) {
    console.log('Not enough users found, skipping new entries');
    return;
  }

  const newFlaggedEntries = [
    {
      userId: users[0]?.user_id,
      userName: users[0]?.user_name,
      modelId: 'gpt-4.1',
      prompt: 'I need help filling out my W-4 form. My SSN is 456-78-9123 and I\'m claiming 2 dependents. What should I put for allowances?',
      response: 'I cannot help you with personal tax information that includes your Social Security Number. Please consult with your HR department or a tax professional directly, and avoid sharing sensitive information like SSNs in chat systems.',
      tokensUsed: 892,
      timestamp: new Date('2024-10-05T14:30:00Z'),
      flagReason: 'Contains Social Security Number'
    },
    {
      userId: users[1].user_id,
      userName: users[1].user_name,
      modelId: 'claude-sonnet-4',
      prompt: 'Can you review this email draft? "Hi team, please update payroll with my new address: 742 Evergreen Terrace, Springfield, and my salary should be $145,000 annually." Does this sound professional?',
      response: 'I\'d be happy to help you draft a professional email, but I notice this contains sensitive information (your home address and salary). I recommend removing those details from our conversation for your privacy and security.',
      tokensUsed: 745,
      timestamp: new Date('2024-09-28T16:45:00Z'),
      flagReason: 'Contains physical address and salary information'
    },
    {
      userId: users[2].user_id,
      userName: users[2].user_name,
      modelId: 'qwen-2.5-vl-72b',
      prompt: 'Help me with my healthcare enrollment. My member ID is MED-998877665 and my DOB is 12/08/1990. Which plan should I choose for someone with pre-existing conditions?',
      response: 'I can provide general information about healthcare plan selection, but I cannot access or process your personal health information. Please work directly with your healthcare provider or HR benefits specialist for personalized guidance.',
      tokensUsed: 623,
      timestamp: new Date('2024-09-20T10:15:00Z'),
      flagReason: 'Contains healthcare member ID and date of birth'
    },
    {
      userId: users[3].user_id,
      userName: users[3].user_name,
      modelId: 'gpt-4.1',
      prompt: 'I\'m applying for a mortgage. Here\'s my info: Credit score 740, annual income $180k, current debt $45k, SSN 321-54-9876. Can you estimate my approval odds?',
      response: 'I cannot process applications containing Social Security Numbers or other sensitive financial information. For mortgage pre-approval, please work directly with a licensed mortgage broker or your bank\'s loan officers.',
      tokensUsed: 814,
      timestamp: new Date('2024-08-30T13:20:00Z'),
      flagReason: 'Contains SSN and detailed financial information'
    },
    {
      userId: users[4].user_id,
      userName: users[4].user_name,
      modelId: 'claude-sonnet-4',
      prompt: 'Setting up my 401k. My employee ID is EMP-2024-8765, SSN 654-32-1098, and I want to contribute 15% to my retirement. Can you help me fill out the enrollment form?',
      response: 'I cannot assist with forms that require your Social Security Number or other sensitive identifiers. Please complete your 401k enrollment through your company\'s HR portal or benefits administrator.',
      tokensUsed: 697,
      timestamp: new Date('2024-08-15T11:00:00Z'),
      flagReason: 'Contains SSN and employee identification'
    }
  ];

  for (const entry of newFlaggedEntries) {
    console.log(`Adding: "${entry.prompt.substring(0, 60)}..."`);

    // Generate a unique ID
    const id = `log-flagged-${Date.now()}-${Math.random().toString(36).substring(7)}`;

    await query(`
      INSERT INTO proxy_logs (id, user_id, user_name, model_id, prompt, response, tokens_used, timestamp, flagged, flag_reason)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, true, $9)
    `, [
      id,
      entry.userId,
      entry.userName,
      entry.modelId,
      entry.prompt,
      entry.response,
      entry.tokensUsed,
      entry.timestamp,
      entry.flagReason
    ]);

    // Small delay to ensure unique IDs
    await new Promise(resolve => setTimeout(resolve, 10));
  }

  console.log('\n✅ Done! Checking results...\n');

  const finalResult = await query(`
    SELECT prompt, flag_reason, timestamp
    FROM proxy_logs
    WHERE flagged = true
    ORDER BY timestamp DESC
  `);

  console.log(`${finalResult.rows.length} total flagged logs:`);
  finalResult.rows.forEach((log, idx) => {
    console.log(`${idx + 1}. ${log.prompt.substring(0, 70)}...`);
  });
}

updateFlaggedVariety().catch(console.error);
