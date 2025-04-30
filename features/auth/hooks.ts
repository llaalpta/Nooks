import { User } from '@supabase/supabase-js';
import { useMutation, useQuery, UseQueryResult } from '@tanstack/react-query';

import {
  signUp,
  signIn,
  signOut,
  resetPassword,
  getCurrentUser,
  getProfile,
  createProfile,
  updateProfile,
} from './api';

import type { Database } from '../../types/supabase';

export function useSignUpMutation() {
  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      signUp(email, password),
  });
}

export function useSignInMutation() {
  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      signIn(email, password),
  });
}

export function useSignOutMutation() {
  return useMutation({ mutationFn: signOut });
}

export function useResetPasswordMutation() {
  return useMutation({ mutationFn: resetPassword });
}

export function useCurrentUserQuery(): UseQueryResult<User | null> {
  return useQuery({
    queryKey: ['currentUser'],
    queryFn: getCurrentUser,
  });
}

export function useProfileQuery(
  userId: string
): UseQueryResult<Database['public']['Tables']['profiles']['Row'] | null> {
  return useQuery({
    queryKey: ['profile', userId],
    queryFn: () => getProfile(userId),
    enabled: !!userId,
  });
}

export function useCreateProfileMutation() {
  return useMutation({
    mutationFn: createProfile,
  });
}

export function useUpdateProfileMutation() {
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Database['public']['Tables']['profiles']['Update'];
    }) => updateProfile(id, data),
  });
}
