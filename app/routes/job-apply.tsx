import type { Route } from "./+types/job-apply";
import { Link } from "react-router";
import { ArrowLeftIcon, BuildingIcon } from "~/components/icons";

export function meta({ params }: Route.MetaArgs) {
    return [
        { title: `Apply for Job - Nomad` },
        { name: "description", content: "Submit your application." },
    ];
}

export default function JobApply() {
    const job = {
        id: 1,
        title: "Senior React Developer",
        company: "TechNova",
    };

    return (
        <div className="bg-gray-50 dark:bg-gray-950 min-h-[calc(100vh-64px)] py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <Link to={`/jobs/${job.id}`} className="inline-flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors mb-6 text-sm font-medium">
                    <ArrowLeftIcon className="w-4 h-4" /> Back to job details
                </Link>

                <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-10 border-2 border-slate-200 dark:border-slate-700">
                    <div className="flex items-center gap-4 mb-8 pb-8 border-b-2 border-slate-100 dark:border-slate-800">
                        <div className="h-12 w-12 rounded-xl bg-slate-100 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 flex items-center justify-center shrink-0">
                            <BuildingIcon className="w-6 h-6 text-slate-400" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Apply for {job.title}</h1>
                            <p className="text-gray-500 dark:text-gray-400 font-medium">{job.company}</p>
                        </div>
                    </div>

                    <form className="space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="firstName" className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">First Name</label>
                                <input type="text" id="firstName" className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-4 focus:ring-blue-600/20 focus:border-blue-600 outline-none transition-all" />
                            </div>
                            <div>
                                <label htmlFor="lastName" className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Last Name</label>
                                <input type="text" id="lastName" className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-4 focus:ring-blue-600/20 focus:border-blue-600 outline-none transition-all" />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Email Address</label>
                            <input type="email" id="email" className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-4 focus:ring-blue-600/20 focus:border-blue-600 outline-none transition-all" />
                        </div>

                        <div>
                            <label htmlFor="portfolio" className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Portfolio / LinkedIn URL</label>
                            <input type="url" id="portfolio" placeholder="https://" className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-4 focus:ring-blue-600/20 focus:border-blue-600 outline-none transition-all" />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Resume / CV</label>
                            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-300 dark:border-slate-600 border-dashed rounded-xl hover:border-blue-600 dark:hover:border-blue-400 transition-colors bg-slate-50 dark:bg-slate-800 group cursor-pointer">
                                <div className="space-y-1 text-center">
                                    <svg className="mx-auto h-12 w-12 text-slate-400 group-hover:text-blue-500 transition-colors" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                                        <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                    <div className="flex text-sm text-slate-600 dark:text-slate-400 justify-center">
                                        <label htmlFor="file-upload" className="relative cursor-pointer bg-transparent rounded-md font-bold text-blue-600 dark:text-blue-400 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                                            <span>Upload a file</span>
                                            <input id="file-upload" name="file-upload" type="file" className="sr-only" accept=".pdf,.doc,.docx" />
                                        </label>
                                        <p className="pl-1">or drag and drop</p>
                                    </div>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">PDF, DOC up to 5MB</p>
                                </div>
                            </div>
                        </div>

                        <div>
                            <label htmlFor="coverLetter" className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Cover Letter (Optional)</label>
                            <textarea id="coverLetter" rows={4} className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-4 focus:ring-blue-600/20 focus:border-blue-600 outline-none transition-all resize-none"></textarea>
                        </div>

                        <div className="pt-6">
                            <button type="button" className="w-full bg-blue-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-blue-700 border-2 border-transparent transition-all active:scale-[0.98]">
                                Submit Application
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
