import { supabase } from '../../utils/supabase';

import type { TablesInsert, TablesUpdate } from '../../types/supabase';

// 🔥 FUNCIÓN ACTUALIZADA - siguiendo el patrón de nooks
export const getTreasures = async (nookId: string) => {
  const { data, error } = await supabase
    .from('treasures')
    .select(
      `
      *,
      treasure_tags (
        tag_id,
        tags:tag_id (
          id,
          name,
          color
        )
      )
    `
    )
    .eq('nook_location_id', nookId);

  if (error) throw new Error(error.message || 'Error al obtener los Treasures');

  // 🔥 Mapear tags igual que en nooks
  return (data || []).map((treasure) => ({
    ...treasure,
    tags: (treasure.treasure_tags || []).map((tt: any) => tt.tags),
  }));
};

// 🔥 NUEVA FUNCIÓN - getTreasureWithTags (igual que getNookWithTags)
export const getTreasureWithTags = async (id: string) => {
  const { data, error } = await supabase
    .from('treasures')
    .select(
      `
      *,
      treasure_tags (
        tag_id,
        tags:tag_id (
          id,
          name,
          color
        )
      )
    `
    )
    .eq('id', id)
    .single();

  if (error) throw new Error(error.message || 'Error al obtener el Treasure con etiquetas');

  // Mapear tags igual que en getTreasures
  return {
    ...data,
    tags: (data.treasure_tags || []).map((tt: any) => tt.tags),
  };
};

export const getTreasureById = async (id: string) => {
  const { data, error } = await supabase.from('treasures').select('*').eq('id', id).single();
  if (error) throw new Error(error.message || 'Error al obtener el Treasure');
  return data;
};

export const createTreasure = async (data: TablesInsert<'treasures'>) => {
  const { data: result, error } = await supabase.from('treasures').insert([data]).select().single();
  if (error) throw new Error(error.message || 'Error al crear el Treasure');
  return result;
};

export const updateTreasure = async (id: string, data: TablesUpdate<'treasures'>) => {
  const { data: result, error } = await supabase
    .from('treasures')
    .update(data)
    .eq('id', id)
    .select()
    .single();
  if (error) throw new Error(error.message || 'Error al actualizar el Treasure');
  return result;
};

export const deleteTreasure = async (id: string) => {
  const { error } = await supabase.from('treasures').delete().eq('id', id);
  if (error) throw new Error(error.message || 'Error al eliminar el Treasure');
};

export const getTreasurePrimaryImageUrl = async (treasureId: string): Promise<string | null> => {
  const { data, error } = await supabase
    .from('media')
    .select('storage_path')
    .eq('entity_type', 'treasure')
    .eq('entity_id', treasureId)
    .order('is_primary', { ascending: false })
    .limit(1)
    .single();

  if (error || !data) return null;

  const { data: urlData } = supabase.storage.from('media').getPublicUrl(data.storage_path);
  return urlData?.publicUrl ?? null;
};
