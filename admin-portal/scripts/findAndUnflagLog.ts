import 'dotenv/config';
import { query } from '../lib/db';

async function findAndUnflagLog() {
  try {
    console.log('🔍 Looking for "how do i get started, step 1" log...');

    // Find logs with similar text
    const result = await query(`
      SELECT id, prompt, flagged, flag_reason, timestamp
      FROM proxy_logs
      WHERE prompt ILIKE '%how do i get started%'
         OR prompt ILIKE '%step 1%'
      ORDER BY timestamp DESC
      LIMIT 10
    `);

    console.log(`\n📊 Found ${result.rows.length} matching logs:\n`);

    for (let i = 0; i < result.rows.length; i++) {
      const log = result.rows[i];
      console.log(`${i + 1}. ID: ${log.id.substring(0, 12)}...`);
      console.log(`   Flagged: ${log.flagged ? '🚩 YES' : '✅ NO'}`);
      if (log.flagged) {
        console.log(`   Reason: ${log.flag_reason}`);
      }
      console.log(`   Prompt: ${log.prompt.substring(0, 150)}${log.prompt.length > 150 ? '...' : ''}`);
      console.log('');
    }

    // Find the one that's incorrectly flagged
    const incorrectlyFlagged = result.rows.filter(log =>
      log.flagged &&
      (log.prompt.toLowerCase().includes('how do i get started') ||
       log.prompt.toLowerCase().includes('step 1'))
    );

    if (incorrectlyFlagged.length === 0) {
      console.log('✨ No incorrectly flagged logs found!');
      return;
    }

    console.log(`\n🔄 Unflagging ${incorrectlyFlagged.length} log(s)...`);

    for (const log of incorrectlyFlagged) {
      await query(
        `UPDATE proxy_logs SET flagged = false, flag_reason = NULL WHERE id = $1`,
        [log.id]
      );
      console.log(`✅ Unflagged: ${log.id.substring(0, 12)}...`);
    }

    console.log('\n✨ Done!');

    // Show updated stats
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
    console.error('❌ Error:', error);
    throw error;
  } finally {
    process.exit(0);
  }
}

findAndUnflagLog();
