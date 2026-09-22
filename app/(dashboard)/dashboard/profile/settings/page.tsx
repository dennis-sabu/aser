import React from 'react';
import { createClientServer } from '@/lib/supabase-server';
import { ProfileSettingsForm } from './ProfileSettingsForm';

export const metadata = {
  title: 'Account Settings',
};

export default async function ProfileSettingsPage() {
  const supabase = await createClientServer();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  const displayName = profile?.full_name ?? user.user_metadata?.full_name ?? user.email?.split('@')[0] ?? 'Student';
  const email = user.email ?? '';
  const department = profile?.department ?? user.user_metadata?.department ?? null;
  const year = profile?.year ?? user.user_metadata?.year ?? null;
  const studentId = profile?.student_id ?? user.user_metadata?.student_id ?? null;
  const bio = profile?.bio ?? user.user_metadata?.bio ?? null;
  const avatarUrl = profile?.avatar_url ?? user.user_metadata?.avatar_url ?? null;

  const phoneNumber = profile?.phone_number ?? user.user_metadata?.phone_number ?? null;
  const whatsappEnabled = profile?.whatsapp_enabled ?? user.user_metadata?.whatsapp_enabled ?? false;

  // Detect OAuth users (Google etc.) — they can't change password
  const identities = user.identities ?? [];
  const isOAuth = identities.some((id) => id.provider !== 'email');

  return (
    <ProfileSettingsForm
      fullName={displayName}
      email={email}
      department={department}
      year={year}
      studentId={studentId}
      bio={bio}
      avatarUrl={avatarUrl}
      phoneNumber={phoneNumber}
      whatsappEnabled={whatsappEnabled}
      isOAuth={isOAuth}
    />
  );
}
