import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { ArrowLeft, MapPin, Clock, Star, ShieldCheck, Tag, AlertCircle, MessageSquare, Package } from 'lucide-react';
import { createClientServer } from '@/lib/supabase-server';
import { startConversation } from '@/app/actions/chat';
import { WhatsAppButton } from '@/components/ui/WhatsAppButton';
import { getWhatsAppUrl } from '@/lib/phone';

export default async function ResourceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClientServer();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: resource, error } = await supabase
    .from('resources')
    .select(`
      *,
      owner:profiles!owner_id(*),
      category:categories(*)
    `)
    .eq('id', id)
    .single();

  if (error || !resource) {
    return notFound();
  }

  const owner = resource.owner;
  const isOwner = user?.id === resource.owner_id;

  const hasWhatsApp = Boolean(owner?.whatsapp_enabled && owner?.phone_number);
  const whatsAppUrl = hasWhatsApp && owner?.phone_number
    ? getWhatsAppUrl(
        owner.phone_number,
        `Hi ${owner.full_name || 'there'}, I saw your listing on CampusNet: "${resource.title}". Is it still available?`
      )
    : null;

  async function handleMessage() {
    'use server';
    if (user?.id === resource.owner_id) return;
    await startConversation({
      targetUserId: resource.owner_id,
      resourceId: resource.id,
    });
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top back nav */}
      <div className="flex items-center gap-4">
        <Link
          href="/dashboard/resources"
          className="p-2 rounded-xl border border-gray-200 text-gray-500 hover:text-black hover:bg-gray-50 transition-all flex items-center gap-2 text-sm font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Resources</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="md:col-span-2 space-y-6">
          {/* Images */}
          <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm">
            {resource.image_urls && resource.image_urls.length > 0 ? (
              <div className="space-y-2">
                <div className="relative w-full h-80">
                  <Image
                    src={resource.image_urls[0]}
                    alt={resource.title}
                    fill
                    priority
                    sizes="(max-width: 768px) 100vw, 66vw"
                    className="object-cover"
                  />
                </div>
                {resource.image_urls.length > 1 && (
                  <div className="flex gap-2 p-3 overflow-x-auto">
                    {resource.image_urls.map((url: string, i: number) => (
                      <div key={i} className="relative w-20 h-20 rounded-xl overflow-hidden border border-gray-200 flex-shrink-0">
                        <Image
                          src={url}
                          alt=""
                          fill
                          sizes="80px"
                          className="object-cover"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="h-64 bg-gray-50 flex flex-col items-center justify-center text-gray-400">
                <Package className="w-16 h-16 mb-2 text-gray-300" />
                <span className="text-sm">No photo provided</span>
              </div>
            )}

            <div className="p-6 space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-semibold px-3 py-1 bg-black text-white rounded-full uppercase tracking-wider">
                  {resource.method ?? 'Available'}
                </span>
                {resource.category && (
                  <span className="text-xs font-medium px-3 py-1 bg-gray-100 text-gray-700 rounded-full">
                    {resource.category.name}
                  </span>
                )}
                {resource.condition && (
                  <span className="text-xs font-medium px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full">
                    {resource.condition} condition
                  </span>
                )}
              </div>

              <h1 className="text-2xl font-bold text-gray-900">{resource.title}</h1>

              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-gray-900">
                  {resource.price ? `₹${resource.price}` : 'Free'}
                </span>
                {resource.price_unit && resource.price_unit !== 'total' && (
                  <span className="text-sm text-gray-500 font-medium">/{resource.price_unit.replace('_', ' ')}</span>
                )}
              </div>

              {resource.description && (
                <div className="pt-4 border-t border-gray-100">
                  <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-2">Description</h2>
                  <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">{resource.description}</p>
                </div>
              )}

              {resource.terms && (
                <div className="pt-4 border-t border-gray-100">
                  <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-2">Terms & Guidelines</h2>
                  <p className="text-gray-600 text-xs leading-relaxed bg-amber-50 border border-amber-100 p-3 rounded-xl">
                    {resource.terms}
                  </p>
                </div>
              )}

              <div className="pt-4 border-t border-gray-100 flex flex-wrap gap-4 text-xs text-gray-500">
                {resource.location && (
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span>Location: {resource.location}</span>
                  </div>
                )}
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span>Posted {new Date(resource.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar: Owner Info & CTA */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm space-y-5">
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Offered By</h2>

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

            {/* Action Buttons */}
            {!isOwner ? (
              <div className="space-y-2.5">
                <form action={handleMessage}>
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
                  <p className="font-semibold text-gray-900">Your Resource Listing</p>
                  <p className="text-gray-500">You posted this item. Other students can view and message you to borrow, buy, or rent.</p>
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
