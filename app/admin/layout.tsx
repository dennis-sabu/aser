import React from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Shield, ArrowLeft, Users, ShieldAlert, LogOut, Network, CheckCircle2 } from 'lucide-react';
import { createClientServer } from '@/lib/supabase-server';
import { isAdmin } from '@/lib/admin';
import { signOut } from '@/app/actions/auth';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClientServer();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  if (!isAdmin(user)) {
    redirect('/dashboard');
  }

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Top Header matching HeroNav design language */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between">
          <div className="flex items-center gap-4 sm:gap-8">
            <Link href="/admin/dashboard" className="flex items-center gap-2 sm:gap-3 group">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-2xl bg-black text-white flex items-center justify-center transition-transform group-hover:scale-105 shadow-sm flex-shrink-0">
                <Network className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <span className="text-base sm:text-lg font-semibold text-gray-900 tracking-tight">CampusNet</span>
                  <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider bg-black text-white px-2 py-0.5 rounded-full">
                    Admin
                  </span>
                </div>
              </div>
            </Link>

            <nav className="hidden md:flex items-center bg-gray-100/80 p-1 rounded-full border border-gray-200/50">
              <Link
                href="/admin/dashboard"
                className="px-4 py-1.5 text-xs font-semibold text-gray-700 hover:text-black rounded-full transition-all"
              >
                Moderation & Directory
              </Link>
              <div className="w-px h-3.5 bg-gray-300" />
              <Link
                href="/admin/reports"
                className="px-4 py-1.5 text-xs font-semibold text-gray-700 hover:text-black rounded-full transition-all"
              >
                Safety & Reports
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
            <div className="hidden lg:inline-flex items-center gap-2 px-3.5 py-1.5 bg-gray-50 border border-gray-200 rounded-full text-xs text-gray-700">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-medium truncate max-w-[180px]">{user.email}</span>
            </div>

            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-700 hover:text-black px-3 sm:px-4 py-2 rounded-full border border-gray-200 hover:bg-gray-50 transition-all"
              title="Back to Campus"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Back to Campus</span>
              <span className="sm:hidden">Exit</span>
            </Link>

            <form action={signOut}>
              <button
                type="submit"
                className="bg-black text-white px-3 sm:px-4 py-2 rounded-full text-xs font-medium hover:bg-gray-800 transition-colors shadow-2xs whitespace-nowrap"
              >
                Sign Out
              </button>
            </form>
          </div>
        </div>

        {/* Mobile Navigation Sub-bar for Admin */}
        <div className="md:hidden flex items-center justify-around border-t border-gray-100 px-4 py-2 bg-gray-50/90 text-xs font-semibold">
          <Link
            href="/admin/dashboard"
            className="px-3 py-1 rounded-full text-gray-700 hover:text-black hover:bg-white transition-colors"
          >
            Directory & Moderation
          </Link>
          <div className="w-px h-3.5 bg-gray-200" />
          <Link
            href="/admin/reports"
            className="px-3 py-1 rounded-full text-gray-700 hover:text-black hover:bg-white transition-colors"
          >
            Safety Reports
          </Link>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        {children}
      </main>
    </div>
  );
}
