import React from 'react';

const Spinner: React.FC<{ size?: number }> = ({ size = 8 }) => {
  return (
    <div className={`animate-spin rounded-full h-${size} w-${size} border-b-2 border-red-500`}></div>
  );
};

export const FullPageSpinner: React.FC<{ message?: string }> = ({ message = "Loading..." }) => {
    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-80 flex flex-col justify-center items-center z-50">
            <Spinner size={16} />
            <p className="mt-4 text-white text-lg">{message}</p>
        </div>
    );
}

export default Spinner;