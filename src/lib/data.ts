import { createClient } from '@/lib/supabase/client';
import fixtures from '@/mocks/fixtures';

export async function getFeedData(postal: string | null) {
  const supabase = createClient();
  const { data, error } = await supabase.from('events').select('*, event_time_options(*), event_site_options(*), sites(*)').limit(20);
  if (!error && data?.length) return data;
  return fixtures.feed;
}