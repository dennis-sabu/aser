'use client';
import React from 'react';
import { ShoppingBag, HelpCircle, Car, Lightbulb } from 'lucide-react';

interface Tab {
  id: string;
  label: string;
  icon: React.ReactNode;
}

const TABS: Tab[] = [
  { id: 'resources', label: 'Resources', icon: <ShoppingBag className="w-4 h-4" /> },
  { id: 'needs', label: 'I Need', icon: <HelpCircle className="w-4 h-4" /> },
  { id: 'rides', label: 'Rides', icon: <Car className="w-4 h-4" /> },
  { id: 'skills', label: 'Skills', icon: <Lightbulb className="w-4 h-4" /> },
];

interface HeroTabBarProps {
  activeTab: string;
  setActiveTab: (id: string) => void;
}

export const HeroTabBar = ({ activeTab, setActiveTab }: HeroTabBarProps) => {
  const activeIndex = TABS.findIndex((tab) => tab.id === activeTab);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;

    event.preventDefault();
    const nextIndex = event.key === 'Home'
      ? 0
      : event.key === 'End'
        ? TABS.length - 1
        : (activeIndex + (event.key === 'ArrowRight' ? 1 : -1) + TABS.length) % TABS.length;
    setActiveTab(TABS[nextIndex].id);
  };

  return (
    <div className="mb-10 flex justify-center px-6">
      <div role="tablist" aria-label="CampusNet features" className="flex w-full max-w-3xl gap-1 overflow-x-auto rounded-2xl border border-gray-200 bg-white/90 p-1.5 shadow-[0_12px_35px_rgba(15,23,42,0.08)] backdrop-blur sm:w-fit sm:max-w-full">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              id={`tab-${tab.id}`}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-controls={`panel-${tab.id}`}
              tabIndex={isActive ? 0 : -1}
              onClick={() => setActiveTab(tab.id)}
              onKeyDown={handleKeyDown}
              className={`group relative flex min-w-[116px] shrink-0 items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-300 sm:min-w-0 sm:px-6 ${
                isActive
                  ? 'bg-gray-950 text-white shadow-lg shadow-gray-950/15'
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-950'
              }`}
            >
              <span className={`transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}>
                {tab.icon}
              </span>
              {tab.label}
              {isActive && <span className="absolute bottom-1 h-0.5 w-5 rounded-full bg-white" />}
            </button>
          );
        })}
      </div>
    </div>
  );
};
