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
        <Link to={`/jobs/${job.id}`} state={{ job }} className="block bg-white dark:bg-gray-900 p-5 md:p-6 rounded-2xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] dark:shadow-none border border-gray-100 dark:border-gray-800 hover:border-blue-100 dark:hover:border-gray-700 hover:shadow-[0_8px_30px_-4px_rgba(6,81,237,0.1)] transition-all group cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500/50">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="flex items-start gap-4 flex-1">
                    <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-800 border border-gray-200 dark:border-gray-700 flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition-transform overflow-hidden p-1">
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
                        <div className="flex flex-wrap items-center text-sm text-gray-500 dark:text-gray-400 gap-2 mb-3">
                            <span className="font-medium text-gray-700 dark:text-gray-300">{job.companyName || "Unknown Company"}</span>
                            <span>&bull;</span>
                            <span className="flex items-center gap-1"><MapPinIcon />{job.jobGeo}</span>
                            <span>&bull;</span>
                            <span className="flex items-center gap-1"><BriefcaseIcon />{job.jobType?.[0] ? job.jobType[0] : 'Remote'}</span>
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                            <span className="px-3 py-1 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-medium rounded-full border border-green-200/50 dark:border-green-800/50">
                                {salary}
                            </span>
                            {job.jobLevel && job.jobLevel !== "Any" && (
                                <span className="px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs font-medium rounded-full border border-blue-200/50 dark:border-blue-800/50">
                                    {job.jobLevel}
                                </span>
                            )}
                            {job.jobIndustry && job.jobIndustry.length > 0 && (
                                <span className="px-3 py-1 bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 text-xs font-medium rounded-full border border-purple-200/50 dark:border-purple-800/50">
                                    {job.jobIndustry[0]}
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-4 sm:gap-2 w-full sm:w-auto mt-2 sm:mt-0 pt-4 sm:pt-0 border-t sm:border-0 border-gray-100 dark:border-gray-800">
                    <span className="text-xs text-gray-400 dark:text-gray-500 font-medium">
                        {new Date(job.pubDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    </span>
                    <button className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg font-medium text-sm hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-colors shadow-sm w-full sm:w-auto hover:!bg-blue-600 hover:!text-white hover:!border-blue-600">
                        View Details
                    </button>
                </div>
            </div>
        </Link>
    );
}
