import { GoogleGenAI, Chat, Type } from "@google/genai";
import { MOCK_JOBS, MOCK_SESSIONS, MOCK_TRAINING_RESOURCES } from "../constants";
import type { MatchedJob, LearningSession, RoadmapStep, TrainingResource, SkillGapAnalysis } from "../types";

// This file is a placeholder to demonstrate where Gemini API calls would be integrated.
// Ensure your API key is stored securely in environment variables.
// Do NOT commit API keys to your repository.

const API_BASE = "https://api.careeriq.com"; // Example API base for your own backend

// Initialize the Gemini client.
// The API key MUST be provided via the `process.env.API_KEY` environment variable.
// The application must not ask the user for it.
const initializeGeminiClient = () => {
    if (!process.env.API_KEY) {
        // In a real app, handle this more gracefully, perhaps by disabling AI features.
        console.error("Gemini API key not found in environment variables.");
        return null;
    }
    return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

// --- Chat Service for AI Career Mentor ---

let chat: Chat | null = null;

const initializeGeminiClientForChat = () => {
    if (!process.env.API_KEY) {
        console.error("Gemini API key not found in environment variables.");
        return null;
    }
    return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const startChat = (): void => {
    const ai = initializeGeminiClientForChat();
    if (!ai) {
        console.error("Could not initialize Gemini client for chat.");
        return;
    }

    if (!chat) {
        chat = ai.chats.create({
            model: 'gemini-2.5-flash',
            config: {
                systemInstruction: "You are CareerIQ's AI Mentor. You are a friendly, professional, and insightful career coach. Your goal is to provide users with personalized career advice, help them identify skill gaps, suggest learning resources, and prepare them for job applications and interviews. Keep your responses encouraging and actionable.",
            },
        });
    }
};

export const sendMessageToChatStream = async (message: string) => {
    if (!chat) {
        startChat();
    }
    if (!chat) {
        throw new Error("Chat session could not be started.");
    }
    
    return chat.sendMessageStream({ message });
};

// --- Service for Internal Job Matcher ---

export const matchJobs = async (userSkills: string, userExperience: number): Promise<MatchedJob[]> => {
    const ai = initializeGeminiClient();
    if (!ai) throw new Error("AI services are currently unavailable.");

    const prompt = `
        As an expert HR recruitment specialist, analyze the candidate's profile against the provided jobs. 
        For each job, provide a "matchPercentage" (0-100) and a brief "matchReason".
        Consider skills and experience level ('Entry' 0-2 yrs, 'Mid' 3-5 yrs, 'Senior' 5+ yrs).
        Return a JSON array of all jobs, sorted from highest to lowest matchPercentage.

        Candidate:
        - Skills: ${userSkills}
        - Experience: ${userExperience} years

        Jobs:
        ${JSON.stringify(MOCK_JOBS, null, 2)}
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            id: { type: Type.NUMBER },
                            title: { type: Type.STRING },
                            department: { type: Type.STRING },
                            location: { type: Type.STRING },
                            description: { type: Type.STRING },
                            requiredSkills: { type: Type.ARRAY, items: { type: Type.STRING } },
                            experienceLevel: { type: Type.STRING },
                            matchPercentage: { type: Type.NUMBER, description: "Score from 0-100." },
                            matchReason: { type: Type.STRING, description: "Brief explanation of the score." }
                        },
                        required: ["id", "title", "matchPercentage", "matchReason"]
                    }
                }
            }
        });
        return JSON.parse(response.text.trim());
    } catch (error) {
        console.error("Error matching jobs with Gemini:", error);
        throw new Error("Failed to get job matches from AI.");
    }
};

// --- Service for Peer Learning Network ---

export const suggestLearningSessions = async (userSkills: string[]): Promise<LearningSession[]> => {
    const ai = initializeGeminiClient();
    if (!ai) throw new Error("AI services are currently unavailable.");

    const prompt = `
        Analyze the user's skills and recommend relevant sessions from the list.
        If a session is a good fit, include it and add a "recommendationReason".
        Return a JSON array of recommended sessions only, sorted by relevance.

        User Skills:
        - ${userSkills.join('\n- ')}

        Available Sessions:
        ${JSON.stringify(MOCK_SESSIONS, null, 2)}
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            id: { type: Type.NUMBER },
                            topic: { type: Type.STRING },
                            recommendationReason: { type: Type.STRING, description: "Why this session is recommended." }
                        },
                        required: ["id", "topic", "recommendationReason"]
                    }
                }
            }
        });

        const recommendations: Partial<LearningSession>[] = JSON.parse(response.text.trim());
        const recommendedSessionMap = new Map(recommendations.map(r => [r.id, r.recommendationReason]));
        
        return MOCK_SESSIONS
            .filter(session => recommendedSessionMap.has(session.id))
            .map(session => ({ ...session, recommendationReason: recommendedSessionMap.get(session.id) }));

    } catch (error) {
        console.error("Error suggesting learning sessions:", error);
        throw new Error("Failed to get AI-powered session recommendations.");
    }
};

