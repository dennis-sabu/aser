import React from 'react';
import Link from 'next/link';
import { BookOpen, Users, MapPin, Plus, Clock, HelpCircle, Car, Lightbulb, Package, ArrowRight, Star } from 'lucide-react';
import { createClientServer } from '@/lib/supabase-server';

export default async function DashboardHomePage() {
  const supabase = await createClientServer();
  const { data: { user } } = await supabase.auth.getUser();

  const displayName = user?.user_metadata?.full_name ?? user?.email?.split('@')[0] ?? 'Student';
  const firstName = displayName.split(' ')[0];
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  const initials = displayName.split(' ').map((n: string) => n[0]).slice(0, 2).join('').toUpperCase();

  // Load user-specific counts only when authenticated
  const userCountsPromise = user?.id
    ? Promise.all([
        supabase.from('resources').select('id', { count: 'exact', head: true }).eq('owner_id', user.id),
        supabase.from('needs').select('id', { count: 'exact', head: true }).eq('poster_id', user.id),
        supabase.from('rides').select('id', { count: 'exact', head: true }).eq('creator_id', user.id),
        supabase.from('skills').select('id', { count: 'exact', head: true }).eq('owner_id', user.id),
      ])
    : Promise.resolve([
        { count: 0 },
        { count: 0 },
        { count: 0 },
        { count: 0 },
      ]);

  // Load real data from live Supabase tables in parallel with minimal column selections
  const [
    { data: recentResources },
    { data: recentNeeds },
    { data: recentRides },
    { data: recentSkills },
    [
      { count: myResCount },
      { count: myNeedCount },
      { count: myRideCount },
      { count: mySkillCount },
    ],
  ] = await Promise.all([
    supabase
      .from('resources')
      .select('id, title, price, price_unit, method, condition, created_at, owner:profiles!owner_id(full_name, department)')
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .limit(4),
    supabase
      .from('needs')
      .select('id, title, budget_min, budget_max, created_at, poster:profiles!poster_id(full_name, department)')
      .eq('status', 'open')
      .order('created_at', { ascending: false })
      .limit(4),
    supabase
      .from('rides')
      .select('id, from_location, to_location, ride_date, ride_time, available_seats, estimated_cost, creator:profiles!creator_id(full_name)')
      .eq('status', 'active')
      .order('ride_date', { ascending: true })
      .limit(3),
    supabase
      .from('skills')
      .select('id, title, level, rate, rate_unit, availability, owner:profiles!owner_id(full_name, department)')
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(3),
    userCountsPromise,
  ]);

  const hubs = [
    { title: 'Resources', icon: BookOpen, path: '/dashboard/resources', desc: 'Borrow, buy or rent' },
    { title: 'I Need', icon: HelpCircle, path: '/dashboard/requests', desc: 'Ask campus for help' },
    { title: 'Rides', icon: Car, path: '/dashboard/rides', desc: 'Carpool & split costs' },
    { title: 'Skills', icon: Users, path: '/dashboard/skills', desc: 'Tutoring & exchange' },
  ];

  const totalUserListings = (myResCount ?? 0) + (myNeedCount ?? 0) + (myRideCount ?? 0) + (mySkillCount ?? 0);

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">
            {greeting}, {firstName}! 👋
          </h1>
          <p className="text-gray-500 mt-1 text-sm sm:text-base">What would you like to share or find today?</p>
        </div>
        <div className="flex gap-3 flex-wrap">
          <Link href="/dashboard/resources/create">
            <button className="flex items-center gap-2 bg-black text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-gray-800 transition-colors shadow-sm">
              <Plus className="w-4 h-4" />
              Post Resource
            </button>
          </Link>
          <Link href="/dashboard/requests/create">
            <button className="flex items-center gap-2 bg-white text-black border border-gray-200 px-5 py-2.5 rounded-full text-sm font-medium hover:bg-gray-50 transition-colors shadow-sm">
              <HelpCircle className="w-4 h-4" />
              Post Need
            </button>
          </Link>
        </div>
      </div>

      {/* Quick Action Hubs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {hubs.map((hub) => (
          <Link key={hub.title} href={hub.path} className="block">
            <div className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-5 hover:border-gray-300 hover:shadow-md transition-all group cursor-pointer">
              <div className="w-10 h-10 sm:w-11 sm:h-11 bg-gray-100 rounded-xl flex items-center justify-center mb-3 group-hover:bg-gray-200 transition-colors">
                <hub.icon className="w-5 h-5 text-gray-600" />
              </div>
              <h3 className="text-sm font-semibold text-gray-900 mb-0.5">{hub.title}</h3>
              <p className="text-xs text-gray-500 hidden sm:block">{hub.desc}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Recent Live Listings */}
        <div className="lg:col-span-2 space-y-6">
          {/* Recent Resources */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
                <Package className="w-4 h-4 text-gray-400" />
                Recent Resources
              </h2>
              <Link href="/dashboard/resources" className="text-xs text-gray-500 hover:text-black font-semibold transition-colors flex items-center gap-1">
                View all <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {recentResources && recentResources.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {recentResources.map((res: any) => (
                  <Link
                    key={res.id}
                    href={`/dashboard/resources/${res.id}`}
                    className="p-4 bg-white rounded-2xl border border-gray-100 hover:border-gray-300 hover:shadow-sm transition-all block group"
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-violet-50 text-violet-700 capitalize">
                        {res.method ?? 'Available'}
                      </span>
                      <span className="text-xs font-bold text-gray-900">
                        {res.price ? `₹${res.price}` : 'Free'}
                      </span>
                    </div>
                    <h3 className="font-semibold text-gray-900 text-sm truncate group-hover:text-black">{res.title}</h3>
                    <p className="text-xs text-gray-400 mt-1 truncate">
                      {res.owner?.full_name ? `By ${res.owner.full_name}` : 'Campus Listing'}
                    </p>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-6 text-center text-xs text-gray-400">
                No active resources yet. Be the first to list one!
              </div>
            )}
          </div>

          {/* Recent Needs */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-gray-400" />
                Recent Student Needs
              </h2>
              <Link href="/dashboard/requests" className="text-xs text-gray-500 hover:text-black font-semibold transition-colors flex items-center gap-1">
                View all <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {recentNeeds && recentNeeds.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {recentNeeds.map((need: any) => (
                  <Link
                    key={need.id}
                    href={`/dashboard/requests/${need.id}`}
                    className="p-4 bg-white rounded-2xl border border-gray-100 hover:border-gray-300 hover:shadow-sm transition-all block group"
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">
                        Need
                      </span>
                      <span className="text-xs text-gray-500 font-medium">
                        {need.budget_max ? `₹${need.budget_max}` : 'Open'}
                      </span>
                    </div>
                    <h3 className="font-semibold text-gray-900 text-sm truncate group-hover:text-black">{need.title}</h3>
                    <p className="text-xs text-gray-400 mt-1 truncate">
                      {need.poster?.full_name ? `Requested by ${need.poster.full_name}` : 'Student request'}
                    </p>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-6 text-center text-xs text-gray-400">
                No open student needs currently posted.
              </div>
            )}
          </div>

          {/* Recent Rides & Skills */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Rides */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
                  <Car className="w-4 h-4 text-gray-400" />
                  Upcoming Rides
                </h2>
                <Link href="/dashboard/rides" className="text-xs text-gray-400 hover:text-black font-medium">More</Link>
              </div>
              {recentRides && recentRides.length > 0 ? (
                <div className="space-y-2">
                  {recentRides.map((ride: any) => (
                    <Link
                      key={ride.id}
                      href={`/dashboard/rides/${ride.id}`}
                      className="p-3 bg-white rounded-xl border border-gray-100 hover:border-gray-300 transition-all block text-xs"
                    >
                      <p className="font-bold text-gray-900 truncate">
                        {ride.from_location} → {ride.to_location}
                      </p>
                      <div className="flex items-center justify-between text-gray-400 mt-1">
                        <span>{ride.ride_date}</span>
                        <span className="font-semibold text-gray-700">{ride.available_seats} seats left</span>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-xl border border-dashed border-gray-200 p-4 text-center text-xs text-gray-400">
                  No upcoming rides scheduled.
                </div>
              )}
            </div>

            {/* Skills */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
                  <Lightbulb className="w-4 h-4 text-gray-400" />
                  Featured Skills
                </h2>
                <Link href="/dashboard/skills" className="text-xs text-gray-400 hover:text-black font-medium">More</Link>
              </div>
              {recentSkills && recentSkills.length > 0 ? (
                <div className="space-y-2">
                  {recentSkills.map((sk: any) => (
                    <Link
                      key={sk.id}
                      href={`/dashboard/skills/${sk.id}`}
                      className="p-3 bg-white rounded-xl border border-gray-100 hover:border-gray-300 transition-all block text-xs"
                    >
                      <p className="font-bold text-gray-900 truncate">{sk.title}</p>
                      <div className="flex items-center justify-between text-gray-400 mt-1">
                        <span className="capitalize">{sk.level ?? 'Peer'}</span>
                        <span className="font-semibold text-gray-700">
                          {sk.rate ? `₹${sk.rate}/${sk.rate_unit || 'hr'}` : 'Free'}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-xl border border-dashed border-gray-200 p-4 text-center text-xs text-gray-400">
                  No skills listed yet.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: User Real Status & Shortcuts */}
        <div className="space-y-6">
          {/* User Card with real counts */}
          <div className="bg-black text-white rounded-3xl p-6 shadow-md">
            <div className="flex items-center gap-3.5 mb-5">
              <div className="w-12 h-12 rounded-full bg-white/15 flex items-center justify-center text-base font-bold flex-shrink-0">
                {initials}
              </div>
              <div className="min-w-0">
                <p className="font-bold truncate text-base">{displayName}</p>
                <p className="text-xs text-gray-400 truncate">{user?.email}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5 mb-5">
              <div className="bg-white/10 rounded-2xl p-3 text-center">
                <p className="text-2xl font-bold">{totalUserListings}</p>
                <p className="text-xs text-gray-300 mt-0.5">My Listings</p>
              </div>
              <div className="bg-white/10 rounded-2xl p-3 text-center">
                <p className="text-2xl font-bold">{myResCount ?? 0}</p>
                <p className="text-xs text-gray-300 mt-0.5">Resources</p>
              </div>
              <div className="bg-white/10 rounded-2xl p-3 text-center">
                <p className="text-2xl font-bold">{myRideCount ?? 0}</p>
                <p className="text-xs text-gray-300 mt-0.5">Rides</p>
              </div>
              <div className="bg-white/10 rounded-2xl p-3 text-center">
                <p className="text-2xl font-bold">{mySkillCount ?? 0}</p>
                <p className="text-xs text-gray-300 mt-0.5">Skills</p>
              </div>
            </div>

            <Link
              href="/dashboard/profile"
              className="w-full py-2.5 bg-white text-black hover:bg-gray-100 rounded-full text-xs font-bold transition-colors block text-center"
            >
              View Full Profile
            </Link>
          </div>

          {/* Quick Create Short Links */}
          <div className="bg-white rounded-3xl border border-gray-100 p-5 shadow-sm space-y-3">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Quick Actions</h3>
            <div className="space-y-1.5">
              <Link
                href="/dashboard/resources/create"
                className="flex items-center justify-between p-2.5 rounded-xl hover:bg-gray-50 transition-colors text-xs font-semibold text-gray-700"
              >
                <span className="flex items-center gap-2.5">
                  <Package className="w-4 h-4 text-violet-600" />
                  Post a Resource
                </span>
                <Plus className="w-3.5 h-3.5 text-gray-400" />
              </Link>
              <Link
                href="/dashboard/requests/create"
                className="flex items-center justify-between p-2.5 rounded-xl hover:bg-gray-50 transition-colors text-xs font-semibold text-gray-700"
              >
                <span className="flex items-center gap-2.5">
                  <HelpCircle className="w-4 h-4 text-emerald-600" />
                  Post a Need Request
                </span>
                <Plus className="w-3.5 h-3.5 text-gray-400" />
              </Link>
              <Link
                href="/dashboard/rides/create"
                className="flex items-center justify-between p-2.5 rounded-xl hover:bg-gray-50 transition-colors text-xs font-semibold text-gray-700"
              >
                <span className="flex items-center gap-2.5">
                  <Car className="w-4 h-4 text-amber-600" />
                  Offer a Ride
                </span>
                <Plus className="w-3.5 h-3.5 text-gray-400" />
              </Link>
              <Link
                href="/dashboard/skills/my-skills"
                className="flex items-center justify-between p-2.5 rounded-xl hover:bg-gray-50 transition-colors text-xs font-semibold text-gray-700"
              >
                <span className="flex items-center gap-2.5">
                  <Lightbulb className="w-4 h-4 text-sky-600" />
                  Offer a Skill
                </span>
                <Plus className="w-3.5 h-3.5 text-gray-400" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
