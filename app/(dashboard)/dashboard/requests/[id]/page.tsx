import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { ArrowLeft, MapPin, Clock, Star, ShieldCheck, HelpCircle, MessageSquare, AlertCircle } from 'lucide-react';
import { createClientServer } from '@/lib/supabase-server';
import { startConversation } from '@/app/actions/chat';
import { WhatsAppButton } from '@/components/ui/WhatsAppButton';
import { getWhatsAppUrl } from '@/lib/phone';

export default async function NeedDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClientServer();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: need, error } = await supabase
    .from('needs')
    .select(`
      *,
      poster:profiles!poster_id(*),
      category:categories(*)
    `)
    .eq('id', id)
    .single();

  if (error || !need) {
    return notFound();
  }

  const poster = need.poster;
  const isPoster = user?.id === need.poster_id;

  const hasWhatsApp = Boolean(poster?.whatsapp_enabled && poster?.phone_number);
  const whatsAppUrl = hasWhatsApp && poster?.phone_number
    ? getWhatsAppUrl(
        poster.phone_number,
        `Hi ${poster.full_name || 'there'}, I saw your request on CampusNet: "${need.title}". I might be able to help!`
      )
    : null;

  async function handleContact() {
    'use server';
    if (user?.id === need.poster_id) return;
    await startConversation({
      targetUserId: need.poster_id,
      needId: need.id,
    });
  }

  const budgetLabel =
    need.budget_min && need.budget_max
      ? `₹${need.budget_min} – ₹${need.budget_max}`
      : need.budget_max
      ? `Up to ₹${need.budget_max}`
      : need.budget_min
      ? `From ₹${need.budget_min}`
      : 'Open / Free';

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/dashboard/requests"
          className="p-2 rounded-xl border border-gray-200 text-gray-500 hover:text-black hover:bg-gray-50 transition-all flex items-center gap-2 text-sm font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Requests</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm">
            {need.image_url ? (
              <div className="relative w-full h-72">
                <Image
                  src={need.image_url}
                  alt={need.title}
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 66vw"
                  className="object-cover"
                />
              </div>
            ) : null}

            <div className="p-6 space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-semibold px-3 py-1 bg-amber-100 text-amber-800 rounded-full uppercase tracking-wider">
                  Need Request
                </span>
                {need.category && (
                  <span className="text-xs font-medium px-3 py-1 bg-gray-100 text-gray-700 rounded-full">
                    {need.category.name}
                  </span>
                )}
                {need.status && (
                  <span className="text-xs font-medium px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full capitalize">
                    {need.status}
                  </span>
                )}
              </div>

              <h1 className="text-2xl font-bold text-gray-900">{need.title}</h1>

              <div className="flex items-baseline gap-2">
                <span className="text-sm text-gray-500">Budget:</span>
                <span className="text-2xl font-extrabold text-gray-900">{budgetLabel}</span>
              </div>

              {need.description && (
                <div className="pt-4 border-t border-gray-100">
                  <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-2">Details</h2>
                  <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">{need.description}</p>
                </div>
              )}

              <div className="pt-4 border-t border-gray-100 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-gray-600">
                {need.duration && (
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400">Duration:</span>
                    <span className="font-semibold text-gray-800">{need.duration}</span>
                  </div>
                )}
                {need.deadline && (
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-amber-600" />
                    <span className="text-amber-800 font-medium">Needed by {new Date(need.deadline).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                  </div>
                )}
                {need.location && (
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span>Location: {need.location}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <span className="text-gray-400">Posted:</span>
                  <span>{new Date(need.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar: Poster Info & CTA */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm space-y-5">
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Posted By</h2>

            {poster ? (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  {poster.avatar_url ? (
                    <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                      <Image src={poster.avatar_url} alt={poster.full_name} fill sizes="48px" className="object-cover" />
                    </div>
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center font-bold text-base">
                      {poster.full_name?.[0]?.toUpperCase() ?? 'U'}
                    </div>
                  )}
                  <div>
                    <div className="flex items-center gap-1.5">
                      <p className="font-bold text-gray-900 text-base">{poster.full_name}</p>
                      {poster.is_verified && (
                        <span title="Verified Student">
                          <ShieldCheck className="w-4 h-4 text-emerald-500" />
                        </span>
                      )}
                    </div>
                    {poster.department && (
                      <p className="text-xs text-gray-500">
                        {poster.department} {poster.year ? `· ${poster.year}` : ''}
                      </p>
                    )}
                    {poster.college && (
                      <p className="text-xs text-gray-400 mt-0.5">{poster.college}</p>
                    )}
                  </div>
                </div>

                {poster.rating && poster.rating > 0 ? (
                  <div className="flex items-center gap-2 bg-yellow-50 px-3 py-1.5 rounded-xl border border-yellow-100 w-fit">
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    <span className="text-xs font-bold text-yellow-900">{poster.rating.toFixed(1)}</span>
                    <span className="text-xs text-yellow-700">({poster.rating_count ?? 1} reviews)</span>
                  </div>
                ) : null}

                {poster.bio && (
                  <p className="text-xs text-gray-600 bg-gray-50 p-3 rounded-xl italic">"{poster.bio}"</p>
                )}
              </div>
            ) : (
              <p className="text-sm text-gray-500">Campus Student</p>
            )}

            {!isPoster ? (
              <div className="space-y-2.5">
                <form action={handleContact}>
                  <button
                    type="submit"
                    className="w-full py-3.5 bg-black hover:bg-gray-800 text-white rounded-2xl font-semibold text-sm transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg active:scale-[0.99]"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>CampusNet Chat</span>
                  </button>
                </form>

                {whatsAppUrl && (
                  <WhatsAppButton href={whatsAppUrl} />
                )}
              </div>
            ) : (
              <div className="p-4 bg-gray-50 border border-gray-200 text-gray-700 text-xs rounded-2xl space-y-2.5">
                <div className="text-center space-y-1">
                  <p className="font-semibold text-gray-900">Your Request</p>
                  <p className="text-gray-500">You posted this request. Other students will view it and contact you to offer help.</p>
                </div>
                <div className="pt-2.5 border-t border-gray-200 flex items-center justify-between text-xs">
                  <span className="text-gray-600 font-medium">WhatsApp Contact</span>
                  {hasWhatsApp ? (
                    <span className="inline-flex items-center gap-1.5 font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      Active for students
                    </span>
                  ) : poster?.phone_number ? (
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
