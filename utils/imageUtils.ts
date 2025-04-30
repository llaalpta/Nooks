import * as FileSystem from 'expo-file-system';
import * as ImageManipulator from 'expo-image-manipulator';

import { supabase } from './supabase';

export async function compressAndResizeImage(
  uri: string,
  options?: { width?: number; height?: number; compress?: number }
) {
  const { width = 800, height = 800, compress = 0.7 } = options || {};
  const result = await ImageManipulator.manipulateAsync(uri, [{ resize: { width, height } }], {
    compress,
    format: ImageManipulator.SaveFormat.JPEG,
  });
  return result;
}

export async function uploadImageToStorage(
  localUri: string,
  storagePath: string,
  bucket = 'media'
): Promise<string | null> {
  try {
    // Obtener una URL firmada para la subida
    const { data, error } = await supabase.storage.from(bucket).createSignedUploadUrl(storagePath);

    if (error || !data?.signedUrl) {
      console.error('Error obteniendo signedUrl:', error);
      return null;
    }

    // Subir el archivo usando FileSystem.uploadAsync
    const uploadRes = await FileSystem.uploadAsync(data.signedUrl, localUri, {
      httpMethod: 'PUT',
      headers: { 'Content-Type': 'image/jpeg' },
      uploadType: FileSystem.FileSystemUploadType.BINARY_CONTENT,
    });

    if (uploadRes.status !== 200) {
      console.error('Error en uploadAsync:', uploadRes);
      return null;
    }

    // Devolver la URL pública
    const { data: publicUrlData } = supabase.storage.from(bucket).getPublicUrl(storagePath);
    return publicUrlData.publicUrl || null;
  } catch (error) {
    console.error('Error en uploadImageToStorage:', error);
    return null;
  }
}
