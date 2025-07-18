import React from 'react';
import { IoArrowBack } from 'react-icons/io5';

interface TopBarMainProps {
  onBack: () => void;
  title?: string;
}

/**
 * A custom top bar with a back button and optional title.
 * Use onBack to handle both UI and hardware back-button overrides.
 */
export default function TopBarMain({ onBack, title }: TopBarMainProps) {
  return (
    <div className="w-full h-12 px-4 bg-transparent flex items-center">
      <button
        onClick={onBack}
        className="p-2 mr-2 focus:outline-none"
        aria-label="Back"
      >
        <IoArrowBack className="text-white text-2xl" />
      </button>
      {title && (
        <h1 className="text-white text-lg font-semibold">{title}</h1>
      )}
    </div>
  );
}
