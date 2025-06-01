# Guía de Migración al Sistema de Design Tokens

## Resumen de Cambios

El sistema de diseño ha sido actualizado para cumplir completamente con Material Design 3 y proporcionar tokens consistentes para:

- ✅ **Espaciado**: Sistema ampliado con más opciones (xs, s, sm, m, ml, l, xl, xxl, xxxl)
- ✅ **Border Radius**: Tokens específicos MD3 (xs: 4dp, s: 8dp, m: 12dp, l: 16dp, xl: 24dp)
- ✅ **Elevación**: Sistema de 6 niveles con sombras consistentes (level0-level5)
- ✅ **Tipografía**: Preparado para escalas MD3 completas

## Cómo Migrar Archivos de Estilos

### Antes (Patrón Anterior)

```typescript
import { AppColors } from '@/types/colors';

export const createStyles = (colors: AppColors) =>
  StyleSheet.create({
    container: {
      padding: 16,
      borderRadius: 8,
      backgroundColor: colors.surface,
      elevation: 4,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
  });
```

### Después (Nuevo Patrón)

```typescript
import { AppTheme } from '@/types';

export const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      padding: theme.spacing.m, // 16dp
      borderRadius: theme.borderRadius.s, // 8dp
      backgroundColor: theme.colors.surface,
      ...theme.elevation.level2, // Elevación consistente MD3
    },
  });
```

## Tokens Disponibles

### Espaciado (theme.spacing)

```typescript
xs: 4; // Para separaciones muy pequeñas
s: 8; // Para separaciones pequeñas
sm: 12; // Para separaciones pequeño-medianas
m: 16; // Para separaciones medianas (estándar)
ml: 20; // Para separaciones medio-grandes
l: 24; // Para separaciones grandes
xl: 32; // Para separaciones extra grandes
xxl: 40; // Para separaciones muy grandes
xxxl: 48; // Para separaciones extremas
```

### Border Radius (theme.borderRadius)

```typescript
xs: 4; // Extra Small (chips pequeños, tags)
s: 8; // Small (cards, inputs)
m: 12; // Medium (botones, cards principales)
l: 16; // Large (modales, sheets)
xl: 24; // Extra Large (containers grandes)
round: 50; // Completamente redondeado (50%)
```

### Elevación (theme.elevation)

```typescript
level0; // Sin sombra (superficie plana)
level1; // Sombra muy sutil (cards básicos)
level2; // Sombra ligera (botones, inputs activos)
level3; // Sombra media (FABs, dropdowns)
level4; // Sombra prominente (navigation drawers)
level5; // Sombra máxima (modales, dialogs)
```

## Ejemplos de Uso por Componente

### Botones

```typescript
// Botón contained principal
button: {
  paddingVertical: theme.spacing.sm, // 12dp
  paddingHorizontal: theme.spacing.l, // 24dp
  borderRadius: theme.borderRadius.m, // 12dp (fully rounded)
  ...theme.elevation.level1,
}

// Botón text
textButton: {
  paddingHorizontal: theme.spacing.sm, // 12dp
  paddingVertical: theme.spacing.s, // 8dp
}
```

### Cards

```typescript
card: {
  padding: theme.spacing.m, // 16dp
  marginBottom: theme.spacing.m, // 16dp
  borderRadius: theme.borderRadius.s, // 8dp
  ...theme.elevation.level1,
}
```

### Headers/Títulos

```typescript
header: {
  paddingHorizontal: theme.spacing.m, // 16dp
  paddingVertical: theme.spacing.m, // 16dp
}

title: {
  fontSize: 24, // headlineSmall según MD3
  fontWeight: '400',
  lineHeight: 32,
  marginBottom: theme.spacing.xs, // 4dp
}
```

### Formularios

```typescript
input: {
  borderRadius: theme.borderRadius.xs, // 4dp
  paddingHorizontal: theme.spacing.m, // 16dp
  paddingVertical: theme.spacing.sm, // 12dp
  marginBottom: theme.spacing.m, // 16dp
}

label: {
  fontSize: 14, // labelLarge según MD3
  fontWeight: '500',
  lineHeight: 20,
  marginBottom: theme.spacing.s, // 8dp
}
```

