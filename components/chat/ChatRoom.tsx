'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { ArrowLeft, Send, Loader2, Lock } from 'lucide-react';
import { createClient } from '@/lib/supabase';

export type Message = {
  id: string;
  body: string;
  image_url: string | null;
  created_at: string;
  sender_id: string;
  sender: { id: string; full_name: string; avatar_url: string | null } | null;
};

export type Profile = {
  id: string;
  full_name: string;
  student_id?: string | null;
  department: string | null;
  year: string | null;
  is_verified: boolean;
  avatar_url: string | null;
};

export type Conversation = {
  id: string;
  type: string | null;
  resource_id: string | null;
  need_id: string | null;
  ride_id: string | null;
  skill_id: string | null;
  resource?: {
    id: string;
    title: string;
    price: number | null;
    price_unit: string | null;
    method: string | null;
    status: string;
    image_urls?: string[];
  } | null;
  need?: {
    id: string;
    title: string;
    budget_min: number | null;
    budget_max: number | null;
    status: string;
  } | null;
  ride?: {
    id: string;
    from_location: string;
    to_location: string;
    ride_date: string;
    ride_time: string;
    estimated_cost: number | null;
    status: string;
  } | null;
  skill?: {
    id: string;
    title: string;
    rate: number | null;
    rate_unit: string | null;
    level: string | null;
    is_active: boolean;
  } | null;
} | null;

function Avatar({ name, url, size = 9 }: { name: string; url?: string | null; size?: number }) {
  const cls = `w-${size} h-${size} rounded-full flex-shrink-0 flex items-center justify-center font-semibold text-white bg-gray-700 text-sm`;
  if (url) return <img src={url} alt={name} className={`${cls} object-cover`} />;
  return <div className={cls}>{name[0]?.toUpperCase()}</div>;
}

function timeLabel(dateStr: string) {
  return new Date(dateStr).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
}

