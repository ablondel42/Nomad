import type { Route } from "./+types/home";
import { useState, useRef, useEffect } from "react";
import { HeroSection } from "~/components/HeroSection";
import { JobList } from "~/components/JobList";
import type { JobicyJob } from "~/types/types";
import { getJobListings } from "~/services/listings";

import desktopBgDark from "~/assets/Desktop-Dark.png";
import desktopBgLight from "~/assets/Desktop-Light.png";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Nomad - Premium Remote Job Board" },
    { name: "description", content: "Find your next great remote opportunity in tech." },
  ];
}

const PAGE_SIZE = 10;

export default function Home() {
  const [allJobs, setAllJobs] = useState<JobicyJob[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [locationTerm, setLocationTerm] = useState("");
  const [displayedJobs, setDisplayedJobs] = useState<JobicyJob[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const jobsSectionRef = useRef<HTMLElement>(null);


  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setIsLoading(true);
        const response = await getJobListings("", "");
        if (response.success) {
          const jobs = response.jobs;
          setAllJobs(jobs);
          setDisplayedJobs(jobs.slice(0, PAGE_SIZE));
          setCurrentPage(1);
        } else {
          setError("Failed to load jobs");
        }
      } catch (err) {
        setError("Error fetching job listings");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchJobs();
  }, []);

  const performSearch = async (term: string, loc: string) => {
    setIsLoading(true);
    setDisplayedJobs([]);
    try {
      const response = await getJobListings(term, loc);
      if (response.success) {
        setAllJobs(response.jobs);
        setDisplayedJobs(response.jobs.slice(0, PAGE_SIZE));
        setCurrentPage(1);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
      jobsSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleSearchTermChange = (term: string) => {
    setSearchTerm(term);
    performSearch(term, locationTerm);
  };

  const handleLocationTermChange = (loc: string) => {
    setLocationTerm(loc);
    performSearch(searchTerm, loc);
  };

  const handleSearch = () => performSearch(searchTerm, locationTerm);

  const handlePopularTag = (tag: string) => {
    setSearchTerm(tag);
    performSearch(tag, locationTerm);
  };

  const loadMoreJobs = () => {
    if (displayedJobs.length >= allJobs.length) return;
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);
    setDisplayedJobs(allJobs.slice(0, nextPage * PAGE_SIZE));
  };

  const handleViewAll = () => {
    setDisplayedJobs(allJobs);
    setCurrentPage(Math.ceil(allJobs.length / PAGE_SIZE));
  };

  const hasMore = displayedJobs.length < allJobs.length;

  const handleClearFilters = async () => {
    setSearchTerm("");
    setLocationTerm("");
    setIsLoading(true);
    setDisplayedJobs([]);
    try {
      const response = await getJobListings("", "");
      if (response.success) {
        setAllJobs(response.jobs);
        setDisplayedJobs(response.jobs.slice(0, PAGE_SIZE));
        setCurrentPage(1);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-red-500 text-lg font-semibold">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <style>{`
        .home-bg-theme { background-image: url('${desktopBgLight}'); }
        .dark .home-bg-theme { background-image: url('${desktopBgDark}'); }
      `}</style>
      <div
        className="home-bg-theme bg-[length:100%_auto] bg-top bg-no-repeat bg-fixed min-h-full"
      >
        <HeroSection
          searchTerm={searchTerm}
          setSearchTerm={handleSearchTermChange}
          locationTerm={locationTerm}
          setLocationTerm={handleLocationTermChange}
          handleSearch={handleSearch}
          isLoading={isLoading}
          handlePopularTag={handlePopularTag}
        />

        <section ref={jobsSectionRef} className="pt-0 pb-10 md:pb-12 md:py-16 px-4 scroll-mt-4 bg-white/50 dark:bg-gray-950/50 backdrop-blur-xs mb-8 md:mb-16 rounded-b-[2rem] mx-4 md:mx-0">
          <div className="max-w-4xl mx-auto">
            <JobList
              jobs={displayedJobs}
              searchTerm={searchTerm}
              locationTerm={locationTerm}
              isLoading={isLoading}
              hasMore={hasMore}
              onClearFilters={handleClearFilters}
              onLoadMore={loadMoreJobs}
              onViewAll={handleViewAll}
            />
          </div>
        </section>
      </div>
    </>
  );
}
