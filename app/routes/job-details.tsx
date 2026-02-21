import type { Route } from "./+types/job-details";
import { Link, useParams, useLocation } from "react-router";
import { useState, useEffect } from "react";
import { BuildingIcon, MapPinIcon, BriefcaseIcon, ArrowLeftIcon, ShareIcon, BookmarkIcon, ClockIcon, ExternalLinkIcon } from "~/components/icons";
import type { JobicyJob } from "~/types/types";
import { getJobListings } from "~/services/listings";

export function meta({ params }: Route.MetaArgs) {
    return [
        { title: `Job Details - Nomad` },
        { name: "description", content: "View full details and apply for this job on Nomad." },
    ];
}

export default function JobDetails() {
    const { id } = useParams();
    const location = useLocation();
    const stateJob = location.state?.job as JobicyJob | undefined;

    const [job, setJob] = useState<JobicyJob | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [imgError, setImgError] = useState(false);

    useEffect(() => {
        if (stateJob) {
            setJob(stateJob);
            setIsLoading(false);
            return;
        }

        const fetchJobFallback = async () => {
            try {
                setIsLoading(true);
                const response = await getJobListings();
                if (response.success) {
                    const foundJob = response.jobs.find(j => j.id.toString() === id);
                    if (foundJob) {
                        setJob(foundJob);
                    } else {
                        setError("Job not found. It may have expired or you need to access it from the job list.");
                    }
                } else {
                    setError("Failed to load job details");
                }
            } catch (err) {
                setError("Error fetching job details");
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        if (id) fetchJobFallback();
    }, [id, stateJob]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[calc(100vh-64px)]">
                <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
            </div>
        );
    }

    if (error || !job) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] px-4">
                <p className="text-red-500 text-xl font-semibold mb-4">{error || "Job not found"}</p>
                <Link to="/" className="text-blue-600 hover:underline font-medium">Back to listings</Link>
            </div>
        );
    }

    const salary = job.salaryMin && job.salaryMax
        ? `${job.salaryCurrency === "USD" ? "$" : job.salaryCurrency || "$"}${job.salaryMin / 1000}k - ${job.salaryMax / 1000}k`
        : "Salary Not Disclosed";

    return (
        <div className="bg-gray-50 dark:bg-gray-950 min-h-[calc(100vh-64px)] py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <Link to="/" className="inline-flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors mb-6 text-sm font-medium">
                    <ArrowLeftIcon className="w-4 h-4" /> Back to job listings
                </Link>

                <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 sm:p-10 shadow-sm border border-gray-100 dark:border-gray-800 mb-8">
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8">
                        <div className="flex items-start gap-6">
                            <div className="h-16 w-16 md:h-20 md:w-20 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-800 border border-gray-200 dark:border-gray-700 flex items-center justify-center shrink-0 shadow-sm overflow-hidden p-1">
                                {job.companyLogo && !imgError ? (
                                    <img
                                        src={job.companyLogo}
                                        alt={job.companyName}
                                        className="h-full w-full object-contain mix-blend-multiply dark:mix-blend-normal"
                                        onError={() => setImgError(true)}
                                    />
                                ) : (
                                    <BuildingIcon className="w-8 h-8 md:w-10 md:h-10 text-gray-400 dark:text-gray-500" />
                                )}
                            </div>
                            <div>
                                <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2 tracking-tight">
                                    {job.jobTitle}
                                </h1>
                                <div className="text-lg text-gray-600 dark:text-gray-300 font-medium mb-4">
                                    {job.companyName}
                                </div>
                                <div className="flex flex-wrap items-center text-sm text-gray-500 dark:text-gray-400 gap-x-4 gap-y-2">
                                    <span className="flex items-center gap-1.5"><MapPinIcon /> {job.jobGeo}</span>
                                    <span className="flex items-center gap-1.5"><BriefcaseIcon /> {job.jobType?.[0] ? job.jobType[0] : 'Remote'}</span>
                                    <span className="flex items-center gap-1.5"><ClockIcon /> Posted {new Date(job.pubDate).toLocaleDateString()}</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <button className="p-3 bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors shadow-sm">
                                <ShareIcon />
                            </button>
                            <button className="p-3 bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-blue-400 transition-colors shadow-sm cursor-pointer">
                                <BookmarkIcon />
                            </button>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 pt-6 border-t border-gray-100 dark:border-gray-800 pb-2">
                        <span className="px-4 py-2 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-sm font-semibold rounded-xl border border-green-200 dark:border-green-800/50">
                            {salary}
                        </span>
                        {job.jobLevel && job.jobLevel !== "Any" && (
                            <span className="px-4 py-2 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-sm font-medium rounded-xl border border-blue-200 dark:border-blue-800/50">
                                {job.jobLevel}
                            </span>
                        )}
                        {job.jobIndustry && job.jobIndustry.length > 0 && (
                            <span className="px-4 py-2 bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 text-sm font-medium rounded-xl border border-purple-200 dark:border-purple-800/50">
                                {job.jobIndustry[0]}
                            </span>
                        )}

                        <div className="ml-auto mt-4 sm:mt-0 w-full sm:w-auto">
                            <a href={job.url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 w-full text-center bg-blue-600 text-white px-8 py-3.5 rounded-xl font-medium hover:bg-blue-700 transition-all shadow-md shadow-blue-600/20 active:scale-[0.98]">
                                Apply Now <ExternalLinkIcon className="w-4 h-4" />
                            </a>
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 sm:p-10 shadow-sm border border-gray-100 dark:border-gray-800">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">About the Role</h2>
                    <div className="prose dark:prose-invert max-w-none text-gray-600 dark:text-gray-300">
                        <div style={{ whiteSpace: 'pre-wrap' }}>
                            {job.jobDescription}
                        </div>
                        <div className="mt-10 p-6 bg-blue-50/50 dark:bg-blue-900/10 rounded-2xl border border-blue-100 dark:border-blue-800/50">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Ready to apply?</h3>
                            <p className="text-gray-600 dark:text-gray-400 mb-6">Join {job.companyName} and help build the future of our innovative platform.</p>
                            <a href={job.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 w-full sm:w-auto text-center bg-blue-600 text-white px-8 py-3 rounded-xl font-medium hover:bg-blue-700 transition-all shadow-md shadow-blue-600/20">
                                Submit Application <ExternalLinkIcon className="w-4 h-4" />
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
