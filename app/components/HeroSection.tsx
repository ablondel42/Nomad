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
            <div className="max-w-4xl mx-auto text-center">
                <h1 className="text-5xl md:text-6xl font-black tracking-tight text-slate-900 dark:text-white mb-6 leading-tight">
                    Land your dream job in <span className="text-blue-600 dark:text-blue-400">Tech</span>
                </h1>
                <p className="text-lg md:text-xl text-gray-800 dark:text-gray-100 mb-10 max-w-2xl mx-auto">
                    Discover remote opportunities at top startups and tech giants. Your next big career move starts here.
                </p>

                <div className="max-w-3xl mx-auto bg-white dark:bg-slate-900 p-4 rounded-xl border-2 border-slate-900 dark:border-slate-700 flex flex-col md:flex-row gap-4">
                    <div className="flex-1 flex items-center gap-3 px-4 py-3 bg-slate-50 dark:bg-slate-800 rounded-lg border-2 border-transparent focus-within:border-blue-600 dark:focus-within:border-blue-400 transition-colors group relative cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700">
                        <div className="flex-1 text-slate-900 dark:text-white pointer-events-none truncate pr-6 text-left font-bold">
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
                    <div className="hidden md:block w-0.5 bg-slate-200 dark:bg-slate-700 my-2" />
                    <div className="flex-1 flex items-center gap-3 px-4 py-3 bg-slate-50 dark:bg-slate-800 rounded-lg border-2 border-transparent focus-within:border-blue-600 dark:focus-within:border-blue-400 transition-colors group relative cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700">
                        <div className="flex-1 text-slate-900 dark:text-white pointer-events-none truncate pr-6 text-left font-bold">
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
