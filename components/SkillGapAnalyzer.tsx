import React, { useState } from 'react';
import { ICONS, MOCK_SKILLS } from '../constants';
import { performSkillGapAnalysis } from '../services/geminiService';
import type { SkillGapAnalysis } from '../types';

const SkillList: React.FC<{ title: string; skills: string[]; color: 'green' | 'red' | 'blue' }> = ({ title, skills, color }) => {
    const colors = {
        green: { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-500' },
        red: { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-500' },
        blue: { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-500' },
    };
    const selectedColor = colors[color];
    
    return (
        <div className={`${selectedColor.bg} p-4 rounded-lg border-l-4 ${selectedColor.border}`}>
            <h4 className={`font-bold text-lg ${selectedColor.text} mb-2`}>{title}</h4>
            {skills.length > 0 ? (
                 <ul className="flex flex-wrap gap-2">
                    {skills.map(skill => (
                        <li key={skill} className={`bg-white text-sm font-medium px-3 py-1 rounded-full border`}>
                            {skill}
                        </li>
                    ))}
                </ul>
            ) : (
                <p className={`text-sm italic ${selectedColor.text}`}>None identified.</p>
            )}
        </div>
    );
};


const SkillGapAnalyzer: React.FC = () => {
    const userSkills = MOCK_SKILLS.map(s => s.name);
    const [jobDescription, setJobDescription] = useState('Seeking a Senior Product Manager to lead our growth team. Must have 5+ years of experience in product management, strong data analysis skills (SQL, Tableau), and a proven track record in A/B testing and user research.');
    const [analysis, setAnalysis] = useState<SkillGapAnalysis | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        setAnalysis(null);

        try {
            const results = await performSkillGapAnalysis(userSkills, jobDescription);
            setAnalysis(results);
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
                    <div className="text-primary">{ICONS.analyzer}</div>
                    <h2 className="text-2xl font-bold font-heading text-text-dark">AI Skill Gap Analyzer</h2>
                </div>
                <p className="text-text-muted mb-6">Paste a job description below to see how your skills stack up and get personalized advice to bridge any gaps.</p>
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                         <div>
                            <label className="block text-sm font-medium text-text-dark mb-1">Your Current Skills</label>
                            <div className="p-3 bg-gray-100 border border-gray-300 rounded-md text-text-muted h-full">
                                {userSkills.join(', ')}
                            </div>
                        </div>
                        <div>
                            <label htmlFor="jobDescription" className="block text-sm font-medium text-text-dark mb-1">Target Role Description</label>
                            <textarea
                                id="jobDescription"
                                value={jobDescription}
                                onChange={(e) => setJobDescription(e.target.value)}
                                className="w-full h-36 bg-gray-100 border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary"
                                required
                            />
                        </div>
                    </div>
                    <div>
                        <button type="submit" className="w-full md:w-auto justify-center py-2 px-6 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors duration-300 disabled:bg-gray-400" disabled={isLoading}>
                            {isLoading ? 'Analyzing...' : 'Analyze My Skills'}
                        </button>
                    </div>
                </form>
            </div>
            
            {isLoading && (
                 <div className="text-center p-10">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                    <p className="mt-4 text-text-muted">AI is analyzing your skill profile...</p>
                </div>
            )}
            
            {error && <div className="p-4 bg-red-100 text-red-700 rounded-md">{error}</div>}

            {!isLoading && analysis && (
                 <div className="p-6 bg-card-white rounded-lg shadow-md space-y-6">
                    <h3 className="text-xl font-bold font-heading text-text-dark">Analysis Results</h3>
                    <SkillList title="✅ Your Matching Skills" skills={analysis.matchingSkills} color="green" />
                    <SkillList title="🎯 Skills to Develop" skills={analysis.missingSkills} color="red" />
                    <div className="bg-blue-100 p-4 rounded-lg border-l-4 border-blue-500">
                        <h4 className="font-bold text-lg text-blue-800 mb-2">💡 Actionable Suggestions</h4>
                        <ul className="list-disc list-inside space-y-2 text-blue-800">
                           {analysis.actionableSuggestions.map((suggestion, index) => (
                               <li key={index}>{suggestion}</li>
                           ))}
                        </ul>
                    </div>
                 </div>
            )}
        </div>
    );
};

export default SkillGapAnalyzer;