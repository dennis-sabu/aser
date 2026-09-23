'use client';

import React, { useEffect, useState } from 'react';
import {
  ArrowUpRight,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  MapPin,
  MessageCircle,
  Users,
} from 'lucide-react';

interface HeroShowcaseSectionProps {
  activeTab: string;
}

const SHOWCASE_CONTENT = {
  resources: {
    eyebrow: 'Campus exchange',
    title: 'Find what you need, close to home.',
    description: 'A live view of useful things students are sharing around campus.',
    accent: 'bg-emerald-400',
    action: 'Browse shared resources',
    cards: [
      { title: 'ESP32 DevKit', meta: 'Borrow · free', person: 'RK', color: 'bg-emerald-100 text-emerald-700' },
      { title: 'Calculus textbook', meta: 'Sell · ₹120', person: 'AM', color: 'bg-sky-100 text-sky-700' },
      { title: 'DSLR camera', meta: 'Rent · ₹200/day', person: 'JP', color: 'bg-amber-100 text-amber-700' },
    ],
  },
  needs: {
    eyebrow: 'Smart matching',
    title: 'Ask once. Get help from your campus.',
    description: 'Post a need and let verified students make the right connection.',
    accent: 'bg-orange-400',
    action: 'Post a request',
    cards: [
      { title: 'Need an ESP32 for a project', meta: '2 responses · due tomorrow', person: 'You', color: 'bg-orange-100 text-orange-700' },
      { title: 'Looking for a quiet study group', meta: '5 nearby matches', person: 'You', color: 'bg-rose-100 text-rose-700' },
      { title: 'Borrow a tripod this weekend', meta: '3 possible matches', person: 'You', color: 'bg-violet-100 text-violet-700' },
    ],
  },
  rides: {
    eyebrow: 'Shared journeys',
    title: 'Make the commute lighter together.',
    description: 'See trusted rides leaving campus and reserve a seat in seconds.',
    accent: 'bg-sky-400',
    action: 'Find a ride',
    cards: [
      { title: 'Campus Gate → Ernakulam', meta: 'Today · 6:30 PM · 2 seats', person: 'AJ', color: 'bg-sky-100 text-sky-700' },
      { title: 'Hostel → Kakkanad', meta: 'Tomorrow · 8:15 AM · 1 seat', person: 'NS', color: 'bg-cyan-100 text-cyan-700' },
      { title: 'Library → Aluva', meta: 'Friday · 5:45 PM · 3 seats', person: 'MK', color: 'bg-indigo-100 text-indigo-700' },
    ],
  },
  skills: {
    eyebrow: 'Skill exchange',
    title: 'Learn from the people next door.',
    description: 'Trade knowledge, find a mentor, or offer the skill you know best.',
    accent: 'bg-violet-400',
    action: 'Explore student skills',
    cards: [
      { title: 'Priya S. · Flutter development', meta: 'Available weekends', person: 'PS', color: 'bg-violet-100 text-violet-700' },
      { title: 'Mohammed R. · PCB design', meta: 'Flexible exchange', person: 'MR', color: 'bg-fuchsia-100 text-fuchsia-700' },
      { title: 'Sneha T. · UI/UX design', meta: '₹200 / hour', person: 'ST', color: 'bg-pink-100 text-pink-700' },
    ],
  },
} as const;

