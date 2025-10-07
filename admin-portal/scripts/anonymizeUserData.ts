import 'dotenv/config';
import { query } from '../lib/db';

async function anonymizeUserData() {
  try {
    console.log('🔒 Anonymizing user data in database...');

    // Mapping of old names to anonymized names
    const userMapping: Record<string, { name: string; email: string }> = {
      'Sarah Chen': { name: 'S*** C***', email: 'user1@apexe3.com' },
      'Marcus Williams': { name: 'M*** W***', email: 'user2@apexe3.com' },
      'Priya Patel': { name: 'P*** P***', email: 'user3@apexe3.com' },
      'James Morrison': { name: 'J*** M***', email: 'user4@apexe3.com' },
      'Lisa Zhang': { name: 'L*** Z***', email: 'user5@apexe3.com' },
      'Alex Kumar': { name: 'A*** K***', email: 'user6@apexe3.com' },
      'Emma Rodriguez': { name: 'E*** R***', email: 'user7@apexe3.com' },
      'David Okonkwo': { name: 'D*** O***', email: 'user8@apexe3.com' },
    };

    let updated = 0;
    for (const [oldName, newData] of Object.entries(userMapping)) {
      const result = await query(
        `UPDATE proxy_logs SET user_name = $1 WHERE user_name = $2`,
        [newData.name, oldName]
      );

      const rowCount = (result as any).rowCount || 0;
      updated += rowCount;
      console.log(`✅ Updated ${rowCount} logs: ${oldName} → ${newData.name}`);
    }

    console.log(`\n✨ Successfully anonymized ${updated} log entries!`);

    // Show sample of updated data
    const sample = await query(`
      SELECT user_name, COUNT(*) as count
      FROM proxy_logs
      GROUP BY user_name
      ORDER BY count DESC
    `);

    console.log('\n📊 User distribution:');
    sample.rows.forEach((row: any) => {
      console.log(`   ${row.user_name}: ${row.count} logs`);
    });

  } catch (error) {
    console.error('❌ Error anonymizing data:', error);
    throw error;
  } finally {
    process.exit(0);
  }
}

anonymizeUserData();
