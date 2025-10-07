import 'dotenv/config';
import { query } from '../lib/db';

async function varyApiPrompts() {
  try {
    console.log('🔍 Finding repetitive API documentation prompts...');

    // Find all logs with "Write documentation for this API endpoint" pattern
    const result = await query(`
      SELECT id, prompt
      FROM proxy_logs
      WHERE prompt LIKE '%Write documentation for this API endpoint%'
         OR prompt LIKE '%Document this API endpoint%'
      ORDER BY timestamp DESC
    `);

    console.log(`📊 Found ${result.rows.length} API documentation prompts to vary\n`);

    if (result.rows.length === 0) {
      console.log('✨ No repetitive prompts found!');
      return;
    }

    // Different API endpoints to use
    const apiEndpoints = [
      { method: 'POST', path: '/api/users', desc: 'creates a new user' },
      { method: 'GET', path: '/api/users/:id', desc: 'retrieves user details by ID' },
      { method: 'PUT', path: '/api/users/:id', desc: 'updates an existing user' },
      { method: 'DELETE', path: '/api/users/:id', desc: 'deletes a user' },
      { method: 'GET', path: '/api/projects', desc: 'lists all projects' },
      { method: 'POST', path: '/api/projects', desc: 'creates a new project' },
      { method: 'PATCH', path: '/api/projects/:id/status', desc: 'updates project status' },
      { method: 'GET', path: '/api/analytics/metrics', desc: 'fetches analytics metrics' },
      { method: 'POST', path: '/api/auth/login', desc: 'authenticates user and returns JWT token' },
      { method: 'POST', path: '/api/auth/refresh', desc: 'refreshes authentication token' },
      { method: 'GET', path: '/api/models', desc: 'lists available AI models' },
      { method: 'POST', path: '/api/inference', desc: 'sends prompt to AI model for inference' },
      { method: 'GET', path: '/api/logs', desc: 'retrieves proxy logs with pagination' },
      { method: 'POST', path: '/api/webhooks', desc: 'registers a new webhook endpoint' },
      { method: 'DELETE', path: '/api/webhooks/:id', desc: 'removes a webhook subscription' },
      { method: 'GET', path: '/api/billing/usage', desc: 'gets current billing usage statistics' },
      { method: 'POST', path: '/api/teams', desc: 'creates a new team' },
      { method: 'PUT', path: '/api/teams/:id/members', desc: 'updates team member roles' },
      { method: 'GET', path: '/api/audit-logs', desc: 'retrieves audit trail entries' },
      { method: 'POST', path: '/api/api-keys', desc: 'generates a new API key' },
    ];

    // Different prompt variations
    const promptTemplates = [
      (ep: any) => `Write documentation for this API endpoint: ${ep.method} ${ep.path} - ${ep.desc}.`,
      (ep: any) => `Document this REST endpoint: ${ep.method} ${ep.path}. It ${ep.desc}.`,
      (ep: any) => `Can you help me write API docs for ${ep.method} ${ep.path}? This endpoint ${ep.desc}.`,
      (ep: any) => `Need to document the ${ep.method} ${ep.path} endpoint - ${ep.desc}. What should I include?`,
      (ep: any) => `How should I document this endpoint: ${ep.method} ${ep.path}? It's used to ${ep.desc.replace('creates', 'create').replace('retrieves', 'retrieve').replace('updates', 'update').replace('deletes', 'delete')}.`,
      (ep: any) => `Write OpenAPI spec for ${ep.method} ${ep.path} endpoint that ${ep.desc}.`,
      (ep: any) => `I need to add API documentation for ${ep.method} ${ep.path}. This endpoint ${ep.desc}.`,
      (ep: any) => `Create comprehensive docs for the ${ep.method} ${ep.path} route - ${ep.desc}.`,
    ];

    let updated = 0;
    for (const log of result.rows) {
      // Pick a random endpoint and template
      const endpoint = apiEndpoints[Math.floor(Math.random() * apiEndpoints.length)];
      const template = promptTemplates[Math.floor(Math.random() * promptTemplates.length)];
      const newPrompt = template(endpoint);

      await query(
        `UPDATE proxy_logs SET prompt = $1 WHERE id = $2`,
        [newPrompt, log.id]
      );

      updated++;
      if (updated % 10 === 0) {
        console.log(`✅ Updated ${updated}/${result.rows.length} prompts`);
      }
    }

    console.log(`\n✨ Successfully updated ${updated} prompts with varied API documentation requests!`);

  } catch (error) {
    console.error('❌ Error updating prompts:', error);
    throw error;
  } finally {
    process.exit(0);
  }
}

varyApiPrompts();
