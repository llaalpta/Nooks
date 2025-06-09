import { supabase } from '../utils/supabase';

import type { TablesInsert, TablesUpdate } from '../types/supabase';

// Realms
export const getRealms = async (userId: string) =>
  supabase.from('locations').select('*').eq('user_id', userId).is('parent_location_id', null);

export const getRealmById = async (id: string) =>
  supabase.from('locations').select('*').eq('id', id).single();

export const createRealm = async (data: TablesInsert<'locations'>) =>
  supabase.from('locations').insert([data]).select().single();

export const updateRealm = async (id: string, data: TablesUpdate<'locations'>) =>
  supabase.from('locations').update(data).eq('id', id).select().single();

export const deleteRealm = async (id: string) => supabase.from('locations').delete().eq('id', id);

// Nooks
export const getNooks = async (realmId: string) =>
  supabase.from('locations').select('*').eq('parent_location_id', realmId);

export const getNookById = async (id: string) =>
  supabase.from('locations').select('*').eq('id', id).single();

export const createNook = async (data: TablesInsert<'locations'>) =>
  supabase.from('locations').insert([data]).select().single();

export const updateNook = async (id: string, data: TablesUpdate<'locations'>) =>
  supabase.from('locations').update(data).eq('id', id).select().single();

export const deleteNook = async (id: string) => supabase.from('locations').delete().eq('id', id);

// Treasures
export const getTreasures = async (nookId: string) =>
  supabase.from('treasures').select('*').eq('nook_location_id', nookId);

export const getTreasureById = async (id: string) =>
  supabase.from('treasures').select('*').eq('id', id).single();

export const createTreasure = async (data: TablesInsert<'treasures'>) =>
  supabase.from('treasures').insert([data]).select().single();

export const updateTreasure = async (id: string, data: TablesUpdate<'treasures'>) =>
  supabase.from('treasures').update(data).eq('id', id).select().single();

export const deleteTreasure = async (id: string) =>
  supabase.from('treasures').delete().eq('id', id);

// Tags
export const getTags = async (userId: string) =>
  supabase.from('tags').select('*').eq('user_id', userId);

export const createTag = async (data: TablesInsert<'tags'>) =>
  supabase.from('tags').insert([data]).select().single();

export const updateTag = async (id: string, data: TablesUpdate<'tags'>) =>
  supabase.from('tags').update(data).eq('id', id).select().single();

export const deleteTag = async (id: string) => supabase.from('tags').delete().eq('id', id);

// tag associations
export const addTagToLocation = async (location_id: string, tag_id: string) =>
  supabase.from('location_tags').insert([{ location_id, tag_id }]);

export const removeTagFromLocation = async (location_id: string, tag_id: string) =>
  supabase.from('location_tags').delete().eq('location_id', location_id).eq('tag_id', tag_id);

export const addTagToTreasure = async (treasure_id: string, tag_id: string) =>
  supabase.from('treasure_tags').insert([{ treasure_id, tag_id }]);

export const removeTagFromTreasure = async (treasure_id: string, tag_id: string) =>
  supabase.from('treasure_tags').delete().eq('treasure_id', treasure_id).eq('tag_id', tag_id);

// Media
export const getMedia = async (entityType: 'location' | 'treasure', entityId: string) =>
  supabase.from('media').select('*').eq('entity_type', entityType).eq('entity_id', entityId);

export const addMedia = async (data: TablesInsert<'media'>) =>
  supabase.from('media').insert([data]).select().single();

export const deleteMedia = async (id: string) => supabase.from('media').delete().eq('id', id);

// global search
export const searchAll = async (userId: string, searchText: string) => {
  const realms = await supabase
    .from('locations')
    .select('*')
    .eq('user_id', userId)
    .is('parent_location_id', null)
    .ilike('name', `%${searchText}%`);
  const nooks = await supabase
    .from('locations')
    .select('*')
    .eq('user_id', userId)
    .not('parent_location_id', 'is', null)
    .ilike('name', `%${searchText}%`);
  const treasures = await supabase
    .from('treasures')
    .select('*')
    .eq('user_id', userId)
    .ilike('name', `%${searchText}%`);
  return { realms: realms.data, nooks: nooks.data, treasures: treasures.data };
};
