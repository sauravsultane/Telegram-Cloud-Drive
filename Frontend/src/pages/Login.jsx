import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Cloud, Mail, Lock, Eye, EyeOff, ArrowRight, AlertCircle } from 'lucide-react';

const Login = () => {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const result = await login(email, password);
    if (result.success) {
      navigate('/');
    } else {
      setError(result.error);
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#f0f2f5] dark:bg-[#0f1117] flex items-center justify-center p-4 transition-colors duration-300">
      {/* Subtle background pattern */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-gradient-to-br from-blue-400/8 to-purple-400/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-gradient-to-tr from-emerald-400/5 to-blue-400/8 rounded-full blur-3xl"></div>
      </div>

      {/* Main card */}
      <div className="w-full max-w-[440px] relative z-10">
        <div className="bg-white dark:bg-[#1a1d27] rounded-[28px] border border-gray-100 dark:border-gray-800/60 shadow-[0_8px_40px_rgba(0,0,0,0.06)] dark:shadow-[0_8px_40px_rgba(0,0,0,0.3)] p-10 transition-colors duration-300">
          
          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <div className="relative mb-5">
              <div className="absolute inset-0 bg-blue-500/20 rounded-2xl blur-xl"></div>
              <div className="relative bg-gradient-to-br from-[#1967d2] to-[#1557b0] p-4 rounded-2xl shadow-lg shadow-blue-500/20">
                <Cloud size={32} className="text-white" />
              </div>
            </div>
            <h1 className="text-[28px] font-bold text-gray-900 dark:text-white tracking-tight">
              Log in
            </h1>
            <p className="text-gray-400 dark:text-gray-500 text-sm mt-1.5">
              Welcome back to TeleDrive
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-center gap-2.5 bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 text-red-600 dark:text-red-400 px-4 py-3 rounded-xl mb-6 text-sm animate-[fadeIn_0.2s_ease]">
              <AlertCircle size={16} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wider">
                Email
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Mail size={17} className="text-gray-300 dark:text-gray-600 group-focus-within:text-[#1967d2] transition-colors" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full bg-gray-50/70 dark:bg-[#12141c] border rounded-xl py-3 pl-10.5 pr-4 text-gray-800 dark:text-white text-[15px] placeholder:text-gray-300 dark:placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#1967d2]/20 focus:border-[#1967d2] dark:focus:border-blue-500 transition-all duration-200 ${
                    error ? 'border-red-300 dark:border-red-500/40' : 'border-gray-200 dark:border-gray-700/60'
                  }`}
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wider">
                Password
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Lock size={17} className="text-gray-300 dark:text-gray-600 group-focus-within:text-[#1967d2] transition-colors" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-gray-50/70 dark:bg-[#12141c] border border-gray-200 dark:border-gray-700/60 rounded-xl py-3 pl-10.5 pr-12 text-gray-800 dark:text-white text-[15px] placeholder:text-gray-300 dark:placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#1967d2]/20 focus:border-[#1967d2] dark:focus:border-blue-500 transition-all duration-200"
                  placeholder="Type here..."
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-300 dark:text-gray-600 hover:text-gray-500 dark:hover:text-gray-400 transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>

            {/* Remember Me + Forgot Password */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 dark:border-gray-600 text-[#1967d2] focus:ring-[#1967d2]/30 dark:bg-gray-700 cursor-pointer"
                />
                <span className="text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors select-none">
                  Remember Me
                </span>
              </label>
              <button type="button" className="text-[#1967d2] dark:text-blue-400 font-medium hover:text-[#1557b0] dark:hover:text-blue-300 transition-colors">
                Forgot Password?
              </button>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-[#1967d2] to-[#1a73e8] hover:from-[#1557b0] hover:to-[#1967d2] text-white font-semibold py-3.5 rounded-xl shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                  </svg>
                  Logging in...
                </div>
              ) : (
                <>
                  Log in
                  <ArrowRight size={18} className="group-hover:translate-x-0.5 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-7">
            <div className="flex-1 h-px bg-gray-100 dark:bg-gray-800"></div>
            <span className="text-xs text-gray-300 dark:text-gray-600 font-medium uppercase tracking-wider">or</span>
            <div className="flex-1 h-px bg-gray-100 dark:bg-gray-800"></div>
          </div>

          {/* Social login buttons */}
          <div className="space-y-3">
            <button
              type="button"
              className="w-full flex items-center justify-center gap-3 bg-white dark:bg-[#12141c] border border-gray-200 dark:border-gray-700/60 rounded-xl py-3 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#1e2130] hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-200"
            >
              <svg width="18" height="18" viewBox="0 0 18 18"><path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" fill="#4285F4"/><path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z" fill="#34A853"/><path d="M3.964 10.71c-.18-.54-.282-1.117-.282-1.71s.102-1.17.282-1.71V4.958H.957C.347 6.173 0 7.548 0 9s.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/><path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/></svg>
              Continue with Google
            </button>
          </div>

          {/* Register link */}
          <p className="mt-8 text-center text-sm text-gray-400 dark:text-gray-500">
            Don't have an account?{' '}
            <Link to="/register" className="text-[#1967d2] dark:text-blue-400 font-semibold hover:text-[#1557b0] dark:hover:text-blue-300 transition-colors">
              Sign up
            </Link>
          </p>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-gray-300 dark:text-gray-600 mt-6">
          Secured by TeleDrive · Cloud Storage
        </p>
      </div>
    </div>
  );
};

export default Login;
