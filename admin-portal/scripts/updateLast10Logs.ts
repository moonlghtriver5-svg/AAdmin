import 'dotenv/config';
import { query } from '../lib/db';

async function updateLast10Logs() {
  try {
    console.log('🔄 Updating last 10 logs...');

    // Get the 10 most recent logs
    const result = await query(`
      SELECT id, timestamp, model_id
      FROM proxy_logs
      ORDER BY timestamp DESC
      LIMIT 10
    `);

    console.log(`📊 Found ${result.rows.length} logs to update\n`);

    // Generate timestamps between Oct 8, 07:50 - 09:15 UTC
    const generateTimestamp = (index: number) => {
      const baseTime = new Date('2025-10-08T07:50:00Z');
      // Spread across 85 minutes (07:50 - 09:15)
      const minutesRange = 85;
      const randomMinutes = Math.floor(Math.random() * minutesRange);
      baseTime.setMinutes(baseTime.getMinutes() + randomMinutes);
      return baseTime;
    };

    // Sort logs by timestamp to assign models realistically
    // Most recent (highest timestamps) should be Qwen
    const logsWithTimestamps = result.rows.map((log, index) => ({
      log,
      newTimestamp: generateTimestamp(index)
    })).sort((a, b) => b.newTimestamp.getTime() - a.newTimestamp.getTime());

    // Model distribution: most recent ~5 are Qwen, rest are other models
    const models = [
      'qwen-2.5-vl-72b',    // Most recent
      'qwen-2.5-vl-72b',
      'qwen-2.5-vl-72b',
      'qwen-2.5-vl-72b',
      'claude-sonnet-4',
      'qwen-2.5-vl-72b',
      'gpt-4.1',
      'gemini-2.5-pro',
      'qwen-3-8b',
      'claude-sonnet-4'     // Oldest
    ];

    let updated = 0;
    for (let i = 0; i < logsWithTimestamps.length; i++) {
      const { log, newTimestamp } = logsWithTimestamps[i];
      const newModelId = models[i];

      await query(
        `UPDATE proxy_logs SET timestamp = $1, model_id = $2 WHERE id = $3`,
        [newTimestamp.toISOString(), newModelId, log.id]
      );

      console.log(`✅ Updated log ${i + 1}/10: ${log.id.substring(0, 12)}... → ${newTimestamp.toISOString().substring(0, 19)}Z (${newModelId})`);
      updated++;
    }

    console.log(`\n✨ Successfully updated ${updated} logs!`);

    // Show the updated logs
    const updatedLogs = await query(`
      SELECT id, timestamp, model_id, prompt
      FROM proxy_logs
      ORDER BY timestamp DESC
      LIMIT 10
    `);

    console.log('\n📊 Updated logs (most recent first):');
    updatedLogs.rows.forEach((row: any, index: number) => {
      const timestamp = new Date(row.timestamp);
      console.log(`   ${index + 1}. ${timestamp.toISOString().substring(0, 19)}Z - ${row.model_id} - ${row.prompt.substring(0, 50)}...`);
    });

  } catch (error) {
    console.error('❌ Error updating logs:', error);
    throw error;
  } finally {
    process.exit(0);
  }
}

updateLast10Logs();
