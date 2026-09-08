import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import UploadQueue from '../upload/UploadQueue';
import { Cloud, ShieldCheck, Clock, Wifi } from 'lucide-react';
import { useFiles } from '../../context/FileContext';
import { formatBytes } from '../../utils/formatBytes';

const AppLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const { storageStats } = useFiles();

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedTime = currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const formattedDate = currentTime.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <div className="flex h-screen w-screen bg-[#f8fafc] dark:bg-[#090d14] text-slate-800 dark:text-slate-100 overflow-hidden font-['Inter',system-ui,sans-serif] transition-colors">
      {/* Sidebar - responsive */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        <Navbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        
        {/* Full-width content without card container */}
        <main className="flex-1 overflow-hidden flex flex-col relative">
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            <Outlet />
          </div>
        </main>

        {/* Modern Bottom Meta Status Bar */}
        <footer className="h-8 px-4 md:px-6 bg-white/70 dark:bg-[#0c1017]/70 backdrop-blur-md border-t border-slate-200/70 dark:border-white/5 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 select-none z-20 transition-colors">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1.5 text-sky-600 dark:text-sky-400 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>Telegram Cloud DC • Synchronized</span>
            </div>
            <div className="hidden sm:flex items-center space-x-1">
              <span>Used:</span>
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                {formatBytes(storageStats?.used || 0)}
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <span className="hidden md:inline text-slate-400 dark:text-slate-500">
              Drag & drop files anywhere to upload
            </span>
            <div className="flex items-center space-x-1.5 font-mono text-slate-600 dark:text-slate-300 font-medium">
              <Clock size={12} className="text-slate-400" />
              <span>{formattedDate}</span>
              <span>•</span>
              <span>{formattedTime}</span>
            </div>
          </div>
        </footer>
      </div>

      <UploadQueue />
    </div>
  );
};

export default AppLayout;
