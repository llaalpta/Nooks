import { StyleSheet } from 'react-native';

import type { AppTheme } from '@/types/theme';

export const createStyles = (theme: AppTheme) => {
  // fallback para fontSize
  const baseFontSize = 16;
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.background },
    emptyContainer: { flex: 1, alignItems: 'center' as const, justifyContent: 'center' as const },
    emptyText: {
      color: theme.colors.onSurfaceVariant,
      fontSize: baseFontSize,
      marginBottom: theme.spacing.m,
    },
    headerSpacer: { height: theme.spacing.m },
    imageContainer: { alignItems: 'center' as const, marginBottom: theme.spacing.m },
    image: {
      width: 180,
      height: 180,
      borderRadius: theme.borderRadius.l,
      backgroundColor: theme.colors.surfaceVariant,
    },
    placeholderImage: {
      width: 180,
      height: 180,
      borderRadius: theme.borderRadius.l,
      backgroundColor: theme.colors.surfaceVariant,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
    },
    contentContainer: { paddingHorizontal: theme.spacing.xl, paddingTop: theme.spacing.s },
    header: { marginBottom: theme.spacing.s },
    headerTitle: {
      fontSize: 22,
      fontWeight: 'bold' as const,
      marginBottom: theme.spacing.xs,
      color: theme.colors.onSurface,
    },
    description: { fontSize: baseFontSize, color: theme.colors.onSurfaceVariant },
    listFooter: { height: theme.spacing.l },
  });
};
