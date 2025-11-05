import React, { useState, useMemo } from 'react';
import { ICONS, MOCK_SESSIONS, MOCK_SKILLS } from '../constants';
import type { LearningSession } from '../types';
import { suggestLearningSessions } from '../services/geminiService';

const SessionCard: React.FC<{ session: LearningSession }> = ({ session }) => {
    const sessionDate = new Date(session.dateTime);
    const formattedDate = sessionDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
    const formattedTime = sessionDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });

    return (
        <div className="bg-card-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 relative">
            {session.recommendationReason && (
                <div className="absolute top-0 right-0 bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-bl-lg z-10 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                    Recommended for you
                </div>
            )}
            <div className="p-5">
                <div className="flex items-center mb-3">
                    <img src={session.host.profileImageUrl} alt={session.host.name} className="h-10 w-10 rounded-full mr-3" />
                    <div>
                        <p className="text-sm font-semibold text-text-dark">{session.host.name}</p>
                        <p className="text-xs text-text-muted">Session Host</p>
                    </div>
                </div>
                <h3 className="text-lg font-bold font-heading text-text-dark">{session.topic}</h3>
                <div className="flex items-center text-sm text-text-muted my-3 space-x-1">
                    {ICONS.calendar}
                    <span>{formattedDate} at {formattedTime}</span>
                </div>
                <p className="text-sm text-text-dark leading-relaxed mb-4">{session.description}</p>
                {session.recommendationReason && (
                    <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 p-3 rounded-r-lg mb-4">
                        <p className="text-sm italic">&ldquo;{session.recommendationReason}&rdquo;</p>
                    </div>
                )}
                <div className="flex flex-wrap gap-2 mb-4">
                    {session.skillTags.map(tag => (
                        <span key={tag} className="bg-primary/10 text-primary text-xs font-medium px-2.5 py-1 rounded-full">{tag}</span>
                    ))}
                </div>
            </div>
            <div className="bg-gray-50 px-5 py-3 flex justify-between items-center">
                <div className="flex items-center -space-x-2">
                    {session.participants.map(p => (
                        <img key={p.name} src={p.profileImageUrl} alt={p.name} title={p.name} className="h-8 w-8 rounded-full border-2 border-white" />
                    ))}
                    <span className="text-xs text-text-muted pl-3">{session.participants.length} joined</span>
                </div>
                <button className="text-sm font-semibold text-white bg-primary hover:bg-blue-700 transition-colors px-4 py-2 rounded-md">
                    Join Session
                </button>
            </div>
        </div>
    );
};

const PeerLearning: React.FC = () => {
    const [sessions, setSessions] = useState<LearningSession[]>(MOCK_SESSIONS);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGetRecommendations = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const userSkills = MOCK_SKILLS.map(s => s.name);
            const recommendedSessions = await suggestLearningSessions(userSkills);
            
            // Create a map of recommendations for quick lookup
            const recommendationMap = new Map(recommendedSessions.map(rs => [rs.id, rs.recommendationReason]));
            
            // Update all sessions with recommendation reasons
            const updatedSessions = MOCK_SESSIONS.map(session => ({
                ...session,
                recommendationReason: recommendationMap.get(session.id) || undefined
            }));

            // Sort sessions to show recommended ones first
            updatedSessions.sort((a, b) => (b.recommendationReason ? 1 : 0) - (a.recommendationReason ? 1 : 0));
            
            setSessions(updatedSessions);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred.');
        } finally {
            setIsLoading(false);
        }
    };


    return (
        <div className="space-y-6">
            <div className="p-6 bg-card-white rounded-lg shadow-md">
                <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                    <div>
                        <div className="flex items-center space-x-3 mb-2">
                            <div className="text-primary">{ICONS.learning}</div>
                            <h2 className="text-2xl font-bold font-heading text-text-dark">Peer Learning Network</h2>
                        </div>
                        <p className="text-text-muted">Learn from your peers, share your knowledge, and grow together.</p>
                    </div>
                    <div className="flex-shrink-0 flex gap-2">
                         <button onClick={handleGetRecommendations} className="w-full md:w-auto justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors duration-300 disabled:bg-gray-400" disabled={isLoading}>
                            {isLoading ? 'Getting Recommendations...' : 'Get AI Recommendations'}
                        </button>
                        <button className="w-full md:w-auto justify-center py-2 px-4 border border-primary text-sm font-medium rounded-md text-primary bg-white hover:bg-primary/5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors">
                            Host a Session
                        </button>
                    </div>
                </div>
            </div>

            {isLoading && (
                 <div className="text-center p-10">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                    <p className="mt-4 text-text-muted">AI is finding the best sessions for you...</p>
                </div>
            )}

            {error && <div className="p-4 bg-red-100 text-red-700 rounded-md">{error}</div>}

            <div className="grid gap-6 lg:grid-cols-1 xl:grid-cols-2">
                {sessions.map(session => (
                    <SessionCard key={session.id} session={session} />
                ))}
            </div>
        </div>
    );
};

export default PeerLearning;