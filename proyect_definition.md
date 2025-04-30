# Documento de Definición del Proyecto: Nooks

## 1. Descripción General y Visión

Nooks es una aplicación móvil personal desarrollada con **React Native + Expo** diseñada para gestionar y localizar objetos personales ("Treasures") a través de un sistema jerárquico de ubicaciones: "Realms" (ubicaciones generales) y "Nooks" (ubicaciones específicas dentro de los Realms). La aplicación permite a los usuarios registrar estos elementos con detalles como nombre, descripción, fotografías, etiquetas y coordenadas geográficas. Utilizará **Supabase** como backend para proporcionar autenticación, almacenamiento persistente en base de datos (PostgreSQL), almacenamiento de archivos (imágenes) y sincronización entre dispositivos. El enfoque principal es el uso privado, con potencial futuro para compartir selectivamente.

El stack tecnológico incluye: **TypeScript, React Native Paper** para UI, **Expo Router** para la navegación, **TanStack Query** para la gestión del estado del servidor y caché, y **React Hook Form** para la gestión de formularios.

---

## 2. Requerimientos Funcionales (RF)

### RF-01: Gestión de Realms

- **ID:** RF-01
- **Descripción:** El sistema debe permitir a los usuarios crear, visualizar, editar y eliminar Realms (ubicaciones generales) con persistencia en Supabase.
- **User Story:** Como usuario, quiero poder registrar los lugares generales donde guardo mis pertenencias, para poder organizarlas de manera jerárquica.
- **Comportamiento esperado:**
  1. El usuario puede crear un nuevo Realm proporcionando:
     - Nombre (obligatorio)
     - Descripción (opcional)
     - Ubicación geográfica (opcional, ver RF-02)
     - Fotografía(s) (opcional, ver RF-07)
     - Etiquetas (opcional, ver RF-05)
     - Privacidad (privado por defecto/público opcional para futuro)
  2. El usuario puede ver un listado de todos sus Realms (vista de lista y/o mapa).
  3. El usuario puede ver los detalles de un Realm específico, incluyendo los Nooks que contiene.
  4. El usuario puede editar cualquier información de un Realm existente.
  5. El usuario puede eliminar un Realm, con confirmación previa. Se debe decidir la política para Nooks/Treasures contenidos (MVP: prohibir eliminar si tiene contenido o eliminar en cascada con advertencia clara).
  6. Todos los cambios se sincronizan con **Supabase**.
- **Implementación Técnica:**
  - **Datos:** Se guardarán en la tabla `locations` de Supabase con `parent_location_id` establecido en `NULL`.
  - **UI:** Formularios creados con **React Hook Form** y componentes de **React Native Paper** (`TextInput`, `Button`, `Card`, etc.). Listas con `FlatList`.
  - **Estado:** Gestión de datos con **TanStack Query**. Hooks como `useRealmsQuery` (para listas), `useRealmQuery(realmId)` (para detalles), `useCreateRealmMutation`, `useUpdateRealmMutation`, `useDeleteRealmMutation`. Asegurar invalidación de caché tras mutaciones.
  - **Navegación:** Pantallas dedicadas (e.g., `app/(tabs)/realms.tsx`, `app/realms/[id].tsx`, `app/(modals)/realm-form.tsx`) gestionadas por **Expo Router**.

### RF-02: Geolocalización de Realms

- **ID:** RF-02
- **Descripción:** El sistema debe permitir asociar coordenadas geográficas a los Realms y visualizarlos en un mapa.
- **User Story:** Como usuario, quiero poder asignar una ubicación geográfica a mis Realms y verlos en un mapa, para recordar su ubicación física exacta.
- **Comportamiento esperado:**
  1. Al crear o editar un Realm, el usuario puede:
     - Seleccionar su ubicación actual mediante GPS (`expo-location`).
     - Seleccionar una ubicación manualmente en un mapa interactivo (`react-native-maps`).
     - (Opcional) Introducir dirección que se geocodificará.
     - (Opcional) Introducir coordenadas manualmente.
  2. El usuario puede ver todos sus Realms geolocalizados en un mapa (`MapView` con `Marker`s en la pantalla `app/(tabs)/realms.tsx` o una dedicada).
  3. Al seleccionar un marcador de Realm en el mapa, se muestra información básica (e.g., `Callout`) y opción para navegar a detalles (`app/realms/[id].tsx`).
  4. El mapa ofrece controles de zoom y centrado.
  5. Las coordenadas (`latitude`, `longitude`) se almacenan en la tabla `locations` de Supabase.
- **Implementación Técnica:**
  - **Librerías:** `react-native-maps` para la visualización, `expo-location` para obtener la ubicación actual y gestionar permisos.
  - **Componentes:** Un componente reutilizable `MapPickerInput` (`src/components/forms/`) para seleccionar ubicación en el formulario.
  - **API Keys:** Configurar API keys para Google Maps (Android) y Apple Maps (iOS) a través de la configuración de Expo (`app.config.ts`).

