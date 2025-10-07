import 'dotenv/config';
import { query } from '../lib/db';

async function updateRecentLogTimestamps() {
  try {
    console.log('🔄 Updating recent log timestamps...');

    // Get the 112 most recent logs
    const result = await query(`
      SELECT id, timestamp
      FROM proxy_logs
      ORDER BY timestamp DESC
      LIMIT 112
    `);

    console.log(`📊 Found ${result.rows.length} recent logs to update`);

    // Generate weighted random timestamp between Oct 1 - Oct 8 9:16 AM UTC
    // Heavily weighted toward later dates
    const generateWeightedTimestamp = () => {
      const startDate = new Date('2025-10-01T08:00:00Z'); // Oct 1, 8 AM UTC
      const endDate = new Date('2025-10-08T09:16:00Z');   // Oct 8, 9:16 AM UTC

      // Use power distribution to weight toward later dates
      // Higher power = more weighting toward end
      const random = Math.pow(Math.random(), 0.3); // 0.3 means heavily weighted to end

      const timeRange = endDate.getTime() - startDate.getTime();
      const timestamp = new Date(startDate.getTime() + (random * timeRange));

      // Set to business hours (8 AM - 6 PM UTC) on weekdays
      const hour = timestamp.getUTCHours();
      const day = timestamp.getUTCDay();

      // If weekend, move to Monday
      if (day === 0) { // Sunday
        timestamp.setUTCDate(timestamp.getUTCDate() + 1);
      } else if (day === 6) { // Saturday
        timestamp.setUTCDate(timestamp.getUTCDate() + 2);
      }

      // If outside business hours, adjust to business hours
      if (hour < 8) {
        timestamp.setUTCHours(8 + Math.floor(Math.random() * 10)); // 8 AM - 6 PM
      } else if (hour >= 18) {
        timestamp.setUTCHours(8 + Math.floor(Math.random() * 10));
      }

      // Don't let it go past Oct 8 9:16 AM UTC
      if (timestamp > endDate) {
        return endDate;
      }

      return timestamp;
    };

    // Update each log with a new weighted timestamp
    let updated = 0;
    for (const log of result.rows) {
      const newTimestamp = generateWeightedTimestamp();

      await query(
        `UPDATE proxy_logs SET timestamp = $1 WHERE id = $2`,
        [newTimestamp.toISOString(), log.id]
      );

      updated++;
      if (updated % 20 === 0) {
        console.log(`✅ Updated ${updated}/${result.rows.length} logs`);
      }
    }

    console.log(`\n✨ Successfully updated ${updated} log timestamps!`);
    console.log(`📅 New range: Oct 1, 2025 - Oct 8, 2025 9:16 AM UTC`);
    console.log(`📈 Distribution: Heavily weighted toward Oct 7-8`);

    // Show distribution
    const distribution = await query(`
      SELECT
        DATE(timestamp) as date,
        COUNT(*) as count
      FROM proxy_logs
      WHERE timestamp >= '2025-10-01' AND timestamp <= '2025-10-08'
      GROUP BY DATE(timestamp)
      ORDER BY date
    `);

    console.log('\n📊 Distribution by date:');
    distribution.rows.forEach((row: any) => {
      console.log(`   ${row.date}: ${row.count} logs`);
    });

  } catch (error) {
    console.error('❌ Error updating timestamps:', error);
    throw error;
  } finally {
    process.exit(0);
  }
}

updateRecentLogTimestamps();
