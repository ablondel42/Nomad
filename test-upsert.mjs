import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env' });
const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

const mockJob = {
    id: 999999,
    url: 'https://example.com/job',
    jobtitle: 'Software Engineer',
    companyname: 'Test Company',
    companylogo: null,
    jobindustry: ['engineering'],
    jobtype: ['full-time'],
    jobgeo: 'Remote',
    joblevel: 'senior',
    jobexcerpt: 'Great job',
    jobdescription: 'Lots of code',
    pubdate: new Date().toISOString(),
    salarymin: 100000,
    salarymax: 150000,
    salarycurrency: 'USD',
    salaryperiod: 'yearly'
};

console.log("Upserting mock job...");
const { data, error } = await supabase.from('job_listings').upsert([mockJob], { onConflict: 'id' }).select();

if (error) {
  console.error('Error upserting to Supabase:', error);
} else {
  console.log('Successfully upserted data:', data.length, 'rows');
  
  // Now verify it's there
  const { data: fetch, error: fetchError } = await supabase.from('job_listings').select('id').eq('id', 999999);
  console.log("Fetch result after upsert:", fetch);
  
  // Clean up
  await supabase.from('job_listings').delete().eq('id', 999999);
}
