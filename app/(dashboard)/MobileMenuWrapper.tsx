'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Menu, X, BookOpen, Car, Users, HelpCircle, MessageSquare, User, Shield, LogOut } from 'lucide-react';
import { signOut } from '@/app/actions/auth';

const NAV_LINKS = [
  { href: '/dashboard/resources', label: 'Resources', icon: BookOpen },
  { href: '/dashboard/requests', label: 'I Need', icon: HelpCircle },
  { href: '/dashboard/rides', label: 'Rides', icon: Car },
  { href: '/dashboard/skills', label: 'Skills', icon: Users },
  { href: '/dashboard/chat', label: 'Chat', icon: MessageSquare },
  { href: '/dashboard/profile', label: 'My Profile', icon: User },
];

export function MobileMenuWrapper({
  isAdmin = false,
  userName,
  userEmail,
  userInitials,
}: {
  isAdmin?: boolean;
  userName?: string;
  userEmail?: string;
  userInitials?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors flex-shrink-0"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle menu"
      >
        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40 bg-black/30 backdrop-blur-xs md:hidden animate-fade-in-overlay"
            onClick={() => setIsOpen(false)}
          />
          {/* Drawer */}
          <div className="fixed top-0 right-0 z-50 h-full w-80 max-w-[85vw] bg-white shadow-2xl md:hidden animate-slide-in-right flex flex-col justify-between">
            <div>
              {/* Header */}
              <div className="flex items-center justify-between p-4 sm:p-5 border-b border-gray-100">
                <span className="font-bold text-gray-900 text-base">Menu</span>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* User info snippet if present */}
              {userName && (
                <div className="p-4 mx-3 my-2 bg-gray-50 rounded-2xl flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
                    {userInitials || 'S'}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-gray-900 truncate">{userName}</p>
                    {userEmail && <p className="text-xs text-gray-500 truncate">{userEmail}</p>}
                  </div>
                </div>
              )}

              {/* Nav links */}
              <nav className="p-3 space-y-1 overflow-y-auto max-h-[calc(100dvh-15rem)]">
                {NAV_LINKS.map(({ href, label, icon: Icon }) => (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-2xl text-gray-700 hover:bg-gray-100 hover:text-black transition-colors font-medium text-sm"
                  >
                    <Icon className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <span>{label}</span>
                  </Link>
                ))}

                {isAdmin && (
                  <div className="pt-2 mt-2 border-t border-gray-100">
                    <Link
                      href="/admin/dashboard"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl bg-black text-white hover:bg-gray-800 transition-colors font-semibold text-sm"
                    >
                      <Shield className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      <span>Admin Portal</span>
                    </Link>
                  </div>
                )}
              </nav>
            </div>

            {/* Bottom Sign-out button */}
            <div className="p-4 border-t border-gray-100 bg-gray-50/50">
              <form action={signOut}>
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold text-red-600 bg-red-50 hover:bg-red-100 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </form>
            </div>
          </div>
        </>
      )}
    </>
  );
}
