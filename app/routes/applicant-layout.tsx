import { Outlet, Link } from "react-router";
import { useState, useRef, useEffect } from "react";
import { CheckCircleIcon, UserIcon, SunIcon, MoonIcon } from "~/components/icons";

export default function ApplicantLayout() {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [theme, setTheme] = useState<"light" | "dark" | null>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const isDark = document.documentElement.classList.contains("dark");
        setTheme(isDark ? "dark" : "light");
    }, []);

    const toggleTheme = () => {
        const newTheme = theme === "dark" ? "light" : "dark";
        console.log("Toggling theme to:", newTheme);
        setTheme(newTheme);
        if (newTheme === "dark") {
            document.documentElement.classList.add("dark");
            localStorage.setItem("theme", "dark");
        } else {
            document.documentElement.classList.remove("dark");
            localStorage.setItem("theme", "light");
        }
    };

    const isSignedIn = false;

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900 font-sans selection:bg-blue-100 dark:bg-gray-950 dark:text-gray-100">
            <nav className="fixed top-0 inset-x-0 z-50 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between relative">
                    <Link to="/" className="flex items-center gap-2 group">
                        <div className="bg-blue-600 text-white p-1.5 rounded-lg group-hover:bg-blue-700 transition-colors">
                            <CheckCircleIcon />
                        </div>
                        <span className="text-xl font-bold tracking-tight text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">Nomad</span>
                    </Link>
                    <div className="absolute left-1/2 -translate-x-1/2 hidden md:flex items-center font-medium text-sm text-gray-500 dark:text-gray-400">
                        <span>Powered by <a href="https://jobicy.com/" target="_blank" rel="noopener noreferrer" className="text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 font-bold transition-colors">Jobicy</a></span>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3">
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                            aria-label="Toggle theme"
                        >
                            {theme === "dark" ? <SunIcon className="w-5 h-5" /> : <MoonIcon className="w-5 h-5" />}
                        </button>

                        <div className="relative" ref={dropdownRef}>
                            <button
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                            >
                                <UserIcon className="w-5 h-5" />
                            </button>

                            {isDropdownOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-100 dark:border-gray-800 py-2 z-50">
                                    {!isSignedIn ? (
                                        <>
                                            <Link
                                                to="/employer/login"
                                                className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                                                onClick={() => setIsDropdownOpen(false)}
                                            >
                                                Sign In
                                            </Link>
                                            <Link
                                                to="/employer/register"
                                                className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                                                onClick={() => setIsDropdownOpen(false)}
                                            >
                                                Sign Up
                                            </Link>
                                        </>
                                    ) : (
                                        <button
                                            className="w-full text-left block px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                                            onClick={() => {
                                                setIsDropdownOpen(false);
                                                console.log("Sign out clicked");
                                            }}
                                        >
                                            Sign Out
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            <main className="flex-1 pt-16">
                <Outlet />
            </main>
            <footer className="bg-white dark:bg-gray-950 border-t border-gray-100 dark:border-gray-800 py-12 text-center text-gray-500 dark:text-gray-400 text-sm">
                <p>{new Date().getFullYear()} Nomad - By Ablondel42.</p>
            </footer>
        </div>
    );
}
