import React from 'react';

const PARTNERS = [
  { name: 'Kerala University', style: 'font-semibold tracking-wide' },
  { name: 'MG University', style: 'font-bold' },
  { name: 'Calicut University', style: 'font-medium tracking-tight' },
  { name: 'APJ Abdul Kalam', style: 'font-light tracking-widest text-xs' },
  { name: 'CUSAT', style: 'font-black' },
  { name: 'NIT Calicut', style: 'font-semibold italic' },
];

export const HeroLogos = () => {
  return (
    <div className="mt-24 mb-12">
      <p className="text-center text-xs text-gray-400 tracking-widest uppercase mb-8">
        Trusted across campuses
      </p>
      <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-40 grayscale">
        {PARTNERS.map((p) => (
          <span key={p.name} className={`text-sm md:text-base text-gray-600 ${p.style}`}>
            {p.name}
          </span>
        ))}
      </div>
    </div>
  );
};
