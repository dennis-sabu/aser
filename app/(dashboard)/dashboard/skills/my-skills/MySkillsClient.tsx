'use client';

import React, { useActionState, useState } from 'react';
import { Plus, Lightbulb, Clock, X, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { createSkill, ActionState } from '@/app/actions/listings';

const LEVELS = ['Beginner', 'Intermediate', 'Expert'];
const RATE_UNITS = [
  { label: 'Free', value: 'free' },
  { label: 'Exchange', value: 'exchange' },
  { label: 'Per Hour', value: 'per_hour' },
  { label: 'Per Session', value: 'per_session' },
];

const LEVEL_COLORS: Record<string, string> = {
  Beginner: 'bg-green-100 text-green-700',
  Intermediate: 'bg-sky-100 text-sky-700',
  Expert: 'bg-violet-100 text-violet-700',
};

const INIT: ActionState = { error: null, success: false };

type Skill = {
  id: string;
  title: string;
  description: string | null;
  level: string | null;
  availability: string | null;
  rate: number | null;
  rate_unit: string | null;
  is_active: boolean;
  category?: { name: string } | null;
};

export default function MySkillsClient({
  initialSkills,
  categoryMap,
  categories,
}: {
  initialSkills: Skill[];
  categoryMap: Record<string, string>;
  categories: { id: string; name: string; slug: string }[];
}) {
  const [state, formAction, isPending] = useActionState(createSkill, INIT);
  const [showForm, setShowForm] = useState(false);
  const [level, setLevel] = useState('');
  const [rateUnit, setRateUnit] = useState('free');
  const [categoryId, setCategoryId] = useState('');

  const rateLabel = (s: Skill) => {
    if (!s.rate || s.rate_unit === 'free') return 'Free';
    if (s.rate_unit === 'exchange') return 'Exchange';
    return `₹${s.rate}/${s.rate_unit === 'per_hour' ? 'hr' : 'session'}`;
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Skills</h1>
          <p className="text-gray-500 text-sm mt-0.5">Skills you offer to the campus community</p>
        </div>
        <button
          onClick={() => setShowForm(v => !v)}
          className="flex items-center gap-2 bg-black text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-800 transition-colors"
        >
          {showForm ? <><X className="w-4 h-4" />Cancel</> : <><Plus className="w-4 h-4" />Add Skill</>}
        </button>
      </div>

      {/* Add Skill Form */}
      {showForm && (
        <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
          <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Add a New Skill</h2>

          {state.error && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-sm px-3 py-2 rounded-lg">
              <AlertCircle className="w-4 h-4 flex-shrink-0" /> {state.error}
            </div>
          )}

          <form action={formAction} className="space-y-4">
            <input type="hidden" name="level" value={level} />
            <input type="hidden" name="rate_unit" value={rateUnit} />
            <input type="hidden" name="category_id" value={categoryId} />

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Skill Title <span className="text-red-500">*</span></label>
              <input required name="title" placeholder="e.g. Python Programming, PCB Design, Video Editing..."
                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black focus:bg-white transition-all" />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Description</label>
              <textarea name="description" rows={2} placeholder="What can you help with? Your experience, tools you use..."
                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black focus:bg-white transition-all resize-none" />
            </div>

            {/* Category */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Category</label>
              <div className="flex flex-wrap gap-2">
                {categories.slice(0, 8).map((cat) => (
                  <button key={cat.id} type="button" onClick={() => setCategoryId(cat.id)}
                    className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${
                      categoryId === cat.id ? 'border-black bg-black text-white' : 'border-gray-200 text-gray-600 hover:border-gray-400'
                    }`}>
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Level */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Experience Level</label>
              <div className="flex gap-2 flex-wrap">
                {LEVELS.map(l => (
                  <button key={l} type="button" onClick={() => setLevel(l)}
                    className={`px-4 py-2 rounded-xl border-2 text-sm font-medium transition-all ${
                      level === l ? 'border-black bg-black text-white' : 'border-gray-200 text-gray-600 hover:border-gray-400'
                    }`}>
                    {l}
                  </button>
                ))}
              </div>
            </div>

            {/* Rate */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Rate</label>
              <div className="flex flex-wrap gap-2">
                {RATE_UNITS.map(r => (
                  <button key={r.value} type="button" onClick={() => setRateUnit(r.value)}
                    className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${
                      rateUnit === r.value ? 'border-black bg-black text-white' : 'border-gray-200 text-gray-600 hover:border-gray-400'
                    }`}>
                    {r.label}
                  </button>
                ))}
              </div>
              {(rateUnit === 'per_hour' || rateUnit === 'per_session') && (
                <div className="relative max-w-[200px]">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">₹</span>
                  <input name="rate" type="number" min="0" placeholder="0"
                    className="w-full pl-8 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black focus:bg-white transition-all" />
                </div>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Availability</label>
              <input name="availability" placeholder="e.g. Weekdays 4–7pm, Weekends..."
                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black focus:bg-white transition-all" />
            </div>

            <button type="submit" disabled={isPending}
              className="w-full py-3 bg-black text-white text-sm font-medium rounded-xl hover:bg-gray-800 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
              {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
              {isPending ? 'Adding...' : 'Add Skill'}
            </button>
          </form>
        </div>
      )}

      {/* Skills List */}
      {initialSkills.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {initialSkills.map((skill) => (
            <div key={skill.id} className="bg-white rounded-2xl border border-gray-100 p-5 hover:border-gray-300 transition-all">
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                  <Lightbulb className="w-5 h-5 text-gray-500" />
                </div>
                <div className="flex items-center gap-2">
                  {skill.level && (
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${LEVEL_COLORS[skill.level] ?? 'bg-gray-100 text-gray-600'}`}>
                      {skill.level}
                    </span>
                  )}
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${skill.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                    {skill.is_active ? 'Active' : 'Paused'}
                  </span>
                </div>
              </div>
              <h3 className="font-semibold text-gray-900 text-sm mb-1">{skill.title}</h3>
              {skill.description && <p className="text-xs text-gray-400 mb-2 line-clamp-2">{skill.description}</p>}
              <div className="flex items-center justify-between mt-2">
                <span className="text-sm font-bold text-gray-900">{rateLabel(skill)}</span>
                {skill.availability && (
                  <span className="text-xs text-gray-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {skill.availability}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : !showForm ? (
        <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-12 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 bg-violet-50 rounded-2xl flex items-center justify-center mb-5">
            <Lightbulb className="w-8 h-8 text-violet-300" />
          </div>
          <h3 className="text-base font-semibold text-gray-800 mb-2">No skills added yet</h3>
          <p className="text-sm text-gray-400 mb-6 max-w-sm">Share your expertise with the campus community.</p>
          <button onClick={() => setShowForm(true)}
            className="flex items-center gap-2 bg-black text-white px-6 py-3 rounded-xl text-sm font-medium hover:bg-gray-800 transition-colors">
            <Plus className="w-4 h-4" /> Add Your First Skill
          </button>
        </div>
      ) : null}
    </div>
  );
}
