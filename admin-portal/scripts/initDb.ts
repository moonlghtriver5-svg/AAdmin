import 'dotenv/config';
import { query } from '../lib/db';
import bcrypt from 'bcryptjs';

async function initializeDatabase() {
  try {
    console.log('🔧 Creating alice_admin_users table...');

    // Create alice_admin_users table (separate from existing users table)
    await query(`
      CREATE TABLE IF NOT EXISTS alice_admin_users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'admin',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log('✅ alice_admin_users table created');

    // Check if admin user exists
    const existingAdmin = await query('SELECT * FROM alice_admin_users WHERE email = $1', ['admin@apex-ai.com']);

    if (existingAdmin.rows.length === 0) {
      console.log('👤 Creating default admin user...');

      // Create default admin user
      const hashedPassword = await bcrypt.hash('admin123', 10);

      await query(
        'INSERT INTO alice_admin_users (email, password_hash, name, role) VALUES ($1, $2, $3, $4)',
        ['admin@apex-ai.com', hashedPassword, 'Admin User', 'admin']
      );

      console.log('✅ Admin user created');
      console.log('   Email: admin@apex-ai.com');
      console.log('   Password: admin123');
    } else {
      console.log('ℹ️  Admin user already exists');
    }

    console.log('\n✨ Database initialization complete!');
  } catch (error) {
    console.error('❌ Error initializing database:', error);
    throw error;
  } finally {
    process.exit(0);
  }
}

initializeDatabase();
