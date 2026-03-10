import { ChevronRightIcon, BriefcaseIcon } from "./icons";
import { JobCard } from "./JobCard";
import type { JobListProps } from "~/types/types";

export function JobList({
    jobs,
    searchTerm,
    locationTerm,
    isLoading,
    hasMore,
    onClearFilters,
    onLoadMore,
    onViewAll
}: JobListProps) {
    return (
        <>
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {searchTerm || locationTerm ? "Search results" : "Recent opportunities"}
                </h2>
                {hasMore && (
                    <button
                        onClick={onViewAll}
                        className="text-blue-600 dark:text-blue-400 font-medium hover:text-blue-700 dark:hover:text-blue-300 transition-colors flex items-center gap-1 group"
                    >
                        View all <ChevronRightIcon className="group-hover:translate-x-0.5 transition-transform" />
                    </button>
                )}
            </div>

            <div className="flex flex-col gap-4">
                {isLoading && jobs.length === 0 ? (
                    Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="bg-white dark:bg-slate-800 p-6 rounded-xl border-2 border-slate-200 dark:border-slate-700">
                            <div className="flex gap-4">
                                <div className="h-12 w-12 bg-slate-200 dark:bg-slate-700 rounded-lg"></div>
                                <div className="flex-1 space-y-3">
                                    <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div>
                                    <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/2"></div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : jobs.length > 0 ? (
                    jobs.map((job) => <JobCard key={job.id} job={job} />)
                ) : !isLoading ? (
                    <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-xl border-2 border-slate-200 dark:border-slate-700">
                        <div className="mb-4 inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-400">
                            <BriefcaseIcon className="w-8 h-8" />
                        </div>
                        <p className="text-slate-500 dark:text-slate-300 text-lg font-bold">No jobs found matching your criteria.</p>
                        <p className="text-slate-400 dark:text-slate-400 text-sm mt-1">Try adjusting your search or filters to find what you're looking for.</p>
                        <button
                            onClick={onClearFilters}
                            className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-colors border-2 border-blue-800 dark:border-transparent"
                        >
                            Clear all filters
                        </button>
                    </div>
                ) : null}
            </div>

            {jobs.length > 0 && (
                <div className="mt-10 text-center">
                    {hasMore ? (
                        <button
                            onClick={onLoadMore}
                            disabled={isLoading}
                            className="px-8 py-3 bg-blue-600 text-white font-bold rounded-lg border-2 border-blue-800 dark:border-transparent hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center mx-auto min-w-[160px]"
                        >
                            {isLoading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            ) : "Load more jobs"}
                        </button>
                    ) : !isLoading && (
                        <p className="text-sm text-gray-400 dark:text-gray-500 font-medium">
                            You've seen all {jobs.length} results{(searchTerm || locationTerm) ? " matching your query" : ""}.
                        </p>
                    )}
                </div>
            )}
        </>
    );
}
