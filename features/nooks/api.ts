import { supabase } from '../../utils/supabase';

import type { TablesInsert, TablesUpdate } from '../../types/supabase';

// CRUD Nooks (ubicaciones específicas dentro de un Realm)
export const getNooks = async (realmId: string) => {
  const { data, error } = await supabase
    .from('locations')
    .select('*')
    .eq('parent_location_id', realmId);
  if (error) throw new Error(error.message || 'Error al obtener los Nooks');
  return data;
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
