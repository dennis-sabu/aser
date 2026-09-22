import { cache } from 'react';
import { createClientServer } from '@/lib/supabase-server';

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon?: string | null;
}

// React cache memoizes category queries per request so multiple components
// don't repeat the same query to Supabase.
export const getCategories = cache(async (): Promise<Category[]> => {
  const supabase = await createClientServer();
  const { data, error } = await supabase
    .from('categories')
    .select('id, name, slug, icon')
    .order('name', { ascending: true });

  if (error) {
    console.error('[getCategories] Error:', error);
    return [];
  }
  return data ?? [];
});
