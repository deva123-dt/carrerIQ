// FIX: Import `ReactNode` to resolve the 'Cannot find namespace React' error.
import type { ReactNode } from 'react';

export interface User {
  fullName: string;
  email: string;
  profileImageUrl: string;
}

export interface Skill {
  name: string;
  progress: number; // A value between 0 and 100
}

export interface Notification {
  id: number;
  message: string;
  timestamp: string;
  read: boolean;
}

export enum FeedItemType {
  Mentor,
  Job,
  Skill,
  Learning,
}

export interface FeedItem {
  id: number;
  type: FeedItemType;
  title: string;
  description: string;
  author?: string;
  icon: ReactNode;
  actionText: string;
}

// Added for the AI Career Mentor chat feature
export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  streaming?: boolean;
}

// Added for the Internal Job Matcher feature
export interface Job {
  id: number;
  title: string;
  department: string;
  location: string;
  description: string;
  requiredSkills: string[];
  experienceLevel: 'Entry' | 'Mid' | 'Senior';
}

export interface MatchedJob extends Job {
    matchPercentage: number;
    matchReason: string;
}

// Added for the Peer Learning Network feature
export interface SessionParticipant {
  name: string;
  profileImageUrl: string;
}

export interface LearningSession {
  id: number;
  topic: string;
  host: SessionParticipant;
  description: string;
  dateTime: string;
  skillTags: string[];
  participants: SessionParticipant[];
  recommendationReason?: string; // For AI-powered suggestions
}

// Added for Career Roadmap feature
export interface RoadmapStep {
  step: number;
  title: string;
  description: string;
  duration: string; // e.g., "3-6 months"
}

// Added for Personalized Training feature
export interface TrainingResource {
    id: number;
    title: string;
    type: 'Course' | 'Book' | 'Workshop' | 'Certification';
    url: string;
    duration: string; // e.g., "10 hours"
    recommendationReason?: string;
}

// Added for Skill Gap Analyzer feature
export interface SkillGapAnalysis {
    matchingSkills: string[];
    missingSkills: string[];
    actionableSuggestions: string[];
}