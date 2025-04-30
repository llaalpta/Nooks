import * as FileSystem from 'expo-file-system';

import { compressAndResizeImage, uploadImageToStorage } from '../../utils/imageUtils';
import { supabase } from '../../utils/supabase';

import type { TablesInsert, TablesUpdate } from '../../types/supabase';

export const getMediaByEntity = async (entity_type: string, entity_id: string) => {
  const { data, error } = await supabase
    .from('media')
    .select('*')
    .eq('entity_type', entity_type)
    .eq('entity_id', entity_id);
  if (error) throw new Error(error.message || 'Error al obtener los archivos multimedia');
  return data;
};

export const getMediaById = async (id: string) => {
  const { data, error } = await supabase.from('media').select('*').eq('id', id).single();
  if (error) throw new Error(error.message || 'Error al obtener el archivo multimedia');
  return data;
};

export const createMedia = async (data: TablesInsert<'media'>) => {
  const { data: result, error } = await supabase.from('media').insert([data]).select().single();
  if (error) throw new Error(error.message || 'Error al crear el archivo multimedia');
  return result;
};

export const updateMedia = async (id: string, data: TablesUpdate<'media'>) => {
  const { data: result, error } = await supabase
    .from('media')
    .update(data)
    .eq('id', id)
    .select()
    .single();
  if (error) throw new Error(error.message || 'Error al actualizar el archivo multimedia');
  return result;
};

export const deleteMedia = async (id: string) => {
  const { error } = await supabase.from('media').delete().eq('id', id);
  if (error) throw new Error(error.message || 'Error al eliminar el archivo multimedia');
};

export const setPrimaryMedia = async (
  entityType: 'location' | 'treasure',
  entityId: string,
  mediaId: string
) => {
  const { error: unsetError } = await supabase
    .from('media')
    .update({ is_primary: false } as TablesUpdate<'media'>)
    .eq('entity_type', entityType)
    .eq('entity_id', entityId);
  if (unsetError)
    throw new Error(unsetError.message || 'Error al desmarcar las imágenes principales');

  const { data, error } = await supabase
    .from('media')
    .update({ is_primary: true } as TablesUpdate<'media'>)
    .eq('id', mediaId)
    .select()
    .single();
  if (error) throw new Error(error.message || 'Error al marcar la imagen como principal');
  return data;
};

export const uploadMedia = async (
  userId: string,
  entityType: 'location' | 'treasure',
  entityId: string,
  localUri: string,
  isPrimary: boolean = false
) => {
  // Número máximo de intentos para subir la imagen
  const MAX_RETRIES = 3;
  let attempt = 1;
  let lastError: any = null;

  while (attempt <= MAX_RETRIES) {
    try {
      // Comprimir más agresivamente en cada reintento
      const compressionLevel = 0.7 - (attempt - 1) * 0.15; // 0.7, 0.55, 0.4
      const maxDimension = 1200 - (attempt - 1) * 200; // 1200, 1000, 800

      // Primero optimizar la imagen para reducir su tamaño
      const optimizedImage = await compressAndResizeImage(localUri, {
        width: maxDimension,
        height: maxDimension,
        compress: compressionLevel,
      });

      // Verificar si podemos acceder a la información del archivo
      let fileSize: number | null = null;
      try {
        const fileInfo = await FileSystem.getInfoAsync(optimizedImage.uri);
        // Verificar si fileInfo.size existe antes de usarlo
        if (fileInfo.exists && 'size' in fileInfo) {
          fileSize = fileInfo.size;
        }
      } catch (fileInfoError) {
        // Manejar el error de obtener información del archivo
        console.error('Error al obtener información del archivo:', fileInfoError);
        // Silenciar error, fileSize seguirá siendo null
      }

      // Generar un nombre único para el archivo
      const fileExt = 'jpeg'; // Siempre usamos jpeg para las imágenes optimizadas
      const fileName = `${Date.now()}_${attempt}.${fileExt}`;
      const storagePath = `${userId}/${entityType}/${entityId}/${fileName}`;

      try {
        // Usar el método de la utilidad que ya corregimos
        const publicUrl = await uploadImageToStorage(optimizedImage.uri, storagePath, 'media');

        if (!publicUrl) {
          throw new Error('No se pudo subir la imagen o obtener la URL pública');
        }

        // Crear el registro en la tabla de media
        const mediaData: TablesInsert<'media'> = {
          user_id: userId,
          entity_type: entityType,
          entity_id: entityId,
          storage_path: storagePath,
          is_primary: isPrimary,
          mime_type: 'image/jpeg',
          file_size: fileSize,
        };

        const mediaRecord = await createMedia(mediaData);

        // Si es la imagen principal, desmarcar las demás
        if (isPrimary) {
          await setPrimaryMedia(entityType, entityId, mediaRecord.id);
        }

        return { ...mediaRecord, publicUrl };
      } catch (uploadError) {
        lastError = uploadError;

        // Si no es el último intento, esperar antes de reintentar
        if (attempt < MAX_RETRIES) {
          // Backoff exponencial para esperar entre reintentos
          const delay = Math.min(1000 * Math.pow(2, attempt - 1), 8000);
          await new Promise((resolve) => setTimeout(resolve, delay));
        }
      }
    } catch (processingError) {
      lastError = processingError;

      // Si no es el último intento, esperar antes de reintentar
      if (attempt < MAX_RETRIES) {
        const delay = Math.min(1000 * Math.pow(2, attempt - 1), 8000);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }

    attempt++;
  }

  // Si llegamos aquí es porque todos los intentos fallaron
  // Crear un mensaje de error detallado
  let errorMessage = `Error al subir imagen después de ${MAX_RETRIES} intentos.`;
  if (lastError) {
    errorMessage += ` Último error: ${lastError.message}`;

    // Si es un error de red, proporcionar un mensaje más descriptivo
    if (lastError instanceof TypeError && lastError.message === 'Network request failed') {
      errorMessage =
        'Error de conexión durante la subida. Verifica tu conexión a internet o intenta con una imagen más pequeña.';
    }
  }

  throw new Error(errorMessage);
};