### RF-03: Gestión de Nooks

- **ID:** RF-03
- **Descripción:** El sistema debe permitir a los usuarios crear, visualizar, editar y eliminar Nooks (ubicaciones específicas) _dentro_ de un Realm, con persistencia en Supabase.
- **User Story:** Como usuario, quiero poder registrar ubicaciones específicas dentro de lugares generales, para organizar mejor mis pertenencias.
- **Comportamiento esperado:**
  1. Desde la vista de detalles de un Realm (`app/realms/[id].tsx`), el usuario puede crear un nuevo Nook (e.g., navegando a `app/(modals)/nook-form.tsx`) proporcionando:
     - Nombre (obligatorio)
     - Descripción (opcional)
     - Fotografía(s) (opcional, ver RF-07)
     - Etiquetas (opcional, ver RF-05)
     - Privacidad (privado por defecto/público opcional)
  2. El usuario puede ver un listado de todos los Nooks dentro de un Realm específico (en `app/realms/[id].tsx`).
  3. El usuario puede navegar para ver los detalles de un Nook (`app/nooks/[id].tsx`), incluyendo los Treasures que contiene.
  4. El usuario puede editar cualquier información de un Nook existente (e.g., usando `app/(modals)/nook-form.tsx` en modo edición).
  5. El usuario puede eliminar un Nook, con confirmación previa. Decidir política para Treasures contenidos (MVP: prohibir eliminar si tiene contenido o eliminar en cascada).
  6. Todos los cambios se sincronizan con **Supabase**.
- **Implementación Técnica:**
  - **Datos:** Se guardarán en la tabla `locations` de Supabase, con `parent_location_id` apuntando al `id` del Realm padre.
  - **UI:** Formularios con **React Hook Form** y **React Native Paper**. Lista de Nooks (e.g., usando `Card` o `List.Item`) dentro de la pantalla de detalles del Realm.
  - **Estado:** Hooks de **TanStack Query** como `useNooksQuery(realmId)`, `useNookQuery(nookId)`, `useCreateNookMutation`, `useUpdateNookMutation`, `useDeleteNookMutation`. Pasar el `realmId` necesario al crear/listar.
  - **Navegación:** El flujo de creación/edición se inicia desde `app/realms/[id].tsx`, posiblemente usando un modal. Navegación a `app/nooks/[id].tsx` desde la lista de Nooks.

### RF-04: Gestión de Treasures

- **ID:** RF-04
- **Descripción:** El sistema debe permitir a los usuarios crear, visualizar, editar y eliminar Treasures (objetos) _dentro_ de un Nook, con persistencia en Supabase.
- **User Story:** Como usuario, quiero poder registrar mis objetos personales con detalles y fotografías, para recordar dónde los he guardado.
- **Comportamiento esperado:**
  1. Desde la vista de detalles de un Nook (`app/nooks/[id].tsx`), el usuario puede crear un nuevo Treasure (e.g., navegando a `app/(modals)/treasure-form.tsx`) proporcionando:
     - Nombre (obligatorio)
     - Descripción (opcional)
     - Fotografía(s) (opcional, ver RF-07)
     - Etiquetas (opcional, ver RF-05)
     - Fecha de almacenamiento (`stored_at`, por defecto la fecha actual)
     - Privacidad (privado por defecto/público opcional)
  2. El usuario puede ver un listado de todos los Treasures dentro de un Nook específico (en `app/nooks/[id].tsx`).
  3. El usuario puede navegar para ver los detalles completos de un Treasure (`app/treasures/[id].tsx`).
  4. El usuario puede editar cualquier información de un Treasure existente (e.g., usando `app/(modals)/treasure-form.tsx` en modo edición).
  5. El usuario puede eliminar un Treasure, con confirmación previa.
  6. Todos los cambios se sincronizan con **Supabase**.
  7. Las imágenes asociadas se gestionan según RF-07.
- **Implementación Técnica:**
  - **Datos:** Se guardarán en la tabla `treasures`, con una foreign key `nook_location_id` apuntando al `id` de un Nook en la tabla `locations`.
  - **UI:** Formularios con **React Hook Form** y **React Native Paper**. Lista de Treasures dentro de la pantalla de detalles del Nook.
  - **Estado:** Hooks de **TanStack Query** como `useTreasuresQuery(nookId)`, `useTreasureQuery(treasureId)`, `useCreateTreasureMutation`, `useUpdateTreasureMutation`, `useDeleteTreasureMutation`. Pasar el `nookId` necesario al crear/listar.
  - **Navegación:** El flujo de creación/edición se inicia desde `app/nooks/[id].tsx`. Navegación a `app/treasures/[id].tsx` desde la lista de Treasures.

### RF-05: Sistema de Etiquetas

