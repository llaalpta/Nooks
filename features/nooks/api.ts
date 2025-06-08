// Obtener la URL de la imagen principal de un Nook
import { supabase } from '../../utils/supabase';

import type { TablesInsert, TablesUpdate } from '../../types/supabase';
export const getNookPrimaryImageUrl = async (nookId: string): Promise<string | null> => {
  const { data, error } = await supabase
    .from('media')
    .select('storage_path')
    .eq('entity_type', 'location')
    .eq('entity_id', nookId)
    .order('is_primary', { ascending: false })
    .limit(1)
    .single();
  if (error || !data) return null;
  const { data: urlData } = supabase.storage.from('media').getPublicUrl(data.storage_path);
  return urlData?.publicUrl ?? null;
};

// CRUD Nooks (ubicaciones específicas dentro de un Realm)
export const getNooks = async (realmId: string) => {
  const { data, error } = await supabase
    .from('locations')
    .select(
      `
      *, 
      location_tags ( 
        tag_id, 
        tags:tag_id (id, name, color) 
      ), 
      treasures:treasures(count)
    `
    )
    .eq('parent_location_id', realmId);

  if (error) throw new Error(error.message || 'Error al obtener los Nooks');

  // Mapea los tags y el count de treasures para cada nook
  return (data || []).map((nook) => ({
    ...nook,
    tags: (nook.location_tags || []).map((lt: any) => lt.tags),
    treasuresCount: nook.treasures?.[0]?.count ?? 0,
  }));
};

export const getNookById = async (id: string) => {
  const { data, error } = await supabase.from('locations').select('*').eq('id', id).single();
  if (error) throw new Error(error.message || 'Error al obtener el Nook');
  return data;
};

export const createNook = async (data: TablesInsert<'locations'>) => {
  const { data: result, error } = await supabase.from('locations').insert([data]).select().single();
  if (error) throw new Error(error.message || 'Error al crear el Nook');
  return result;
};

export const updateNook = async (id: string, data: TablesUpdate<'locations'>) => {
  const { data: result, error } = await supabase
    .from('locations')
    .update(data)
    .eq('id', id)
    .select()
    .single();
  if (error) throw new Error(error.message || 'Error al actualizar el Nook');
  return result;
};

export const deleteNook = async (id: string) => {
  const { error } = await supabase.from('locations').delete().eq('id', id);
  if (error) throw new Error(error.message || 'Error al eliminar el Nook');
};

export const getNookWithTags = async (id: string) => {
  const { data, error } = await supabase
    .from('locations')
    .select(
      `
      *,
      location_tags (
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

  if (error) throw new Error(error.message || 'Error al obtener el Nook con etiquetas');

  // Mapear tags igual que en getNooks
  return {
    ...data,
    tags: (data.location_tags || []).map((lt: any) => lt.tags),
  };
};
