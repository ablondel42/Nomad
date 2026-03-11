import { getJobListings } from './app/services/listings.ts';
async function test() {
  console.log("Fetching jobs...");
  const result = await getJobListings('engineering');
  console.log('Successfully fetched', result.jobs.length, 'jobs');
  if (result.jobs.length > 0) {
      console.log('Sample job id:', result.jobs[0].id);
  }
}
test().catch(console.error);
