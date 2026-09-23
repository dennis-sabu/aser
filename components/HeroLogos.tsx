'use client';

import React, { useEffect, useRef, useState } from 'react';

export interface LogoCloudItem {
  name: string;
  shortName: string;
  imageSrc?: string;
  className?: string;
}

export interface LogoCloudProps {
  sets?: LogoCloudItem[][];
  intervalMs?: number;
}

const UNIVERSITY_LOGO_SETS: LogoCloudItem[][] = [
  [
    { name: 'University of Kerala', shortName: 'KU', className: 'font-semibold' },
    { name: 'Mahatma Gandhi University', shortName: 'MGU', className: 'font-bold' },
    { name: 'University of Calicut', shortName: 'CALICUT', className: 'font-medium' },
    { name: 'APJ Abdul Kalam Technological University', shortName: 'KTU', className: 'font-semibold' },
    { name: 'Cochin University of Science and Technology', shortName: 'CUSAT', className: 'font-black' },
  ],
  [
    { name: 'National Institute of Technology Calicut', shortName: 'NITC', className: 'font-black' },
    { name: 'Kannur University', shortName: 'KANNUR', className: 'font-semibold' },
    { name: 'Amrita Vishwa Vidyapeetham', shortName: 'AMRITA', className: 'font-bold' },
    { name: 'Indian Institute of Space Science and Technology', shortName: 'IIST', className: 'font-semibold' },
    { name: 'Kerala Agricultural University', shortName: 'KAU', className: 'font-bold' },
  ],
];

const TRANSITION_MS = 760;

export const HeroLogos = ({ sets = UNIVERSITY_LOGO_SETS, intervalMs = 2000 }: LogoCloudProps) => {
  const [setIndex, setSetIndex] = useState(0);
  const [nextSet, setNextSet] = useState<LogoCloudItem[] | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const handoffTimer = useRef<number | null>(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updatePreference = () => setReduceMotion(mediaQuery.matches);
    updatePreference();
    mediaQuery.addEventListener('change', updatePreference);
    return () => mediaQuery.removeEventListener('change', updatePreference);
  }, []);

  useEffect(() => {
    if (reduceMotion || sets.length < 2) return;

    const timer = window.setInterval(() => {
      const upcomingIndex = (setIndex + 1) % sets.length;
      setNextSet(sets[upcomingIndex]);
      setIsTransitioning(true);

      handoffTimer.current = window.setTimeout(() => {
        setSetIndex(upcomingIndex);
        setNextSet(null);
        setIsTransitioning(false);
      }, TRANSITION_MS);
    }, intervalMs);

    return () => {
      window.clearInterval(timer);
      if (handoffTimer.current !== null) window.clearTimeout(handoffTimer.current);
    };
  }, [intervalMs, reduceMotion, setIndex, sets]);

  const currentSet = sets[setIndex] ?? UNIVERSITY_LOGO_SETS[0];
  const incomingSet = nextSet ?? currentSet;

  return (
    <section className="mt-10 mb-12 px-6 py-8 text-gray-900 sm:mt-16" aria-label="Trusted universities">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 sm:gap-8 md:flex-row md:items-center md:gap-12">
        <p className="shrink-0 text-xs font-semibold uppercase tracking-[0.22em] text-black md:w-40">Trusted by the best</p>
        <div className="min-w-0 flex-1 overflow-x-auto overflow-y-hidden pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="grid min-w-[680px] grid-cols-5 items-center gap-5 sm:min-w-0 sm:gap-8 lg:gap-12" aria-live="polite">
            {Array.from({ length: 5 }, (_, index) => {
              const currentLogo = currentSet[index % currentSet.length];
              const incomingLogo = incomingSet[index % incomingSet.length];

              return (
                <div key={`${currentLogo.name}-${index}`} className="relative flex h-10 min-w-0 items-center justify-center">
                  {isTransitioning && !reduceMotion ? (
                    <>
                      <LogoMark logo={currentLogo} state="outgoing" index={index} />
                      <LogoMark logo={incomingLogo} state="incoming" index={index} />
                    </>
                  ) : (
                    <LogoMark logo={currentLogo} state="visible" index={index} />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

function LogoMark({ logo, state, index }: { logo: LogoCloudItem; state: 'visible' | 'incoming' | 'outgoing'; index: number }) {
  const className = `absolute inset-0 flex items-center justify-center whitespace-nowrap text-center text-[11px] tracking-[0.12em] text-black sm:text-xs ${logo.className ?? ''}`;
  const animationClass = state === 'incoming' ? 'logo-cloud-incoming' : state === 'outgoing' ? 'logo-cloud-outgoing' : '';

  if (logo.imageSrc) {
    return <img src={logo.imageSrc} alt={logo.name} className={`${className} ${animationClass} object-contain`} style={{ animationDelay: `${index * 90}ms` }} />;
  }

  return <span title={logo.name} className={`${className} ${animationClass}`} style={{ animationDelay: `${index * 90}ms` }}>{logo.shortName}</span>;
}
