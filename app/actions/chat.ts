'use server';

import { redirect } from 'next/navigation';
import { isRedirectError } from 'next/dist/client/components/redirect-error';
import { createClientServer, createClientAdmin } from '@/lib/supabase-server';

export async function startConversation({
  targetUserId,
  resourceId,
  needId,
  rideId,
  skillId,
}: {
  targetUserId: string;
  resourceId?: string;
  needId?: string;
  rideId?: string;
  skillId?: string;
}) {
  const supabase = await createClientServer();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // If trying to chat with self, do not create conversation — redirect to chat or dashboard
  if (user.id === targetUserId) {
    redirect('/dashboard/chat');
  }

  // Determine conversation type
  let type: 'resource_request' | 'need_response' | 'ride' | 'skill_request' | 'direct' = 'direct';
  if (resourceId) type = 'resource_request';
  else if (needId) type = 'need_response';
  else if (rideId) type = 'ride';
  else if (skillId) type = 'skill_request';

  // Check if an existing conversation exists with this context and participants
  let query = supabase.from('conversations').select(`
    id,
    conversation_participants!inner(profile_id)
  `);

  if (resourceId) query = query.eq('resource_id', resourceId);
  else if (needId) query = query.eq('need_id', needId);
  else if (rideId) query = query.eq('ride_id', rideId);
  else if (skillId) query = query.eq('skill_id', skillId);

  const { data: existingConvs } = await query;

  if (existingConvs && existingConvs.length > 0) {
    // Check if both user and target are participants
    for (const c of existingConvs) {
      const pIds = (c.conversation_participants as any[])?.map(p => p.profile_id) ?? [];
      if (pIds.includes(user.id) && pIds.includes(targetUserId)) {
        redirect(`/dashboard/chat/${c.id}`);
      }
    }
  }

  // Securely provision the conversation channel via admin client
  let targetConvId: string | null = null;
  try {
    const admin = createClientAdmin();
    const { data: newConv, error: convError } = await admin
      .from('conversations')
      .insert({
        type,
        resource_id: resourceId ?? null,
        need_id: needId ?? null,
        ride_id: rideId ?? null,
        skill_id: skillId ?? null,
        last_message_at: new Date().toISOString(),
      })
      .select('id')
      .single();

    if (convError || !newConv) {
      console.error('[startConversation] Error creating conversation:', convError);
      redirect('/dashboard/chat');
    }

    // Insert both participants
    const { error: partError } = await admin
      .from('conversation_participants')
      .insert([
        { conversation_id: newConv.id, profile_id: user.id },
        { conversation_id: newConv.id, profile_id: targetUserId },
      ]);

    if (partError) {
      console.error('[startConversation] Error adding participants:', partError);
      redirect('/dashboard/chat');
    }

    targetConvId = newConv.id;
  } catch (err: unknown) {
    // If Next.js redirect was thrown, re-throw it so navigation occurs
    if (isRedirectError(err)) throw err;
    console.error('[startConversation] Failed to provision conversation:', err);
    redirect('/dashboard/chat');
  }

  if (targetConvId) {
    redirect(`/dashboard/chat/${targetConvId}`);
  }
}
