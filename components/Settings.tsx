import React, { useState } from 'react';
import { ICONS } from '../constants';

interface SettingsProps {
    onLogout: () => void;
}

const Settings: React.FC<SettingsProps> = ({ onLogout }) => {
    // Mock user data - in a real app, this would come from an API/context
    const [profile, setProfile] = useState({
        fullName: 'John Doe',
        email: 'john.doe@company.com',
    });

    const [passwords, setPasswords] = useState({
        current: '',
        new: '',
        confirm: ''
    });

    const [notifications, setNotifications] = useState({
        jobMatches: true,
        peerSessions: true,
        weeklySummary: false,
    });

    const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const showStatus = (type: 'success' | 'error', text: string) => {
        setStatusMessage({ type, text });
        setTimeout(() => setStatusMessage(null), 3000);
    };

    const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setProfile({ ...profile, [e.target.name]: e.target.value });
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPasswords({ ...passwords, [e.target.name]: e.target.value });
    };
    
    const handleNotificationToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNotifications({ ...notifications, [e.target.name]: e.target.checked });
    };

    const handleProfileSave = (e: React.FormEvent) => {
        e.preventDefault();
        // API call to save profile would go here
        console.log("Saving profile:", profile);
        showStatus('success', 'Profile updated successfully!');
    };

    const handlePasswordUpdate = (e: React.FormEvent) => {
        e.preventDefault();
        if (passwords.new !== passwords.confirm) {
            showStatus('error', 'New passwords do not match.');
            return;
        }
        if (passwords.new.length < 8) {
            showStatus('error', 'New password must be at least 8 characters long.');
            return;
        }
        // API call to update password
        console.log("Updating password...");
        showStatus('success', 'Password changed successfully!');
        setPasswords({ current: '', new: '', confirm: '' });
    };

    const handleDeleteAccount = () => {
        if (window.confirm("Are you sure you want to delete your account? This action is irreversible.")) {
            // API call to delete account
            console.log("Deleting account...");
            onLogout(); // Log out after deletion
        }
    };

    const Toggle: React.FC<{ name: string, label: string, isChecked: boolean, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }> = ({ name, label, isChecked, onChange }) => (
        <label htmlFor={name} className="flex items-center justify-between cursor-pointer">
            <span className="text-text-dark">{label}</span>
            <div className="relative">
                <input type="checkbox" id={name} name={name} className="sr-only" checked={isChecked} onChange={onChange} />
                <div className={`block w-14 h-8 rounded-full transition ${isChecked ? 'bg-primary' : 'bg-gray-300'}`}></div>
                <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition transform ${isChecked ? 'translate-x-6' : ''}`}></div>
            </div>
        </label>
    );

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
             <div className="flex items-center space-x-3 mb-4">
                <div className="text-primary">{ICONS.settings}</div>
                <h2 className="text-2xl font-bold font-heading text-text-dark">Settings & Privacy</h2>
            </div>

            {statusMessage && (
                <div className={`p-3 rounded-md text-sm ${statusMessage.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {statusMessage.text}
                </div>
            )}

            {/* Profile Information */}
            <div className="p-6 bg-card-white rounded-lg shadow-md">
                <h3 className="text-xl font-bold font-heading text-text-dark mb-4">Profile Information</h3>
                <form onSubmit={handleProfileSave} className="space-y-4">
                     <div className="flex items-center space-x-4">
                        <img src="https://picsum.photos/id/237/200/200" alt="Profile" className="w-16 h-16 rounded-full" />
                        <button type="button" className="text-sm font-semibold text-primary hover:text-blue-700">Change Photo</button>
                    </div>
                    <div>
                        <label htmlFor="fullName" className="block text-sm font-medium text-text-dark mb-1">Full Name</label>
                        <input type="text" name="fullName" id="fullName" value={profile.fullName} onChange={handleProfileChange} className="w-full bg-gray-100 border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary" />
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-text-dark mb-1">Company Email</label>
                        <input type="email" name="email" id="email" value={profile.email} className="w-full bg-gray-200 border border-gray-300 rounded-md py-2 px-3 text-text-muted cursor-not-allowed" disabled />
                    </div>
                    <div className="text-right">
                        <button type="submit" className="py-2 px-4 text-sm font-medium rounded-md text-white bg-primary hover:bg-blue-700">Save Profile</button>
                    </div>
                </form>
            </div>

             {/* Change Password */}
            <div className="p-6 bg-card-white rounded-lg shadow-md">
                <h3 className="text-xl font-bold font-heading text-text-dark mb-4">Change Password</h3>
                <form onSubmit={handlePasswordUpdate} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-text-dark mb-1">Current Password</label>
                        <input type="password" name="current" value={passwords.current} onChange={handlePasswordChange} className="w-full bg-gray-100 border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-text-dark mb-1">New Password</label>
                        <input type="password" name="new" value={passwords.new} onChange={handlePasswordChange} className="w-full bg-gray-100 border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-text-dark mb-1">Confirm New Password</label>
                        <input type="password" name="confirm" value={passwords.confirm} onChange={handlePasswordChange} className="w-full bg-gray-100 border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary" />
                    </div>
                     <div className="text-right">
                        <button type="submit" className="py-2 px-4 text-sm font-medium rounded-md text-white bg-primary hover:bg-blue-700">Update Password</button>
                    </div>
                </form>
            </div>

            {/* Notification Preferences */}
            <div className="p-6 bg-card-white rounded-lg shadow-md">
                <h3 className="text-xl font-bold font-heading text-text-dark mb-4">Notification Preferences</h3>
                <div className="space-y-4">
                    <Toggle name="jobMatches" label="Email me for new job matches" isChecked={notifications.jobMatches} onChange={handleNotificationToggle} />
                    <Toggle name="peerSessions" label="Notify me about upcoming peer sessions" isChecked={notifications.peerSessions} onChange={handleNotificationToggle} />
                    <Toggle name="weeklySummary" label="Send me a weekly progress summary" isChecked={notifications.weeklySummary} onChange={handleNotificationToggle} />
                </div>
            </div>
            
            {/* Account Actions */}
            <div className="p-6 bg-card-white rounded-lg shadow-md border-2 border-red-200">
                 <h3 className="text-xl font-bold font-heading text-red-700 mb-4">Account Actions</h3>
                 <div className="flex justify-between items-center">
                    <div>
                        <p className="font-semibold text-text-dark">Delete Your Account</p>
                        <p className="text-sm text-text-muted">Once you delete your account, there is no going back. Please be certain.</p>
                    </div>
                    <button onClick={handleDeleteAccount} className="py-2 px-4 text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700">
                        Delete Account
                    </button>
                 </div>
            </div>

        </div>
    );
};

export default Settings;
