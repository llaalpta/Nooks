import { supabase } from '../../utils/supabase';

import type { TablesInsert, TablesUpdate } from '../../types/supabase';

export const getTreasures = async (nookId: string) => {
  const { data, error } = await supabase
    .from('treasures')
    .select('*')
    .eq('nook_location_id', nookId);
  if (error) throw new Error(error.message || 'Error al obtener los Treasures');
  return data;
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
