import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://zurnxrcxeawgfgrpcmmu.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp1cm54cmN4ZWF3Z2ZncnBjbW11Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQyNDE2MjUsImV4cCI6MjA3OTgxNzYyNX0.75FDLqMZAKusdPdtNtPKu_UYcjc91ZmReakVzZ5ALGw';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkWorkflows() {
  console.log('Fetching workflows from Supabase...\n');

  const { data, error } = await supabase
    .from('workflows')
    .select('*')
    .limit(1);

  if (error) {
    console.error('Error:', error);
    return;
  }

  console.log('First workflow:');
  console.log(JSON.stringify(data[0], null, 2));
}

checkWorkflows();
