import { Link } from "react-router";
import { useState } from "react";
import { BuildingIcon, MapPinIcon, BriefcaseIcon, BookmarkIcon, BookmarkSolidIcon } from "./icons";
import { CustomSelect } from "./CustomSelect";
import type { JobCardProps } from "~/types/types";

export function JobCard({ job, isBookmarked = false, onToggleBookmark, onStatusChange }: JobCardProps) {
    const [imgError, setImgError] = useState(false);
    const salary = job.salaryMin && job.salaryMax
        ? `${job.salaryCurrency === "USD" ? "$" : job.salaryCurrency || "$"}${job.salaryMin / 1000}k - ${job.salaryMax / 1000}k`
        : "Salary Not Disclosed";

    const STATUS_OPTIONS = [
        { value: '', label: 'No status' },
        { value: 'Application sent', label: 'Application sent' },
        { value: 'Interview in progress', label: 'Interview in progress' },
        { value: 'Offer received', label: 'Offer received' },
        { value: 'Offer accepted', label: 'Offer accepted' },
    ];

    return (
        <Link to={`/jobs/${job.id}`} state={{ job }} className="block bg-white dark:bg-slate-900 p-5 md:p-6 rounded-xl border-2 border-slate-200 dark:border-slate-700 hover:border-blue-600 dark:hover:border-blue-400 hover:-translate-y-1 transition-all group cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 dark:focus:ring-offset-slate-900 relative z-10 hover:z-50 focus-within:z-50">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="flex items-start gap-4 flex-1">
                    <div className="h-12 w-12 rounded-lg bg-slate-100 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform overflow-hidden p-1">
                        {job.companyLogo && !imgError ? (
                            <img
                                src={job.companyLogo}
                                alt={job.companyName}
                                className="h-full w-full object-contain mix-blend-multiply dark:mix-blend-normal"
                                onError={() => setImgError(true)}
                            />
                        ) : (
                            <BuildingIcon className="text-gray-400 dark:text-gray-500" />
                        )}
                    </div>

                    <div className="flex-1">
                        <div className="flex justify-between items-start">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-1">
                                {job.jobTitle}
                            </h3>
                        </div>
                        <div className="flex flex-wrap items-center text-sm text-slate-500 dark:text-slate-400 gap-2 mb-3">
                            <span className="font-bold text-slate-700 dark:text-slate-300">{job.companyName || "Unknown Company"}</span>
                            <span>&bull;</span>
                            <span className="flex items-center gap-1"><MapPinIcon />{job.jobGeo}</span>
                            <span>&bull;</span>
                            <span className="flex items-center gap-1"><BriefcaseIcon />{job.jobType?.[0] ? job.jobType[0] : 'Remote'}</span>
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                            <span className="px-3 py-1 bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300 text-xs font-bold rounded border-2 border-green-200 dark:border-green-800">
                                {salary}
                            </span>
                            {job.jobLevel && job.jobLevel !== "Any" && (
                                <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300 text-xs font-bold rounded border-2 border-blue-200 dark:border-blue-800">
                                    {job.jobLevel}
                                </span>
                            )}
                            {job.jobIndustry && job.jobIndustry.length > 0 && (
                                <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/50 text-purple-800 dark:text-purple-300 text-xs font-bold rounded border-2 border-purple-200 dark:border-purple-800">
                                    {job.jobIndustry[0]}
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-4 sm:gap-2 w-full sm:w-auto mt-2 sm:mt-0 pt-4 sm:pt-0 border-t-2 sm:border-0 border-slate-100 dark:border-slate-800 relative z-20">
                    <span className="text-xs text-slate-500 font-bold">
                        {new Date(job.pubDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    </span>
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                        <button className="bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 px-4 py-2 rounded-lg font-bold text-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors flex-1 sm:flex-none group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 dark:group-hover:border-blue-600">
                            View Details
                        </button>
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                onToggleBookmark?.(e, job.id);
                            }}
                            className={`p-2 rounded-lg border-2 transition-colors flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 dark:focus:ring-offset-slate-900 ${isBookmarked
                                    ? 'border-blue-200 dark:border-blue-700 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                                    : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-50 dark:hover:bg-slate-700'
                                }`}
                            aria-label={isBookmarked ? "Remove bookmark" : "Bookmark job"}
                        >
                            {isBookmarked ? <BookmarkSolidIcon /> : <BookmarkIcon />}
                        </button>
                    </div>
                    {isBookmarked && onStatusChange && (
                        <div className="w-full sm:w-auto mt-2 relative z-30">
                            <CustomSelect
                                options={STATUS_OPTIONS}
                                value={job.status || ""}
                                onChange={(val: string) => {
                                    onStatusChange(null as any, job.id, val || null);
                                }}
                                placeholder="Status"
                                className="w-full sm:w-auto flex items-center justify-between gap-2 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 px-3 py-2 rounded-lg text-sm font-bold focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 dark:focus-within:ring-offset-slate-900 transition-colors cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700"
                                textClassName="flex-1 truncate text-left select-none"
                                dropdownClassName="absolute top-full right-0 sm:right-0 sm:left-auto left-0 mt-2 bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 rounded-xl shadow-xl z-50 max-h-64 min-w-[200px] overflow-y-auto p-2 flex flex-col gap-1 text-sm font-medium"
                                iconClassName="text-slate-400"
                            />
                        </div>
                    )}
                </div>
            </div>
        </Link>
    );
}
