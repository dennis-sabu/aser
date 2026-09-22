import React from 'react';
import { CheckCircle2 } from 'lucide-react';

export const HeroContent = () => {
  return (
    <div className="px-6 pt-24 pb-16 max-w-7xl mx-auto text-center">
      <div className="inline-flex items-center gap-2 mb-8">
        <div className="w-6 h-6 border border-gray-300 rounded flex items-center justify-center">
          <CheckCircle2 className="w-3.5 h-3.5 text-black" />
        </div>
        <span className="text-sm font-medium text-black">Verified Student-Only Platform</span>
      </div>

      <h1 className="text-6xl md:text-7xl lg:text-[80px] font-semibold leading-[1.1] tracking-tight mb-5 text-black">
        Your Campus.<br />
        <span className="gradient-text">
          Everything You Need.
        </span>
      </h1>

      <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
        Discover and share resources, rides, and skills with verified students on your campus.
        One platform. Real connections. Zero friction.
      </p>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
        <a href="/signup">
          <button className="bg-black text-white px-8 py-3 rounded-full text-base font-medium hover:bg-gray-800 transition-colors">
            Join Your Campus
          </button>
        </a>
        <a href="#how-it-works">
          <button className="bg-white text-black border border-gray-200 px-8 py-3 rounded-full text-base font-medium hover:bg-gray-50 transition-colors">
            See How It Works
          </button>
        </a>
      </div>

      {/* Search preview bar */}
      <div className="max-w-xl mx-auto relative">
        <div className="flex items-center bg-gray-100 rounded-full px-5 py-3.5 gap-3 border border-gray-200">
          <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <span className="text-gray-400 text-sm">Search resources, skills, rides, or people...</span>
        </div>
      </div>
    </div>
  );
};
