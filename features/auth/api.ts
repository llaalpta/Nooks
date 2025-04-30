import { supabase } from '../../utils/supabase';

import type { TablesInsert, TablesUpdate } from '../../types/supabase';

// Registro de usuario
export const signUp = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) throw new Error(error.message || 'No se pudo registrar');
  return data;
};

// Login de usuario
export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw new Error(error.message || 'Credenciales incorrectas');
  return data;
};

// Logout
export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw new Error(error.message || 'Error al cerrar sesión');
};

// Recuperación de contraseña
export const resetPassword = async (email: string) => {
  const { error } = await supabase.auth.resetPasswordForEmail(email);
  if (error) throw new Error(error.message || 'No se pudo enviar el email');
};

// Obtener usuario actual
export const getCurrentUser = async () => {
  const { data } = await supabase.auth.getUser();
  return data.user ?? null;
};

// Obtener perfil
export const getProfile = async (userId: string) =>
  supabase.from('profiles').select('*').eq('id', userId).single();

// Crear perfil (al registrar usuario)
export const createProfile = async (data: TablesInsert<'profiles'>) =>
  supabase.from('profiles').insert([data]).select().single();

// Actualizar perfil
export const updateProfile = async (id: string, data: TablesUpdate<'profiles'>) =>
  supabase.from('profiles').update(data).eq('id', id).select().single();
