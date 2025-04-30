import { supabase } from '../../utils/supabase';

import type { TablesInsert, TablesUpdate } from '../../types/supabase';

// CRUD Realms (ubicaciones generales)
export const getRealms = async (userId: string) => {
  const { data, error } = await supabase
    .from('locations')
    .select(`*, location_tags ( tag_id, tags:tag_id (id, name, color) )`)
    .eq('user_id', userId)
    .is('parent_location_id', null);
  if (error) throw new Error(error.message || 'Error al obtener los Realms');
  // Mapea los tags para cada realm
  return (data || []).map((realm) => ({
    ...realm,
    tags: (realm.location_tags || []).map((lt: any) => lt.tags),
  }));
};

export const getRealmById = async (id: string) => {
  const { data, error } = await supabase.from('locations').select('*').eq('id', id).single();
  if (error) throw new Error(error.message || 'Error al obtener el Realm');
  return data;
};

// Obtener un Realm con sus etiquetas
export const getRealmWithTags = async (id: string) => {
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
  if (error) throw new Error(error.message || 'Error al obtener el Realm con etiquetas');
  return data;
};

export const createRealm = async (data: TablesInsert<'locations'>) => {
  const { data: result, error } = await supabase.from('locations').insert([data]).select().single();
  if (error) throw new Error(error.message || 'Error al crear el Realm');
  return result;
};

export const updateRealm = async (id: string, data: TablesUpdate<'locations'>) => {
  const { data: result, error } = await supabase
    .from('locations')
    .update(data)
    .eq('id', id)
    .select()
    .single();
  if (error) throw new Error(error.message || 'Error al actualizar el Realm');
  return result;
};

export const deleteRealm = async (id: string) => {
  const { error } = await supabase.from('locations').delete().eq('id', id);
  if (error) throw new Error(error.message || 'Error al eliminar el Realm');
};

// Comprobar si un Realm tiene Nooks antes de eliminar
export const hasNooks = async (realmId: string): Promise<boolean> => {
  const { data, error } = await supabase
    .from('locations')
    .select('id')
    .eq('parent_location_id', realmId)
    .limit(1);
  if (error) throw new Error(error.message || 'Error al comprobar si el Realm tiene Nooks');
  return !!(data && data.length > 0);
};

// Comprobar si un Nook tiene Treasures antes de eliminar
export const hasTreasures = async (nookId: string): Promise<boolean> => {
  const { data, error } = await supabase
    .from('treasures')
    .select('id')
    .eq('nook_location_id', nookId)
    .limit(1);
  if (error) throw new Error(error.message || 'Error al comprobar si el Nook tiene Treasures');
  return !!(data && data.length > 0);
};

// Buscar Realms cercanos a unas coordenadas (lat, lng, radio en metros)
export const getNearbyRealms = async (
  userId: string,
  latitude: number,
  longitude: number,
  radiusMeters: number
) => {
  // Usamos la función de PostGIS earth_distance si está disponible, si no, calculamos distancia euclídea básica
  // Aquí se asume que la tabla locations tiene columnas latitude y longitude
  const { data, error } = await supabase.rpc('realms_nearby', {
    user_id: userId,
    lat: latitude,
    lng: longitude,
    radius: radiusMeters,
  });
  if (error) throw new Error(error.message || 'Error al buscar Realms cercanos');
  return data;
};

// ------------- GESTIÓN DE ETIQUETAS -------------
// Asignar etiquetas a un Realm
export const setTagsForRealm = async (
  realmId: string,
  tags: { id: string }[],
  isEditing = false
) => {
  if (isEditing) {
    await supabase.from('location_tags').delete().eq('location_id', realmId);
  }
  if (tags.length > 0) {
    const locationTagsData = tags.map((tag) => ({ location_id: realmId, tag_id: tag.id }));
    const { error } = await supabase.from('location_tags').insert(locationTagsData);
    if (error) throw new Error(error.message || 'Error al asociar etiquetas al Realm');
  }
};

// Eliminar todas las etiquetas de un Realm
export const removeAllTagsFromRealm = async (realmId: string) => {
  const { error } = await supabase.from('location_tags').delete().eq('location_id', realmId);

  if (error) throw new Error(error.message || 'Error al eliminar etiquetas del Realm');
};

// Obtener todas las etiquetas de un Realm
export const getRealmTags = async (realmId: string) => {
  const { data, error } = await supabase
    .from('location_tags')
    .select('tag_id, tags:tag_id (id, name, color)')
    .eq('location_id', realmId);
  if (error) throw new Error(error.message || 'Error al obtener los tags del Realm');
  // Devuelve solo el array de tags
  return (data || []).map((item) => item.tags);
};

// ------------- GESTIÓN DE IMÁGENES -------------
// Obtener imágenes de un Realm
export const getRealmImages = async (realmId: string) => {
  const { data, error } = await supabase
    .from('media')
    .select('*')
    .eq('entity_type', 'location')
    .eq('entity_id', realmId)
    .order('is_primary', { ascending: false });

  if (error) throw new Error(error.message || 'Error al obtener imágenes del Realm');
  return data;
};

// Registrar una nueva imagen para un Realm
export const addRealmImage = async (
  realmId: string,
  userId: string,
  storagePath: string,
  isPrimary: boolean = false,
  mimeType?: string,
  fileSize?: number
) => {
  const mediaData = {
    entity_id: realmId,
    entity_type: 'location',
    user_id: userId,
    storage_path: storagePath,
    is_primary: isPrimary,
    mime_type: mimeType,
    file_size: fileSize,
  };

  const { data, error } = await supabase.from('media').insert([mediaData]).select().single();

  if (error) throw new Error(error.message || 'Error al guardar referencia de imagen del Realm');
  return data;
};

// Establecer imagen como primaria (la imagen de portada del Realm)
export const setRealmPrimaryImage = async (imageId: string, realmId: string) => {
  try {
    // Primero, quitamos el estado primary de todas las imágenes del realm
    await supabase
      .from('media')
      .update({ is_primary: false })
      .eq('entity_type', 'location')
      .eq('entity_id', realmId);

    // Luego establecemos la imagen seleccionada como primaria
    const { error } = await supabase
      .from('media')
      .update({ is_primary: true })
      .eq('id', imageId)
      .eq('entity_id', realmId);

    if (error) throw new Error(error.message || 'Error al establecer imagen primaria');
  } catch (error: any) {
    throw new Error(error.message || 'Error al actualizar imagen primaria del Realm');
  }
};

// Eliminar imagen de un Realm
export const deleteRealmImage = async (imageId: string) => {
  const { error } = await supabase.from('media').delete().eq('id', imageId);

  if (error) throw new Error(error.message || 'Error al eliminar imagen del Realm');
};

// Obtener la URL de la imagen principal de un Realm
export const getRealmPrimaryImageUrl = async (realmId: string): Promise<string | null> => {
  const { data, error } = await supabase
    .from('media')
    .select('storage_path')
    .eq('entity_type', 'location')
    .eq('entity_id', realmId)
    .order('is_primary', { ascending: false })
    .limit(1)
    .single();
  if (error || !data) return null;
  const { data: urlData } = supabase.storage.from('media').getPublicUrl(data.storage_path);
  return urlData?.publicUrl ?? null;
};
