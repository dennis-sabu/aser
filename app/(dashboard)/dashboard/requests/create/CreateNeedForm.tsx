'use client';

import React, { useActionState, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, AlertCircle, Loader2 } from 'lucide-react';
import { createNeed, ActionState } from '@/app/actions/listings';

const INIT: ActionState = { error: null, success: false };

export default function CreateNeedPage({
  categoryMap,
}: {
  categoryMap: Record<string, string>;
}) {
  const [state, formAction, isPending] = useActionState(createNeed, INIT);
  const [categorySlug, setCategorySlug] = useState('');

  const CATS = [
    { label: 'Electronics', slug: 'electronics' },
    { label: 'Books', slug: 'books' },
    { label: 'Tools', slug: 'tools' },
    { label: 'Lab Equipment', slug: 'lab-equipment' },
    { label: 'Cameras', slug: 'cameras' },
    { label: 'Other', slug: 'other' },
  ];

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/requests" className="p-2 rounded-xl border border-gray-200 text-gray-500 hover:text-black hover:bg-gray-50 transition-all">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Post a Need</h1>
          <p className="text-sm text-gray-500 mt-0.5">Tell the campus what you are looking for</p>
        </div>
      </div>

      {state.error && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {state.error}
        </div>
      )}

      <form action={formAction} className="space-y-6">
        <input type="hidden" name="category_id" value={categoryMap[categorySlug] ?? ''} />

        {/* What do you need */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
          <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">What do you need?</h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {CATS.map((cat) => (
              <button
                key={cat.slug} type="button" onClick={() => setCategorySlug(cat.slug)}
                className={`p-3 rounded-xl border-2 transition-all text-sm font-medium text-left ${
                  categorySlug === cat.slug ? 'border-black bg-black text-white' : 'border-gray-100 hover:border-gray-300 text-gray-700'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">What exactly? <span className="text-red-500">*</span></label>
            <input required name="title" placeholder="e.g. Need Arduino Uno for 2 days for a project..."
              className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black focus:bg-white transition-all" />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">More details</label>
            <textarea name="description" rows={3} placeholder="When do you need it? For how long? Any specific requirements?"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black focus:bg-white transition-all resize-none" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Duration needed</label>
              <input name="duration" placeholder="e.g. 2 days, 1 week"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black focus:bg-white transition-all" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Needed by</label>
              <input name="deadline" type="date"
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black focus:bg-white transition-all" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Budget Min (₹)</label>
              <input name="budget_min" type="number" min="0" placeholder="0"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black focus:bg-white transition-all" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Budget Max (₹)</label>
              <input name="budget_max" type="number" min="0" placeholder="500"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black focus:bg-white transition-all" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">Location / Pickup preference</label>
            <input name="location" placeholder="e.g. Main campus, Library"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black focus:bg-white transition-all" />
          </div>
        </div>

        <div className="flex items-start gap-2 bg-amber-50 text-amber-700 text-xs px-4 py-3 rounded-xl border border-amber-100">
          <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <span>Only verified college students can see your request. Stay safe — meet in campus public areas.</span>
        </div>

        <div className="flex gap-3">
          <Link href="/dashboard/requests" className="flex-1 py-3.5 text-center text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
            Cancel
          </Link>
          <button type="submit" disabled={isPending}
            className="flex-1 py-3.5 bg-black text-white text-sm font-medium rounded-xl hover:bg-gray-800 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
            {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
            {isPending ? 'Posting...' : 'Post Need'}
          </button>
        </div>
      </form>
    </div>
  );
}