- **ID:** RF-05
- **Descripción:** El sistema debe permitir a los usuarios crear, asignar y gestionar etiquetas para categorizar Realms, Nooks y Treasures, con persistencia en Supabase.
- **User Story:** Como usuario, quiero poder etiquetar mis lugares y objetos para categorizarlos y encontrarlos más fácilmente.
- **Comportamiento esperado:**
  1. El usuario puede crear nuevas etiquetas con:
     - Nombre (obligatorio, único por usuario)
     - Color (opcional)
  2. Al crear/editar Realms, Nooks o Treasures, el usuario puede asignar múltiples etiquetas existentes o crear nuevas sobre la marcha usando un componente selector.
  3. (Opcional MVP) El usuario puede ver una lista de todas sus etiquetas y gestionarlas (editar/eliminar) en la sección de perfil/ajustes (`app/(tabs)/profile.tsx`).
  4. Al eliminar una etiqueta (si se implementa la gestión), ésta se desasocia de todos los elementos.
  5. La información de etiquetas y sus asociaciones se almacena y sincroniza con **Supabase**.
- **Implementación Técnica:**
  - **Datos:** Tabla `tags` y tablas de unión `location_tags` y `treasure_tags`.
  - **UI:** Componente reutilizable `TagSelector` (`src/components/forms/`) en los formularios (puede ser un campo de texto con autocompletado y creación, o un modal). Usar `Chip` de **React Native Paper** para mostrar etiquetas asignadas en vistas de detalle y listas.
  - **Estado:** Hooks de **TanStack Query** (`useTagsQuery`, `useCreateTagMutation`, etc.). Las mutaciones de CUD de Realms/Nooks/Treasures manejarán la actualización de las tablas de unión.

### RF-06: Búsqueda y Filtrado

- **ID:** RF-06
- **Descripción:** El sistema debe permitir a los usuarios buscar y filtrar Realms, Nooks y Treasures según diferentes criterios.
- **User Story:** Como usuario, quiero poder buscar y filtrar mis lugares y objetos para encontrarlos rápidamente cuando los necesito.
- **Comportamiento esperado:**
  1. El usuario puede realizar búsquedas por texto en nombres y descripciones de Realms, Nooks y Treasures desde una pantalla dedicada (`app/(tabs)/search.tsx`).
  2. El usuario puede filtrar por:
     - Tipo de elemento (Realm, Nook, Treasure)
     - Etiquetas asignadas
     - (Opcional) Fecha de creación/almacenamiento
     - (Opcional, para Realms) Proximidad geográfica
  3. Los resultados muestran claramente la jerarquía (e.g., "Comic Spiderman" en "Baúl Rojo" (Nook) en "Casa Padres" (Realm)).
  4. Los resultados pueden visualizarse en lista y/o mapa (para Realms).
- **Implementación Técnica:**
  - **Backend:** Utilizar capacidades de búsqueda full-text (FTS) y filtros de **Supabase (PostgreSQL)**. Potencialmente crear funciones SQL (`rpc`) o vistas para búsquedas complejas.
  - **Estado:** Hooks de **TanStack Query** que acepten parámetros de búsqueda/filtro (e.g., `useGlobalSearchQuery({ searchText, filterTags, filterType })`). Usar debouncing (`useDebounce` hook) para la entrada de texto de búsqueda.
  - **UI:** Pantalla `app/(tabs)/search.tsx` con campo de búsqueda (`Searchbar` de Paper) y opciones de filtro (e.g., `Chip`, `Checkbox`).

### RF-07: Captura y Gestión de Imágenes

- **ID:** RF-07
- **Descripción:** El sistema debe permitir a los usuarios tomar fotografías o seleccionarlas de la galería para asociarlas a Realms, Nooks y Treasures, almacenándolas en Supabase Storage.
- **User Story:** Como usuario, quiero poder tomar fotos o elegirlas de mi galería para identificar visualmente mis lugares y objetos.
- **Comportamiento esperado:**
  1. Al crear o editar un Realm, Nook o Treasure, el usuario puede:
     - Tomar una o varias fotografías usando la cámara del dispositivo.
     - Seleccionar una o varias imágenes de la galería.
     - Establecer una imagen como principal/portada.
     - Eliminar imágenes asociadas.
  2. Las imágenes se suben a **Supabase Storage**.
  3. Se aplica optimización básica (compresión, redimensionado) antes de subir para ahorrar espacio y mejorar rendimiento (`expo-image-manipulator`).
  4. Las imágenes se muestran en vistas de detalle (galería) y como miniaturas en listas.
- **Implementación Técnica:**
  - **Librerías:** `expo-image-picker` para selección de galería, `expo-camera` para captura directa, `expo-image-manipulator` para optimización. Solicitar permisos necesarios usando `usePermissions` hook (`src/hooks/`).
  - **Backend:** Bucket en **Supabase Storage** con políticas **RLS** para acceso seguro (usuarios solo acceden a sus archivos).
  - **Datos:** Tabla `media` para registrar metadatos de las imágenes (ruta en storage, a qué entidad pertenece (`entity_type`, `entity_id`), si es primaria, etc.).
  - **UI:** Componente `ImagePickerInput` (`src/components/forms/`) reutilizable. Componente `ImageGallery` (`src/components/media/`) en pantallas de detalle. Usar `Image` de React Native o `expo-image` para carga eficiente.

