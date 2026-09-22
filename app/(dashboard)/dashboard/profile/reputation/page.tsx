import React from 'react';
import Link from 'next/link';
import { createClientServer } from '@/lib/supabase-server';
import { Star, CheckCircle2, ShieldCheck, ArrowLeft, Package, Car, Lightbulb, HelpCircle, Award } from 'lucide-react';
import type { Profile } from '@/lib/database.types';

export const metadata = {
  title: 'Trust & Reputation | CampusNet',
};

export default async function ReputationPage() {
  const supabase = await createClientServer();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  // Fetch real profile and activity counts in parallel
  const [
    { data: profileData },
    { count: resourceCount },
    { count: rideCount },
    { count: needCount },
    { count: skillCount },
    { data: reviews },
  ] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', user.id).single(),
    supabase.from('resources').select('id', { count: 'exact', head: true }).eq('owner_id', user.id),
    supabase.from('rides').select('id', { count: 'exact', head: true }).eq('creator_id', user.id),
    supabase.from('needs').select('id', { count: 'exact', head: true }).eq('poster_id', user.id),
    supabase.from('skills').select('id', { count: 'exact', head: true }).eq('owner_id', user.id),
    supabase.from('reviews').select('*, reviewer:profiles!reviewer_id(full_name, avatar_url)').eq('target_id', user.id).limit(10),
  ]);

  const profile = profileData as Profile | null;
  const rating = profile?.rating && profile.rating > 0 ? profile.rating.toFixed(1) : null;
  const ratingCount = profile?.rating_count ?? 0;
  const isVerified = Boolean(profile?.is_verified);
  const totalContributions = (resourceCount ?? 0) + (rideCount ?? 0) + (skillCount ?? 0) + (needCount ?? 0);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Back button */}
      <div>
        <Link
          href="/dashboard/profile"
          className="text-xs text-gray-500 hover:text-black flex items-center gap-1.5 transition-colors mb-4"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Profile
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h1 className="text-3xl font-normal tracking-tight text-gray-900">Trust & Reputation</h1>
            <p className="text-sm text-gray-500 mt-1">Verified reputation built on real campus contributions and peer reviews.</p>
          </div>
          {isVerified && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-100 text-xs font-semibold w-fit">
              <ShieldCheck className="w-4 h-4" />
              Verified Student
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Rating Score Card */}
        <div className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-sm text-center space-y-6 lg:col-span-1 flex flex-col justify-between">
          <div>
            <div className="w-24 h-24 rounded-full bg-gray-50 border-4 border-white shadow-lg mx-auto flex flex-col items-center justify-center relative">
              {rating ? (
                <>
                  <span className="text-3xl font-extrabold text-gray-900">{rating}</span>
                  <div className="flex items-center gap-0.5 text-yellow-500 mt-0.5">
                    <Star className="w-3.5 h-3.5 fill-yellow-500" />
                  </div>
                </>
              ) : (
                <Award className="w-10 h-10 text-gray-400" />
              )}
              {isVerified && (
                <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-white p-1 rounded-full border-2 border-white shadow-sm">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
              )}
            </div>

            <div className="mt-4">
              <h3 className="text-lg font-bold text-gray-900">
                {rating ? `${rating} Rating` : 'Building Reputation'}
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">
                {ratingCount > 0 ? `Based on ${ratingCount} verified reviews` : 'Complete exchanges to earn ratings'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-4 border-t border-gray-100">
            <div className="p-3 bg-gray-50 rounded-2xl text-center">
              <p className="text-lg font-bold text-gray-900">{totalContributions}</p>
              <p className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider">Posts</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-2xl text-center">
              <p className="text-lg font-bold text-gray-900">{ratingCount}</p>
              <p className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider">Reviews</p>
            </div>
          </div>
        </div>

        {/* Real Activity Breakdown & Guidelines */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-sm space-y-6">
            <h2 className="text-base font-bold text-gray-900">Campus Contribution Breakdown</h2>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100/80 text-center">
                <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center mx-auto mb-2 text-gray-700 shadow-2xs">
                  <Package className="w-4 h-4" />
                </div>
                <p className="text-xl font-extrabold text-gray-900">{resourceCount ?? 0}</p>
                <p className="text-xs text-gray-500 mt-0.5">Resources</p>
              </div>

              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100/80 text-center">
                <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center mx-auto mb-2 text-gray-700 shadow-2xs">
                  <Car className="w-4 h-4" />
                </div>
                <p className="text-xl font-extrabold text-gray-900">{rideCount ?? 0}</p>
                <p className="text-xs text-gray-500 mt-0.5">Rides</p>
              </div>

              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100/80 text-center">
                <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center mx-auto mb-2 text-gray-700 shadow-2xs">
                  <Lightbulb className="w-4 h-4" />
                </div>
                <p className="text-xl font-extrabold text-gray-900">{skillCount ?? 0}</p>
                <p className="text-xs text-gray-500 mt-0.5">Skills</p>
              </div>

              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100/80 text-center">
                <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center mx-auto mb-2 text-gray-700 shadow-2xs">
                  <HelpCircle className="w-4 h-4" />
                </div>
                <p className="text-xl font-extrabold text-gray-900">{needCount ?? 0}</p>
                <p className="text-xs text-gray-500 mt-0.5">Requests</p>
              </div>
            </div>

            <div className="p-4 bg-amber-50/70 border border-amber-100 rounded-2xl space-y-1.5">
              <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wide">How Reputation Works</h4>
              <p className="text-xs text-amber-800 leading-relaxed">
                Reputation in CampusNet is 100% merit-based. Ratings are awarded exclusively by students after completing an exchange, sharing a ride, or receiving skill guidance. Fair pricing, punctual handoffs, and honest descriptions earn top ratings.
              </p>
            </div>
          </div>

          {/* Reviews & Activity Log */}
          <div className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-gray-900">Peer Reviews & Endorsements</h2>
            {reviews && reviews.length > 0 ? (
              <div className="space-y-3">
                {reviews.map((rev: any) => (
                  <div key={rev.id} className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{rev.reviewer?.full_name ?? 'Campus Student'}</p>
                      {rev.comment && <p className="text-xs text-gray-600 mt-1 italic">"{rev.comment}"</p>}
                    </div>
                    <div className="flex items-center gap-1 text-yellow-500 text-xs font-bold bg-white px-2.5 py-1 rounded-xl border border-gray-100">
                      <Star className="w-3.5 h-3.5 fill-yellow-500" />
                      <span>{rev.rating}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-gray-400 space-y-2">
                <p className="text-sm font-medium text-gray-700">No peer reviews yet</p>
                <p className="text-xs text-gray-500 max-w-sm mx-auto">
                  When other campus students borrow from you, share a ride, or collaborate, their feedback will appear here.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
