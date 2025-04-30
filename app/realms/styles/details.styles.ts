import { StyleSheet } from 'react-native';

import { AppColors } from '@/types/colors';

export const createStyles = (colors: AppColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      paddingHorizontal: 16,
      paddingVertical: 16,
      backgroundColor: colors.surface,
      borderBottomWidth: 1,
      borderBottomColor: colors.outlineVariant,
    },
    headerTitle: {
      fontSize: 24,
      fontWeight: 'bold',
      color: colors.onSurface,
      marginBottom: 8,
    },
    description: {
      fontSize: 16,
      color: colors.onSurfaceVariant,
      marginBottom: 8,
    },
    tagsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginTop: 8,
    },
    tag: {
      borderRadius: 4,
      paddingHorizontal: 8,
      paddingVertical: 2,
      marginRight: 8,
      marginBottom: 4,
    },
    tagText: {
      fontSize: 12,
      fontWeight: '500',
    },
    sectionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 12,
      backgroundColor: colors.surfaceVariant,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: colors.onSurfaceVariant,
    },
    addButton: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    addButtonText: {
      marginLeft: 4,
      color: colors.primary,
      fontWeight: '500',
    },
    listContainer: {
      flex: 1,
      padding: 16,
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 24,
    },
    emptyText: {
      fontSize: 16,
      color: colors.onSurfaceVariant,
      textAlign: 'center',
      marginBottom: 16,
    },
    location: {
      fontSize: 14,
      color: colors.onSurfaceVariant,
      marginTop: 8,
    },
    // Estilos para los Nooks
    nookCard: {
      backgroundColor: colors.surface,
      borderRadius: 8,
      padding: 16,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: colors.outlineVariant,
      elevation: 1,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.2,
      shadowRadius: 1,
    },
    nookTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: colors.onSurface,
      marginBottom: 4,
    },
    nookDescription: {
      fontSize: 14,
      color: colors.onSurfaceVariant,
    },
  });