### RF-08: Gestión de Conectividad

- **ID:** RF-08
- **Descripción:** El sistema debe manejar adecuadamente los estados de conectividad, proporcionando feedback apropiado al usuario.
- **User Story:** Como usuario, quiero recibir notificaciones claras cuando no tenga conexión a internet para entender por qué ciertas funciones podrían no estar disponibles o los datos no están actualizados.
- **Comportamiento esperado:**
  1. La aplicación muestra un indicador visual sutil (e.g., `Snackbar` o `Banner` de Paper) si no hay conexión.
  2. Las acciones que requieren conexión (guardar, refrescar) muestran un estado de carga (`ActivityIndicator`) y manejan errores de red de forma controlada.
  3. **TanStack Query** maneja el caché en memoria, mostrando datos previamente cargados mientras no hay conexión (si están disponibles y no expirados).
  4. Al recuperar la conexión, TanStack Query intenta sincronizar/refrescar datos en segundo plano automáticamente (según configuración).
- **Implementación Técnica:**
  - **Librerías:** Hook `useIsOnline` de **TanStack Query** o `@react-native-community/netinfo`.
  - **UI:** Usar `Snackbar` o `Banner` de **React Native Paper** para notificaciones de estado. Indicadores de carga.
  - **Estado:** Configurar **TanStack Query** (`QueryClient`) para reintentos en caso de fallo de red y gestión de estado online/offline.

### RF-09: Autenticación de Usuarios

- **ID:** RF-09
- **Descripción:** El sistema debe permitir a los usuarios registrarse, iniciar sesión y gestionar su perfil utilizando Supabase Auth.
- **User Story:** Como usuario, quiero poder crear una cuenta segura y acceder a mis datos privados desde cualquier dispositivo donde instale la aplicación.
- **Comportamiento esperado:**
  1. Pantallas para registro (`app/(auth)/register.tsx`) y inicio de sesión (`app/(auth)/login.tsx`) con Email/Password. (Opcional: Social Logins).
  2. Opción para cerrar sesión (en `app/(tabs)/profile.tsx`).
  3. (Opcional MVP) Flujo de recuperación de contraseña (`app/(auth)/forgot-password.tsx`).
  4. (Opcional MVP) Pantalla de perfil básica para ver/editar datos (`app/(tabs)/profile.tsx`).
  5. La sesión del usuario persiste entre reinicios de la app (gestionado por Supabase y SecureStore).
- **Implementación Técnica:**
  - **Backend:** Utilizar **Supabase Auth**.
  - **Cliente:** Usar los métodos de autenticación de `@supabase/supabase-js`.
  - **Estado:** Gestionar el estado de autenticación globalmente usando `AuthContext` (`src/contexts/AuthContext.tsx`), que escucha los cambios de sesión de Supabase (`onAuthStateChange`).
  - **Seguridad:** Implementar **Row Level Security (RLS)** en **todas** las tablas de Supabase basadas en `auth.uid() = user_id`. Usar `expo-secure-store` para almacenar tokens de sesión de forma segura (configurado en el cliente Supabase).
  - **Navegación:** Usar un layout condicional en `app/_layout.tsx` para mostrar el grupo `(auth)` o `(tabs)` basado en el estado de `AuthContext`.

### RF-10: Interfaz de Usuario Adaptable

- **ID:** RF-10
- **Descripción:** La aplicación debe proporcionar una interfaz de usuario consistente, intuitiva y adaptable, siguiendo las convenciones de diseño móvil.
- **User Story:** Como usuario, quiero una interfaz fácil de usar, visualmente agradable y que funcione bien en mi dispositivo, permitiéndome navegar sin esfuerzo por mis Realms, Nooks y Treasures.
- **Comportamiento esperado:**
  1. La interfaz se adapta a diferentes tamaños y orientaciones de pantalla (diseño responsivo).
  2. El diseño es coherente visualmente (**theming**) y funcionalmente en toda la aplicación.
  3. La navegación entre las jerarquías (Realms -> Nooks -> Treasures) es clara e intuitiva a través de **Expo Router**.
  4. Se usan componentes estándar de **React Native Paper** para una apariencia nativa y accesible.
  5. Se proporciona feedback visual para acciones (loading, success, error) usando componentes como `ActivityIndicator`, `Snackbar`.
- **Implementación Técnica:**
  - **UI Kit:** **React Native Paper** para componentes y sistema de Theming (`src/theme/`).
  - **Layout:** Usar Flexbox para responsividad. Considerar `useWindowDimensions` para adaptaciones más complejas si es necesario.
  - **Navegación:** Estructura lógica con **Expo Router** (ver `app/` en la estructura de carpetas). Tipado fuerte para rutas y parámetros.
  - **Consistencia:** Crear componentes reutilizables (`src/components/`) para elementos comunes (botones, inputs, tarjetas, etc.).

