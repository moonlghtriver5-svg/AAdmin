import 'dotenv/config';
import { query } from '../lib/db';

async function checkAndFlagLogs() {
  try {
    console.log('🔍 Checking last 100 logs for PII...');

    // Get the 100 most recent logs
    const result = await query(`
      SELECT id, prompt, flagged, flag_reason
      FROM proxy_logs
      ORDER BY timestamp DESC
      LIMIT 100
    `);

    console.log(`📊 Found ${result.rows.length} logs to check\n`);

    // PII detection patterns
    const sensitivePatterns = [
      { pattern: /passport number|passport #|passport no/i, reason: 'Contains passport information' },
      { pattern: /\bssn\b|social security|social security number/i, reason: 'Contains Social Security Number' },
      { pattern: /credit card|card number|cvv|card details/i, reason: 'Contains credit card information' },
      { pattern: /password|temporary password|my password is/i, reason: 'Contains password information' },
      { pattern: /routing number|account number|bank account/i, reason: 'Contains banking information' },
      { pattern: /driver'?s? license|license number/i, reason: 'Contains driver\'s license information' },
      { pattern: /\b\d{3}-\d{2}-\d{4}\b/, reason: 'Contains SSN pattern (XXX-XX-XXXX)' },
      { pattern: /\b\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}\b/, reason: 'Contains credit card pattern' },
      { pattern: /salary|compensation|\$\d{2,3},?\d{3}/, reason: 'Contains salary/compensation information' },
      { pattern: /dob|date of birth|born on|birthday.*\d{2}\/\d{2}\/\d{4}/i, reason: 'Contains date of birth' },
      { pattern: /address.*\d+.*(?:street|st|avenue|ave|road|rd|lane|ln|drive|dr)/i, reason: 'Contains physical address' },
      { pattern: /phone.*\d{3}[-.]?\d{3}[-.]?\d{4}|call.*\d{3}[-.]?\d{3}[-.]?\d{4}/i, reason: 'Contains phone number' },
    ];

    let flaggedCount = 0;
    let alreadyFlagged = 0;
    let updates = [];

    for (const log of result.rows) {
      let shouldFlag = false;
      let flagReason = '';

      // Check if already flagged
      if (log.flagged) {
        alreadyFlagged++;
        console.log(`🚩 Already flagged: ${log.id.substring(0, 8)}... - "${log.flag_reason}"`);
        continue;
      }

      // Check against patterns
      for (const { pattern, reason } of sensitivePatterns) {
        if (pattern.test(log.prompt)) {
          shouldFlag = true;
          flagReason = reason;
          break;
        }
      }

      if (shouldFlag) {
        console.log(`🚨 NEEDS FLAGGING: ${log.id.substring(0, 8)}...`);
        console.log(`   Reason: ${flagReason}`);
        console.log(`   Prompt: ${log.prompt.substring(0, 100)}...`);
        console.log('');

        updates.push({ id: log.id, reason: flagReason });
        flaggedCount++;
      }
    }

    console.log('\n📈 Summary:');
    console.log(`   - Already flagged: ${alreadyFlagged}`);
    console.log(`   - Needs flagging: ${flaggedCount}`);
    console.log(`   - Clean logs: ${result.rows.length - alreadyFlagged - flaggedCount}`);

    if (updates.length > 0) {
      console.log(`\n🔄 Updating ${updates.length} logs...`);

      for (const { id, reason } of updates) {
        await query(
          `UPDATE proxy_logs SET flagged = true, flag_reason = $1 WHERE id = $2`,
          [reason, id]
        );
      }

      console.log('✅ All logs updated!');
    } else {
      console.log('\n✨ No updates needed - all logs are properly flagged!');
    }

    // Show final stats
    const stats = await query(`
      SELECT
        COUNT(*) as total,
        COUNT(*) FILTER (WHERE flagged = true) as flagged_count
      FROM proxy_logs
    `);

    console.log(`\n📊 Database totals:`);
    console.log(`   - Total logs: ${stats.rows[0].total}`);
    console.log(`   - Flagged logs: ${stats.rows[0].flagged_count}`);

  } catch (error) {
    console.error('❌ Error checking logs:', error);
    throw error;
  } finally {
    process.exit(0);
  }
}

checkAndFlagLogs();
