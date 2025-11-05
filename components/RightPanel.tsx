
import React from 'react';
import { MOCK_SKILLS, MOCK_NOTIFICATIONS } from '../constants';
import type { Skill } from '../types';

const ProgressBar: React.FC<{ skill: Skill }> = ({ skill }) => (
    <div>
        <div className="flex justify-between mb-1">
            <span className="text-sm font-medium text-text-dark">{skill.name}</span>
            <span className="text-sm font-medium text-primary">{skill.progress}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-gradient-to-r from-blue-400 to-primary h-2 rounded-full" style={{ width: `${skill.progress}%` }}></div>
        </div>
    </div>
);

const RightPanel: React.FC = () => {
  return (
    <aside className="hidden lg:block w-80 bg-card-white p-6 border-l border-gray-200">
      <div className="space-y-8">
        <div>
          <h3 className="text-lg font-bold font-heading text-text-dark mb-4">Skills Spotlight</h3>
          <div className="space-y-4">
            {MOCK_SKILLS.slice(0, 3).map(skill => (
              <ProgressBar key={skill.name} skill={skill} />
            ))}
          </div>
        </div>
        <div>
          <h3 className="text-lg font-bold font-heading text-text-dark mb-4">Recent Activity</h3>
          <ul className="space-y-4">
            {MOCK_NOTIFICATIONS.slice(0, 3).map(notif => (
              <li key={notif.id} className="text-sm">
                <p className="text-text-dark">{notif.message}</p>
                <p className="text-xs text-text-muted mt-1">{notif.timestamp}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </aside>
  );
};

export default RightPanel;
