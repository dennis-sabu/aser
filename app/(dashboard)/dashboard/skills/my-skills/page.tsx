import { createClientServer } from '@/lib/supabase-server';
import MySkillsClient from './MySkillsClient';

export default async function MySkillsPage() {
  const supabase = await createClientServer();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: skills, error: skillsError } = await supabase
    .from('skills')
    .select('*, category:categories(id, name, slug)')
    .eq('owner_id', user?.id ?? '')
    .order('created_at', { ascending: false });

  const { data: categories } = await supabase
    .from('categories')
    .select('id, name, slug')
    .order('name');

  const categoryMap: Record<string, string> = {};
  (categories ?? []).forEach((c: { id: string; slug: string }) => { categoryMap[c.slug] = c.id; });

  if (skillsError) console.error('[MySkillsPage]', skillsError);

  return (
    <MySkillsClient
      initialSkills={skills ?? []}
      categoryMap={categoryMap}
      categories={categories ?? []}
    />
  );
}
