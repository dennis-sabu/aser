'use client';

import React from 'react';
import Link from 'next/link';
import { MessageSquare } from 'lucide-react';

export type Participant = {
  profile_id: string;
  profile: { id: string; full_name: string; student_id?: string | null; department: string | null; year: string | null; is_verified: boolean; avatar_url: string | null } | null;
};

export type Conversation = {
  id: string;
  type: string | null;
  resource_id: string | null;
  need_id: string | null;
  ride_id: string | null;
  skill_id: string | null;
  last_message_at: string | null;
  lastReadAt?: string | null;
  lastMsg: { body: string; created_at: string; sender_id?: string } | null;
  otherParticipants: Participant[];
};

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'now';
  if (mins < 60) return `${mins}m`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h`;
  return `${Math.floor(hrs / 24)}d`;
}

function Avatar({ name, url, size = 10 }: { name: string; url?: string | null; size?: number }) {
  const cls = `w-${size} h-${size} rounded-full flex items-center justify-center font-semibold text-white bg-gray-700 flex-shrink-0`;
  if (url) return <img src={url} alt={name} className={`${cls} object-cover`} />;
  return <div className={cls}>{name[0]?.toUpperCase()}</div>;
}

export function ChatSidebar({
  conversations,
  currentUserId,
}: {
  conversations: Conversation[];
  currentUserId: string;
}) {
  if (conversations.length === 0) {
    return (
      <div className="flex-1 bg-white rounded-2xl border border-dashed border-gray-200 flex flex-col items-center justify-center text-center p-12">
        <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-5">
          <MessageSquare className="w-8 h-8 text-gray-300" />
        </div>
        <h3 className="text-base font-semibold text-gray-800 mb-2">No conversations yet</h3>
        <p className="text-sm text-gray-400 max-w-xs">
          Start a conversation by tapping "Message" on any resource, need, ride, or skill.
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-white rounded-2xl border border-gray-100 overflow-y-auto">
      <div className="divide-y divide-gray-50">
        {conversations.map((conv) => {
          const rawProfile = conv.otherParticipants[0]?.profile;
          const other = Array.isArray(rawProfile) ? rawProfile[0] : rawProfile;
          const name = other?.full_name?.trim() || other?.student_id || 'Campus Student';
          const sub = [other?.department, other?.year].filter(Boolean).join(' · ');

          const isUnread =
            conv.lastMsg &&
            conv.lastMsg.sender_id !== currentUserId &&
            (!conv.lastReadAt || new Date(conv.lastMsg.created_at) > new Date(conv.lastReadAt));

          const contextLabel =
            conv.resource_id ? '📦 Resource' :
            conv.need_id ? '🔎 Need' :
            conv.ride_id ? '🚗 Ride' :
            conv.skill_id ? '💻 Skill' : null;

          return (
            <Link
              key={conv.id}
              href={`/dashboard/chat/${conv.id}`}
              className={`flex items-center gap-3 px-3.5 py-3.5 sm:px-5 sm:py-4 hover:bg-gray-50 transition-colors cursor-pointer ${
                isUnread ? 'bg-gray-50/70 font-semibold' : ''
              }`}
            >
              <div className="relative flex-shrink-0">
                <Avatar name={name} url={other?.avatar_url} size={10} />
                {isUnread && (
                  <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-black rounded-full border-2 border-white" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-0.5">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="font-semibold text-gray-900 text-sm truncate">{name}</span>
                    {other?.is_verified && <span className="text-emerald-500 text-xs flex-shrink-0">✓</span>}
                  </div>
                  {conv.last_message_at && (
                    <span className="text-[11px] sm:text-xs text-gray-400 flex-shrink-0 ml-2">
                      {timeAgo(conv.last_message_at)}
                    </span>
                  )}
                </div>
                {sub && <p className="text-xs text-gray-400 mb-1 truncate">{sub}</p>}
                <p className={`text-xs truncate ${isUnread ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
                  {conv.lastMsg?.body ?? 'Start the conversation...'}
                </p>
                {contextLabel && (
                  <span className="mt-1 inline-block text-[11px] text-gray-400 font-medium">{contextLabel}</span>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export default ChatSidebar;
