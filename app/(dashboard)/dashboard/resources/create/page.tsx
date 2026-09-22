import { createClientServer } from '@/lib/supabase-server';
import CreateResourceForm from './CreateResourceForm';

export default async function CreateResourcePage() {
  const supabase = await createClientServer();

  // Load categories to build slug→id map
  const { data: categories } = await supabase
    .from('categories')
    .select('id, slug')
    .order('name');

  const categoryMap: Record<string, string> = {};
  (categories ?? []).forEach((c: { id: string; slug: string }) => {
    categoryMap[c.slug] = c.id;
  });

  return <CreateResourceForm categoryMap={categoryMap} />;
}
