import { query } from './db';
import { loadGeneratedLogs } from './loadGeneratedData';
import type { ProxyLog } from './mockData';

export async function loadProxyLogs(): Promise<ProxyLog[]> {
  try {
    // Try to load from database first
    const result = await query(`
      SELECT
        id,
        user_id as "userId",
        user_name as "userName",
        model_id as "modelId",
        prompt,
        response,
        timestamp,
        tokens_used as "tokensUsed",
        flagged,
        flag_reason as "flagReason",
        web_search_used as "webSearchUsed"
      FROM proxy_logs
      ORDER BY timestamp DESC
    `);

    if (result.rows.length > 0) {
      console.log(`✅ Loaded ${result.rows.length} logs from database`);
      return result.rows.map((row: Record<string, unknown>) => ({
        ...row,
        timestamp: new Date(row.timestamp as string),
      })) as ProxyLog[];
    }

    // If no data in DB, fall back to JSON file
    console.log('⚠️  No data in database, loading from JSON file');
    return loadGeneratedLogs();
  } catch (error) {
    // If database connection fails, fall back to JSON file
    console.error('❌ Database error, falling back to JSON file:', error);
    return loadGeneratedLogs();
  }
}
