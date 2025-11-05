import React, { useState } from 'react';
import { ICONS, MOCK_SKILLS } from '../constants';
import { recommendTraining } from '../services/geminiService';
import type { TrainingResource } from '../types';

const TrainingCard: React.FC<{ resource: TrainingResource }> = ({ resource }) => {
    const getIcon = () => {
        switch (resource.type) {
            case 'Course': return '🎓';
            case 'Book': return '📚';
            case 'Workshop': return '🛠️';
            case 'Certification': return '📜';
            default: return '⭐';
        }
    };

    return (
        <div className="bg-card-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
            <div className="p-5">
                <div className="flex items-start">
                    <div className="text-3xl mr-4">{getIcon()}</div>
                    <div>
                        <div className="flex justify-between items-center">
                            <h3 className="text-lg font-bold font-heading text-text-dark">{resource.title}</h3>
                        </div>
                         <div className="text-sm font-semibold bg-primary/10 text-primary px-3 py-1 rounded-full inline-block mt-1">{resource.type}</div>
                        <p className="text-sm text-text-muted mt-1">Duration: {resource.duration}</p>
                    </div>
                </div>

                {resource.recommendationReason && (
                    <div className="mt-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 p-3 rounded-r-lg">
                        <p className="text-sm font-semibold">AI Recommendation:</p>
                        <p className="text-sm italic">&ldquo;{resource.recommendationReason}&rdquo;</p>
                    </div>
                )}
            </div>
            <div className="bg-gray-50 px-5 py-3 text-right">
                 <a href={resource.url} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-white bg-primary hover:bg-blue-700 transition-colors px-4 py-2 rounded-md">
                    View Resource &rarr;
                </a>
            </div>
        </div>
    );
};


const PersonalizedTraining: React.FC = () => {
    const [goals, setGoals] = useState('Transition into a product management role, focusing on AI-driven products.');
    const [recommendations, setRecommendations] = useState<TrainingResource[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        setRecommendations([]);

        try {
            const userSkills = MOCK_SKILLS.map(s => s.name);
            const results = await recommendTraining(userSkills, goals);
            setRecommendations(results);
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
                    <div className="text-primary">{ICONS.training}</div>
                    <h2 className="text-2xl font-bold font-heading text-text-dark">Personalized Training Plan</h2>
                </div>
                <p className="text-text-muted mb-6">Describe your career goals, and our AI will recommend the best training resources to help you get there.</p>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="goals" className="block text-sm font-medium text-text-dark mb-1">Your Career Goals</label>
                        <textarea
                            id="goals"
                            value={goals}
                            onChange={(e) => setGoals(e.target.value)}
                            placeholder="e.g., Become a team lead, master data science..."
                            className="w-full h-24 bg-gray-100 border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary"
                            required
                        />
                    </div>
                    <div>
                        <button type="submit" className="w-full md:w-auto justify-center py-2 px-6 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors duration-300 disabled:bg-gray-400" disabled={isLoading}>
                            {isLoading ? 'Finding Resources...' : 'Get Recommendations'}
                        </button>
                    </div>
                </form>
            </div>
            
            {isLoading && (
                 <div className="text-center p-10">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                    <p className="mt-4 text-text-muted">AI is curating your training plan...</p>
                </div>
            )}
            
            {error && <div className="p-4 bg-red-100 text-red-700 rounded-md">{error}</div>}

            {!isLoading && recommendations.length > 0 && (
                <div className="grid gap-6 lg:grid-cols-1 xl:grid-cols-2">
                    {recommendations.map(res => (
                        <TrainingCard key={res.id} resource={res} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default PersonalizedTraining;