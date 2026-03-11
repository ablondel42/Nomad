import { useState, useRef, useEffect } from "react";
import { CATEGORIES, LOCATIONS, SENIORITIES } from "~/constants/constants";
import type { HeroSectionProps } from "~/types/types";

import { CustomSelect } from "./CustomSelect";

export function HeroSection({
    searchTerm,
    setSearchTerm,
    locationTerm,
    setLocationTerm,
    seniorityTerm,
    setSeniorityTerm,
    handleSearch,
    isLoading,
}: HeroSectionProps) {
    return (
        <section className="relative px-4 pt-12 md:pt-20 pb-20 md:pb-32 bg-transparent">
            <div className="max-w-4xl mx-auto text-center">
                <h1 className="text-5xl md:text-6xl font-black tracking-tight text-slate-900 dark:text-white mb-6 leading-tight">
                    Land your dream job in <span className="text-blue-600 dark:text-blue-400">Tech</span>
                </h1>
                <p className="text-lg md:text-xl text-gray-800 dark:text-gray-100 mb-10 max-w-2xl mx-auto">
                    Discover remote opportunities at top startups and tech giants. Your next big career move starts here.
                </p>

                <div className="max-w-3xl mx-auto bg-white dark:bg-slate-900 p-4 rounded-xl border-2 border-slate-200 dark:border-slate-700 flex flex-col md:flex-row gap-4 relative z-50">
                    <CustomSelect 
                        options={CATEGORIES} 
                        value={searchTerm} 
                        onChange={setSearchTerm} 
                        placeholder="🎯 All Categories" 
                    />
                    <div className="hidden md:block w-0.5 bg-slate-200 dark:bg-slate-700 my-2" />
                    
                    <CustomSelect 
                        options={LOCATIONS} 
                        value={locationTerm} 
                        onChange={setLocationTerm} 
                        placeholder="🌐 Any Location" 
                    />
                    <div className="hidden md:block w-0.5 bg-slate-200 dark:bg-slate-700 my-2" />
                    
                    <CustomSelect 
                        options={SENIORITIES} 
                        value={seniorityTerm} 
                        onChange={setSeniorityTerm} 
                        placeholder="🎓 Any Seniority" 
                    />
                </div>
            </div>
        </section>
    );
}
