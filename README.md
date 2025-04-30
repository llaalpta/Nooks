# Nooks

Nooks es una aplicación móvil que te ayuda a recordar dónde has guardado tus objetos personales. A través de un sistema jerárquico de ubicaciones y etiquetas, nunca más olvidarás dónde dejaste tus pertenencias importantes.

## 📱 Concepto

Nooks organiza la información en tres niveles principales:

- **Realms**: Ubicaciones generales como tu casa, oficina o almacén
- **Nooks**: Ubicaciones específicas dentro de un Realm (cajón, estantería, armario)
- **Treasures**: Los objetos que guardas en cada Nook

Esta estructura jerárquica, combinada con geolocalización, imágenes y etiquetas, crea un sistema completo para catalogar y encontrar fácilmente tus pertenencias.

## ✨ Características principales

- 🗺️ **Geolocalización**: Registra la ubicación exacta de tus Realms en un mapa interactivo
- 📸 **Gestión de imágenes**: Añade fotos a tus Realms, Nooks y Treasures
- 🏷️ **Sistema de etiquetas**: Organiza y filtra mediante etiquetas personalizables
- 🔍 **Búsqueda avanzada**: Encuentra rápidamente lo que necesitas
- 🔄 **Sincronización en la nube**: Accede a tus datos desde cualquier dispositivo
- 🔒 **Privacidad**: Control total sobre qué información es privada

## 🛠️ Tecnologías

- **Frontend**: React Native con Expo
- **UI**: React Native Paper
- **Estado**: React Query
- **Backend**: Supabase (Auth, PostgreSQL, Storage)
- **Mapas**: React Native Maps + Expo Location
- **Formularios**: React Hook Form + Zod

## 🚀 Instalación y uso

```bash
# Clonar el repositorio
git clone https://github.com/tu-usuario/nooks.git
cd nooks

# Instalar dependencias
npm install

# Iniciar el servidor de desarrollo
expo start
```

## 📝 Variables de entorno

Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:

```
EXPO_PUBLIC_SUPABASE_URL=tu-url-de-supabase
EXPO_PUBLIC_SUPABASE_ANON_KEY=tu-clave-anon-de-supabase
```

## 📱 Capturas de pantalla

[Próximamente]

## 🔄 Estado del proyecto

Este proyecto se encuentra en desarrollo activo como parte de un proyecto final de ciclo formativo DAM. La versión actual incluye las funcionalidades básicas y se irá ampliando con más características.

### Roadmap

- ✅ MVP con funcionalidades básicas
- 🔄 Optimización para uso offline
- 🔄 Búsqueda avanzada y filtros
- 📅 Sistema de recordatorios (próximamente)
- 📅 Compartir ubicaciones entre usuarios (próximamente)

## 🤝 Contribuciones

Este proyecto es actualmente un trabajo académico individual, pero las sugerencias son bienvenidas a través de issues.

## 📄 Licencia

[MIT License](LICENSE)

---

Desarrollado por [Tu Nombre] © 2025
