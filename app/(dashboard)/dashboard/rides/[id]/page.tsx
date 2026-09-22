import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowRight, MapPin, Clock, Users, Car, Star, ShieldCheck, MessageSquare } from 'lucide-react';
import { createClientServer } from '@/lib/supabase-server';
import { startConversation } from '@/app/actions/chat';
import { WhatsAppButton } from '@/components/ui/WhatsAppButton';
import { getWhatsAppUrl } from '@/lib/phone';

export default async function RideDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClientServer();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: ride, error } = await supabase
    .from('rides')
    .select(`
      *,
      creator:profiles!creator_id(*)
    `)
    .eq('id', id)
    .single();

  if (error || !ride) {
    return notFound();
  }

  const creator = ride.creator;
  const isCreator = user?.id === ride.creator_id;

  const hasWhatsApp = Boolean(creator?.whatsapp_enabled && creator?.phone_number);
  const whatsAppUrl = hasWhatsApp && creator?.phone_number
    ? getWhatsAppUrl(
        creator.phone_number,
        `Hi ${creator.full_name || 'there'}, I saw your ride offer on CampusNet: "${ride.from_location} → ${ride.to_location}". Are there seats available?`
      )
    : null;

  async function handleContact() {
    'use server';
    if (user?.id === ride.creator_id) return;
    await startConversation({
      targetUserId: ride.creator_id,
      rideId: ride.id,
    });
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/dashboard/rides"
          className="p-2 rounded-xl border border-gray-200 text-gray-500 hover:text-black hover:bg-gray-50 transition-all flex items-center gap-2 text-sm font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Rides</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold px-3 py-1 bg-green-50 text-green-700 rounded-full uppercase tracking-wider">
                {ride.status}
              </span>
              <span className="text-2xl font-bold text-gray-900">
                {ride.estimated_cost ? `₹${ride.estimated_cost}` : 'Free'}
                <span className="text-xs text-gray-400 font-normal"> / seat</span>
              </span>
            </div>

            {/* Route Map Visual */}
            <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100 space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-3 h-3 rounded-full bg-green-500 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-400">Pickup Location</p>
                  <p className="font-semibold text-gray-900 text-base">{ride.from_location}</p>
                </div>
              </div>
              <div className="border-l-2 border-dashed border-gray-300 ml-1.5 h-6" />
              <div className="flex items-start gap-3">
                <div className="w-3 h-3 rounded-full bg-red-500 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-400">Dropoff Destination</p>
                  <p className="font-semibold text-gray-900 text-base">{ride.to_location}</p>
                </div>
              </div>
            </div>

            {/* Key Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div className="p-3.5 bg-gray-50 rounded-2xl border border-gray-100">
                <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Departure</span>
                </div>
                <p className="text-sm font-bold text-gray-900">
                  {new Date(ride.ride_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                </p>
                <p className="text-xs text-gray-500">{ride.ride_time?.slice(0, 5)}</p>
              </div>

              <div className="p-3.5 bg-gray-50 rounded-2xl border border-gray-100">
                <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-1">
                  <Users className="w-3.5 h-3.5" />
                  <span>Seats Available</span>
                </div>
                <p className="text-sm font-bold text-gray-900">
                  {ride.available_seats} of {ride.total_seats}
                </p>
                <p className="text-xs text-gray-500">remaining</p>
              </div>

              <div className="p-3.5 bg-gray-50 rounded-2xl border border-gray-100">
                <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-1">
                  <Car className="w-3.5 h-3.5" />
                  <span>Vehicle</span>
                </div>
                <p className="text-sm font-bold text-gray-900 capitalize">
                  {ride.vehicle_type ?? 'Standard'}
                </p>
                <p className="text-xs text-gray-500">ride type</p>
              </div>
            </div>

            {ride.notes && (
              <div className="pt-4 border-t border-gray-100">
                <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-2">Driver Notes</h2>
                <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-line bg-gray-50 p-4 rounded-2xl border border-gray-100">
                  {ride.notes}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar: Creator Profile & CTA */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm space-y-5">
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Driver / Creator</h2>

            {creator ? (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  {creator.avatar_url ? (
                    <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                      <Image src={creator.avatar_url} alt={creator.full_name} fill sizes="48px" className="object-cover" />
                    </div>
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center font-bold text-base">
                      {creator.full_name?.[0]?.toUpperCase() ?? 'U'}
                    </div>
                  )}
                  <div>
                    <div className="flex items-center gap-1.5">
                      <p className="font-bold text-gray-900 text-base">{creator.full_name}</p>
                      {creator.is_verified && (
                        <span title="Verified Student">
                          <ShieldCheck className="w-4 h-4 text-emerald-500" />
                        </span>
                      )}
                    </div>
                    {creator.department && (
                      <p className="text-xs text-gray-500">
                        {creator.department} {creator.year ? `· ${creator.year}` : ''}
                      </p>
                    )}
                    {creator.college && (
                      <p className="text-xs text-gray-400 mt-0.5">{creator.college}</p>
                    )}
                  </div>
                </div>

                {creator.rating && creator.rating > 0 ? (
                  <div className="flex items-center gap-2 bg-yellow-50 px-3 py-1.5 rounded-xl border border-yellow-100 w-fit">
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    <span className="text-xs font-bold text-yellow-900">{creator.rating.toFixed(1)}</span>
                    <span className="text-xs text-yellow-700">({creator.rating_count ?? 1} rides)</span>
                  </div>
                ) : null}

                {creator.bio && (
                  <p className="text-xs text-gray-600 bg-gray-50 p-3 rounded-xl italic">"{creator.bio}"</p>
                )}
              </div>
            ) : (
              <p className="text-sm text-gray-500">Campus Driver</p>
            )}

            {!isCreator ? (
              <div className="space-y-2.5">
                <form action={handleContact}>
                  <button
                    type="submit"
                    disabled={ride.available_seats === 0}
                    className="w-full py-3.5 bg-black hover:bg-gray-800 disabled:opacity-50 text-white rounded-2xl font-semibold text-sm transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg active:scale-[0.99]"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>{ride.available_seats === 0 ? 'Ride Full' : 'CampusNet Chat'}</span>
                  </button>
                </form>

                {whatsAppUrl && ride.available_seats > 0 && (
                  <WhatsAppButton href={whatsAppUrl} />
                )}
              </div>
            ) : (
              <div className="p-4 bg-gray-50 border border-gray-200 text-gray-700 text-xs rounded-2xl space-y-2.5">
                <div className="text-center space-y-1">
                  <p className="font-semibold text-gray-900">Your Ride Offer</p>
                  <p className="text-gray-500">You posted this ride. Other students can view and contact you to request seats.</p>
                </div>
                <div className="pt-2.5 border-t border-gray-200 flex items-center justify-between text-xs">
                  <span className="text-gray-600 font-medium">WhatsApp Contact</span>
                  {hasWhatsApp ? (
                    <span className="inline-flex items-center gap-1.5 font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      Active for students
                    </span>
                  ) : creator?.phone_number ? (
                    <Link href="/dashboard/profile/settings" className="inline-flex items-center gap-1 text-amber-700 hover:text-amber-800 font-semibold underline">
                      Disabled · Turn on in Settings
                    </Link>
                  ) : (
                    <Link href="/dashboard/profile/settings" className="inline-flex items-center gap-1 text-gray-500 hover:text-gray-800 underline">
                      Add phone in Settings
                    </Link>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
