export interface JobicyJob {
    id: number;
    url: string;
    jobTitle: string;
    companyName: string;
    companyLogo: string;
    jobIndustry: string[];
    jobType: string[];
    jobGeo: string;
    jobLevel: string;
    jobExcerpt: string;
    jobDescription: string;
    pubDate: string;
    salaryMin?: number;
    salaryMax?: number;
    salaryCurrency?: string;
    salaryPeriod?: string;
}

export interface ApiResponse {
    success: boolean;
    jobs: JobicyJob[];
}

export interface JobCardProps {
    job: JobicyJob;
}

export interface JobListProps {
    jobs: JobicyJob[];
    searchTerm: string;
    locationTerm: string;
    isLoading: boolean;
    hasMore: boolean;
    onClearFilters: () => void;
    onLoadMore: () => void;
    onViewAll: () => void;
}

export interface HeroSectionProps {
    searchTerm: string;
    setSearchTerm: (value: string) => void;
    locationTerm: string;
    setLocationTerm: (value: string) => void;
    handleSearch: () => void;
    isLoading: boolean;
    handlePopularTag: (tag: string) => void;
}