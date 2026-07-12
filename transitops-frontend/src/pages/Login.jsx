import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';
import { useAuth } from '../context/AuthContext';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      const response = await api.post('/auth/login', {
        email,
        password
      });
      
      login(response.data.user, response.data.token);
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-white">
      {/* Left Column - Dark Side */}
      <div className="hidden lg:flex w-1/2 flex-col justify-center px-16 bg-[#1a202c] text-white relative">
        <div className="absolute top-1/2 -translate-y-1/2">
          {/* Logo */}
          <div className="mb-6 h-14 w-14 border border-[#d97706] bg-transparent flex items-center justify-center relative">
            {/* Grid Pattern inside Logo */}
            <div className="absolute inset-0 grid grid-cols-4 grid-rows-4 gap-0.5 p-1">
               {Array.from({length: 16}).map((_, i) => (
                 <div key={i} className="bg-[#d97706]/40 rounded-sm"></div>
               ))}
            </div>
          </div>
          
          <h1 className="text-4xl font-semibold mb-2 tracking-wide font-sans">TransitOps</h1>
          <p className="text-slate-400 mb-12 italic tracking-wide">Smart Transport Operations Platform</p>
          
          <h2 className="text-xl font-medium mb-4 tracking-wide font-sans">One login, four roles:</h2>
          <ul className="space-y-3 font-sans text-lg tracking-wide">
            <li className="flex items-center gap-3">
              <div className="h-2 w-2 rounded-full bg-[#d97706]"></div>
              <span>Fleet Manager</span>
            </li>
            <li className="flex items-center gap-3">
              <div className="h-2 w-2 rounded-full bg-[#d97706]"></div>
              <span>Dispatcher</span>
            </li>
            <li className="flex items-center gap-3">
              <div className="h-2 w-2 rounded-full bg-[#d97706]"></div>
              <span>Safety Officer</span>
            </li>
            <li className="flex items-center gap-3">
              <div className="h-2 w-2 rounded-full bg-[#d97706]"></div>
              <span>Financial Analyst</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Right Column - Login Form */}
      <div className="flex w-full lg:w-1/2 flex-col justify-center px-8 sm:px-16 relative bg-white dark:bg-slate-900 transition-colors duration-300">
        <div className="w-full max-w-md mx-auto">
          
          <div className="mb-6">
            <h2 className="text-[28px] font-semibold text-slate-900 dark:text-white mb-1 font-sans transition-colors duration-300">Sign in to your account</h2>
            <p className="text-slate-500 dark:text-slate-400 font-sans text-sm transition-colors duration-300">Enter your credentials to continue</p>
            <div className="mt-4 inline-block bg-pink-100 dark:bg-pink-900/50 text-pink-700 dark:text-pink-300 text-xs font-bold px-3 py-1 rounded-md transition-colors duration-300">
              Cool Salamander
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm text-center">
                {error}
              </div>
            )}
            
            <div className="space-y-1">
              <label className="text-xs font-semibold tracking-wider text-slate-500 dark:text-slate-400 uppercase font-sans">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full rounded-md border border-slate-300 dark:border-slate-700 px-3 py-2 text-slate-900 dark:text-white bg-transparent placeholder-slate-400 dark:placeholder-slate-500 focus:border-[#d97706] focus:outline-none focus:ring-1 focus:ring-[#d97706] sm:text-sm font-sans transition-colors duration-300"
                placeholder="raven.k@transitops.in"
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold tracking-wider text-slate-500 dark:text-slate-400 uppercase font-sans">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full rounded-md border border-slate-300 dark:border-slate-700 px-3 py-2 text-slate-900 dark:text-white bg-transparent placeholder-slate-400 dark:placeholder-slate-500 focus:border-[#d97706] focus:outline-none focus:ring-1 focus:ring-[#d97706] sm:text-sm font-sans transition-colors duration-300"
                placeholder="••••••••"
                required
                disabled={isLoading}
              />
            </div>

            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 rounded border-slate-300 text-[#eab308] focus:ring-[#eab308]"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-700 font-sans">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="font-medium text-blue-500 hover:text-blue-400 font-sans">
                  Forgot password?
                </a>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="flex w-full justify-center rounded-md border border-transparent bg-[#eab308] py-2.5 px-4 text-sm font-semibold text-slate-900 shadow-sm hover:bg-[#ca8a04] focus:outline-none focus:ring-2 focus:ring-[#eab308] focus:ring-offset-2 disabled:opacity-50 transition-colors mt-2"
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-8 font-sans transition-colors duration-300">
            <h3 className="text-sm text-slate-500 dark:text-slate-400 mb-2 italic">Access is scoped by role after login:</h3>
            <ul className="text-sm text-slate-600 dark:text-slate-300 space-y-1">
              <li>• <span className="font-medium">Fleet Manager</span> → Fleet, Maintenance</li>
              <li>• <span className="font-medium">Dispatcher</span> → Dashboard, Trips</li>
              <li>• <span className="font-medium">Safety Officer</span> → Drivers, Compliance</li>
              <li>• <span className="font-medium">Financial Analyst</span> → Fuel & Expenses, Analytics</li>
            </ul>
          </div>

        </div>
      </div>
    </div>
  );
}
