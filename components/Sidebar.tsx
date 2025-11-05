import React from 'react';
import { ICONS } from '../constants';

export type ViewKey = 'mentor' | 'job' | 'learning' | 'roadmap' | 'training' | 'analyzer' | 'settings';

interface NavItemProps {
    icon: React.ReactNode;
    tooltip: string;
    viewKey: ViewKey;
    onViewChange: (view: ViewKey) => void;
}

const NavItem: React.FC<NavItemProps> = ({ icon, tooltip, viewKey, onViewChange }) => (
  <div className="group relative flex justify-center">
    <button 
      onClick={() => onViewChange(viewKey)} 
      className="p-3 bg-gray-200 text-text-muted rounded-full hover:bg-primary hover:text-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary"
      aria-label={tooltip}
    >
      {icon}
    </button>
    <div className="absolute left-16 w-max scale-0 origin-left transform rounded-md bg-gray-800 p-2 text-xs text-white transition-all duration-200 group-hover:scale-100">
      {tooltip}
    </div>
  </div>
);

interface SidebarProps {
    onViewChange: (view: ViewKey) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onViewChange }) => {
  const navItems: { icon: React.ReactNode; tooltip: string; key: ViewKey }[] = [
    { icon: ICONS.mentor, tooltip: 'AI Career Mentor', key: 'mentor' },
    { icon: ICONS.job, tooltip: 'Internal Job Matcher', key: 'job' },
    { icon: ICONS.learning, tooltip: 'Peer Learning Network', key: 'learning' },
    { icon: ICONS.roadmap, tooltip: 'Career Roadmap', key: 'roadmap' },
    { icon: ICONS.training, tooltip: 'Personalized Training', key: 'training' },
    { icon: ICONS.analyzer, tooltip: 'Skill Gap Analyzer', key: 'analyzer' },
  ];

  const settingsItem = { icon: ICONS.settings, tooltip: 'Settings', key: 'settings' as ViewKey };

  return (
    <aside className="hidden md:flex flex-col items-center w-20 bg-card-white shadow-md p-4 justify-between">
      <div className="space-y-6">
        {navItems.map((item) => (
          <NavItem key={item.key} icon={item.icon} tooltip={item.tooltip} viewKey={item.key} onViewChange={onViewChange} />
        ))}
      </div>
      <div className="mt-6">
        <NavItem icon={settingsItem.icon} tooltip={settingsItem.tooltip} viewKey={settingsItem.key} onViewChange={onViewChange} />
      </div>
    </aside>
  );
};

export default Sidebar;