export const HeroShowcaseSection = ({ activeTab }: HeroShowcaseSectionProps) => {
  const content = SHOWCASE_CONTENT[activeTab as keyof typeof SHOWCASE_CONTENT] ?? SHOWCASE_CONTENT.resources;
  const [activeCard, setActiveCard] = useState(0);

  useEffect(() => {
    setActiveCard(0);
  }, [activeTab]);

  const moveCard = (direction: 1 | -1) => {
    setActiveCard((current) => (current + direction + content.cards.length) % content.cards.length);
  };

  const getCardOffset = (index: number) => {
    const rawOffset = index - activeCard;
    if (rawOffset > 1) return rawOffset - content.cards.length;
    if (rawOffset < -1) return rawOffset + content.cards.length;
    return rawOffset;
  };

  return (
    <section className="px-6 pb-20" aria-live="polite">
      <div id={`panel-${activeTab}`} role="tabpanel" aria-labelledby={`tab-${activeTab}`} key={activeTab} className="relative mx-auto min-h-[500px] max-w-6xl overflow-hidden rounded-[2rem] border border-gray-200 bg-[#111827] p-6 text-white shadow-[0_24px_80px_rgba(17,24,39,0.16)] sm:p-10 lg:p-14">
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-white/[0.08] blur-3xl" />
        <div className="pointer-events-none absolute bottom-[-8rem] left-1/3 h-72 w-72 rounded-full bg-blue-400/[0.12] blur-3xl" />

        <div className="relative grid min-w-0 gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-12">
          <div className="min-w-0 max-w-xl animate-showcase-copy">
            <div className="mb-6 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-gray-400">
              <span className={`h-2 w-2 rounded-full ${content.accent}`} />
              {content.eyebrow}
            </div>
            <h2 className="max-w-lg text-4xl font-medium leading-[1.05] tracking-tight sm:text-5xl">{content.title}</h2>
            <p className="mt-5 max-w-md text-base leading-7 text-gray-400">{content.description}</p>
            <div className="mt-8 flex flex-wrap gap-3 text-sm text-gray-300">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-3 py-2"><CheckCircle2 className="h-4 w-4 text-emerald-400" /> Verified students</span>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-3 py-2"><MapPin className="h-4 w-4 text-sky-400" /> Your campus</span>
            </div>
          </div>

          <div className="relative min-w-0 animate-showcase-panel rounded-2xl border border-white/10 bg-white/[0.08] p-4 shadow-2xl backdrop-blur-xl sm:p-5">
            <div className="flex flex-col gap-3 border-b border-white/10 pb-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold">Live on CampusNet</p>
                <p className="text-xs text-gray-400">Swipe through what is happening nearby</p>
              </div>
              <button type="button" aria-label={content.action} className="group inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-2 text-xs font-medium text-gray-300 transition hover:bg-white/10 hover:text-white">{content.action}<ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" /></button>
            </div>
            <div className="relative mt-5 h-[300px] overflow-hidden sm:h-[330px]">
              {content.cards.map((card, index) => {
                const offset = getCardOffset(index);
                const isActive = offset === 0;

                return (
                  <article
                    key={card.title}
                    aria-hidden={!isActive}
                    className={`absolute inset-y-0 w-[82%] max-w-[310px] rounded-2xl border p-5 transition-all duration-500 ease-out sm:w-[72%] ${
                      isActive
                        ? 'border-white/25 bg-white/[0.16] shadow-2xl shadow-black/30'
                        : 'border-white/10 bg-black/20 opacity-35 blur-[1px]'
                    }`}
                    style={{
                      left: `${50 + offset * 44}%`,
                      transform: `translateX(-50%) scale(${isActive ? 1 : 0.88})`,
                      zIndex: isActive ? 3 : 1,
                    }}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className={`flex h-11 w-11 items-center justify-center rounded-xl text-xs font-bold ${card.color}`}>{card.person}</div>
                      <MessageCircle className="h-4 w-4 text-gray-400" />
                    </div>
                    <div className="mt-16 sm:mt-20">
                      <p className="text-lg font-semibold leading-tight text-white">{card.title}</p>
                      <p className="mt-2 text-sm leading-6 text-gray-400">{card.meta}</p>
                    </div>
                    <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between border-t border-white/10 pt-4 text-xs text-gray-400">
                      <span>{isActive ? 'Available now' : 'Campus listing'}</span>
                      <span className="h-2 w-2 rounded-full bg-emerald-400" />
                    </div>
                  </article>
                );
              })}
            </div>
            <div className="mt-2 flex items-center justify-between border-t border-white/10 pt-4 text-xs text-gray-400">
              <span className="inline-flex items-center gap-2"><Users className="h-4 w-4" /> 248 active students</span>
              <div className="flex items-center gap-2">
                <button type="button" onClick={() => moveCard(-1)} aria-label="Previous card" className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 transition hover:bg-white/10 hover:text-white"><ChevronLeft className="h-4 w-4" /></button>
                <div className="flex items-center gap-1.5 px-2">
                  {content.cards.map((card, index) => <button key={card.title} type="button" onClick={() => setActiveCard(index)} aria-label={`Show ${card.title}`} className={`h-1.5 rounded-full transition-all ${index === activeCard ? 'w-6 bg-white' : 'w-1.5 bg-white/30 hover:bg-white/60'}`} />)}
                </div>
                <button type="button" onClick={() => moveCard(1)} aria-label="Next card" className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 transition hover:bg-white/10 hover:text-white"><ChevronRight className="h-4 w-4" /></button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
