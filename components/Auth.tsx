
import React, { useState } from 'react';

interface AuthProps {
  onLoginSuccess: () => void;
}

const Auth: React.FC<AuthProps> = ({ onLoginSuccess }) => {
  const [isLoginView, setIsLoginView] = useState(true);
  const [error, setError] = useState('');
  
  // A single state object for form data
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = (): boolean => {
    const { fullName, email, password, confirmPassword } = formData;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!isLoginView && !fullName.trim()) {
      setError('Full Name is required.');
      return false;
    }
    if (!emailRegex.test(email)) {
      setError('Please enter a valid company email.');
      return false;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return false;
    }
    if (!isLoginView && password !== confirmPassword) {
      setError('Passwords do not match.');
      return false;
    }
    setError('');
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    
    // --- API Integration Point ---
    // Here you would make an API call to your backend for authentication.
    // Example using fetch:
    /*
    const endpoint = isLoginView ? '/login' : '/signup';
    fetch(`https://api.example.com${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    })
    .then(res => res.json())
    .then(data => {
      if (data.token) {
        // Store the JWT token securely
        localStorage.setItem('authToken', data.token);
        onLoginSuccess();
      } else {
        setError(data.message || 'An error occurred.');
      }
    })
    .catch(err => setError('Could not connect to server.'));
    */

    // For demonstration purposes, we'll just simulate a successful login/signup.
    console.log(`${isLoginView ? 'Logging in' : 'Signing up'} with:`, formData);
    onLoginSuccess();
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-lg">
        <div className="text-center">
            <h1 className="text-4xl font-heading font-bold text-primary">CareerIQ</h1>
            <p className="mt-2 text-text-muted">Your AI-Powered Career Co-pilot</p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          
          {!isLoginView && (
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <input id="full-name" name="fullName" type="text" required value={formData.fullName} onChange={handleInputChange} className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm" placeholder="Full Name" />
              </div>
            </div>
          )}
          
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <input id="email-address" name="email" type="email" autoComplete="email" required value={formData.email} onChange={handleInputChange} className={`appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 ${isLoginView ? 'rounded-t-md' : ''} focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm`} placeholder="Company Email" />
            </div>
            <div>
              <input id="password" name="password" type="password" autoComplete="current-password" required value={formData.password} onChange={handleInputChange} className={`appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 ${isLoginView && !isLoginView ? 'rounded-b-md' : ''} ${!isLoginView ? '' : 'rounded-b-md'} focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm`} placeholder="Password" />
            </div>
          </div>

          {!isLoginView && (
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <input id="confirm-password" name="confirmPassword" type="password" required value={formData.confirmPassword} onChange={handleInputChange} className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm" placeholder="Confirm Password" />
              </div>
            </div>
          )}

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <div>
            <button type="submit" className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors duration-300">
              {isLoginView ? 'Sign in' : 'Create Account'}
            </button>
          </div>
        </form>

        <p className="mt-2 text-center text-sm text-text-muted">
          {isLoginView ? "Don't have an account?" : 'Already have an account?'}
          <button onClick={() => { setIsLoginView(!isLoginView); setError(''); }} className="font-medium text-primary hover:text-blue-700 ml-1">
            {isLoginView ? 'Sign up' : 'Sign in'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Auth;
