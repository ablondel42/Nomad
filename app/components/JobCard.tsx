import { Link } from "react-router";
import { useState } from "react";
import { BuildingIcon, MapPinIcon, BriefcaseIcon } from "./icons";
import type { JobCardProps } from "~/types/types";


export function JobCard({ job }: JobCardProps) {
    const [imgError, setImgError] = useState(false);
    const salary = job.salaryMin && job.salaryMax
        ? `${job.salaryCurrency === "USD" ? "$" : job.salaryCurrency || "$"}${job.salaryMin / 1000}k - ${job.salaryMax / 1000}k`
        : "Salary Not Disclosed";

    return (
        <Link to={`/jobs/${job.id}`} state={{ job }} className="block bg-white dark:bg-slate-900 p-5 md:p-6 rounded-xl border-2 border-slate-200 dark:border-slate-700 hover:border-blue-600 dark:hover:border-blue-400 hover:-translate-y-1 transition-all group cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 dark:focus:ring-offset-slate-900">
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

                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-4 sm:gap-2 w-full sm:w-auto mt-2 sm:mt-0 pt-4 sm:pt-0 border-t-2 sm:border-0 border-slate-100 dark:border-slate-800">
                    <span className="text-xs text-slate-500 font-bold">
                        {new Date(job.pubDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    </span>
                    <button className="bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 px-4 py-2 rounded-lg font-bold text-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors w-full sm:w-auto group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 dark:group-hover:border-blue-600">
                        View Details
                    </button>
                </div>
            </div>
        </Link>
    );
}
