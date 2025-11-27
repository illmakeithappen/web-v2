/**
 * Apply Migration 004: Add file type columns to content_references
 *
 * Simple script using Supabase REST API to execute SQL migration
 */

import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Read environment variables from .env.local
const envPath = join(__dirname, '../.env.local');
const envContent = readFileSync(envPath, 'utf8');

const envVars = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^([^#=]+)=(.+)$/);
  if (match) {
    envVars[match[1].trim()] = match[2].trim();
  }
});

const supabaseUrl = envVars.VITE_SUPABASE_URL;
const supabaseServiceKey = envVars.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials in .env.local');
  console.error('Required: VITE_SUPABASE_URL and SUPABASE_SERVICE_KEY');
  process.exit(1);
}

// Read the migration SQL file
const migrationPath = join(__dirname, '../database/migrations/supabase/004_add_file_type_columns.sql');
const migrationSQL = readFileSync(migrationPath, 'utf8');

console.log('🚀 Starting Migration 004: Add file type columns\n');
console.log('📄 Migration SQL:');
console.log('─'.repeat(80));
console.log(migrationSQL);
console.log('─'.repeat(80));
console.log('');

// Extract project reference from URL
const projectRef = supabaseUrl.match(/https:\/\/(.+?)\.supabase\.co/)?.[1];

if (!projectRef) {
  console.error('❌ Could not extract project reference from URL');
  process.exit(1);
}

console.log(`📍 Project: ${projectRef}`);
console.log('⏳ Executing migration via Supabase REST API...\n');

// Execute SQL using Supabase REST API
const apiUrl = `${supabaseUrl}/rest/v1/rpc/exec_sql`;

fetch(apiUrl, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'apikey': supabaseServiceKey,
    'Authorization': `Bearer ${supabaseServiceKey}`,
    'Prefer': 'return=minimal'
  },
  body: JSON.stringify({
    query: migrationSQL
  })
})
.then(async response => {
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`HTTP ${response.status}: ${error}`);
  }
  return response.text();
})
.then(data => {
  console.log('✅ Migration executed successfully!\n');
  if (data) {
    console.log('Response:', data);
  }

  console.log('\n💡 Next steps:');
  console.log('   1. Verify the migration in Supabase Dashboard → Database → content_references');
  console.log('   2. Check that file_type and is_markdown columns exist');
  console.log('   3. Verify indexes were created');
  console.log('\n✨ Migration 004 applied successfully!');
})
.catch(error => {
  console.error('\n❌ Migration failed:', error.message);
  console.error('\n💡 Alternative approach - Manual execution:');
  console.error('   1. Go to: https://supabase.com/dashboard/project/' + projectRef + '/sql/new');
  console.error('   2. Copy the SQL from: database/migrations/supabase/004_add_file_type_columns.sql');
  console.error('   3. Paste and execute in the SQL Editor');
  console.error('\n   Or use the Supabase CLI:');
  console.error('   $ npx supabase db push');
  process.exit(1);
});
