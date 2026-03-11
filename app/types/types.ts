import type { Session } from "@supabase/supabase-js";

export interface SessionContext {
    session: Session | null | undefined;
}

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
    status?: 'Application sent' | 'Interview in progress' | 'Offer received' | 'Offer accepted' | null;
}

export interface ApiResponse {
    success: boolean;
    jobs: JobicyJob[];
}

export interface JobCardProps {
    job: JobicyJob;
    isBookmarked?: boolean;
    onToggleBookmark?: (e: React.MouseEvent, jobId: number) => void;
    onStatusChange?: (e: React.MouseEvent, jobId: number, newStatus: string | null) => void;
}

export interface JobListProps {
    jobs: JobicyJob[];
    searchTerm?: string;
    locationTerm?: string;
    isLoading: boolean;
    hasMore: boolean;
    onClearFilters?: () => void;
    onLoadMore?: () => void;
    onViewAll?: () => void;
    bookmarkedJobIds?: number[];
    onToggleBookmark?: (e: React.MouseEvent, jobId: number) => void;
    onStatusChange?: (e: React.MouseEvent, jobId: number, newStatus: string | null) => void;
}

export interface HeroSectionProps {
    searchTerm: string;
    setSearchTerm: (value: string) => void;
    locationTerm: string;
    setLocationTerm: (value: string) => void;
    seniorityTerm: string;
    setSeniorityTerm: (value: string) => void;
    handleSearch: () => void;
    isLoading: boolean;
    handlePopularTag: (tag: string) => void;
}