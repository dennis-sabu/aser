import { createClientServer, createClientAdmin } from '@/lib/supabase-server';
import { notFound } from 'next/navigation';
import ChatRoom from '@/components/chat/ChatRoom';

export default async function ChatRoomPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClientServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return notFound();

  // Verify user is a participant — non-participants get 404 (privacy enforcement)
  const { data: participant } = await supabase
    .from('conversation_participants')
    .select('profile_id')
    .eq('conversation_id', id)
    .eq('profile_id', user.id)
    .single();

  if (!participant) return notFound();

  // Admin client is used after privacy verification to bypass the RLS restriction
  // that filters out the other participant's record from conversation_participants
  const admin = createClientAdmin();

  // Fetch conversation info, participants, messages and current user profile in parallel
  const [
    { data: rawConversation },
    { data: participants },
    { data: messages, error: msgError },
    { data: currentUserProfile },
  ] = await Promise.all([
    admin
      .from('conversations')
      .select(`
        id, type, resource_id, need_id, ride_id, skill_id,
        resource:resources(id, title, price, price_unit, method, status, image_urls),
        need:needs(id, title, budget_min, budget_max, status),
        ride:rides(id, from_location, to_location, ride_date, ride_time, estimated_cost, status),
        skill:skills(id, title, rate, rate_unit, level, is_active)
      `)
      .eq('id', id)
      .single(),
    admin
      .from('conversation_participants')
      .select('profile_id, profile:profiles(id, full_name, student_id, department, year, is_verified, avatar_url)')
      .eq('conversation_id', id),
    admin
      .from('messages')
      .select('id, body, image_url, created_at, sender_id, sender:profiles!sender_id(id, full_name, avatar_url)')
      .eq('conversation_id', id)
      .order('created_at', { ascending: false })
      .limit(50),
    // Fetch current user's real profile for display name
    admin
      .from('profiles')
      .select('id, full_name, avatar_url')
      .eq('id', user.id)
      .single(),
  ]);

  const conversation = rawConversation ? {
    ...rawConversation,
    resource: Array.isArray(rawConversation.resource) ? rawConversation.resource[0] : rawConversation.resource,
    need: Array.isArray(rawConversation.need) ? rawConversation.need[0] : rawConversation.need,
    ride: Array.isArray(rawConversation.ride) ? rawConversation.ride[0] : rawConversation.ride,
    skill: Array.isArray(rawConversation.skill) ? rawConversation.skill[0] : rawConversation.skill,
  } : null;

  if (msgError) console.error('[ChatRoom] messages error:', msgError);

  // Get the other participant
  const otherParticipant = (participants ?? []).find((p: any) => p.profile_id !== user.id);
  // Supabase returns joined relation as array — take first element
  const otherProfileRaw = Array.isArray(otherParticipant?.profile)
    ? otherParticipant.profile[0]
    : otherParticipant?.profile;

  // Normalise messages in chronological order for display
  const normMessages = (messages ?? []).slice().reverse().map((m: any) => ({
    ...m,
    sender: Array.isArray(m.sender) ? m.sender[0] ?? null : m.sender ?? null,
  }));

  // Update last_read_at
  await supabase
    .from('conversation_participants')
    .update({ last_read_at: new Date().toISOString() })
    .eq('conversation_id', id)
    .eq('profile_id', user.id);

  return (
    <ChatRoom
      conversationId={id}
      currentUserId={user.id}
      currentUserProfile={currentUserProfile ?? null}
      initialMessages={normMessages}
      otherProfile={otherProfileRaw ?? null}
      conversation={conversation}
    />
  );
}
