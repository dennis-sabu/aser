import React from 'react';
import { createClientAdmin } from '@/lib/supabase-server';
import { AdminDashboardClient } from './AdminDashboardClient';

export const metadata = {
  title: 'Moderator Console | CampusNet',
};

export default async function AdminDashboardPage() {
  const adminClient = createClientAdmin();

  // Fetch real students, resources, rides, needs, skills, and reports from live Supabase
  const [
    { data: students },
    { data: resources },
    { data: rides },
    { data: needs },
    { data: skills },
    { count: reportsCount },
  ] = await Promise.all([
    adminClient
      .from('profiles')
      .select('id, full_name, student_id, department, year, is_verified, phone_number, whatsapp_enabled, created_at')
      .order('created_at', { ascending: false }),
    adminClient
      .from('resources')
      .select('id, title, method, condition, price, status, created_at, owner:profiles!owner_id(full_name)')
      .order('created_at', { ascending: false }),
    adminClient
      .from('rides')
      .select('id, from_location, to_location, ride_date, ride_time, available_seats, price, status, created_at, creator:profiles!creator_id(full_name)')
      .order('created_at', { ascending: false }),
    adminClient
      .from('needs')
      .select('id, title, budget_min, budget_max, deadline, status, created_at, poster:profiles!poster_id(full_name)')
      .order('created_at', { ascending: false }),
    adminClient
      .from('skills')
      .select('id, title, experience_level, rate, rate_unit, created_at, owner:profiles!owner_id(full_name)')
      .order('created_at', { ascending: false }),
    adminClient
      .from('reports')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'open'),
  ]);

  // Normalize ride columns (from_location / to_location or origin / destination)
  const normalizedRides = (rides || []).map((r: any) => ({
    ...r,
    origin: r.origin || r.from_location,
    destination: r.destination || r.to_location,
    departure_date: r.departure_date || r.ride_date,
    departure_time: r.departure_time || r.ride_time,
  }));

  return (
    <AdminDashboardClient
      initialStudents={students || []}
      initialResources={resources || []}
      initialRides={normalizedRides}
      initialNeeds={needs || []}
      initialSkills={skills || []}
      reportsCount={reportsCount ?? 0}
    />
  );
}
