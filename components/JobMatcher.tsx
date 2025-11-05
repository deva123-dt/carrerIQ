import React, { useState } from 'react';
import { ICONS } from '../constants';
import { matchJobs } from '../services/geminiService';
import type { MatchedJob } from '../types';

const MatchProgressBar: React.FC<{ percentage: number }> = ({ percentage }) => {
    const getColor = () => {
        if (percentage >= 80) return 'bg-green-500';
        if (percentage >= 60) return 'bg-blue-500';
        if (percentage >= 40) return 'bg-yellow-500';
        return 'bg-gray-400';
    };

    return (
        <div>
            <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-text-dark">Match Score</span>
                <span className={`text-sm font-bold ${getColor().replace('bg-', 'text-')}`}>{percentage}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className={`${getColor()} h-2.5 rounded-full transition-all duration-500`} style={{ width: `${percentage}%` }}></div>
            </div>
        </div>
    );
};


const JobCard: React.FC<{ job: MatchedJob }> = ({ job }) => (
    <div className="bg-card-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
        <div className="p-5">
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="text-lg font-bold font-heading text-text-dark">{job.title}</h3>
                    <p className="text-sm text-text-muted mt-1">{job.department} &bull; {job.location}</p>
                </div>
                <div className="text-sm font-semibold bg-primary/10 text-primary px-3 py-1 rounded-full">{job.experienceLevel}</div>
            </div>
            <p className="mt-4 text-sm text-text-dark leading-relaxed">{job.description}</p>
            
            <div className="mt-4">
                <h4 className="text-sm font-semibold text-text-dark mb-2">Required Skills:</h4>
                <div className="flex flex-wrap gap-2">
                    {job.requiredSkills.map(skill => (
                        <span key={skill} className="bg-gray-200 text-text-muted text-xs font-medium px-2.5 py-1 rounded-full">{skill}</span>
                    ))}
                </div>
            </div>

            <div className="mt-6">
                <MatchProgressBar percentage={job.matchPercentage} />
                <p className="mt-2 text-sm text-text-muted italic">&ldquo;{job.matchReason}&rdquo;</p>
            </div>
        </div>
        <div className="bg-gray-50 px-5 py-3 text-right">
             <button className="text-sm font-semibold text-white bg-primary hover:bg-blue-700 transition-colors px-4 py-2 rounded-md">
                Apply Now &rarr;
            </button>
        </div>
    </div>
);


const JobMatcher: React.FC = () => {
    const [skills, setSkills] = useState('React, TypeScript, Node.js');
    const [experience, setExperience] = useState(5);
    const [matchedJobs, setMatchedJobs] = useState<MatchedJob[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        setMatchedJobs([]);

        try {
            const results = await matchJobs(skills, experience);
            setMatchedJobs(results);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="p-6 bg-card-white rounded-lg shadow-md">
                <div className="flex items-center space-x-3 mb-4">
                    <div className="text-primary">{ICONS.job}</div>
                    <h2 className="text-2xl font-bold font-heading text-text-dark">Internal Job Matcher</h2>
                </div>
                <p className="text-text-muted mb-6">Enter your skills and experience to find the best internal roles for you, powered by AI.</p>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                    <div className="md:col-span-2">
                        <label htmlFor="skills" className="block text-sm font-medium text-text-dark mb-1">Your Skills (comma-separated)</label>
                        <input
                            id="skills"
                            type="text"
                            value={skills}
                            onChange={(e) => setSkills(e.target.value)}
                            placeholder="e.g., Python, SQL, Data Analysis"
                            className="w-full bg-gray-100 border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary"
                            required
                        />
                    </div>
                    <div>
                         <label htmlFor="experience" className="block text-sm font-medium text-text-dark mb-1">Years of Experience</label>
                        <input
                            id="experience"
                            type="number"
                            value={experience}
                            onChange={(e) => setExperience(parseInt(e.target.value, 10))}
                            className="w-full bg-gray-100 border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary"
                            required
                            min="0"
                        />
                    </div>
                    <div className="md:col-span-3">
                        <button type="submit" className="w-full md:w-auto justify-center py-2 px-6 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors duration-300 disabled:bg-gray-400" disabled={isLoading}>
                            {isLoading ? 'Analyzing...' : 'Find My Match'}
                        </button>
                    </div>
                </form>
            </div>
            
            {isLoading && (
                 <div className="text-center p-10">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                    <p className="mt-4 text-text-muted">AI is analyzing your profile...</p>
                </div>
            )}
            
            {error && <div className="p-4 bg-red-100 text-red-700 rounded-md">{error}</div>}

            {!isLoading && matchedJobs.length > 0 && (
                <div className="grid gap-6 lg:grid-cols-1 xl:grid-cols-2">
                    {matchedJobs.map(job => (
                        <JobCard key={job.id} job={job} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default JobMatcher;