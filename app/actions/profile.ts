'use server';

import { revalidatePath } from 'next/cache';
import { createClientServer } from '@/lib/supabase-server';

export type UpdateProfileState = {
  success: boolean;
  error: string | null;
};

export async function updateProfile(
  prevState: UpdateProfileState,
  formData: FormData
): Promise<UpdateProfileState> {
  const supabase = await createClientServer();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: 'You must be signed in.' };
  }

  const fullName = (formData.get('full_name') as string)?.trim();
  const department = (formData.get('department') as string)?.trim();
  const year = (formData.get('year') as string)?.trim();
  const studentId = (formData.get('student_id') as string)?.trim();
  const bio = (formData.get('bio') as string)?.trim();
  const avatarUrl = (formData.get('avatar_url') as string)?.trim();

  if (!fullName) {
    return { success: false, error: 'Full name is required.' };
  }

  const rawPhone = (formData.get('phone_number') as string)?.trim();
  const whatsappCheckbox = formData.get('whatsapp_enabled');
  const wantsWhatsapp = whatsappCheckbox === 'on' || whatsappCheckbox === 'true' || whatsappCheckbox === '1';

  let finalPhoneNumber: string | null = null;
  let finalWhatsappEnabled = false;

  if (rawPhone) {
    const { validateAndNormalizeIndianPhone } = await import('@/lib/phone');
    const phoneValidation = validateAndNormalizeIndianPhone(rawPhone);
    if (!phoneValidation.valid) {
      return { success: false, error: phoneValidation.error || 'Please enter a valid Indian phone number.' };
    }
    finalPhoneNumber = phoneValidation.normalized ?? null;
    finalWhatsappEnabled = wantsWhatsapp;
  } else {
    // If no phone number is provided but WhatsApp is toggled on, reject
    if (wantsWhatsapp) {
      return { success: false, error: 'A valid phone number is required to enable WhatsApp contact.' };
    }
    finalPhoneNumber = null;
    finalWhatsappEnabled = false;
  }

  // Update auth metadata
  await supabase.auth.updateUser({
    data: {
      full_name: fullName,
      department: department || null,
      year: year || null,
      student_id: studentId || null,
      bio: bio || null,
      avatar_url: avatarUrl || null,
      phone_number: finalPhoneNumber,
      whatsapp_enabled: finalWhatsappEnabled,
    },
  });

  // Update real profiles table
  const updatePayload: Record<string, any> = {
    full_name: fullName,
    department: department || null,
    year: year || null,
    student_id: studentId || null,
    bio: bio || null,
    avatar_url: avatarUrl || null,
    phone_number: finalPhoneNumber,
    whatsapp_enabled: finalWhatsappEnabled,
    updated_at: new Date().toISOString(),
  };

  let { error: profileError } = await supabase
    .from('profiles')
    .update(updatePayload)
    .eq('id', user.id);

  // Graceful fallback if database migration hasn't been applied yet in remote Supabase
  if (profileError && (profileError.message?.includes('phone_number') || profileError.code === '42703' || profileError.code === 'PGRST204')) {
    console.warn('[updateProfile] phone_number/whatsapp_enabled column not yet in DB schema. Falling back to core fields. Apply migration 20260922_add_phone_number_and_whatsapp_to_profiles.sql.');
    const fallbackPayload = {
      full_name: fullName,
      department: department || null,
      year: year || null,
      student_id: studentId || null,
      bio: bio || null,
      avatar_url: avatarUrl || null,
      updated_at: new Date().toISOString(),
    };
    const { error: fallbackErr } = await supabase
      .from('profiles')
      .update(fallbackPayload)
      .eq('id', user.id);
    profileError = fallbackErr;
  }

  if (profileError) {
    console.error('[updateProfile] DB error:', profileError);
    return { success: false, error: profileError.message };
  }

  revalidatePath('/dashboard/profile');
  revalidatePath('/dashboard/profile/settings');
  revalidatePath('/dashboard');
  return { success: true, error: null };
}

export async function updatePassword(
  prevState: UpdateProfileState,
  formData: FormData
): Promise<UpdateProfileState> {
  const supabase = await createClientServer();

  const newPassword = formData.get('new_password') as string;
  const confirmPassword = formData.get('confirm_password') as string;

  if (!newPassword || newPassword.length < 8) {
    return { success: false, error: 'Password must be at least 8 characters.' };
  }
  if (newPassword !== confirmPassword) {
    return { success: false, error: 'Passwords do not match.' };
  }

  const { error } = await supabase.auth.updateUser({ password: newPassword });

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, error: null };
}
