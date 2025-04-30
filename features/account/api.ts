import * as uuid from 'uuid';

import { compressAndResizeImage, uploadImageToStorage } from '@/utils/imageUtils';
import { supabase } from '@/utils/supabase';

export const getProfile = async (userId: string) => {
  const { data, error, status } = await supabase
    .from('profiles')
    .select('username, avatar_url')
    .eq('id', userId)
    .single();
  if (error && status !== 406) throw new Error(error.message || 'Error al obtener el perfil');
  return data;
};

export const updateProfile = async (
  userId: string,
  updates: { username: string; avatar_url: string }
) => {
  const { error } = await supabase.from('profiles').upsert({
    id: userId,
    ...updates,
    updated_at: new Date().toISOString(),
  });
  if (error) throw new Error(error.message || 'Error al actualizar el perfil');
};

export const uploadAvatar = async (userId: string, localUri: string) => {
  const manipulated = await compressAndResizeImage(localUri);
  const storagePath = `${userId}/${uuid.v4()}.jpg`;
  const publicUrl = await uploadImageToStorage(manipulated.uri, storagePath, 'avatars');
  if (!publicUrl) throw new Error('Error al subir la imagen de avatar');
  return publicUrl;
};
