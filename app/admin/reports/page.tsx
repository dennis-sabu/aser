import React from 'react';
import { createClientAdmin } from '@/lib/supabase-server';
import { ReportsClient } from './ReportsClient';

export const metadata = {
  title: 'Safety & Reports | CampusNet Admin',
};

export default async function ReportsPage() {
  const adminClient = createClientAdmin();

  // Fetch real reports from Supabase
  const { data: reports } = await adminClient
    .from('reports')
    .select(`
      id,
      reporter_id,
      reported_id,
      reason,
      details,
      status,
      created_at,
      reporter:profiles!reporter_id(full_name),
      reported:profiles!reported_id(full_name)
    `)
    .order('created_at', { ascending: false });

  return <ReportsClient initialReports={reports || []} />;
}
