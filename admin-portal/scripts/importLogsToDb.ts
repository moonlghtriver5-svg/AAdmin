import 'dotenv/config';
import { query } from '../lib/db';
import fs from 'fs';
import path from 'path';

async function importLogs() {
  try {
    console.log('🔧 Creating proxy_logs table...');

    // Create proxy_logs table
    await query(`
      CREATE TABLE IF NOT EXISTS proxy_logs (
        id VARCHAR(255) PRIMARY KEY,
        user_id VARCHAR(255) NOT NULL,
        user_name VARCHAR(255) NOT NULL,
        model_id VARCHAR(255) NOT NULL,
        prompt TEXT NOT NULL,
        response TEXT NOT NULL,
        timestamp TIMESTAMP NOT NULL,
        tokens_used INTEGER NOT NULL,
        flagged BOOLEAN DEFAULT FALSE,
        flag_reason TEXT,
        web_search_used BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log('✅ proxy_logs table created');

    // Load generated logs
    const logsPath = path.join(process.cwd(), 'data', 'generatedLogs.json');
    const logsData = fs.readFileSync(logsPath, 'utf-8');
    const logs = JSON.parse(logsData);

    console.log(`📊 Found ${logs.length} logs to import`);

    // Clear existing data
    await query('DELETE FROM proxy_logs');
    console.log('🗑️  Cleared existing logs');

    // Insert logs in batches
    const batchSize = 50;
    for (let i = 0; i < logs.length; i += batchSize) {
      const batch = logs.slice(i, i + batchSize);

      for (const log of batch) {
        await query(
          `INSERT INTO proxy_logs
          (id, user_id, user_name, model_id, prompt, response, timestamp, tokens_used, flagged, flag_reason, web_search_used)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
          ON CONFLICT (id) DO UPDATE SET
            user_id = EXCLUDED.user_id,
            user_name = EXCLUDED.user_name,
            model_id = EXCLUDED.model_id,
            prompt = EXCLUDED.prompt,
            response = EXCLUDED.response,
            timestamp = EXCLUDED.timestamp,
            tokens_used = EXCLUDED.tokens_used,
            flagged = EXCLUDED.flagged,
            flag_reason = EXCLUDED.flag_reason,
            web_search_used = EXCLUDED.web_search_used`,
          [
            log.id,
            log.userId,
            log.userName,
            log.modelId,
            log.prompt,
            log.response,
            log.timestamp,
            log.tokensUsed,
            log.flagged || false,
            log.flagReason || null,
            false // web_search_used - will be updated later
          ]
        );
      }

      console.log(`✅ Imported ${Math.min(i + batchSize, logs.length)}/${logs.length} logs`);
    }

    // Get stats
    const stats = await query(`
      SELECT
        COUNT(*) as total,
        COUNT(*) FILTER (WHERE flagged = true) as flagged_count,
        SUM(tokens_used) as total_tokens
      FROM proxy_logs
    `);

    console.log('\n✨ Import complete!');
    console.log(`📊 Stats:`);
    console.log(`   - Total logs: ${stats.rows[0].total}`);
    console.log(`   - Flagged logs: ${stats.rows[0].flagged_count}`);
    console.log(`   - Total tokens: ${parseInt(stats.rows[0].total_tokens).toLocaleString()}`);

  } catch (error) {
    console.error('❌ Error importing logs:', error);
    throw error;
  } finally {
    process.exit(0);
  }
}

importLogs();
