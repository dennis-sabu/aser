import { createClientServer, createClientAdmin } from '@/lib/supabase-server';
import ChatSidebar from '@/components/chat/ChatSidebar';

export default async function ChatPage() {
  const supabase = await createClientServer();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  // Load conversations where user is a participant
  const { data: participantRows, error } = await supabase
    .from('conversation_participants')
    .select(`
      conversation_id,
      last_read_at,
      conversation:conversations(
        id, type, resource_id, need_id, ride_id, skill_id, last_message_at, created_at
      )
    `)
    .eq('profile_id', user.id)    // ← correct column: profile_id
    .order('conversation(last_message_at)', { ascending: false })
    .limit(50);

  if (error) console.error('[ChatPage]', error);

  const convIds = (participantRows ?? []).map((r: any) => r.conversation_id);

  // Load last message + other participant for each conversation
  let conversations: any[] = [];
  if (convIds.length > 0) {
    // Admin client is used specifically here to bypass the restrictive
    // conversation_participants RLS policy that hides other participants' rows
    const admin = createClientAdmin();

    // Parallelize conversation details and bounded recent messages query
    const [{ data: convData }, { data: lastMessages }] = await Promise.all([
      admin
        .from('conversations')
        .select(`
          id, type, resource_id, need_id, ride_id, skill_id, last_message_at,
          conversation_participants(
            profile_id,
            profile:profiles(id, full_name, student_id, department, year, is_verified, avatar_url)
          )
        `)
        .in('id', convIds)
        .order('last_message_at', { ascending: false }),
      admin
        .from('messages')
        .select('conversation_id, body, created_at, sender_id')
        .in('conversation_id', convIds)
        .order('created_at', { ascending: false })
        .limit(Math.min(convIds.length * 3, 150)),
    ]);

    const lastMsgMap: Record<string, any> = {};
    (lastMessages ?? []).forEach((m: any) => {
      if (!lastMsgMap[m.conversation_id]) lastMsgMap[m.conversation_id] = m;
    });

    const lastReadMap: Record<string, string | null> = {};
    (participantRows ?? []).forEach((r: any) => {
      lastReadMap[r.conversation_id] = r.last_read_at;
    });

    conversations = (convData ?? []).map((c: any) => ({
      ...c,
      lastReadAt: lastReadMap[c.id] ?? null,
      lastMsg: lastMsgMap[c.id] ?? null,
      otherParticipants: (c.conversation_participants ?? [])
        .filter((p: any) => p.profile_id !== user.id)
        .map((p: any) => ({
          ...p,
          profile: Array.isArray(p.profile) ? p.profile[0] ?? null : p.profile ?? null,
        })),
    }));
  }

  return (
    <div className="h-[calc(100dvh-7.5rem)] sm:h-[calc(100vh-8rem)] flex flex-col">
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Messages</h1>
        {conversations.length > 0 && (
          <span className="text-xs sm:text-sm text-gray-400">
            {conversations.length} conversation{conversations.length !== 1 ? 's' : ''}
          </span>
        )}
      </div>
      <ChatSidebar conversations={conversations} currentUserId={user.id} />
    </div>
  );
}