export function ChatRoom({
  conversationId,
  currentUserId,
  currentUserProfile,
  initialMessages,
  otherProfile,
  conversation,
}: {
  conversationId: string;
  currentUserId: string;
  currentUserProfile: { id: string; full_name: string; avatar_url: string | null } | null;
  initialMessages: Message[];
  otherProfile: Profile | null;
  conversation: Conversation;
}) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const otherName = otherProfile?.full_name?.trim() || otherProfile?.student_id || 'Campus Student';

  const scrollToBottom = useCallback(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => { scrollToBottom(); }, [messages, scrollToBottom]);

  // Real-time subscription
  useEffect(() => {
    const supabase = createClient();

    const channel = supabase
      .channel(`chat-${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`,
        },
        async (payload) => {
          const newMsg = payload.new as Message;
          if (messages.some(m => m.id === newMsg.id)) return;

          const { data: sender } = await supabase
            .from('profiles')
            .select('id, full_name, avatar_url')
            .eq('id', newMsg.sender_id)
            .single();

          setMessages((prev) => [...prev, { ...newMsg, sender: sender ?? null }]);
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [conversationId]); // eslint-disable-line react-hooks/exhaustive-deps

  const sendMessage = async () => {
    const body = input.trim();
    if (!body || sending) return;

    setInput('');
    setSending(true);
    setError(null);

    const supabase = createClient();

    const { data: newMsg, error: insertError } = await supabase
      .from('messages')
      .insert({
        conversation_id: conversationId,
        sender_id: currentUserId,
        body,
      })
      .select('id, body, image_url, created_at, sender_id')
      .single();

    if (insertError) {
      console.error('[sendMessage]', insertError);
      setError('Failed to send message. Please try again.');
      setInput(body);
      setSending(false);
      return;
    }

    setMessages((prev) => [
      ...prev,
      {
        ...newMsg,
        sender: {
          id: currentUserId,
          full_name: currentUserProfile?.full_name ?? 'You',
          avatar_url: currentUserProfile?.avatar_url ?? null,
        },
      },
    ]);

    await supabase
      .from('conversations')
      .update({ last_message_at: new Date().toISOString() })
      .eq('id', conversationId);

    setSending(false);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const grouped: { date: string; msgs: Message[] }[] = [];
  messages.forEach((m) => {
    const date = new Date(m.created_at).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' });
    const last = grouped[grouped.length - 1];
    if (last?.date === date) last.msgs.push(m);
    else grouped.push({ date, msgs: [m] });
  });

  return (
    <div className="flex flex-col h-[calc(100dvh-7.5rem)] sm:h-[calc(100vh-8rem)]">
      {/* WHO Header */}
      <div className="flex items-center gap-2.5 sm:gap-3 pb-3 border-b border-gray-100 flex-shrink-0">
        <Link href="/dashboard/chat" className="p-2 rounded-xl border border-gray-200 text-gray-500 hover:text-black hover:bg-gray-50 transition-all flex-shrink-0">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        {otherProfile && <Avatar name={otherName} url={otherProfile.avatar_url} size={9} />}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 min-w-0">
            <p className="font-bold text-gray-900 text-sm truncate">{otherName}</p>
            {otherProfile?.is_verified && (
              <span className="text-emerald-600 text-xs font-semibold flex items-center gap-0.5 flex-shrink-0">
                ✓ <span className="hidden xs:inline">Verified</span>
              </span>
            )}
          </div>
          {otherProfile?.department && (
            <p className="text-xs text-gray-500 font-medium truncate">
              {otherProfile.department}{otherProfile.year ? ` • ${otherProfile.year}` : ''}
            </p>
          )}
        </div>
        {/* Private conversation badge */}
        <div className="hidden xs:flex items-center gap-1 px-2.5 py-1 bg-gray-100 rounded-full flex-shrink-0" title="Only you and this person can see these messages">
          <Lock className="w-3 h-3 text-gray-400" />
          <span className="text-xs text-gray-400 font-medium">Private</span>
        </div>
      </div>

      {/* WHAT Context Banner */}
      {conversation?.resource && (
        <div className="my-2 p-3 bg-gray-50 border border-gray-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3 flex-shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <span className="text-xl sm:text-2xl flex-shrink-0">📦</span>
            <div className="min-w-0">
              <p className="font-bold text-gray-900 text-sm truncate">{conversation.resource.title}</p>
              <p className="text-xs text-gray-500">
                {conversation.resource.price ? `₹${conversation.resource.price}` : 'Free'} • {conversation.resource.status ?? 'Available'}
              </p>
            </div>
          </div>
          <Link
            href={`/dashboard/resources/${conversation.resource.id}`}
            className="flex-shrink-0 px-3 py-1.5 bg-black hover:bg-gray-800 text-white rounded-xl text-xs font-semibold transition-all text-center"
          >
            View Resource
          </Link>
        </div>
      )}

      {conversation?.need && (
        <div className="my-2 p-3 bg-gray-50 border border-gray-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3 flex-shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <span className="text-xl sm:text-2xl flex-shrink-0">🔎</span>
            <div className="min-w-0">
              <p className="font-bold text-gray-900 text-sm truncate">{conversation.need.title}</p>
              <p className="text-xs text-gray-500">
                Budget: {conversation.need.budget_max ? `Up to ₹${conversation.need.budget_max}` : 'Open'} • {conversation.need.status ?? 'Open'}
              </p>
            </div>
          </div>
          <Link
            href={`/dashboard/requests/${conversation.need.id}`}
            className="flex-shrink-0 px-3 py-1.5 bg-black hover:bg-gray-800 text-white rounded-xl text-xs font-semibold transition-all text-center"
          >
            View Request
          </Link>
        </div>
      )}

      {conversation?.ride && (
        <div className="my-2 p-3 bg-gray-50 border border-gray-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3 flex-shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <span className="text-xl sm:text-2xl flex-shrink-0">🚗</span>
            <div className="min-w-0">
              <p className="font-bold text-gray-900 text-sm truncate">
                {conversation.ride.from_location} → {conversation.ride.to_location}
              </p>
              <p className="text-xs text-gray-500">
                {conversation.ride.ride_date} at {conversation.ride.ride_time?.slice(0, 5)} • {conversation.ride.estimated_cost ? `₹${conversation.ride.estimated_cost}/seat` : 'Free'}
              </p>
            </div>
          </div>
          <Link
            href={`/dashboard/rides/${conversation.ride.id}`}
            className="flex-shrink-0 px-3 py-1.5 bg-black hover:bg-gray-800 text-white rounded-xl text-xs font-semibold transition-all text-center"
          >
            View Ride
          </Link>
        </div>
      )}

      {conversation?.skill && (
        <div className="my-2 p-3 bg-gray-50 border border-gray-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3 flex-shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <span className="text-xl sm:text-2xl flex-shrink-0">💻</span>
            <div className="min-w-0">
              <p className="font-bold text-gray-900 text-sm truncate">{conversation.skill.title}</p>
              <p className="text-xs text-gray-500 capitalize">
                {conversation.skill.level ?? 'General'} Level • {conversation.skill.rate ? `₹${conversation.skill.rate}/${conversation.skill.rate_unit || 'hr'}` : 'Free'}
              </p>
            </div>
          </div>
          <Link
            href={`/dashboard/skills/${conversation.skill.id}`}
            className="flex-shrink-0 px-3 py-1.5 bg-black hover:bg-gray-800 text-white rounded-xl text-xs font-semibold transition-all text-center"
          >
            View Skill
          </Link>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto py-3 sm:py-4 space-y-4 min-h-0">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center py-12">
            <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
              <Send className="w-6 h-6 text-gray-300" />
            </div>
            <p className="text-sm font-medium text-gray-600 mb-1">Start the conversation</p>
            <p className="text-xs text-gray-400">Say hi to {otherName}</p>
          </div>
        )}

        {grouped.map(({ date, msgs }) => (
          <div key={date}>
            <div className="flex items-center gap-3 my-3 sm:my-4">
              <div className="flex-1 h-px bg-gray-100" />
              <span className="text-[11px] sm:text-xs text-gray-400 whitespace-nowrap">{date}</span>
              <div className="flex-1 h-px bg-gray-100" />
            </div>
            <div className="space-y-2">
              {msgs.map((msg) => {
                const isMe = msg.sender_id === currentUserId;
                return (
                  <div key={msg.id} className={`flex items-end gap-2 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                    {!isMe && (
                      <Avatar name={msg.sender?.full_name ?? otherName} url={msg.sender?.avatar_url} size={8} />
                    )}
                    <div className={`max-w-[85%] sm:max-w-[65%] flex flex-col gap-0.5 ${isMe ? 'items-end' : 'items-start'}`}>
                      <div className={`px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-2xl text-sm leading-relaxed break-words ${
                        isMe
                          ? 'bg-black text-white rounded-br-sm'
                          : 'bg-gray-100 text-gray-900 rounded-bl-sm'
                      }`}>
                        {msg.body}
                      </div>
                      <span className="text-[10px] sm:text-xs text-gray-400">{timeLabel(msg.created_at)}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Error */}
      {error && (
        <div className="px-3 py-2 bg-red-50 border border-red-200 text-red-600 text-xs rounded-lg mx-0 mb-2 flex-shrink-0">
          {error}
        </div>
      )}

      {/* Input */}
      <div className="pt-2 sm:pt-3 border-t border-gray-100 flex-shrink-0">
        <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-2xl px-3 py-1.5 sm:px-4 sm:py-2 focus-within:ring-2 focus-within:ring-black focus-within:border-transparent transition-all">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`Message ${otherName}...`}
            className="flex-1 bg-transparent text-sm text-gray-900 placeholder-gray-400 focus:outline-none min-w-0"
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim() || sending}
            className="w-8 h-8 flex items-center justify-center bg-black text-white rounded-xl hover:bg-gray-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
          >
            {sending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
          </button>
        </div>
        <p className="text-[11px] text-gray-400 mt-1 text-center hidden sm:block">Press Enter to send</p>
      </div>
    </div>
  );
}

export default ChatRoom;
