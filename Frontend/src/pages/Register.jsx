import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Cloud, Mail, Lock, User } from 'lucide-react';

const Register = () => {
  const { register, user } = useAuth();
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const result = await register(firstName, email, password);
    if (result.success) {
      navigate('/');
    } else {
      setError(result.error);
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] dark:bg-gray-900 flex items-center justify-center p-4 transition-colors">
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-3xl p-10 w-full max-w-md flex flex-col items-center shadow-xl relative overflow-hidden transition-colors">
        {/* Decorative blur */}
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-[#1967d2] rounded-full blur-[80px] opacity-10"></div>
        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-[#34A853] rounded-full blur-[80px] opacity-10"></div>

        <div className="bg-[#1967d2]/10 p-4 rounded-2xl mb-6 border border-[#1967d2]/20 relative z-10 text-center mx-auto">
          <Cloud size={48} className="text-[#1967d2] dark:text-blue-400" />
        </div>
        
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2 relative z-10 text-center">Create Account</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-8 relative z-10 text-center">
          Join Google Drive to start storing files securely.
        </p>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl mb-6 w-full relative z-10 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="w-full relative z-10">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">First Name</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User size={18} className="text-gray-400 dark:text-gray-500" />
              </div>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-700 rounded-xl py-3 pl-10 pr-4 text-gray-800 dark:text-white focus:outline-none focus:border-[#1967d2] dark:focus:border-blue-500 focus:bg-white dark:focus:bg-gray-700 transition-colors"
                placeholder="John"
                required
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">Email</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail size={18} className="text-gray-400 dark:text-gray-500" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-700 rounded-xl py-3 pl-10 pr-4 text-gray-800 dark:text-white focus:outline-none focus:border-[#1967d2] dark:focus:border-blue-500 focus:bg-white dark:focus:bg-gray-700 transition-colors"
                placeholder="Enter your email"
                required
              />
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock size={18} className="text-gray-400 dark:text-gray-500" />
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-700 rounded-xl py-3 pl-10 pr-4 text-gray-800 dark:text-white focus:outline-none focus:border-[#1967d2] dark:focus:border-blue-500 focus:bg-white dark:focus:bg-gray-700 transition-colors"
                placeholder="Create a password"
                minLength="6"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#1967d2] hover:bg-[#1a73e8] text-white font-medium py-3 rounded-xl shadow-md transition-all disabled:opacity-50"
          >
            {isLoading ? 'Creating account...' : 'Sign Up'}
          </button>
        </form>

        <p className="mt-6 text-gray-500 dark:text-gray-400 text-sm relative z-10">
          Already have an account?{' '}
          <Link to="/login" className="text-[#1967d2] dark:text-blue-400 font-medium hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
