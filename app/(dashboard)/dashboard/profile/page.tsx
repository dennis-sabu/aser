import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { createClientServer } from '@/lib/supabase-server';
import { Package, Car, Lightbulb, Settings, Edit3, ShieldCheck, Star, HelpCircle } from 'lucide-react';
import type { Profile } from '@/lib/database.types';

export default async function ProfilePage() {
  const supabase = await createClientServer();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  // Fetch profile and all 4 domain counts in parallel
  const [
    { data: profileData, error: profileErr },
    { count: resourceCount },
    { count: needCount },
    { count: rideCount },
    { count: skillCount },
  ] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', user.id).single(),
    supabase.from('resources').select('id', { count: 'exact', head: true }).eq('owner_id', user.id),
    supabase.from('needs').select('id', { count: 'exact', head: true }).eq('poster_id', user.id),
    supabase.from('rides').select('id', { count: 'exact', head: true }).eq('creator_id', user.id),
    supabase.from('skills').select('id', { count: 'exact', head: true }).eq('owner_id', user.id),
  ]);

  if (profileErr) {
    console.error('[ProfilePage] Error fetching profile:', profileErr);
  }

  const profile = profileData as Profile | null;

  const fullName = profile?.full_name ?? user.user_metadata?.full_name ?? user.email?.split('@')[0] ?? 'Student';
  const initials = fullName
    .split(' ')
    .map((n: string) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Profile Card */}
      <div className="bg-white rounded-3xl border border-gray-100 p-5 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
          {profile?.avatar_url ? (
            <div className="relative w-16 h-16 sm:w-24 sm:h-24 rounded-full overflow-hidden border-2 border-gray-100 flex-shrink-0">
              <Image
                src={profile.avatar_url}
                alt={fullName}
                fill
                sizes="(max-width: 640px) 64px, 96px"
                className="object-cover"
              />
            </div>
          ) : (
            <div className="w-16 h-16 sm:w-24 sm:h-24 rounded-full bg-black text-white flex items-center justify-center text-xl sm:text-3xl font-bold flex-shrink-0">
              {initials}
            </div>
          )}

          <div className="flex-1 min-w-0 w-full">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-xl sm:text-2xl font-bold text-gray-900 truncate">{fullName}</h1>
                  {profile?.is_verified && (
                    <span className="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full text-xs font-semibold">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      Verified
                    </span>
                  )}
                </div>

                {(profile?.department || profile?.year) && (
                  <p className="text-gray-600 text-sm mt-1">
                    {profile.department ?? 'Campus'}{profile.year ? ` · ${profile.year}` : ''}
                  </p>
                )}

                {profile?.college && (
                  <p className="text-gray-400 text-xs mt-0.5">{profile.college}</p>
                )}

                {profile?.student_id && (
                  <p className="text-gray-400 text-xs mt-0.5">Student ID: {profile.student_id}</p>
                )}

                <p className="text-gray-400 text-xs mt-0.5 truncate">{user.email}</p>
              </div>

              <Link href="/dashboard/profile/settings" className="w-full sm:w-auto flex-shrink-0">
                <button className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 sm:px-3 sm:py-2 text-sm text-gray-700 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors font-medium">
                  <Settings className="w-4 h-4" />
                  Edit Profile
                </button>
              </Link>
            </div>

            {/* Rating */}
            {profile && profile.rating > 0 ? (
              <div className="flex items-center gap-2 mt-4 bg-yellow-50 px-3 py-1.5 rounded-xl border border-yellow-100 w-fit">
                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                <span className="text-sm font-bold text-yellow-900">{profile.rating.toFixed(1)}</span>
                <span className="text-xs text-yellow-700">({profile.rating_count ?? 1} reviews)</span>
              </div>
            ) : null}

            {/* Real Domain Activity Counts */}
            <div className="grid grid-cols-4 gap-1.5 sm:gap-4 mt-6 pt-6 border-t border-gray-100">
              <div className="text-center">
                <p className="text-lg sm:text-2xl font-bold text-gray-900">{resourceCount ?? 0}</p>
                <p className="text-[11px] sm:text-xs text-gray-400 mt-0.5 truncate">Resources</p>
              </div>
              <div className="text-center border-l border-gray-100">
                <p className="text-lg sm:text-2xl font-bold text-gray-900">{needCount ?? 0}</p>
                <p className="text-[11px] sm:text-xs text-gray-400 mt-0.5 truncate">Needs</p>
              </div>
              <div className="text-center border-l border-gray-100">
                <p className="text-lg sm:text-2xl font-bold text-gray-900">{rideCount ?? 0}</p>
                <p className="text-[11px] sm:text-xs text-gray-400 mt-0.5 truncate">Rides</p>
              </div>
              <div className="text-center border-l border-gray-100">
                <p className="text-lg sm:text-2xl font-bold text-gray-900">{skillCount ?? 0}</p>
                <p className="text-[11px] sm:text-xs text-gray-400 mt-0.5 truncate">Skills</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'My Resources', count: resourceCount, icon: Package, href: '/dashboard/resources/manage', bg: 'bg-violet-50', iconColor: 'text-violet-600' },
          { label: 'My Requests', count: needCount, icon: HelpCircle, href: '/dashboard/requests', bg: 'bg-emerald-50', iconColor: 'text-emerald-600' },
          { label: 'My Rides', count: rideCount, icon: Car, href: '/dashboard/rides', bg: 'bg-amber-50', iconColor: 'text-amber-600' },
          { label: 'My Skills', count: skillCount, icon: Lightbulb, href: '/dashboard/skills/my-skills', bg: 'bg-sky-50', iconColor: 'text-sky-600' },
        ].map(item => (
          <Link key={item.label} href={item.href} className="block">
            <div className="bg-white rounded-2xl border border-gray-100 p-4 text-center hover:border-gray-300 hover:shadow-sm transition-all group cursor-pointer">
              <div className={`w-10 h-10 ${item.bg} rounded-xl flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform`}>
                <item.icon className={`w-4 h-4 ${item.iconColor}`} />
              </div>
              <p className="text-sm font-semibold text-gray-900">{item.label}</p>
              <p className="text-xs text-gray-400 mt-0.5">{item.count ?? 0} active</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Bio / About */}
      <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-gray-900 text-base">About</h2>
          <Link href="/dashboard/profile/settings" className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-black transition-colors font-medium">
            <Edit3 className="w-3.5 h-3.5" />
            Edit Bio
          </Link>
        </div>
        {profile?.bio ? (
          <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">{profile.bio}</p>
        ) : (
          <p className="text-sm text-gray-400 italic">
            No bio yet.{' '}
            <Link href="/dashboard/profile/settings" className="underline underline-offset-2 hover:text-black transition-colors">
              Add one
            </Link>{' '}
            to let fellow students know about you and your academic interests.
          </p>
        )}
      </div>
    </div>
  );
}
