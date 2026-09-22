'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClientServer } from '@/lib/supabase-server';

// ─── Sign Up ────────────────────────────────────────────────────────────────

export async function signUp(prevState: { error: string | null }, formData: FormData) {
  const supabase = await createClientServer();

  const fullName = formData.get('fullName') as string;
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const studentId = formData.get('studentId') as string;
  const department = formData.get('department') as string;
  const year = formData.get('year') as string;

  // Basic validation
  if (!fullName || !email || !password) {
    return { error: 'Full name, email and password are required.' };
  }
  if (password.length < 8) {
    return { error: 'Password must be at least 8 characters.' };
  }

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        student_id: studentId,
        department,
        year,
      },
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL ?? 'https://aser-eosin.vercel.app'}/auth/callback`,
    },
  });

  if (error) {
    return { error: error.message };
  }

  redirect('/verify');
}

// ─── Sign In ────────────────────────────────────────────────────────────────

export async function signIn(prevState: { error: string | null }, formData: FormData) {
  const supabase = await createClientServer();

  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) {
    return { error: 'Email and password are required.' };
  }

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/', 'layout');
  redirect('/dashboard');
}

// ─── Sign Out ───────────────────────────────────────────────────────────────

export async function signOut() {
  const supabase = await createClientServer();
  await supabase.auth.signOut();
  revalidatePath('/', 'layout');
  redirect('/login');
}