---

## 3. Requisitos No Funcionales Clave (RNF)

- **RNF-01: Rendimiento:**
  - Interacciones principales < 1s.
  - Listas virtualizadas (`FlatList`).
  - Optimización de imágenes (RF-07).
  - Consultas a Supabase optimizadas (índices, limitar datos).
  - Uso eficiente de la caché de TanStack Query.
- **RNF-02: Usabilidad:**
  - Seguir guías de diseño Material Design (Android) / Human Interface Guidelines (iOS) a través de React Native Paper.
  - Flujos de trabajo intuitivos (acciones comunes en pocos taps).
  - Feedback claro al usuario.
- **RNF-03: Seguridad:**
  - Autenticación segura (Supabase Auth).
  - Autorización basada en RLS de Supabase (usuarios solo acceden a sus datos).
  - Protección de acceso a archivos en Supabase Storage.
  - Manejo seguro de credenciales/tokens (uso de `expo-secure-store`).
- **RNF-04: Compatibilidad:**
  - Android 9+ / iOS 13+ (definir soporte mínimo).
  - Adaptación a diversos tamaños/densidades de pantalla.

---

## 4. Priorización (MoSCoW)

- **Must Have (Imprescindible para MVP):**
  - RF-01: Gestión de Realms (CRUD básico)
  - RF-03: Gestión de Nooks (CRUD básico, asociado a Realm)
  - RF-04: Gestión de Treasures (CRUD básico, asociado a Nook)
  - RF-09: Autenticación de Usuarios (Registro/Login Email, Logout)
  - RF-10: Interfaz de Usuario Adaptable (Base funcional y navegable con Paper)
  - RF-07: Captura y Gestión de Imágenes (Funcionalidad básica de subir y ver 1 imagen por entidad)
- **Should Have (Importante pero no crítico para el primer lanzamiento):**
  - RF-02: Geolocalización de Realms (Mapa básico y selección de coordenadas)
  - RF-05: Sistema de Etiquetas (Asignación básica y creación)
  - RF-07: Mejoras en Imágenes (Múltiples imágenes, galería básica)
  - Filtrado básico por Tags (integrado en listas o búsqueda)
- **Could Have (Deseable si hay tiempo/recursos):**
  - RF-06: Búsqueda y Filtrado Global Avanzado
  - RF-08: Gestión de Conectividad (Feedback visual explícito)
  - Mejoras en RF-09 (Social Login, Recuperar contraseña)
  - Mejoras en RF-05 (Gestión centralizada de tags, filtro avanzado)
  - RF-07: Optimización avanzada de imágenes
- **Won't Have (Fuera del alcance de la versión inicial):**
  - Compartir elementos entre usuarios.
  - Funcionamiento offline completo con sincronización compleja.
  - Notificaciones / Recordatorios.
  - Versión web.
  - Soporte para vídeo.

---

## 5. Modelo de Datos Propuesto (Supabase / PostgreSQL)

- **`profiles`** (Extiende `auth.users` para datos adicionales del perfil)

  - `id` (uuid, primary key, references `auth.users.id` on delete cascade)
  - `username` (text, nullable, unique)
  - `created_at` (timestamp with time zone, default `now()`)
  - `updated_at` (timestamp with time zone)
  - _(RLS habilitada: Usuarios solo pueden ver/editar su propio perfil)_

- **`locations`** (Almacena Realms y Nooks)

  - `id` (uuid, primary key, default `gen_random_uuid()`)
  - `user_id` (uuid, not null, references `auth.users.id` on delete cascade)
  - `parent_location_id` (uuid, nullable, references `locations(id)` on delete cascade) -- _NULL para Realms, ID del Realm padre para Nooks_
  - `name` (text, not null)
  - `description` (text, nullable)
  - `latitude` (double precision, nullable)
  - `longitude` (double precision, nullable)
  - `is_public` (boolean, default `false`)
  - `created_at` (timestamp with time zone, default `now()`)
  - `updated_at` (timestamp with time zone)
  - _(RLS habilitada: Usuarios solo pueden CUD sus locations. Lectura puede variar si is_public=true en futuro)_
  - _(Índices recomendados: `user_id`, `parent_location_id`)_

- **`treasures`** (Objetos guardados)

  - `id` (uuid, primary key, default `gen_random_uuid()`)
  - `user_id` (uuid, not null, references `auth.users.id` on delete cascade)
  - `nook_location_id` (uuid, not null, references `locations(id)` on delete cascade) -- _FK a la location (Nook) donde está guardado_
  - `name` (text, not null)
  - `description` (text, nullable)
  - `stored_at` (timestamp with time zone, default `now()`)
  - `is_public` (boolean, default `false`)
  - `created_at` (timestamp with time zone, default `now()`)
  - `updated_at` (timestamp with time zone)
  - _(RLS habilitada: Usuarios solo pueden CUD sus treasures. Lectura puede variar si is_public=true)_
  - _(Índices recomendados: `user_id`, `nook_location_id`)_

