import React from 'react';
import type { FeedItem, Skill, Notification, Job, LearningSession, SessionParticipant, TrainingResource } from './types';
import { FeedItemType } from './types';

// SVG Icons
export const ICONS = {
    mentor: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>,
    job: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>,
    learning: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 14l9-5-9-5-9 5 9 5z" /><path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-9.998 12.078 12.078 0 01.665-6.479L12 14z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-9.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222 4 2.222V20" /></svg>,
    roadmap: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>,
    training: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>,
    analyzer: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>,
    skills: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16v4m-2-2h4m6 17v4m-2-2h4M12 3v18" /></svg>,
    notifications: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>,
    search: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" /></svg>,
    calendar: <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>,
    settings: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.096 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
};

// Mock Data
export const MOCK_FEED_ITEMS: FeedItem[] = [
  { id: 1, type: FeedItemType.Mentor, title: "AI Mentor: Leadership Path", description: "Based on your recent project performance, consider developing your conflict resolution and team motivation skills to move into a leadership role.", icon: ICONS.mentor, actionText: "Explore Leadership Skills" },
  { id: 2, type: FeedItemType.Job, title: "Internal Job Match: Senior Product Manager", description: "Your profile is a 92% match for the new Senior Product Manager role in the Innovations department. Your experience in market analysis is highly relevant.", icon: ICONS.job, actionText: "View Job Details" },
  { id: 3, type: FeedItemType.Skill, title: "Personalized Skill Suggestion: Python", description: "The demand for Python skills in your department has increased by 35%. Completing a course could open up new project opportunities.", icon: ICONS.analyzer, actionText: "Find Python Courses" },
  { id: 4, type: FeedItemType.Learning, title: "Peer Session: Advanced React Patterns", author: "Hosted by Jane Doe", description: "Join a peer-led session this Friday to discuss advanced component patterns and state management strategies in React.", icon: ICONS.learning, actionText: "RSVP for Session" },
];

export const MOCK_SKILLS: Skill[] = [
  { name: "React & TypeScript", progress: 85 },
  { name: "Project Management", progress: 70 },
  { name: "UI/UX Design Principles", progress: 60 },
  { name: "Public Speaking", progress: 45 },
];

export const MOCK_NOTIFICATIONS: Notification[] = [
  { id: 1, message: "Your skill 'React & TypeScript' was endorsed by John Smith.", timestamp: "2 hours ago", read: false },
  { id: 2, message: "A new job matching your profile has been posted.", timestamp: "1 day ago", read: false },
  { id: 3, message: "Reminder: 'Advanced React Patterns' peer session is tomorrow.", timestamp: "1 day ago", read: true },
];

export const MOCK_JOBS: Job[] = [
  { id: 1, title: 'Senior Full-Stack Engineer', department: 'Engineering', location: 'Remote', description: 'Build and maintain our core platform, working across the stack from our React frontend to our Node.js backend services.', requiredSkills: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'AWS'], experienceLevel: 'Senior' },
  { id: 2, title: 'Product Manager, Growth', department: 'Product', location: 'New York, NY', description: 'Lead our growth team to identify and execute on opportunities to expand our user base and drive engagement.', requiredSkills: ['Product Management', 'Data Analysis', 'A/B Testing', 'User Research'], experienceLevel: 'Mid' },
  { id: 3, title: 'UI/UX Designer', department: 'Design', location: 'San Francisco, CA', description: 'Create intuitive and beautiful user experiences for our web and mobile applications. You will own the design process from concept to execution.', requiredSkills: ['Figma', 'UI Design', 'UX Research', 'Prototyping'], experienceLevel: 'Mid' },
  { id: 4, title: 'Data Scientist', department: 'Analytics', location: 'Remote', description: 'Analyze large datasets to uncover insights, build predictive models, and inform strategic decisions across the company.', requiredSkills: ['Python', 'SQL', 'Machine Learning', 'Statistics', 'Tableau'], experienceLevel: 'Senior' },
  { id: 5, title: 'Junior Frontend Developer', department: 'Engineering', location: 'Austin, TX', description: 'Join our frontend team to build new features, improve user experience, and learn from experienced engineers.', requiredSkills: ['HTML', 'CSS', 'JavaScript', 'React'], experienceLevel: 'Entry' },
];

