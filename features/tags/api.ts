// Obtener todas las etiquetas de una ubicación (Nook o Realm)
import { supabase } from '../../utils/supabase';

import type { TablesInsert, TablesUpdate } from '../../types/supabase';
export const getLocationTags = async (locationId: string) => {
  const { data, error } = await supabase
    .from('location_tags')
    .select('tag_id, tags:tag_id (id, name, color)')
    .eq('location_id', locationId);
  if (error) throw new Error(error.message || 'Error al obtener los tags de la ubicación');
  return (data || []).map((item) => item.tags);
};

// CRUD Tags (etiquetas)
export const getTags = async (userId: string) => {
  const { data, error } = await supabase.from('tags').select('*').eq('user_id', userId);
  if (error) throw new Error(error.message || 'Error al obtener las etiquetas');
  return data;
};

export const getTagById = async (id: string) => {
  const { data, error } = await supabase.from('tags').select('*').eq('id', id).single();
  if (error) throw new Error(error.message || 'Error al obtener la etiqueta');
  return data;
};

export const createTag = async (data: TablesInsert<'tags'>) => {
  const { data: result, error } = await supabase.from('tags').insert([data]).select().single();
  if (error) throw new Error(error.message || 'Error al crear la etiqueta');
  return result;
};

export const updateTag = async (id: string, data: TablesUpdate<'tags'>) => {
  const { data: result, error } = await supabase
    .from('tags')
    .update(data)
    .eq('id', id)
    .select()
    .single();
  if (error) throw new Error(error.message || 'Error al actualizar la etiqueta');
  return result;
};

export const deleteTag = async (id: string) => {
  const { error } = await supabase.from('tags').delete().eq('id', id);
  if (error) throw new Error(error.message || 'Error al eliminar la etiqueta');
};

// Asociaciones de tags
export const addTagToLocation = async (location_id: string, tag_id: string) => {
  const { error } = await supabase.from('location_tags').insert([{ location_id, tag_id }]);
  if (error) throw new Error(error.message || 'Error al asociar la etiqueta a la ubicación');
};

export const removeTagFromLocation = async (location_id: string, tag_id: string) => {
  const { error } = await supabase
    .from('location_tags')
    .delete()
    .eq('location_id', location_id)
    .eq('tag_id', tag_id);
  if (error) throw new Error(error.message || 'Error al desasociar la etiqueta de la ubicación');
};

export const addTagToTreasure = async (treasure_id: string, tag_id: string) => {
  const { error } = await supabase.from('treasure_tags').insert([{ treasure_id, tag_id }]);
  if (error) throw new Error(error.message || 'Error al asociar la etiqueta al tesoro');
};

export const removeTagFromTreasure = async (treasure_id: string, tag_id: string) => {
  const { error } = await supabase
    .from('treasure_tags')
    .delete()
    .eq('treasure_id', treasure_id)
    .eq('tag_id', tag_id);
  if (error) throw new Error(error.message || 'Error al desasociar la etiqueta del tesoro');
};
