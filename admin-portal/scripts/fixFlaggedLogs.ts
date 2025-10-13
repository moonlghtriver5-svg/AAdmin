import 'dotenv/config';
import { query } from '../lib/db';

async function fixFlaggedLogs() {
  console.log('Fetching flagged logs...\n');

  const result = await query(`
    SELECT id, prompt, flagged, flag_reason
    FROM proxy_logs
    WHERE flagged = true
    ORDER BY timestamp DESC
  `);

  const flaggedLogs = result.rows;

  console.log(`Found ${flaggedLogs.length} flagged logs\n`);

  // Logs that should remain flagged (contain actual PII)
  const shouldRemainFlagged = [
    'Need to book travel for the investor meeting. My DOB is 03/15/1982 and passport expires on 08/20/2027. What documents do I need?',
    'Can you help with my background check form? Driver\'s license CA-D1234567, issued 2020, expires 2028.',
    'I need to update my bank account. My passport number is P87654321 and my SSN is 123-45-6789. Can you help me draft an email to the bank?',
  ];

  for (const log of flaggedLogs) {
    const shouldFlag = shouldRemainFlagged.includes(log.prompt);

    if (!shouldFlag && log.flagged) {
      console.log(`UNFLAGGING: "${log.prompt.substring(0, 80)}..."`);
      await query(`
        UPDATE proxy_logs
        SET flagged = false, flag_reason = NULL
        WHERE id = $1
      `, [log.id]);
    } else if (shouldFlag) {
      console.log(`KEEPING FLAGGED: "${log.prompt.substring(0, 80)}..."`);
    }
  }

  console.log('\nDone! Checking results...\n');

  const remainingResult = await query(`
    SELECT id, prompt, flag_reason
    FROM proxy_logs
    WHERE flagged = true
    ORDER BY timestamp DESC
  `);

  const remainingFlagged = remainingResult.rows;

  console.log(`${remainingFlagged.length} logs remain flagged (should be 3):`);
  remainingFlagged.forEach(log => {
    console.log(`- ${log.prompt.substring(0, 60)}...`);
  });
}

fixFlaggedLogs().catch(console.error);
