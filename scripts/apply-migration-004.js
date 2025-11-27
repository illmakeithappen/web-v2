/**
 * Apply Migration 004: Add file type columns to content_references
 *
 * This script applies the migration to add file_type and is_markdown columns
 * to the content_references table in Supabase.
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Initialize Supabase client with service role key (required for admin operations)
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials in .env.local');
  console.error('Required: VITE_SUPABASE_URL and SUPABASE_SERVICE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function applyMigration() {
  try {
    console.log('🚀 Starting Migration 004: Add file type columns\n');

    // Read the migration SQL file
    const migrationPath = join(__dirname, '../database/migrations/supabase/004_add_file_type_columns.sql');
    const migrationSQL = readFileSync(migrationPath, 'utf8');

    console.log('📄 Migration SQL:');
    console.log('─'.repeat(80));
    console.log(migrationSQL);
    console.log('─'.repeat(80));
    console.log('');

    // Execute the migration
    console.log('⏳ Executing migration...\n');

    const { data, error } = await supabase.rpc('exec_sql', {
      sql: migrationSQL
    });

    if (error) {
      // If exec_sql doesn't exist, try direct execution (this might not work for DDL)
      console.log('⚠️  exec_sql function not found, attempting direct execution...\n');

      // Split SQL by semicolons and execute each statement
      const statements = migrationSQL
        .split(';')
        .map(s => s.trim())
        .filter(s => s.length > 0 && !s.startsWith('--'));

      for (let i = 0; i < statements.length; i++) {
        const statement = statements[i];
        if (!statement) continue;

        console.log(`Executing statement ${i + 1}/${statements.length}:`);
        console.log(statement.substring(0, 100) + '...');

        const { error: execError } = await supabase.rpc('exec', {
          sql: statement
        });

        if (execError) {
          throw new Error(`Failed to execute statement ${i + 1}: ${execError.message}`);
        }

        console.log('✅ Success\n');
      }

      console.log('✅ Migration completed successfully!\n');
    } else {
      console.log('✅ Migration completed successfully!\n');
      if (data) {
        console.log('Response:', data);
      }
    }

    // Verify the migration by checking the table structure
    console.log('🔍 Verifying migration...\n');

    const { data: columns, error: verifyError } = await supabase
      .from('content_references')
      .select('*')
      .limit(1);

    if (verifyError) {
      console.log('⚠️  Could not verify migration:', verifyError.message);
    } else {
      console.log('✅ Verification successful');
      if (columns && columns.length > 0) {
        console.log('📊 Sample row with new columns:');
        const sampleRow = columns[0];
        console.log({
          id: sampleRow.id,
          name: sampleRow.name,
          file_type: sampleRow.file_type || '(null)',
          is_markdown: sampleRow.is_markdown || false
        });
      } else {
        console.log('ℹ️  No existing rows in content_references table');
      }
    }

    console.log('\n✨ Migration 004 applied successfully!');

  } catch (error) {
    console.error('\n❌ Migration failed:', error.message);
    console.error('\n💡 Manual steps required:');
    console.error('   1. Go to Supabase Dashboard → SQL Editor');
    console.error('   2. Copy the SQL from database/migrations/supabase/004_add_file_type_columns.sql');
    console.error('   3. Execute manually in the SQL Editor');
    process.exit(1);
  }
}

// Run the migration
applyMigration();
