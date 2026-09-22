'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClientServer } from '@/lib/supabase-server';

// ─── Create Resource ─────────────────────────────────────────────────────────

export type ActionState = { error: string | null; success: boolean };
const INIT: ActionState = { error: null, success: false };

export async function createResource(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const supabase = await createClientServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'You must be signed in.', success: false };

  const title = (formData.get('title') as string)?.trim();
  const description = (formData.get('description') as string)?.trim() || null;
  const category_id = (formData.get('category_id') as string) || null;
  const condition = (formData.get('condition') as string) || null;
  const method = (formData.get('method') as string) || null;
  const priceRaw = formData.get('price') as string;
  const price = priceRaw ? parseFloat(priceRaw) : null;
  const price_unit = (formData.get('price_unit') as string) || null;
  const location = (formData.get('location') as string)?.trim() || null;
  const terms = (formData.get('terms') as string)?.trim() || null;
  const imageUrlsRaw = formData.get('image_urls') as string;
  const image_urls: string[] = imageUrlsRaw ? JSON.parse(imageUrlsRaw) : [];

  if (!title) return { error: 'Title is required.', success: false };

  // Normalize enums for PostgreSQL
  const cMap: Record<string, string> = {
    'brand new': 'new',
    'new': 'new',
    'like new': 'like_new',
    'good': 'good',
    'fair': 'used',
    'used': 'used',
    'working': 'good',
    'needs repair': 'needs_repair',
  };
  const normCondition = condition ? (cMap[condition.toLowerCase()] ?? 'good') : 'good';

  const mMap: Record<string, string> = {
    'sell': 'sell',
    'rent': 'rent',
    'borrow': 'borrow',
    'lend': 'borrow',
    'free': 'free',
    'exchange': 'exchange',
  };
  const normMethod = method ? (mMap[method.toLowerCase()] ?? 'sell') : 'sell';

  const { error } = await supabase.from('resources').insert({
    owner_id: user.id,
    title,
    description,
    category_id,
    condition: normCondition,
    method: normMethod,
    price,
    price_unit,
    location,
    terms,
    image_urls,
    status: 'active',
  });

  if (error) {
    console.error('[createResource]', error);
    return { error: 'Unable to create resource. Please try again.', success: false };
  }

  revalidatePath('/dashboard/resources');
  redirect('/dashboard/resources');
}

// ─── Create Need ─────────────────────────────────────────────────────────────

export async function createNeed(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const supabase = await createClientServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'You must be signed in.', success: false };

  const title = (formData.get('title') as string)?.trim();
  const description = (formData.get('description') as string)?.trim() || null;
  const category_id = (formData.get('category_id') as string) || null;
  const deadline = (formData.get('deadline') as string) || null;
  const duration = (formData.get('duration') as string)?.trim() || null;
  const budget_min = formData.get('budget_min') ? parseFloat(formData.get('budget_min') as string) : null;
  const budget_max = formData.get('budget_max') ? parseFloat(formData.get('budget_max') as string) : null;
  const location = (formData.get('location') as string)?.trim() || null;
  const image_url = (formData.get('image_url') as string) || null;

  if (!title) return { error: 'Title is required.', success: false };

  const { error } = await supabase.from('needs').insert({
    poster_id: user.id,   // ← correct column: poster_id, NOT user_id
    title,
    description,
    category_id,
    deadline,
    duration,
    budget_min,
    budget_max,
    location,
    image_url,
    status: 'open',
  });

  if (error) {
    console.error('[createNeed]', error);
    return { error: 'Unable to post need. Please try again.', success: false };
  }

  revalidatePath('/dashboard/requests');
  redirect('/dashboard/requests');
}

// ─── Create Ride ─────────────────────────────────────────────────────────────

export async function createRide(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const supabase = await createClientServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'You must be signed in.', success: false };

  const from_location = (formData.get('from_location') as string)?.trim();
  const to_location = (formData.get('to_location') as string)?.trim();
  const ride_date = formData.get('ride_date') as string;
  const ride_time = formData.get('ride_time') as string;
  const total_seats = parseInt(formData.get('total_seats') as string, 10);
  const vehicleRaw = (formData.get('vehicle_type') as string)?.toLowerCase() || 'car';
  const estimated_cost = formData.get('estimated_cost')
    ? parseFloat(formData.get('estimated_cost') as string)
    : null;
  const notes = (formData.get('notes') as string)?.trim() || null;

  if (!from_location || !to_location) return { error: 'Origin and destination are required.', success: false };
  if (!ride_date || !ride_time) return { error: 'Date and time are required.', success: false };
  if (!total_seats || total_seats < 1) return { error: 'At least 1 seat is required.', success: false };

  // Normalize vehicle_type for public.vehicle_type enum: ['car', 'bike', 'auto', 'bus', 'other']
  let vehicle_type = 'other';
  if (['car', 'bike', 'auto', 'bus'].includes(vehicleRaw)) {
    vehicle_type = vehicleRaw;
  } else if (['suv', 'van', 'sedan'].includes(vehicleRaw)) {
    vehicle_type = 'car';
  }

  const { error } = await supabase.from('rides').insert({
    creator_id: user.id,   // ← correct column: creator_id
    from_location,
    to_location,
    ride_date,
    ride_time,
    total_seats,
    available_seats: total_seats,
    vehicle_type,
    estimated_cost,
    notes,
    status: 'active',
  });

  if (error) {
    console.error('[createRide]', error);
    return { error: 'Unable to post ride. Please try again.', success: false };
  }

  revalidatePath('/dashboard/rides');
  redirect('/dashboard/rides');
}

// ─── Create Skill ─────────────────────────────────────────────────────────────

export async function createSkill(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const supabase = await createClientServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'You must be signed in.', success: false };

  const title = (formData.get('title') as string)?.trim();
  const description = (formData.get('description') as string)?.trim() || null;
  const category_id = (formData.get('category_id') as string) || null;
  const levelRaw = (formData.get('level') as string)?.toLowerCase();
  const availabilityRaw = (formData.get('availability') as string)?.trim();
  const rateRaw = formData.get('rate') as string;
  const rate = rateRaw ? parseFloat(rateRaw) : null;
  const rate_unit = (formData.get('rate_unit') as string) || 'free';

  if (!title) return { error: 'Skill title is required.', success: false };

  // Normalize level enum: ['beginner', 'intermediate', 'advanced', 'expert']
  let level = 'intermediate';
  if (levelRaw === 'beginner') level = 'beginner';
  else if (levelRaw === 'intermediate') level = 'intermediate';
  else if (levelRaw === 'advanced' || levelRaw === 'expert') level = 'expert';

  // Normalize availability enum: ['free', 'paid', 'exchange']
  let availability = 'free';
  if (rate_unit === 'exchange') availability = 'exchange';
  else if (rate_unit === 'per_hour' || rate_unit === 'per_session' || (rate && rate > 0)) availability = 'paid';

  const fullDescription = availabilityRaw 
    ? `${description ? description + '\n\n' : ''}Availability: ${availabilityRaw}`
    : description;

  const { error } = await supabase.from('skills').insert({
    owner_id: user.id,    // ← correct column: owner_id, NOT user_id
    title,
    description: fullDescription,
    category_id,
    level,
    availability,
    rate,
    rate_unit,
    is_active: true,
  });

  if (error) {
    console.error('[createSkill]', error);
    return { error: 'Unable to add skill. Please try again.', success: false };
  }

  revalidatePath('/dashboard/skills');
  revalidatePath('/dashboard/skills/my-skills');
  redirect('/dashboard/skills');
}
