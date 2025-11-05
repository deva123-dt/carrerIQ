import React, { useState, useCallback, useEffect } from 'react';
import Topbar from './Topbar';
import Sidebar, { ViewKey } from './Sidebar';
import Feed from './Feed';
import RightPanel from './RightPanel';
import FloatingPanel from './FloatingPanel';
import CareerMentor from './CareerMentor';
import JobMatcher from './JobMatcher';
import PeerLearning from './PeerLearning';
import CareerRoadmap from './CareerRoadmap';
import PersonalizedTraining from './PersonalizedTraining';
import SkillGapAnalyzer from './SkillGapAnalyzer';
import Settings from './Settings';
import { MOCK_SKILLS, MOCK_NOTIFICATIONS } from '../constants';
import type { Skill } from '../types';

interface DashboardProps {
  onLogout: () => void;
}

const ProgressBar: React.FC<{ skill: Skill }> = ({ skill }) => (
    <div>
        <div className="flex justify-between mb-1">
            <span className="text-sm font-medium text-text-dark">{skill.name}</span>
            <span className="text-sm font-medium text-primary">{skill.progress}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div className="bg-primary h-2.5 rounded-full" style={{ width: `${skill.progress}%` }}></div>
        </div>
    </div>
);

const Dashboard: React.FC<DashboardProps> = ({ onLogout }) => {
  const [activePanel, setActivePanel] = useState<'skills' | 'notifications' | null>(null);
  const [activeView, setActiveView] = useState<ViewKey | 'feed'>('feed');
  
  const handlePanelToggle = (panel: 'skills' | 'notifications') => {
    setActivePanel(prev => (prev === panel ? null : panel));
  };

  const closePanel = useCallback(() => {
    setActivePanel(null);
  }, []);

  const handleViewChange = (view: ViewKey) => {
    setActiveView(view);
  };

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closePanel();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [closePanel]);

  const unreadCount = MOCK_NOTIFICATIONS.filter(n => !n.read).length;

  const renderActiveView = () => {
    switch(activeView) {
      case 'mentor':
        return <CareerMentor />;
      case 'job':
        return <JobMatcher />;
      case 'learning':
        return <PeerLearning />;
      case 'roadmap':
        return <CareerRoadmap />;
      case 'training':
        return <PersonalizedTraining />;
      case 'analyzer':
        return <SkillGapAnalyzer />;
      case 'settings':
        return <Settings onLogout={onLogout} />;
      case 'feed':
      default:
        return <Feed />;
    }
  };

  return (
    <div className="relative min-h-screen bg-background-grey">
        <Topbar 
            onLogout={onLogout} 
            onSkillsClick={() => handlePanelToggle('skills')}
            onNotificationsClick={() => handlePanelToggle('notifications')}
            notificationCount={unreadCount}
            onLogoClick={() => setActiveView('feed')}
        />
        <div className="flex pt-16">
            <Sidebar onViewChange={handleViewChange} />
            <main className="flex-1 p-4 sm:p-6 lg:p-8">
                {renderActiveView()}
            </main>
            <RightPanel />
        </div>

        {/* Floating Skills Panel */}
        <FloatingPanel
            isOpen={activePanel === 'skills'}
            onClose={closePanel}
            positionClasses="top-16 right-4 lg:right-40"
        >
            <h3 className="text-lg font-bold font-heading text-text-dark p-4 border-b">Your Skills</h3>
            <div className="p-4 space-y-4">
                {MOCK_SKILLS.map(skill => <ProgressBar key={skill.name} skill={skill} />)}
            </div>
        </FloatingPanel>

        {/* Floating Notifications Panel */}
        <FloatingPanel
            isOpen={activePanel === 'notifications'}
            onClose={closePanel}
            positionClasses="top-16 right-4 lg:right-20"
        >
            <h3 className="text-lg font-bold font-heading text-text-dark p-4 border-b">Notifications</h3>
            <ul className="divide-y max-h-80 overflow-y-auto">
                {MOCK_NOTIFICATIONS.map(notif => (
                    <li key={notif.id} className={`p-4 hover:bg-gray-50 ${!notif.read ? 'bg-blue-50' : ''}`}>
                        <p className="text-sm text-text-dark">{notif.message}</p>
                        <p className="text-xs text-text-muted mt-1">{notif.timestamp}</p>
                    </li>
                ))}
            </ul>
        </FloatingPanel>
    </div>
  );
};

export default Dashboard;