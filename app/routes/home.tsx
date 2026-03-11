import type { Route } from "./+types/home";
import { useState, useRef, useEffect } from "react";
import { HeroSection } from "~/components/HeroSection";
import { JobList } from "~/components/JobList";
import type { JobicyJob } from "~/types/types";
import { getJobListings } from "~/services/listings";
import Spline from '@splinetool/react-spline';
import { useOutletContext, useNavigate } from "react-router";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "~/utils/supabase";

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
  const [seniorityTerm, setSeniorityTerm] = useState("");
  const [displayedJobs, setDisplayedJobs] = useState<JobicyJob[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [bookmarkedJobIds, setBookmarkedJobIds] = useState<number[]>([]);
  
  const { session } = useOutletContext<{ session: Session | null | undefined }>();
  const navigate = useNavigate();

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

  // Fetch bookmarks when session changes
  useEffect(() => {
    const fetchBookmarks = async () => {
      if (!session?.user) {
        setBookmarkedJobIds([]);
        return;
      }
      try {
        const { data, error } = await supabase
          .from('bookmarked_jobs')
          .select('job_id')
          .eq('user_id', session.user.id);
          
        if (error) throw error;
        setBookmarkedJobIds(data.map(bm => bm.job_id));
      } catch (err) {
        console.error("Error fetching bookmarks:", err);
      }
    };
    fetchBookmarks();
  }, [session]);

  const toggleBookmark = async (e: React.MouseEvent, jobId: number) => {
    e.preventDefault(); // Prevent navigating to job details
    if (!session?.user) {
      navigate('/login');
      return;
    }

    const isBookmarked = bookmarkedJobIds.includes(jobId);
    
    // Optimistic UI update
    setBookmarkedJobIds(prev => 
      isBookmarked ? prev.filter(id => id !== jobId) : [...prev, jobId]
    );

    try {
      if (isBookmarked) {
        await supabase
          .from('bookmarked_jobs')
          .delete()
          .eq('user_id', session.user.id)
          .eq('job_id', jobId);
      } else {
        await supabase
          .from('bookmarked_jobs')
          .insert({ user_id: session.user.id, job_id: jobId });
      }
    } catch (err) {
      console.error("Error toggling bookmark:", err);
      // Revert on error
      setBookmarkedJobIds(prev => 
        isBookmarked ? [...prev, jobId] : prev.filter(id => id !== jobId)
      );
    }
  };

  const performSearch = async (term: string, loc: string, sen: string) => {
    setIsLoading(true);
    setDisplayedJobs([]);
    try {
      const response = await getJobListings(term, loc);
      if (response.success) {
        let filteredJobs = response.jobs;
        if (sen) {
          filteredJobs = response.jobs.filter((job) => {
            const level = job.jobLevel?.toLowerCase() || "";
            // Special handling for the grouped categories we created
            if (sen === "entry") return level.includes("entry") || level.includes("junior");
            if (sen === "manager") return level.includes("manager") || level.includes("management");
            if (sen === "executive") return level.includes("executive") || level.includes("vp");
            return level.includes(sen);
          });
        }
        setAllJobs(filteredJobs);
        setDisplayedJobs(filteredJobs.slice(0, PAGE_SIZE));
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
    performSearch(term, locationTerm, seniorityTerm);
  };

  const handleLocationTermChange = (loc: string) => {
    setLocationTerm(loc);
    performSearch(searchTerm, loc, seniorityTerm);
  };

  const handleSeniorityTermChange = (sen: string) => {
    setSeniorityTerm(sen);
    performSearch(searchTerm, locationTerm, sen);
  };

  const handleSearch = () => performSearch(searchTerm, locationTerm, seniorityTerm);

  const handlePopularTag = (tag: string) => {
    setSearchTerm(tag);
    performSearch(tag, locationTerm, seniorityTerm);
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
    setSeniorityTerm("");
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
    <div className="relative min-h-screen w-full">
      <div className="fixed inset-0 w-full h-full z-0 overflow-hidden">
        <Spline scene="https://prod.spline.design/X7BTa0JTGontw8zg/scene.splinecode" />
      </div>

      <div className="relative z-10 w-full min-h-screen">
        <HeroSection
          searchTerm={searchTerm}
          setSearchTerm={handleSearchTermChange}
          locationTerm={locationTerm}
          setLocationTerm={handleLocationTermChange}
          seniorityTerm={seniorityTerm}
          setSeniorityTerm={handleSeniorityTermChange}
          handleSearch={handleSearch}
          isLoading={isLoading}
          handlePopularTag={handlePopularTag}
        />

        <section ref={jobsSectionRef} className="pt-0 pb-10 md:pb-12 md:py-16 px-4 scroll-mt-4 md:mb-4 mx-4 md:mx-0">
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
              bookmarkedJobIds={bookmarkedJobIds}
              onToggleBookmark={toggleBookmark}
            />
          </div>
        </section>
      </div>
    </div>
  );
}
