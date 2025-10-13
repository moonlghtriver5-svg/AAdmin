import 'dotenv/config';
import { query } from '../lib/db';
import bcrypt from 'bcryptjs';

async function createAdminUser() {
  try {
    console.log('🔐 Creating alice_admin_users table...');

    // Create the table
    await query(`
      CREATE TABLE IF NOT EXISTS alice_admin_users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        name VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'admin',
        created_at TIMESTAMP DEFAULT NOW(),
        last_login TIMESTAMP
      )
    `);

    console.log('✅ Table created successfully\n');

    // Check if admin user already exists
    const existingUser = await query(
      'SELECT * FROM alice_admin_users WHERE email = $1',
      ['admin@apexe3.com']
    );

    if (existingUser.rows.length > 0) {
      console.log('ℹ️  Admin user already exists');
      console.log('Email: admin@apexe3.com');
      console.log('Password: admin123');
      return;
    }

    console.log('👤 Creating admin user...');

    // Hash the password
    const password = 'admin123';
    const passwordHash = await bcrypt.hash(password, 10);

    // Insert admin user
    await query(
      `INSERT INTO alice_admin_users (email, password_hash, name, role)
       VALUES ($1, $2, $3, $4)`,
      ['admin@apexe3.com', passwordHash, 'Admin User', 'admin']
    );

    console.log('\n✅ Admin user created successfully!');
    console.log('\n📝 Login credentials:');
    console.log('   Email: admin@apexe3.com');
    console.log('   Password: admin123');
    console.log('\n⚠️  Please change the password after first login');
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

createAdminUser();
