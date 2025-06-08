// Asegurar que crypto polyfill esté disponible antes de usar UUID
import 'react-native-get-random-values';
// Importación optimizada de UUID para evitar problemas con crypto polyfill
import { v4 as uuidv4 } from 'uuid';

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
  const storagePath = `avatars/${userId}/${uuidv4()}.jpg`;
  const publicUrl = await uploadImageToStorage(manipulated.uri, storagePath, 'media');
  if (!publicUrl) throw new Error('Error al subir la imagen de avatar');
  return publicUrl;
};
