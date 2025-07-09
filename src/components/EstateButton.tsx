import React from 'react';

interface EstateButtonProps {
  label: string;
  onClick: () => void;
}

const EstateButton: React.FC<EstateButtonProps> = ({ label, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="group bg-gray-800 border-2 border-gray-700 rounded-lg p-6 w-full text-center transition-all duration-300 hover:bg-red-700 hover:border-red-600 hover:shadow-lg hover:-translate-y-1"
    >
      <div className="flex justify-center mb-4">
        <svg className="w-16 h-16 text-gray-400 group-hover:text-white transition-colors" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 4v16" />
        </svg>
      </div>
      <h3 className="text-xl font-semibold text-gray-200 group-hover:text-white transition-colors">{label}</h3>
    </button>
  );
};

export default EstateButton;