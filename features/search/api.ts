import { supabase } from '../../utils/supabase';

import type { Database } from '../../types/supabase';

export type Realm = Database['public']['Tables']['locations']['Row'];
export type Nook = Database['public']['Tables']['locations']['Row'];
export type Treasure = Database['public']['Tables']['treasures']['Row'];

export type SearchType = 'realm' | 'nook' | 'treasure' | 'all';

export interface SearchParams {
  userId: string;
  searchText?: string;
  type?: SearchType;
  tagIds?: string[];
}

export const searchItems = async ({
  userId,
  searchText = '',
  type = 'all',
  tagIds = [],
}: SearchParams) => {
  let realms: Realm[] = [];
  let nooks: Nook[] = [];
  let treasures: Treasure[] = [];

  // Helper para filtrar por tags
  async function getLocationIdsByTagIds(tagIds: string[]): Promise<string[]> {
    if (tagIds.length === 0) return [];
    const { data, error } = await supabase
      .from('location_tags')
      .select('location_id')
      .in('tag_id', tagIds);
    if (error) throw new Error(error.message || 'Error al obtener location_ids por tag_ids');
    return (data || []).map((row: { location_id: string }) => row.location_id);
  }
  async function getTreasureIdsByTagIds(tagIds: string[]): Promise<string[]> {
    if (tagIds.length === 0) return [];
    const { data, error } = await supabase
      .from('treasure_tags')
      .select('treasure_id')
      .in('tag_id', tagIds);
    if (error) throw new Error(error.message || 'Error al obtener treasure_ids por tag_ids');
    return (data || []).map((row: { treasure_id: string }) => row.treasure_id);
  }

  // Realms
  if (type === 'realm' || type === 'all') {
    let query = supabase
      .from('locations')
      .select('*, location_tags(tag_id)')
      .eq('user_id', userId)
      .is('parent_location_id', null);
    if (searchText) {
      query = query.or(`name.ilike.%${searchText}%,description.ilike.%${searchText}%`);
    }
    if (tagIds.length > 0) {
      const ids = await getLocationIdsByTagIds(tagIds);
      if (ids.length > 0) query = query.in('id', ids);
      else query = query.in('id', ['']); // No results
    }
    const { data, error } = await query;
    if (error) throw new Error(error.message || 'Error al buscar Realms');
    realms = data || [];
  }
  // Nooks
  if (type === 'nook' || type === 'all') {
    let query = supabase
      .from('locations')
      .select('*, location_tags(tag_id)')
      .eq('user_id', userId)
      .not('parent_location_id', 'is', null);
    if (searchText) {
      query = query.or(`name.ilike.%${searchText}%,description.ilike.%${searchText}%`);
    }
    if (tagIds.length > 0) {
      const ids = await getLocationIdsByTagIds(tagIds);
      if (ids.length > 0) query = query.in('id', ids);
      else query = query.in('id', ['']);
    }
    const { data, error } = await query;
    if (error) throw new Error(error.message || 'Error al buscar Nooks');
    nooks = data || [];
  }
  // Treasures
  if (type === 'treasure' || type === 'all') {
    let query = supabase.from('treasures').select('*, treasure_tags(tag_id)').eq('user_id', userId);
    if (searchText) {
      query = query.or(`name.ilike.%${searchText}%,description.ilike.%${searchText}%`);
    }
    if (tagIds.length > 0) {
      const ids = await getTreasureIdsByTagIds(tagIds);
      if (ids.length > 0) query = query.in('id', ids);
      else query = query.in('id', ['']);
    }
    const { data, error } = await query;
    if (error) throw new Error(error.message || 'Error al buscar Treasures');
    treasures = data || [];
  }
  return { realms, nooks, treasures };
};

export const searchRealms = async (userId: string, searchText: string) => {
  const { data, error } = await supabase
    .from('locations')
    .select('*')
    .eq('user_id', userId)
    .is('parent_location_id', null)
    .ilike('name', `%${searchText}%`);
  if (error) throw new Error(error.message || 'Error al buscar Realms');
  return data;
};

export const searchNooks = async (userId: string, searchText: string) => {
  const { data, error } = await supabase
    .from('locations')
    .select('*')
    .eq('user_id', userId)
    .not('parent_location_id', 'is', null)
    .ilike('name', `%${searchText}%`);
  if (error) throw new Error(error.message || 'Error al buscar Nooks');
  return data;
};

export const searchTreasures = async (userId: string, searchText: string) => {
  const { data, error } = await supabase
    .from('treasures')
    .select('*')
    .eq('user_id', userId)
    .ilike('name', `%${searchText}%`);
  if (error) throw new Error(error.message || 'Error al buscar Treasures');
  return data;
};