- **`tags`** (Etiquetas definidas por el usuario)

  - `id` (uuid, primary key, default `gen_random_uuid()`)
  - `user_id` (uuid, not null, references `auth.users.id` on delete cascade)
  - `name` (text, not null)
  - `color` (text, nullable) -- _Podría ser un código HEX_
  - `created_at` (timestamp with time zone, default `now()`)
  - _(Constraint: `unique (user_id, name)`)_
  - _(RLS habilitada: Usuarios solo pueden CUD sus tags)_

- **`location_tags`** (Tabla de unión N-M: Locations <-> Tags)

  - `location_id` (uuid, not null, references `locations(id)` on delete cascade)
  - `tag_id` (uuid, not null, references `tags(id)` on delete cascade)
  - `primary key (location_id, tag_id)`
  - _(RLS habilitada: Requiere verificar que el usuario es dueño de la location Y/O del tag al insertar/eliminar)_

- **`treasure_tags`** (Tabla de unión N-M: Treasures <-> Tags)

  - `treasure_id` (uuid, not null, references `treasures(id)` on delete cascade)
  - `tag_id` (uuid, not null, references `tags(id)` on delete cascade)
  - `primary key (treasure_id, tag_id)`
  - _(RLS habilitada: Requiere verificar que el usuario es dueño del treasure Y/O del tag al insertar/eliminar)_

- **`media`** (Metadatos de archivos multimedia asociados)

  - `id` (uuid, primary key, default `gen_random_uuid()`)
  - `user_id` (uuid, not null, references `auth.users.id` on delete cascade)
  - `storage_path` (text, not null, unique) -- _Ruta en Supabase Storage, e.g., `{user_id}/{location_id | treasure_id}/{media_id}.jpg`_
  - `entity_type` (text, not null, check (`entity_type` in ('location', 'treasure'))) -- _A qué tipo de entidad pertenece_
  - `entity_id` (uuid, not null) -- _ID de la Location o Treasure específico_
  - `is_primary` (boolean, default `false`) -- _Para imagen de portada_
  - `mime_type` (text, nullable)
  - `file_size` (integer, nullable) -- _En bytes_
  - `created_at` (timestamp with time zone, default `now()`)
  - _(RLS habilitada: Usuarios solo pueden CUD media asociada a sus propias entidades)_
  - _(Índice recomendado: `(entity_type, entity_id)`)_

- **Supabase Storage:**

  - Crear un bucket (e.g., `nooks_media`).
  - Configurar políticas de acceso basadas en la ruta (`user_id`) y/o RLS en la tabla `media` para asegurar que los usuarios solo puedan subir/descargar/eliminar sus propios archivos.

---

## 6. Arquitectura Técnica Propuesta (Revisada con Expo Router)

- **Framework Principal:** React Native gestionado con Expo (Managed Workflow).
- **Lenguaje:** TypeScript.
- **UI Kit & Theming:** React Native Paper.
- **Navegación:** **Expo Router (v3+)**.
  - **Estructura:** Enrutamiento basado en el sistema de archivos dentro del directorio `app/`. Uso de convenciones como `index.tsx`, `_layout.tsx`, `[param].tsx`, `(...)` para modales, `(group)` para organización sin afectar la URL.
  - **Layouts:** Definición de Tab Navigators, Stack Navigators y otros layouts mediante archivos `_layout.tsx` anidados.
  - **API:** Uso de `expo-router` para navegación programática (`router.push`, `router.replace`), manejo de parámetros (`useLocalSearchParams`, `useGlobalSearchParams`) y enlaces declarativos (`<Link>`).
  - **Tipado:** Aprovechar el sistema de rutas tipadas de Expo Router.
- **Gestión de Estado del Servidor (Server State):** TanStack Query (v5+).
  - **Setup:** `QueryClientProvider` en la raíz (`app/_layout.tsx`). Configuración de `QueryClient` (defaults para `staleTime`, `gcTime`) en `src/services/queryClient.ts`.
  - **Hooks:** Uso extensivo de `useQuery` (para lectura, con keys estructuradas desde `src/constants/queryKeys.ts`) y `useMutation` (para CUD, con invalidación automática/manual de queries relevantes post-éxito).
  - **Beneficios:** Gestión de caché, background updates, reintentos, estados de loading/error, optimistic updates (opcional).
- **Gestión de Formularios:** React Hook Form (v7+).
  - **Setup:** Hook `useForm` en componentes de formulario.
  - **Integración:** Uso del componente `Controller` para conectar inputs de React Native Paper al estado de RHF (`src/components/forms/ControlledInput.tsx`, etc.).
  - **Validación:** Validación integrada o mediante resolvers (e.g., `@hookform/resolvers/zod` con esquemas Zod definidos junto a tipos de entidades).
