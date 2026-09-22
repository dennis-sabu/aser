import React from 'react';
import Link from 'next/link';
import { Bell, Network, MessageSquare, User, LogOut, Shield } from 'lucide-react';
import { createClientServer } from '@/lib/supabase-server';
import { signOut } from '@/app/actions/auth';
import { MobileMenuWrapper } from '@/app/(dashboard)/MobileMenuWrapper';
import { isAdmin } from '@/lib/admin';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClientServer();
  const { data: { user } } = await supabase.auth.getUser();

  const userIsAdmin = isAdmin(user);
  const displayName = user?.user_metadata?.full_name ?? user?.email?.split('@')[0] ?? 'Student';
  const initials = displayName
    .split(' ')
    .map((n: string) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/dashboard" className="flex items-center gap-2">
              <Network className="w-4 h-4 text-black flex-shrink-0" />
              <span className="text-base font-bold tracking-tight">CampusNet</span>
            </Link>

            <div className="hidden md:flex items-center gap-1">
              <Link href="/dashboard/resources" className="px-3.5 py-1.5 text-sm font-medium text-gray-600 hover:text-black hover:bg-gray-100 rounded-full transition-all">Resources</Link>
              <Link href="/dashboard/requests" className="px-3.5 py-1.5 text-sm font-medium text-gray-600 hover:text-black hover:bg-gray-100 rounded-full transition-all">I Need</Link>
              <Link href="/dashboard/rides" className="px-3.5 py-1.5 text-sm font-medium text-gray-600 hover:text-black hover:bg-gray-100 rounded-full transition-all">Rides</Link>
              <Link href="/dashboard/skills" className="px-3.5 py-1.5 text-sm font-medium text-gray-600 hover:text-black hover:bg-gray-100 rounded-full transition-all">Skills</Link>
              <Link href="/dashboard/chat" className="px-3.5 py-1.5 text-sm font-medium text-gray-600 hover:text-black hover:bg-gray-100 rounded-full transition-all flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5" />
                Chat
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-3">
            {userIsAdmin && (
              <Link
                href="/admin/dashboard"
                className="hidden sm:flex items-center gap-1.5 px-3 py-1 bg-black text-white text-xs font-semibold rounded-full hover:bg-gray-800 transition-colors shadow-sm"
                title="Open Admin Portal"
              >
                <Shield className="w-3.5 h-3.5 text-emerald-400" />
                <span>Admin</span>
              </Link>
            )}

            <button className="p-2 text-gray-600 hover:text-black hover:bg-gray-100 rounded-full transition-all relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-orange-500 rounded-full border-2 border-white" />
            </button>

            <Link
              href="/dashboard/profile"
              className="p-2 text-gray-600 hover:text-black hover:bg-gray-100 rounded-full transition-all"
              title="Profile"
            >
              <User className="w-5 h-5" />
            </Link>

            {/* User avatar + sign out (desktop) */}
            <div className="hidden md:flex items-center gap-2">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <div className="w-7 h-7 rounded-full bg-black text-white flex items-center justify-center text-xs font-bold">
                  {initials}
                </div>
                <span className="font-medium text-gray-800 max-w-[120px] truncate">{displayName}</span>
              </div>
              <form action={signOut}>
                <button
                  type="submit"
                  title="Sign out"
                  className="flex items-center gap-1.5 px-4 py-1.5 text-sm text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-full transition-all"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </form>
            </div>

            {/* Mobile hamburger */}
            <MobileMenuWrapper
              isAdmin={userIsAdmin}
              userName={displayName}
              userEmail={user?.email}
              userInitials={initials}
            />
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {children}
      </main>
    </div>
  );
}
