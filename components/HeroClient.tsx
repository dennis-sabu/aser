'use client';

import React, { useState } from 'react';
import { HeroContent } from './HeroContent';
import { HeroTabBar } from './HeroTabBar';
import { HeroShowcaseSection } from './HeroShowcaseSection';
import { HeroLogos } from './HeroLogos';
import { FeaturesSection, HowItWorksSection } from './LandingDetails';

export const HeroClient = () => {
  const [activeTab, setActiveTab] = useState('resources');

  return (
    <>
      <div className="max-w-7xl mx-auto">
        <div style={{ opacity: 0, animationDelay: '0.2s' }} className="animate-fade-in-up">
          <HeroContent />
        </div>

        <div style={{ opacity: 0, animationDelay: '0.3s' }} className="animate-fade-in-up">
          <HeroTabBar activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>

        <div style={{ opacity: 0, animationDelay: '0.4s' }} className="animate-fade-in-up">
          <HeroShowcaseSection activeTab={activeTab} />
        </div>

        <div style={{ opacity: 0, animationDelay: '0.5s' }} className="animate-fade-in-up">
          <HeroLogos />
        </div>
      </div>

      {/* Extended Landing Page Sections */}
      <FeaturesSection />
      <HowItWorksSection />

      {/* Final CTA Section */}
      <section className="py-24 bg-white text-center px-6">
        <div style={{ opacity: 0, animationDelay: '0.1s' }} className="animate-fade-in-up max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-6xl font-normal tracking-tight mb-6">
            Ready to connect<br />your campus?
          </h2>
          <p className="text-gray-600 text-lg mb-10">
            Join verified students already sharing resources, rides, and skills on their campus.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="/signup">
              <button className="bg-black text-white px-10 py-4 rounded-full text-lg font-medium hover:bg-gray-800 transition-all w-full sm:w-auto">
                Join Your Campus Free
              </button>
            </a>
            <a href="#how-it-works">
              <button className="bg-white text-black border border-gray-200 px-10 py-4 rounded-full text-lg font-medium hover:bg-gray-50 transition-all w-full sm:w-auto">
                Learn More
              </button>
            </a>
          </div>
        </div>
      </section>
    </>
  );
};
