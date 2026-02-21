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
                        <div key={i} className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 animate-pulse">
                            <div className="flex gap-4">
                                <div className="h-12 w-12 bg-gray-200 dark:bg-gray-800 rounded-xl"></div>
                                <div className="flex-1 space-y-3">
                                    <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-3/4"></div>
                                    <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-1/2"></div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : jobs.length > 0 ? (
                    jobs.map((job) => <JobCard key={job.id} job={job} />)
                ) : !isLoading ? (
                    <div className="text-center py-12 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
                        <div className="mb-4 inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-50 dark:bg-gray-800 text-gray-400">
                            <BriefcaseIcon className="w-8 h-8" />
                        </div>
                        <p className="text-gray-500 dark:text-gray-400 text-lg font-medium">No jobs found matching your criteria.</p>
                        <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">Try adjusting your search or filters to find what you're looking for.</p>
                        <button
                            onClick={onClearFilters}
                            className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors shadow-md shadow-blue-600/20"
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
                            className="px-6 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 font-medium rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors shadow-sm disabled:opacity-50 flex items-center justify-center mx-auto min-w-[160px]"
                        >
                            {isLoading ? (
                                <div className="w-5 h-5 border-2 border-gray-400/30 border-t-gray-600 dark:border-gray-500/30 dark:border-t-gray-300 rounded-full animate-spin"></div>
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
