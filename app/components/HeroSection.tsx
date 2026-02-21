import type { HeroSectionProps } from "~/types/types";
import { CATEGORIES, LOCATIONS } from "~/constants/constants";

export function HeroSection({
    searchTerm,
    setSearchTerm,
    locationTerm,
    setLocationTerm,
    handleSearch,
    isLoading,
}: HeroSectionProps) {
    return (
        <section className="relative px-4 pt-12 md:pt-20 pb-20 md:pb-32 overflow-hidden bg-transparent">
            <div className="absolute inset-x-0 top-0 h-[500px] bg-gradient-to-b from-blue-50/50 to-transparent dark:from-blue-900/10 dark:to-transparent -z-10" />
            <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-100 dark:bg-blue-900/20 rounded-full blur-3xl opacity-50 -z-10" />
            <div className="absolute top-20 -left-20 w-72 h-72 bg-purple-100 dark:bg-purple-900/20 rounded-full blur-3xl opacity-50 -z-10" />

            <div className="max-w-4xl mx-auto text-center">
                <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-6 leading-tight">
                    Land your dream job in <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">Tech</span>
                </h1>
                <p className="text-lg md:text-xl text-gray-800 dark:text-gray-100 mb-10 max-w-2xl mx-auto">
                    Discover remote opportunities at top startups and tech giants. Your next big career move starts here.
                </p>

                <div className="max-w-3xl mx-auto bg-white dark:bg-gray-900 p-4 md:p-4 rounded-2xl shadow-xl dark:shadow-none border border-gray-100/50 dark:border-gray-800 flex flex-col md:flex-row gap-2">
                    <div className="flex-1 flex items-center gap-3 px-4 py-2 md:py-2 bg-gray-50/50 dark:bg-gray-800/50 rounded-xl border border-transparent focus-within:border-blue-200 dark:focus-within:border-blue-800 focus-within:bg-white dark:focus-within:bg-gray-800 transition-colors group relative">
                        <div className="flex-1 text-gray-900 dark:text-white pointer-events-none truncate pr-6 text-left">
                            {CATEGORIES.find(c => c.value === searchTerm)?.label || "🎯 All Categories"}
                        </div>
                        <select
                            className="bg-transparent w-full h-full absolute inset-0 opacity-0 cursor-pointer"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        >
                            {CATEGORIES.map(category => (
                                <option key={category.value} value={category.value}>
                                    {category.label}
                                </option>
                            ))}
                        </select>
                        <div className="pointer-events-none absolute right-4 text-gray-400">
                            ▼
                        </div>
                    </div>
                    <div className="hidden md:block w-px bg-gray-200 dark:bg-gray-800 my-2" />
                    <div className="flex-1 flex items-center gap-3 px-4 py-3 md:py-2 bg-gray-50/50 dark:bg-gray-800/50 rounded-xl border border-transparent focus-within:border-blue-200 dark:focus-within:border-blue-800 focus-within:bg-white dark:focus-within:bg-gray-800 transition-colors group relative">
                        <div className="flex-1 text-gray-900 dark:text-white pointer-events-none truncate pr-6 text-left">
                            {LOCATIONS.find(l => l.value === locationTerm)?.label || "🌐 Any Location"}
                        </div>
                        <select
                            className="bg-transparent w-full h-full absolute inset-0 opacity-0 cursor-pointer"
                            value={locationTerm}
                            onChange={(e) => setLocationTerm(e.target.value)}
                        >
                            {LOCATIONS.map(location => (
                                <option key={location.value} value={location.value}>
                                    {location.label}
                                </option>
                            ))}
                        </select>
                        <div className="pointer-events-none absolute right-4 text-gray-400">
                            ▼
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