// --- Service for Career Roadmap ---

export const generateCareerRoadmap = async (currentRole: string, targetRole: string): Promise<RoadmapStep[]> => {
    const ai = initializeGeminiClient();
    if (!ai) throw new Error("AI services are currently unavailable.");

    const prompt = `
        Create a realistic, step-by-step career roadmap for a professional wanting to move from a "${currentRole}" position to a "${targetRole}" position.
        The roadmap should consist of 4-6 distinct steps. For each step, provide a clear title, a detailed description of the actions to take, and an estimated duration.
        Return a JSON array of these steps.
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            step: { type: Type.NUMBER },
                            title: { type: Type.STRING },
                            description: { type: Type.STRING },
                            duration: { type: Type.STRING }
                        },
                        required: ["step", "title", "description", "duration"]
                    }
                }
            }
        });
        return JSON.parse(response.text.trim());
    } catch (error) {
        console.error("Error generating career roadmap:", error);
        throw new Error("Failed to generate AI-powered career roadmap.");
    }
};

// --- Service for Personalized Training ---

export const recommendTraining = async (userSkills: string[], careerGoals: string): Promise<TrainingResource[]> => {
    const ai = initializeGeminiClient();
    if (!ai) throw new Error("AI services are currently unavailable.");

    const prompt = `
        Based on the user's current skills and career goals, recommend 3-4 highly relevant training resources from the provided catalog.
        For each recommendation, add a "recommendationReason" explaining why it's a good fit.
        Return a JSON array of recommended resources only.

        User Skills: ${userSkills.join(', ')}
        Career Goals: "${careerGoals}"

        Available Training Catalog:
        ${JSON.stringify(MOCK_TRAINING_RESOURCES, null, 2)}
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            id: { type: Type.NUMBER },
                            title: { type: Type.STRING },
                            type: { type: Type.STRING },
                            url: { type: Type.STRING },
                            duration: { type: Type.STRING },
                            recommendationReason: { type: Type.STRING }
                        },
                        required: ["id", "title", "recommendationReason"]
                    }
                }
            }
        });

        return JSON.parse(response.text.trim());
    } catch (error) {
        console.error("Error recommending training:", error);
        throw new Error("Failed to get AI-powered training recommendations.");
    }
};

// --- Service for Skill Gap Analyzer ---

export const performSkillGapAnalysis = async (userSkills: string[], targetRoleDescription: string): Promise<SkillGapAnalysis> => {
    const ai = initializeGeminiClient();
    if (!ai) throw new Error("AI services are currently unavailable.");

    const prompt = `
        Perform a skill gap analysis for a user aspiring to a target role.
        - Identify "matchingSkills" from the user's list that are relevant to the role.
        - Identify "missingSkills" that are required for the role but not in the user's list.
        - Provide a list of "actionableSuggestions" (2-3 items) for how to bridge the gap.
        Return a single JSON object with these three keys.

        User's Skills: ${userSkills.join(', ')}

        Target Role Description: "${targetRoleDescription}"
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-pro', // Using a more powerful model for nuanced analysis
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        matchingSkills: { type: Type.ARRAY, items: { type: Type.STRING } },
                        missingSkills: { type: Type.ARRAY, items: { type: Type.STRING } },
                        actionableSuggestions: { type: Type.ARRAY, items: { type: Type.STRING } }
                    },
                    required: ["matchingSkills", "missingSkills", "actionableSuggestions"]
                }
            }
        });
        return JSON.parse(response.text.trim());
    } catch (error) {
        console.error("Error performing skill gap analysis:", error);
        throw new Error("Failed to perform AI-powered skill gap analysis.");
    }
};