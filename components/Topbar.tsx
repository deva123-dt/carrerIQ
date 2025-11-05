import React, { useState } from 'react';
import { ICONS } from '../constants';

interface TopbarProps {
  onLogout: () => void;
  onSkillsClick: () => void;
  onNotificationsClick: () => void;
  notificationCount: number;
  onLogoClick: () => void;
}

const Topbar: React.FC<TopbarProps> = ({ onLogout, onSkillsClick, onNotificationsClick, notificationCount, onLogoClick }) => {
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-30 bg-card-white shadow-md h-16 flex items-center px-4 md:px-6">
      <div className="flex items-center">
        <button onClick={onLogoClick} className="text-2xl font-bold font-heading text-primary">
          CareerIQ
        </button>
      </div>
      
      <div className="flex-1 flex justify-center px-4 lg:px-12">
        <div className="relative w-full max-w-lg">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {ICONS.search}
          </div>
          <input
            type="text"
            placeholder="Search for jobs, skills, people..."
            className="block w-full bg-background-grey border border-gray-300 rounded-md py-2 pl-10 pr-3 text-sm placeholder-text-muted focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
          />
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        <button onClick={onSkillsClick} className="p-2 rounded-full hover:bg-gray-100 transition-colors" aria-label="View your skills">
          {ICONS.skills}
        </button>
        <button onClick={onNotificationsClick} className="relative p-2 rounded-full hover:bg-gray-100 transition-colors" aria-label="View notifications">
          {ICONS.notifications}
          {notificationCount > 0 && (
            <span className="absolute top-1 right-1 block h-4 w-4 rounded-full bg-red-500 text-white text-xs font-bold flex items-center justify-center animate-pulse">
              {notificationCount}
            </span>
          )}
        </button>

        <div className="relative">
          <button onClick={() => setProfileMenuOpen(!profileMenuOpen)} className="block h-10 w-10 rounded-full overflow-hidden border-2 border-transparent hover:border-primary focus:outline-none focus:border-primary transition">
            <img src="https://picsum.photos/id/237/200/200" alt="User Profile" className="h-full w-full object-cover" />
          </button>
          {profileMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-card-white rounded-md shadow-lg py-1 z-40">
              <a href="#" className="block px-4 py-2 text-sm text-text-dark hover:bg-gray-100">Profile</a>
              <a href="#" className="block px-4 py-2 text-sm text-text-dark hover:bg-gray-100">Settings</a>
              <button
                onClick={() => {
                  onLogout();
                  setProfileMenuOpen(false);
                }}
                className="w-full text-left block px-4 py-2 text-sm text-text-dark hover:bg-gray-100"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Topbar;
