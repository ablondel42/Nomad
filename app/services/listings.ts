import type { ApiResponse, JobicyJob } from '../types/types';
import he from 'he';
import { supabase } from '../utils/supabase';

/**
 * Convert HTML string to readable plain text
 */
function htmlToText(html: string): string {
    if (!html) return '';

    // Decode HTML entities
    html = he.decode(html);

    // Use DOM parser
    const div = document.createElement('div');
    div.innerHTML = html;

    function walk(node: Node): string {
        let text = '';

        node.childNodes.forEach((child) => {
            if (child.nodeType === Node.TEXT_NODE) {
                text += child.textContent;
            } else if (child.nodeType === Node.ELEMENT_NODE) {
                const el = child as HTMLElement;
                switch (el.tagName.toLowerCase()) {
                    case 'br':
                        text += '\n';
                        break;
                    case 'p':
                        text += walk(el).trim() + '\n\n';
                        break;
                    case 'li':
                        text += '- ' + walk(el).trim() + '\n';
                        break;
                    default:
                        text += walk(el);
                        break;
                }
            }
        });

        return text;
    }

    return walk(div).trim();
}

/**
 * Recursively decode object strings
 */
function decodeRecursive<T>(value: T): T {
    if (typeof value === 'string') {
        // Convert HTML to readable text
        return htmlToText(value) as unknown as T;
    }

    if (Array.isArray(value)) {
        return value.map(decodeRecursive) as unknown as T;
    }

    if (value && typeof value === 'object') {
        const result: any = {};
        for (const key in value) {
            if (Object.prototype.hasOwnProperty.call(value, key)) {
                result[key] = decodeRecursive((value as any)[key]);
            }
        }
        return result as T;
    }

    return value;
}

export const getJobListings = async (
    searchQuery: string = "",
    locationTerm: string = ""
): Promise<ApiResponse> => {

    // 1. Try fetching from Supabase cache first
    try {
        let query = supabase
            .from('job_listings')
            .select('*');

        if (searchQuery.trim()) {
            query = query.contains('jobindustry', [searchQuery.trim()]);
        }
        if (locationTerm.trim()) {
            query = query.ilike('jobgeo', `%${locationTerm.trim()}%`);
        }

        const { data: cachedJobs, error } = await query.order('pubdate', { ascending: false }).limit(100);

        if (!error && cachedJobs && cachedJobs.length > 0) {
            console.log("Serving jobs from Supabase cache");
            
            // Map the Supabase rows back to JobicyJob format
            const jobs: JobicyJob[] = cachedJobs.map(job => ({
                id: job.id,
                url: job.url || '',
                jobTitle: job.jobtitle || '',
                companyName: job.companyname || '',
                companyLogo: job.companylogo || '',
                jobIndustry: job.jobindustry || [],
                jobType: job.jobtype || [],
                jobGeo: job.jobgeo || '',
                jobLevel: job.joblevel || '',
                jobExcerpt: job.jobexcerpt || '',
                jobDescription: job.jobdescription || '',
                pubDate: job.pubdate || '',
                salaryMin: job.salarymin,
                salaryMax: job.salarymax,
                salaryCurrency: job.salarycurrency,
                salaryPeriod: job.salaryperiod
            }));
            
            return {
                success: true,
                jobs
            };
        }
    } catch (e) {
        console.warn("Error querying Supabase cache", e);
    }

    // 2. Fetch from Jobicy API if cache is empty or missed
    try {
        let url = `https://jobicy.com/api/v2/remote-jobs?count=100`;

        if (searchQuery.trim()) {
            // Note: Jobicy API requires industry term
            url += `&industry=${encodeURIComponent(searchQuery.trim())}`;
        }

        if (locationTerm.trim()) {
            // Note: Jobicy API requires geo term
            url += `&geo=${encodeURIComponent(locationTerm.trim())}`;
        }

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const rawData: any = await response.json();

        // Decode all HTML in all strings recursively
        const decodedData = decodeRecursive(rawData);

        const result: ApiResponse = {
            success: decodedData.success ?? true,
            jobs: decodedData.jobs || []
        };

        // 3. Upsert new jobs to Supabase
        try {
            if (result.jobs.length > 0) {
                const upsertData = result.jobs.map(job => ({
                    id: job.id,
                    url: job.url || '',
                    jobtitle: job.jobTitle || '',
                    companyname: job.companyName || '',
                    companylogo: job.companyLogo || '',
                    jobindustry: job.jobIndustry || [],
                    jobtype: job.jobType || [],
                    jobgeo: job.jobGeo || '',
                    joblevel: job.jobLevel || '',
                    jobexcerpt: job.jobExcerpt || '',
                    jobdescription: job.jobDescription || '',
                    pubdate: job.pubDate || '',
                    salarymin: job.salaryMin || null,
                    salarymax: job.salaryMax || null,
                    salarycurrency: job.salaryCurrency || null,
                    salaryperiod: job.salaryPeriod || null
                }));

                // Upsert ignoring duplicates based on id
                const { error: upsertError } = await supabase
                    .from('job_listings')
                    .upsert(upsertData, { onConflict: 'id' });
                    
                if (upsertError) {
                    console.error('Error inserting jobs to Supabase:', upsertError);
                }
            }
        } catch (e) {
            console.warn("Error saving to Supabase", e);
        }

        console.log(result);
        return result;

    } catch (error) {
        console.error('Error fetching job listings:', error);
        throw error;
    }
};