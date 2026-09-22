import { createClientServer } from '@/lib/supabase-server';
import CreateNeedPage from './CreateNeedForm';

export default async function CreateNeedPageWrapper() {
  const supabase = await createClientServer();
  const { data: categories } = await supabase.from('categories').select('id, slug').order('name');
  const categoryMap: Record<string, string> = {};
  (categories ?? []).forEach((c: { id: string; slug: string }) => { categoryMap[c.slug] = c.id; });
  return <CreateNeedPage categoryMap={categoryMap} />;
}
