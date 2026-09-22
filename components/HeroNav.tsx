import React from 'react';
import Link from 'next/link';
import { Network } from 'lucide-react';
import { createClientServer } from '@/lib/supabase-server';
import { signOut } from '@/app/actions/auth';

export const HeroNav = async () => {
  const supabase = await createClientServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <nav className="px-4 sm:px-6 py-4 flex items-center justify-between max-w-7xl mx-auto w-full">
      <div className="flex items-center gap-2 flex-shrink-0">
        <Network className="w-5 h-5 text-black" />
        <span className="text-base sm:text-lg font-semibold tracking-tight">
          <span className="hidden xs:inline">Campus Resource Network</span>
          <span className="xs:hidden">CampusNet</span>
        </span>
      </div>

      <div className="hidden md:flex items-center gap-8">
        <a href="#features" className="text-sm text-gray-700 hover:text-black transition-colors">
          Features
        </a>
        <a href="#how-it-works" className="text-sm text-gray-700 hover:text-black transition-colors">
          How It Works
        </a>
        <a href="#about" className="text-sm text-gray-700 hover:text-black transition-colors">
          About
        </a>
      </div>

      <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
        {user ? (
          <>
            <Link
              href="/dashboard"
              className="text-xs sm:text-sm text-gray-700 hover:text-black transition-colors font-medium px-2 py-1"
            >
              Dashboard
            </Link>
            <form action={signOut}>
              <button
                type="submit"
                className="bg-black text-white px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-medium hover:bg-gray-800 transition-colors"
              >
                Sign Out
              </button>
            </form>
          </>
        ) : (
          <>
            <Link href="/login" className="text-xs sm:text-sm text-gray-700 hover:text-black transition-colors px-2 py-1 font-medium">
              Login
            </Link>
            <Link
              href="/signup"
              className="bg-black text-white px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-medium hover:bg-gray-800 transition-colors whitespace-nowrap"
            >
              Join Campus
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};
