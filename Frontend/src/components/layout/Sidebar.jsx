import React from 'react';
import { NavLink } from 'react-router-dom';
import { Cloud, Folder, Clock, Users, Trash2, Settings } from 'lucide-react';

const Sidebar = () => {
  const navItems = [
    { name: 'My Files', path: '/', icon: <Folder size={20} /> },
    { name: 'Trash', path: '/trash', icon: <Trash2 size={20} /> },
  ];

  return (
    <div className="w-64 bg-[#1A1A1A] border-r border-[#2A2A2A] flex flex-col">
      <div className="p-6 flex items-center space-x-3">
        <div className="bg-[#2AABEE] p-2 rounded-lg">
          <Cloud size={24} className="text-white" />
        </div>
        <span className="text-xl font-bold tracking-wide">TeleDrive</span>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors duration-200 ${
                isActive 
                  ? 'bg-[#2AABEE]/10 text-[#2AABEE]' 
                  : 'text-gray-400 hover:bg-[#2A2A2A] hover:text-white'
              }`
            }
          >
            {item.icon}
            <span className="font-medium">{item.name}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-[#2A2A2A]">
        <button className="flex items-center space-x-3 px-4 py-3 w-full text-gray-400 hover:bg-[#2A2A2A] hover:text-white rounded-xl transition-colors">
          <Settings size={20} />
          <span className="font-medium">Settings</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
