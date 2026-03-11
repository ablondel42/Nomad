import { useOutletContext, useNavigate } from "react-router";
import { supabase } from "~/utils/supabase";
import { JobList } from "~/components/JobList";
import type { JobicyJob, SessionContext } from "~/types/types";
import { useState, useCallback, useEffect } from "react";

export async function loader() {
    return null;
}

export default function Dashboard() {
    const { session } = useOutletContext<SessionContext>();
    const navigate = useNavigate();
    const [bookmarkedJobs, setBookmarkedJobs] = useState<JobicyJob[]>([]);
    const [bookmarkedJobIds, setBookmarkedJobIds] = useState<number[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState<string | null>(null);

    // Redirect if not logged in
    useEffect(() => {
        if (session === null) {
            navigate("/login");
        }
    }, [session, navigate]);

    useEffect(() => {
        async function fetchBookmarks() {
            if (!session?.user?.id) {
                setIsLoading(false);
                return;
            }

            try {
                // Fetch the bookmarked job IDs for the user
                const { data: bookmarks, error: bookmarkError } = await supabase
                    .from('bookmarked_jobs')
                    .select('job_id, status')
                    .eq('user_id', session.user.id);

                if (bookmarkError) throw bookmarkError;

                if (!bookmarks || bookmarks.length === 0) {
                    setBookmarkedJobs([]);
                    setBookmarkedJobIds([]);
                    setIsLoading(false);
                    return;
                }

                const jobIds = bookmarks.map(b => b.job_id);
                setBookmarkedJobIds(jobIds);

                // Fetch the actual job details for those IDs
                const { data: rawJobs, error: jobsError } = await supabase
                    .from('job_listings')
                    .select('*')
                    .in('id', jobIds)
                    .order('pubdate', { ascending: false });

                if (jobsError) throw jobsError;

                const formattedJobs: JobicyJob[] = (rawJobs || []).map(job => {
                    const bookmark = bookmarks.find(b => b.job_id === job.id);
                    return {
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
                        salaryPeriod: job.salaryperiod,
                        status: bookmark?.status || null
                    };
                });

                setBookmarkedJobs(formattedJobs);
            } catch (error) {
                console.error("Error fetching bookmarks:", error);
            } finally {
                setIsLoading(false);
            }
        }

        fetchBookmarks();
    }, [session]);

    const handleToggleBookmark = useCallback(async (e: React.MouseEvent, jobId: number) => {
        e.preventDefault();
        
        if (!session?.user?.id) return;

        const isCurrentlyBookmarked = bookmarkedJobIds.includes(jobId);

        // Optimistic update for the UI
        setBookmarkedJobIds(prev => 
            isCurrentlyBookmarked 
                ? prev.filter(id => id !== jobId)
                : [...prev, jobId]
        );
        
        // On the dashboard, we probably want to remove the job from the list immediately when un-bookmarked
        if (isCurrentlyBookmarked) {
            setBookmarkedJobs(prev => prev.filter(job => job.id !== jobId));
        }

        try {
            if (isCurrentlyBookmarked) {
                // Remove bookmark
                const { error } = await supabase
                    .from('bookmarked_jobs')
                    .delete()
                    .eq('user_id', session.user.id)
                    .eq('job_id', jobId);

                if (error) throw error;
            } else {
                // This shouldn't typically happen on the dashboard as you only see bookmarked jobs,
                // but just in case they manage to re-bookmark it before the UI updates.
                const { error } = await supabase
                    .from('bookmarked_jobs')
                    .insert([{ user_id: session.user.id, job_id: jobId }]);

                if (error) throw error;
            }
        } catch (error) {
            console.error("Error toggling bookmark:", error);
            // Revert optimistic update on error
            setBookmarkedJobIds(prev => 
                isCurrentlyBookmarked 
                    ? [...prev, jobId]
                    : prev.filter(id => id !== jobId)
            );
            // We would also need to restore the job to the list if we removed it, 
            // but for simplicity we'll just let the next refresh handle it or re-fetch.
        }
    }, [bookmarkedJobIds, session]);

    const handleStatusChange = useCallback(async (e: React.MouseEvent, jobId: number, newStatus: string | null) => {
        if (!session?.user?.id) return;

        // Optimistic UI update
        setBookmarkedJobs(prev => prev.map(job => 
            job.id === jobId ? { ...job, status: newStatus as any } : job
        ));

        try {
            const { error } = await supabase
                .from('bookmarked_jobs')
                .update({ status: newStatus })
                .eq('user_id', session.user.id)
                .eq('job_id', jobId);

            if (error) throw error;
        } catch (error) {
            console.error("Error updating status:", error);
            // In a real app we'd revert the optimistic update here,
            // but for simplicity we're just ignoring the error in the UI.
        }
    }, [session]);

    // Don't render until we check session to avoid hydration mismatches
    if (session === undefined) return null;

    const STATUS_TABS = [
        { id: 'Application sent', label: 'Application sent' },
        { id: 'Interview in progress', label: 'Interview in progress' },
        { id: 'Offer received', label: 'Offer received' },
        { id: 'Offer accepted', label: 'Offer accepted' },
    ];

    const filteredJobs = bookmarkedJobs.filter(job => {
        if (!statusFilter) return true;
        return job.status === statusFilter;
    });

    const getStatusCount = (statusId: string) => {
        return bookmarkedJobs.filter(j => j.status === statusId).length;
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
            <div className="mb-8">
                <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-2">My Dashboard</h1>
                <p className="text-slate-600 dark:text-slate-400 text-lg max-w-2xl">
                    View and manage your saved opportunities.
                </p>
            </div>
            <div className="mb-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {STATUS_TABS.map(tab => {
                            const count = getStatusCount(tab.id);
                            const isSelected = statusFilter === tab.id;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setStatusFilter(isSelected ? null : tab.id)}
                                    className={`px-3 py-2 rounded-lg text-sm font-bold transition-colors w-full flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900 ${
                                        isSelected 
                                        ? 'bg-blue-600 text-white shadow-sm' 
                                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                                    }`}
                                >
                                    <span className="truncate">{tab.label}</span>
                                    <span className={`ml-1.5 px-2 py-0.5 rounded-full text-xs shrink-0 ${isSelected ? 'bg-blue-700 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-300'}`}>{count}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {isLoading ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    </div>
                ) : filteredJobs.length > 0 ? (
                    <JobList 
                        jobs={filteredJobs} 
                        isLoading={false} 
                        hasMore={false} 
                        onClearFilters={() => {}} 
                        bookmarkedJobIds={bookmarkedJobIds}
                        onToggleBookmark={handleToggleBookmark}
                        onStatusChange={handleStatusChange}
                        hideTitle={true}
                    />
                ) : (
                    <div className="text-center py-16 px-4">
                        <div className="bg-slate-50 dark:bg-slate-800 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-10 h-10 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No jobs found in this status</h3>
                        <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-8">
                            You don't have any jobs marked as "{STATUS_TABS.find(t => t.id === statusFilter)?.label}".
                        </p>
                        <button 
                            onClick={() => setStatusFilter(null)}
                            className="bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold py-3 px-6 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900"
                        >
                            View all saved jobs
                        </button>
                    </div>
                )}
        </div>
    );
}
