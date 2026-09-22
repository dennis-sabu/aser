import React from 'react';
import Link from 'next/link';
import { Plus, Search, Star, Lightbulb, Clock } from 'lucide-react';
import { createClientServer } from '@/lib/supabase-server';
import type { Skill } from '@/lib/database.types';

const LEVEL_COLORS: Record<string, string> = {
  Beginner:     'bg-gray-100 text-gray-600',
  Intermediate: 'bg-gray-200 text-gray-700',
  Expert:       'bg-gray-900 text-white',
};

function SkillCard({ skill, currentUserId }: { skill: Skill; currentUserId?: string }) {
  const owner = skill.owner;
  const isOwner = !!currentUserId && skill.owner_id === currentUserId;
  const levelColor = LEVEL_COLORS[skill.level ?? ''] ?? 'bg-gray-100 text-gray-600';

  const rateLabel =
    skill.rate_unit === 'free' || !skill.rate
      ? 'Free'
      : skill.rate_unit === 'exchange'
      ? 'Exchange'
      : `₹${skill.rate}/${skill.rate_unit === 'per_hour' ? 'hr' : skill.rate_unit === 'per_session' ? 'session' : 'hr'}`;

  return (
    <Link
      href={`/dashboard/skills/${skill.id}`}
      className="bg-white rounded-2xl border border-gray-100 p-5 hover:border-gray-300 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
    >
      <div>
        <div className="flex items-start justify-between mb-3">
          <div className="w-11 h-11 bg-gray-100 rounded-xl flex items-center justify-center group-hover:bg-gray-200 transition-colors">
            <Lightbulb className="w-5 h-5 text-gray-500" />
          </div>
          <div className="flex items-center gap-1.5">
            {isOwner && (
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
                Your Skill
              </span>
            )}
            {skill.level && (
              <span className={`text-xs font-medium px-2.5 py-1 rounded-full capitalize ${levelColor}`}>
                {skill.level}
              </span>
            )}
          </div>
        </div>

        <h3 className="font-semibold text-gray-900 text-sm mb-1">{skill.title}</h3>
        {skill.description && (
          <p className="text-xs text-gray-400 mb-2 line-clamp-2">{skill.description}</p>
        )}

        {owner && (
          <p className="text-xs text-gray-500 mb-3">
            {isOwner ? 'You (Instructor)' : owner.full_name}
            {owner.department ? ` · ${owner.department}` : ''}
            {owner.year ? ` ${owner.year}` : ''}
          </p>
        )}

        <div className="flex items-center justify-between">
          <div>
            <p className="font-bold text-gray-900 text-sm">{rateLabel}</p>
            {skill.availability && (
              <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5 capitalize">
                <Clock className="w-3 h-3" />
                {skill.availability}
              </p>
            )}
          </div>
          {owner?.rating && owner.rating > 0 ? (
            <div className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
              <span className="text-xs font-medium text-gray-700">{owner.rating.toFixed(1)}</span>
            </div>
          ) : null}
        </div>
      </div>

      <div className="mt-4 pt-0">
        <span
          className={`block text-center w-full py-2 text-xs font-medium rounded-full transition-colors ${
            isOwner
              ? 'bg-gray-100 text-gray-800 border border-gray-200 group-hover:bg-gray-200'
              : 'bg-black text-white group-hover:bg-gray-800'
          }`}
        >
          {isOwner ? 'Your Skill' : 'View & Request Session'}
        </span>
      </div>
    </Link>
  );
}

const LEVELS = ['All', 'Beginner', 'Intermediate', 'Expert'];

export default async function SkillsPage() {
  const supabase = await createClientServer();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: skills, error } = await supabase
    .from('skills')
    .select(`
      id,
      title,
      description,
      level,
      rate,
      rate_unit,
      availability,
      created_at,
      owner_id,
      owner:profiles!owner_id(id, full_name, department, year, is_verified, rating, avatar_url),
      category:categories(id, name, slug)
    `)
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .limit(50);

  if (error) {
    console.error('[SkillsPage] Failed to load skills:', error);
  }

  const items = (skills ?? []) as unknown as Skill[];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Skills Exchange</h1>
          <p className="text-gray-500 text-sm mt-0.5">Learn from peers or share your expertise</p>
        </div>
        <Link href="/dashboard/skills/my-skills" className="flex items-center gap-2 bg-black text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-gray-800 transition-colors">
          <Plus className="w-4 h-4" />
          Add a Skill
        </Link>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search skills, subjects, tutors..."
          className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black transition-all"
        />
      </div>

      {/* Level filters */}
      <div className="flex flex-wrap gap-2">
        {LEVELS.map(l => (
          <button key={l} className={`px-4 py-1.5 rounded-full text-xs font-medium transition-colors ${l === 'All' ? 'bg-black text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-100'}`}>
            {l}
          </button>
        ))}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
          Unable to load skills. Please try refreshing.
        </div>
      )}

      {items.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((skill) => <SkillCard key={skill.id} skill={skill} currentUserId={user?.id} />)}
        </div>
      ) : !error ? (
        <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-12 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 bg-sky-50 rounded-2xl flex items-center justify-center mb-5">
            <Lightbulb className="w-8 h-8 text-sky-300" />
          </div>
          <h3 className="text-base font-semibold text-gray-800 mb-2">No skills listed yet</h3>
          <p className="text-sm text-gray-400 mb-6 max-w-sm">
            Share what you know — coding, design, music, or anything else.
          </p>
          <Link href="/dashboard/skills/my-skills" className="flex items-center gap-2 bg-black text-white px-6 py-3 rounded-full text-sm font-medium hover:bg-gray-800 transition-colors">
            <Plus className="w-4 h-4" />
            Add Your First Skill
          </Link>
        </div>
      ) : null}
    </div>
  );
}