// --- Mock Data for Peer Learning Network ---
const PARTICIPANTS: SessionParticipant[] = [
    { name: 'Alice', profileImageUrl: 'https://picsum.photos/id/1011/50/50' },
    { name: 'Bob', profileImageUrl: 'https://picsum.photos/id/1012/50/50' },
    { name: 'Charlie', profileImageUrl: 'https://picsum.photos/id/1025/50/50' },
    { name: 'Diana', profileImageUrl: 'https://picsum.photos/id/1027/50/50' },
    { name: 'Eve', profileImageUrl: 'https://picsum.photos/id/64/50/50' },
];

export const MOCK_SESSIONS: LearningSession[] = [
    {
        id: 1,
        topic: 'Advanced React Patterns for State Management',
        host: { name: 'Jane Doe', profileImageUrl: 'https://picsum.photos/id/42/50/50' },
        description: 'A deep dive into advanced state management patterns in React, exploring alternatives to Redux like Zustand and Jotai for complex applications.',
        dateTime: '2024-11-15T14:00:00Z',
        skillTags: ['React', 'State Management', 'TypeScript', 'Frontend'],
        participants: [PARTICIPANTS[0], PARTICIPANTS[1], PARTICIPANTS[3]]
    },
    {
        id: 2,
        topic: 'Effective Public Speaking for Technical Presentations',
        host: { name: 'John Smith', profileImageUrl: 'https://picsum.photos/id/237/50/50' },
        description: 'Learn techniques to structure your technical talks, engage your audience, and handle Q&A sessions with confidence.',
        dateTime: '2024-11-18T10:00:00Z',
        skillTags: ['Public Speaking', 'Communication', 'Soft Skills'],
        participants: [PARTICIPANTS[2], PARTICIPANTS[4]]
    },
    {
        id: 3,
        topic: 'Introduction to Figma for Developers',
        host: { name: 'Emily White', profileImageUrl: 'https://picsum.photos/id/342/50/50' },
        description: 'This session is for developers who want to better understand Figma. Learn how to inspect designs, extract assets, and collaborate more effectively with designers.',
        dateTime: '2024-11-20T16:00:00Z',
        skillTags: ['Figma', 'UI/UX Design', 'Collaboration'],
        participants: [PARTICIPANTS[0], PARTICIPANTS[1], PARTICIPANTS[2], PARTICIPANTS[3]]
    },
    {
        id: 4,
        topic: 'Building Accessible Web Components',
        host: { name: 'Michael Brown', profileImageUrl: 'https://picsum.photos/id/555/50/50' },
        description: 'Explore the principles of web accessibility (WCAG) and learn how to build inclusive components using ARIA attributes and semantic HTML.',
        dateTime: '2024-11-22T11:00:00Z',
        skillTags: ['Accessibility', 'HTML', 'Frontend', 'Web Standards'],
        participants: [PARTICIPANTS[4]]
    }
];

// --- Mock Data for Personalized Training ---
export const MOCK_TRAINING_RESOURCES: TrainingResource[] = [
    { id: 1, title: "Advanced TypeScript", type: "Course", url: "#", duration: "12 hours" },
    { id: 2, title: "The Lean Product Playbook", type: "Book", url: "#", duration: "8-hour read" },
    { id: 3, title: "Certified ScrumMaster (CSM)", type: "Certification", url: "#", duration: "2-day workshop" },
    { id: 4, title: "Data-Driven Decision Making", type: "Workshop", url: "#", duration: "4 hours" },
    { id: 5, title: "AI for Product Managers", type: "Course", url: "#", duration: "15 hours" },
    { id: 6, title: "Fundamentals of UI/UX Design", type: "Course", url: "#", duration: "20 hours" },
];