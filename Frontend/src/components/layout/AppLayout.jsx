import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import UploadQueue from '../upload/UploadQueue';

const AppLayout = () => {
  return (
    <div className="flex h-screen bg-[#0F0F0F] text-white overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
      <UploadQueue />
    </div>
  );
};

export default AppLayout;