- **Cliente Backend (Supabase):** `@supabase/supabase-js`.
  - **Wrapper:** Servicio centralizado (`src/api/supabase/client.ts`) para inicializar el cliente con tipos generados (`Database`) y configuración (Auth con `expo-secure-store`).
  - **API Calls:** Funciones asíncronas encapsuladas (e.g., en `src/api/locations.ts`, `src/api/treasures.ts`) que usan el cliente Supabase. Estos servicios serán llamados por los hooks de TanStack Query.
  - **Auth Listener:** Configurar listener `onAuthStateChange` en `AuthContext` para gestionar el estado de sesión global.
- **Mapas:** `react-native-maps`.
- **Acceso a Cámara y Galería:** `expo-image-picker`, `expo-camera`.
- **Procesamiento de Imágenes:** `expo-image-manipulator`.
- **Almacenamiento Seguro:** `expo-secure-store` (para tokens de sesión de Supabase).
- **Gestión de Tipos de Base de Datos:** Generación automática con **Supabase CLI** (`supabase gen types ...`) guardados en `src/types/supabase.ts`.

---

## 7. Estructura de Carpetas Detallada (`src/` y `app/`)

├── app/ # Expo Router: Define la estructura de navegación/rutas
│ ├── \_layout.tsx # Layout Raíz: Providers globales (Paper, QueryClient, Auth), manejo inicial de Auth
│ │
│ ├── (auth)/ # Grupo para pantallas de autenticación (activo si !isAuthenticated)
│ │ ├── \_layout.tsx # Layout simple para el flujo de Auth (sin tabs)
│ │ ├── login.tsx # Pantalla de inicio de sesión
│ │ ├── register.tsx # Pantalla de registro
│ │ └── forgot-password.tsx # (Opcional) Pantalla de recuperación
│ │
│ ├── (tabs)/ # Grupo para el layout principal con Tabs (activo si isAuthenticated)
│ │ ├── \_layout.tsx # Define el Tab Navigator (usando BottomNavigation de Paper)
│ │ ├── index.tsx # Pantalla principal/dashboard (quizás un resumen o mapa)
│ │ ├── realms.tsx # Pantalla para listar/visualizar Realms (puede incluir mapa/lista)
│ │ ├── search.tsx # Pantalla de búsqueda global
│ │ └── profile.tsx # Pantalla de perfil de usuario y ajustes
│ │
│ ├── (modals)/ # Grupo para pantallas modales (ej: formularios de creación rápida)
│ │ ├── \_layout.tsx # Layout para configurar el stack modal
│ │ ├── add-options.tsx # Modal para elegir qué crear (Realm, Nook, Treasure)
│ │ ├── realm-form.tsx # Modal formulario para crear/editar Realm
│ │ ├── nook-form.tsx # Modal formulario para crear/editar Nook
│ │ └── treasure-form.tsx# Modal formulario para crear/editar Treasure
│ │
│ ├── realms/ # Stack para detalles y gestión de Realms
│ │ ├── \_layout.tsx # Layout del Stack de Realms (configura header, etc.)
│ │ └── [id].tsx # Pantalla de detalles de un Realm específico
│ │
│ ├── nooks/ # Stack para detalles de Nooks (accesible desde Realm)
│ │ ├── \_layout.tsx # Layout del Stack de Nooks
│ │ └── [id].tsx # Pantalla de detalles de un Nook específico
│ │
│ ├── treasures/ # Stack para detalles de Treasures (accesible desde Nook)
│ │ ├── \_layout.tsx # Layout del Stack de Treasures
│ │ └── [id].tsx # Pantalla de detalles de un Treasure específico
│ │
│ └── +not-found.tsx # Pantalla para rutas no encontradas
│
├── src/ # Código fuente reutilizable y lógica de negocio
│ ├── api/ # Funciones para interactuar con Supabase
│ │ ├── supabase/ # Configuración y exportación del cliente Supabase
│ │ │ └── client.ts
│ │ ├── auth.ts # Funciones API de autenticación (login, register, logout...)
│ │ ├── locations.ts # Funciones API para Realms y Nooks (get, create, update, delete)
│ │ ├── treasures.ts # Funciones API para Treasures
│ │ ├── tags.ts # Funciones API para Tags
│ │ ├── media.ts # Funciones API para subir/gestionar imágenes
│ │ └── profile.ts # Funciones API para el perfil de usuario
│ │
│ ├── assets/ # Recursos estáticos
│ │ ├── fonts/ # Fuentes personalizadas
│ │ ├── icons/ # Iconos personalizados (si no usas los de Paper/vector-icons)
│ │ └── images/ # Imágenes estáticas (placeholders, logos, etc.)
│ │
│ ├── components/ # Componentes UI reutilizables y genéricos
│ │ ├── common/ # Componentes básicos (Button, InputWrapper, Loading, EmptyState, ...)
│ │ ├── forms/ # Componentes específicos para formularios (integrados con RHF)
│ │ │ ├── ControlledInput.tsx
│ │ │ ├── ControlledImagePicker.tsx
│ │ │ ├── TagSelector.tsx
│ │ │ └── MapPickerInput.tsx
│ │ ├── layout/ # Componentes estructurales (ScreenWrapper, AppHeader, ...)
│ │ ├── map/ # Componentes relacionados con mapas (CustomMarker, MapCluster, ...)
│ │ └── media/ # Componentes para mostrar media (ImageGallery, MediaItem, ...)
│ │
│ ├── constants/ # Valores constantes
│ │ ├── colors.ts # Paleta de colores
│ │ ├── queryKeys.ts # Claves para TanStack Query
│ │ ├── routes.ts # (Opcional) Nombres de rutas tipadas si no usas las generadas por Expo Router
│ │ ├── spacing.ts # Valores de espaciado/tamaño
│ │ └── storageKeys.ts # Claves para AsyncStorage/SecureStore (e.g., token de sesión)
│ │
│ ├── contexts/ # Contextos globales de React
│ │ ├── AuthContext.tsx # Gestiona estado de autenticación, sesión, perfil básico
│ │ └── ThemeContext.tsx # (Opcional) Si permites cambio de tema light/dark
│ │
│ ├── features/ # Lógica y componentes específicos de cada "feature" o dominio
│ │ ├── realms/ # Todo lo relacionado específicamente con Realms
│ │ │ ├── components/ # RealmCard, RealmList, RealmMapDisplay...
│ │ │ ├── hooks/ # useRealmsQuery, useRealmDetails, useCreateRealm...
│ │ │ └── types.ts # Tipos específicos de Realm (podrían estar en src/types/entities.ts)
│ │ ├── nooks/ # Ídem para Nooks
│ │ │ ├── components/
│ │ │ ├── hooks/
│ │ │ └── types.ts
│ │ ├── treasures/ # Ídem para Treasures
│ │ │ ├── components/
│ │ │ ├── hooks/
│ │ │ └── types.ts
│ │ ├── tags/ # Ídem para Tags
│ │ │ ├── components/
│ │ │ ├── hooks/
│ │ │ └── types.ts
│ │ └── search/ # Ídem para la funcionalidad de búsqueda
│ │ ├── components/
│ │ ├── hooks/
│ │ └── types.ts
│ │
│ ├── hooks/ # Hooks genéricos y reutilizables
│ │ ├── useDebounce.ts # Hook para debouncing (útil en búsquedas)
│ │ ├── usePermissions.ts # Hook para gestionar permisos (cámara, localización, galería)
│ │ └── useSecureStore.ts # Hook para interactuar con Expo SecureStore (guardar tokens)
│ │
│ ├── lib/ # Librerías de terceros o configuración específica
│ │ └── dayjs.ts # (Ejemplo) Configuración de librería de fechas
│ │
│ ├── services/ # Inicialización y configuración de servicios externos
│ │ ├── queryClient.ts # Creación y configuración del QueryClient de TanStack
│ │ └── i18n.ts # (Opcional) Configuración de internacionalización
│ │
│ ├── theme/ # Configuración del tema de React Native Paper
│ │ ├── darkTheme.ts # Definición del tema oscuro
│ │ ├── lightTheme.ts # Definición del tema claro
│ │ ├── fonts.ts # Configuración de fuentes para Paper
│ │ └── index.ts # Exporta el tema activo o función para obtenerlo
│ │
│ ├── types/ # Definiciones globales de TypeScript
│ │ ├── supabase.ts # Tipos generados por Supabase CLI <<-- IMPORTANTE
│ │ ├── entities.ts # Tipos de datos principales (Realm, Nook, Treasure, Tag, UserProfile...)
│ │ ├── navigation.ts # Tipos para parámetros de ruta (Expo Router puede generar esto)
│ │ ├── zod.ts # (Opcional) Esquemas Zod para validación si se usan
│ │ └── react-native.d.ts # Extensiones/declaraciones para módulos de RN si es necesario
│ │
│ └── utils/ # Funciones de utilidad puras y genéricas
│ ├── dateUtils.ts # Funciones para formatear/manipular fechas
│ ├── helpers.ts # Funciones genéricas varias
│ ├── imageUtils.ts # Funciones para manipular imágenes (si es necesario)
│ ├── locationUtils.ts # Funciones para trabajar con coordenadas/distancias
│ └── validationUtils.ts # Funciones de validación reutilizables (si no usas Zod/Yup extensivamente)
│
├── .env # Variables de entorno (URLs Supabase, API Keys) - ¡Añadir a .gitignore!
├── .env.example # Ejemplo de variables de entorno
├── .gitignore
├── app.config.ts # Configuración de Expo (nombre app, íconos, splash, plugins, variables de entorno...)
├── babel.config.js
├── eas.json # Configuración de Expo Application Services (EAS Build)
├── package.json
└── tsconfig.json
