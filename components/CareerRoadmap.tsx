import React, { useState } from 'react';
import { ICONS } from '../constants';
import { generateCareerRoadmap } from '../services/geminiService';
import type { RoadmapStep } from '../types';

const RoadmapStepCard: React.FC<{ step: RoadmapStep, isLast: boolean }> = ({ step, isLast }) => (
    <div className="flex">
        <div className="flex flex-col items-center mr-4">
            <div>
                <div className="flex items-center justify-center w-10 h-10 border-2 border-primary rounded-full">
                    <span className="font-bold text-primary">{step.step}</span>
                </div>
            </div>
            {!isLast && <div className="w-px h-full bg-gray-300"></div>}
        </div>
        <div className="pb-8">
            <p className="mb-1 text-sm font-semibold text-primary">{step.duration}</p>
            <p className="font-bold text-text-dark text-lg">{step.title}</p>
            <p className="text-text-muted mt-2">{step.description}</p>
        </div>
    </div>
);


const CareerRoadmap: React.FC = () => {
    const [currentRole, setCurrentRole] = useState('Frontend Developer');
    const [targetRole, setTargetRole] = useState('Senior Product Manager');
    const [roadmap, setRoadmap] = useState<RoadmapStep[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentRole || !targetRole) {
            setError("Please fill in both your current and target roles.");
            return;
        }
        setIsLoading(true);
        setError(null);
        setRoadmap([]);

        try {
            const results = await generateCareerRoadmap(currentRole, targetRole);
            setRoadmap(results);
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
                    <div className="text-primary">{ICONS.roadmap}</div>
                    <h2 className="text-2xl font-bold font-heading text-text-dark">AI-Powered Career Roadmap</h2>
                </div>
                <p className="text-text-muted mb-6">Chart your path to success. Enter your current and desired roles to generate a personalized, step-by-step career plan.</p>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                    <div>
                        <label htmlFor="currentRole" className="block text-sm font-medium text-text-dark mb-1">Current Role</label>
                        <input
                            id="currentRole"
                            type="text"
                            value={currentRole}
                            onChange={(e) => setCurrentRole(e.target.value)}
                            className="w-full bg-gray-100 border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary"
                            required
                        />
                    </div>
                    <div>
                         <label htmlFor="targetRole" className="block text-sm font-medium text-text-dark mb-1">Target Role</label>
                        <input
                            id="targetRole"
                            type="text"
                            value={targetRole}
                            onChange={(e) => setTargetRole(e.target.value)}
                            className="w-full bg-gray-100 border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary"
                            required
                        />
                    </div>
                    <div>
                        <button type="submit" className="w-full justify-center py-2 px-6 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors duration-300 disabled:bg-gray-400" disabled={isLoading}>
                            {isLoading ? 'Generating Plan...' : 'Generate Roadmap'}
                        </button>
                    </div>
                </form>
            </div>
            
            {isLoading && (
                 <div className="text-center p-10">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                    <p className="mt-4 text-text-muted">AI is building your personalized roadmap...</p>
                </div>
            )}
            
            {error && <div className="p-4 bg-red-100 text-red-700 rounded-md">{error}</div>}

            {!isLoading && roadmap.length > 0 && (
                <div className="p-6 bg-card-white rounded-lg shadow-md">
                     <h3 className="text-xl font-bold font-heading text-text-dark mb-4">Your Roadmap from {currentRole} to {targetRole}</h3>
                    <div>
                        {roadmap.map((step, index) => (
                            <RoadmapStepCard key={step.step} step={step} isLast={index === roadmap.length - 1} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default CareerRoadmap;