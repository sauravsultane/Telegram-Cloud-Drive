import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Cloud } from 'lucide-react';

const Login = () => {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const telegramWrapperRef = useRef(null);

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  useEffect(() => {
    // We attach the callback to window so the Telegram widget can call it
    window.onTelegramAuth = async (user) => {
      const result = await login(user);
      if (result.success) {
        navigate('/');
      } else {
        setError(result.error);
      }
    };

    if (telegramWrapperRef.current && telegramWrapperRef.current.children.length === 0) {
      // Load the Telegram Login Widget script dynamically
      const script = document.createElement('script');
      script.src = 'https://telegram.org/js/telegram-widget.js?22';
      // Use environment variable or fallback to placeholder for dev
      script.setAttribute('data-telegram-login', import.meta.env.VITE_TELEGRAM_BOT_USERNAME || 'YOUR_BOT_USERNAME');
      script.setAttribute('data-size', 'large');
      script.setAttribute('data-onauth', 'onTelegramAuth(user)');
      script.setAttribute('data-request-access', 'write');
      script.async = true;
      
      telegramWrapperRef.current.appendChild(script);
    }

    return () => {
      // Clean up callback
      delete window.onTelegramAuth;
    };
  }, [login, navigate]);

  return (
    <div className="min-h-screen bg-[#0F0F0F] flex items-center justify-center p-4">
      <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl p-10 w-full max-w-md flex flex-col items-center text-center shadow-2xl relative overflow-hidden">
        {/* Decorative blur */}
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-[#2AABEE] rounded-full blur-[100px] opacity-20"></div>
        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-[#AA3BFF] rounded-full blur-[100px] opacity-20"></div>

        <div className="bg-[#2AABEE]/10 p-4 rounded-2xl mb-6 border border-[#2AABEE]/20 relative z-10">
          <Cloud size={48} className="text-[#2AABEE]" />
        </div>
        
        <h1 className="text-3xl font-bold text-white mb-3 relative z-10">TeleDrive</h1>
        <p className="text-gray-400 mb-8 relative z-10">
          Unlimited cloud storage powered by Telegram. Secure, fast, and completely free.
        </p>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-500 px-4 py-3 rounded-xl mb-6 w-full relative z-10 text-sm">
            {error}
          </div>
        )}

        <div className="relative z-10 bg-white/5 p-6 rounded-xl w-full border border-white/5 flex flex-col items-center justify-center min-h-[120px]">
          <div ref={telegramWrapperRef}></div>
          <p className="text-xs text-gray-500 mt-4">
            By continuing, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
