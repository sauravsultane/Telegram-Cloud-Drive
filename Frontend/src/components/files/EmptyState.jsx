import React from 'react';
import { CloudOff } from 'lucide-react';

const EmptyState = ({ message, subMessage }) => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center py-20 text-center">
      <div className="w-32 h-32 mb-6 rounded-full bg-gray-50 dark:bg-gray-800 flex items-center justify-center">
        <CloudOff size={48} className="text-gray-300 dark:text-gray-600" />
      </div>
      <h3 className="text-xl font-medium text-gray-700 dark:text-gray-300 mb-2">{message}</h3>
      {subMessage && (
        <p className="text-gray-500 dark:text-gray-500">{subMessage}</p>
      )}
    </div>
  );
};

export default EmptyState;
