import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { ArrowLeft, Clock, Star, ShieldCheck, Lightbulb, MessageSquare } from 'lucide-react';
import { createClientServer } from '@/lib/supabase-server';
import { startConversation } from '@/app/actions/chat';
import { WhatsAppButton } from '@/components/ui/WhatsAppButton';
import { getWhatsAppUrl } from '@/lib/phone';

export default async function SkillDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClientServer();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: skill, error } = await supabase
    .from('skills')
    .select(`
      *,
      owner:profiles!owner_id(*),
      category:categories(*)
    `)
    .eq('id', id)
    .single();

  if (error || !skill) {
    return notFound();
  }

  const owner = skill.owner;
  const isOwner = user?.id === skill.owner_id;

  const hasWhatsApp = Boolean(owner?.whatsapp_enabled && owner?.phone_number);
  const whatsAppUrl = hasWhatsApp && owner?.phone_number
    ? getWhatsAppUrl(
        owner.phone_number,
        `Hi ${owner.full_name || 'there'}, I saw your skill on CampusNet: "${skill.title}". I would love to connect!`
      )
    : null;

  async function handleContact() {
    'use server';
    if (user?.id === skill.owner_id) return;
    await startConversation({
      targetUserId: skill.owner_id,
      skillId: skill.id,
    });
  }

  const rateLabel =
    skill.rate_unit === 'free' || !skill.rate
      ? 'Free'
      : skill.rate_unit === 'exchange'
      ? 'Skill Exchange'
      : `₹${skill.rate}/${skill.rate_unit === 'per_hour' ? 'hr' : skill.rate_unit === 'per_session' ? 'session' : 'hr'}`;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/dashboard/skills"
          className="p-2 rounded-xl border border-gray-200 text-gray-500 hover:text-black hover:bg-gray-50 transition-all flex items-center gap-2 text-sm font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Skills</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm space-y-6">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold px-3 py-1 bg-violet-100 text-violet-800 rounded-full uppercase tracking-wider">
                Skill Offering
              </span>
              {skill.category && (
                <span className="text-xs font-medium px-3 py-1 bg-gray-100 text-gray-700 rounded-full">
                  {skill.category.name}
                </span>
              )}
              {skill.level && (
                <span className="text-xs font-medium px-3 py-1 bg-sky-50 text-sky-700 rounded-full capitalize">
                  {skill.level} Level
                </span>
              )}
            </div>

            <h1 className="text-2xl font-bold text-gray-900">{skill.title}</h1>

            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-gray-900">{rateLabel}</span>
            </div>

            {skill.description && (
              <div className="pt-4 border-t border-gray-100">
                <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-2">About this Skill</h2>
                <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">{skill.description}</p>
              </div>
            )}

            <div className="pt-4 border-t border-gray-100 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-gray-600">
              {skill.availability && (
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span>Availability: <strong className="capitalize text-gray-900">{skill.availability}</strong></span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <span className="text-gray-400">Listed:</span>
                <span>{new Date(skill.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar: Owner Info & CTA */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm space-y-5">
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Mentor / Tutor</h2>

            {owner ? (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  {owner.avatar_url ? (
                    <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                      <Image src={owner.avatar_url} alt={owner.full_name} fill sizes="48px" className="object-cover" />
                    </div>
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center font-bold text-base">
                      {owner.full_name?.[0]?.toUpperCase() ?? 'U'}
                    </div>
                  )}
                  <div>
                    <div className="flex items-center gap-1.5">
                      <p className="font-bold text-gray-900 text-base">{owner.full_name}</p>
                      {owner.is_verified && (
                        <span title="Verified Student">
                          <ShieldCheck className="w-4 h-4 text-emerald-500" />
                        </span>
                      )}
                    </div>
                    {owner.department && (
                      <p className="text-xs text-gray-500">
                        {owner.department} {owner.year ? `· ${owner.year}` : ''}
                      </p>
                    )}
                    {owner.college && (
                      <p className="text-xs text-gray-400 mt-0.5">{owner.college}</p>
                    )}
                  </div>
                </div>

                {owner.rating && owner.rating > 0 ? (
                  <div className="flex items-center gap-2 bg-yellow-50 px-3 py-1.5 rounded-xl border border-yellow-100 w-fit">
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    <span className="text-xs font-bold text-yellow-900">{owner.rating.toFixed(1)}</span>
                    <span className="text-xs text-yellow-700">({owner.rating_count ?? 1} reviews)</span>
                  </div>
                ) : null}

                {owner.bio && (
                  <p className="text-xs text-gray-600 bg-gray-50 p-3 rounded-xl italic">"{owner.bio}"</p>
                )}
              </div>
            ) : (
              <p className="text-sm text-gray-500">Campus Student</p>
            )}

            {!isOwner ? (
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
                  <p className="font-semibold text-gray-900">Your Skill Listing</p>
                  <p className="text-gray-500">You posted this skill. Other students will view it and contact you to request mentorship or exchange.</p>
                </div>
                <div className="pt-2.5 border-t border-gray-200 flex items-center justify-between text-xs">
                  <span className="text-gray-600 font-medium">WhatsApp Contact</span>
                  {hasWhatsApp ? (
                    <span className="inline-flex items-center gap-1.5 font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      Active for students
                    </span>
                  ) : owner?.phone_number ? (
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
