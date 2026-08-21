import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import UploadQueue from '../upload/UploadQueue';

const AppLayout = () => {
  return (
    <div className="flex h-screen bg-[#ffffff] dark:bg-gray-900 text-[#3c4043] dark:text-gray-100 overflow-hidden transition-colors">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 bg-[#ffffff] dark:bg-gray-900 transition-colors">
        <Navbar />
        <main className="flex-1 overflow-hidden p-4">
          <div className="h-full bg-[#f8f9fa] dark:bg-[#1a1c1e] rounded-2xl overflow-y-auto flex transition-colors">
            <div className="flex-1 overflow-y-auto">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
      <UploadQueue />
    </div>
  );
};

export default AppLayout;
