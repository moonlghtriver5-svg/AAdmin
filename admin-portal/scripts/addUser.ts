import 'dotenv/config';
import { query } from '../lib/db';
import bcrypt from 'bcryptjs';

async function addUser() {
  try {
    const username = 'aalgo';
    const password = 'password23!';

    console.log(`🔐 Adding new user: ${username}`);

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user into database
    await query(
      `INSERT INTO alice_admin_users (email, password_hash, name, role, created_at)
       VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP)
       ON CONFLICT (email) DO UPDATE SET password_hash = EXCLUDED.password_hash`,
      [username, hashedPassword, 'Algo User', 'admin']
    );

    console.log(`✅ User '${username}' added successfully!`);
    console.log(`   Username: ${username}`);
    console.log(`   Password: ${password}`);

    // Show all users
    const users = await query('SELECT email, created_at FROM alice_admin_users ORDER BY created_at');
    console.log(`\n📊 All users in database:`);
    users.rows.forEach((row: any) => {
      console.log(`   - ${row.email} (created: ${new Date(row.created_at).toISOString().substring(0, 10)})`);
    });

  } catch (error) {
    console.error('❌ Error adding user:', error);
    throw error;
  } finally {
    process.exit(0);
  }
}

addUser();