### FABs (Floating Action Buttons)

```typescript
fab: {
  position: 'absolute',
  bottom: theme.spacing.m, // 16dp
  right: theme.spacing.m, // 16dp
  borderRadius: theme.borderRadius.round, // Completamente redondo
  ...theme.elevation.level3, // Elevación prominente
}
```

## Tipografía MD3 (Próxima Implementación)

```typescript
// Escalas que se implementarán
displayLarge: { fontSize: 57, lineHeight: 64, fontWeight: '400' }
displayMedium: { fontSize: 45, lineHeight: 52, fontWeight: '400' }
displaySmall: { fontSize: 36, lineHeight: 44, fontWeight: '400' }
headlineLarge: { fontSize: 32, lineHeight: 40, fontWeight: '400' }
headlineMedium: { fontSize: 28, lineHeight: 36, fontWeight: '400' }
headlineSmall: { fontSize: 24, lineHeight: 32, fontWeight: '400' }
titleLarge: { fontSize: 22, lineHeight: 28, fontWeight: '400' }
titleMedium: { fontSize: 16, lineHeight: 24, fontWeight: '500' }
titleSmall: { fontSize: 14, lineHeight: 20, fontWeight: '500' }
bodyLarge: { fontSize: 16, lineHeight: 24, fontWeight: '400' }
bodyMedium: { fontSize: 14, lineHeight: 20, fontWeight: '400' }
bodySmall: { fontSize: 12, lineHeight: 16, fontWeight: '400' }
labelLarge: { fontSize: 14, lineHeight: 20, fontWeight: '500' }
labelMedium: { fontSize: 12, lineHeight: 16, fontWeight: '500' }
labelSmall: { fontSize: 11, lineHeight: 16, fontWeight: '500' }
```

## Archivos Ya Migrados

✅ **Componentes Base:**

- `components/atoms/Button/Button.styles.ts`

✅ **Pantallas:**

- `styles/app/tabs/map.style.ts`

✅ **Features:**

- `features/realms/components/styles/RealmCard.styles.ts`

✅ **Formularios:**

- `components/forms/styles/ControlledTextInput.styles.ts`

## Archivos Pendientes de Migración

📋 **Pantallas principales:**

- `styles/app/auth/login.style.ts`
- `styles/app/modals/realm-form.style.ts`
- `styles/app/realms/details.style.ts`
- Y todos los demás archivos `.style.ts`

📋 **Componentes:**

- Todos los archivos en `components/*/styles/`

## Proceso de Migración Recomendado

1. **Cambiar la importación:**

   ```typescript
   // Antes
   import { AppColors } from '@/types/colors';

   // Después
   import { AppTheme } from '@/types';
   ```

2. **Actualizar la función createStyles:**

   ```typescript
   // Antes
   export const createStyles = (colors: AppColors) =>

   // Después
   export const createStyles = (theme: AppTheme) =>
   ```

3. **Reemplazar valores hardcodeados con tokens:**

   - Padding/margin → `theme.spacing.*`
   - Border radius → `theme.borderRadius.*`
   - Elevación/sombras → `...theme.elevation.*`
   - Colores → `theme.colors.*`

4. **Actualizar componentes que usan los estilos:**

   ```typescript
   // Antes
   const styles = createStyles(theme.colors);

   // Después
   const styles = createStyles(theme);
   ```

## Beneficios Inmediatos

- 🎯 **Consistencia visual** en toda la aplicación
- 🛠️ **Mantenimiento fácil** - cambios centralizados
- 📐 **Conformidad MD3** - diseño según estándares
- 🔍 **IntelliSense mejorado** - autocompletado de tokens
- ⚡ **Desarrollo más rápido** - menos decisiones de diseño

---

_Documentación actualizada - Junio 1, 2025_
