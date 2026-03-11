import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function testSupabase() {
  const { data, error } = await supabase.from('job_listings').select('id').limit(1);
  if (error) {
    console.error('Error fetching from Supabase:', error);
  } else {
    console.log('Successfully connected and queried Supabase.', data);
  }
}

testSupabase();
