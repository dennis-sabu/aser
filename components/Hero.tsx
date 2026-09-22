// Server Component wrapper for the Hero section
// HeroNav is a Server Component (uses Supabase server client)
// HeroClient handles all the client-side animation/tab state
import { HeroNav } from './HeroNav';
import { HeroClient } from './HeroClient';

export const Hero = () => {
  return (
    <div className="bg-white min-h-screen">
      <div style={{ opacity: 0, animationDelay: '0.1s' }} className="animate-fade-in-up">
        <HeroNav />
      </div>
      <HeroClient />
    </div>
  );
};
