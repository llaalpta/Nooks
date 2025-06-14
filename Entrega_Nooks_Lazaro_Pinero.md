# Entrega del Proyecto Final - Nooks

**Autor:** Lázaro Piñero Sánchez
**Centro:** CIFP Carlos III Cartagena
**Ciclo:** Desarrollo de Aplicaciones Multiplataforma (DAM)
**Fecha de entrega:** 8 de junio de 2025
**Asignatura:** Proyecto DAM 2425

---

## Sobre Nooks

Nooks es una aplicación móvil desarrollada en React Native que revoluciona la forma de organizar y encontrar objetos personales. Mediante un sistema jerárquico intuitivo (Realms → Nooks → Treasures) y funciones avanzadas como geolocalización, gestión de imágenes y etiquetas personalizables, los usuarios nunca más olvidarán dónde guardaron sus pertenencias.

### ✨ Características principales

- 🏠 **Realms:** Ubicaciones generales (casa, oficina, almacén)
- 📦 **Nooks:** Espacios específicos dentro de cada Realm (cajón, estantería, armario)
- 💎 **Treasures:** Objetos catalogados con fotos y detalles
- 🗺️ **Geolocalización:** Ubicación exacta de Realms en mapa interactivo
- 🏷️ **Sistema de etiquetas:** Organización y filtrado inteligente

---

## Enlaces del Proyecto

### Repositorio de Código

- GitHub: [https://github.com/llaalpta/Nooks](https://github.com/llaalpta/Nooks)

El repositorio contiene todo el código fuente, documentación técnica, scripts de base de datos y archivos de configuración necesarios para ejecutar el proyecto.

### Aplicación para Testing (Android)

- **APK Direct Download:** [Descargar APK de Nooks (Expo Build)](https://expo.dev/accounts/llaalpta/projects/Nooks/builds/f1d05f0d-96ca-4d6e-8de8-0ed777e6c8bd)
- **QR Code para instalación:**

  ![1749483580216](image/Entrega_Nooks_Lazaro_Pinero/1749483580216.png)

### iOS (En desarrollo)

- TestFlight: disponible el día de la presentación

---

## Stack Tecnológico

### Frontend

- React Native con Expo SDK
- TypeScript para tipado estático
- Expo Router para navegación
- React Query para gestión de estado del servidor
- React Hook Form para formularios y validación

### Backend & Servicios

- Supabase (Backend as a Service)
  - PostgreSQL como base de datos
  - Authentication & Authorization
  - Storage para imágenes
  - Real-time subscriptions

### Herramientas de Desarrollo

- Material Design 3 siguiendo guías de diseño
- React Native Maps para geolocalización
- Expo Image Picker para gestión de imágenes
- EAS Build para compilación y distribución

---

## Instrucciones de Instalación y Testing

### Para Android:

- Descarga directa: Hacer clic en el enlace del APK proporcionado
- Vía QR: Escanear el código QR con la cámara del dispositivo
- Instalación: Permitir instalación de fuentes desconocidas si es necesario
- Primera ejecución: La app se conectará automáticamente a los servicios de backend

### Para desarrollo local:

- Clonar repositorio: `git clone https://github.com/llaalpta/Nooks.git`
- Instalar dependencias: `npm install`
- Configurar variables de entorno: Copiar `.env.example` a `.env`
- Ejecutar: `npx expo start`

---

## Funcionalidades Implementadas

### ✅ Completadas

- Sistema de autenticación completo (registro, login, perfil)
- CRUD completo para Realms, Nooks y Treasures
- Geolocalización con mapas interactivos
- Gestión de imágenes (captura, galería, optimización)
- Sistema de etiquetas con colores personalizables
- Búsqueda
- Navegación jerárquica intuitiva
- Interfaz responsive y accesible
- Tema claro/oscuro
- Almacenamiento seguro en la nube

### 🔄 En desarrollo para la presentación

- Build de iOS para TestFlight
- Optimizaciones de rendimiento adicionales
- Funciones de exportación de datos

---

## Estado del Proyecto

- Desarrollo: 85% Completado
- ✅ Funcionalidades core implementadas
- ✅ Base de datos configurada y poblada
- ✅ Testing en dispositivos Android
- ✅ Documentación técnica completa

### Distribución:

- ✅ Android: APK funcionando correctamente
- 🔄 iOS: En proceso

---

## Notas para Evaluación

- Credenciales de prueba: Se proporcionarán credenciales de usuario demo si es necesario
- Base de datos: Completamente funcional con datos de ejemplo
- Rendimiento: Optimizado para dispositivos con 8GB+ RAM
- Conectividad: Requiere conexión a internet para sincronización
- Permisos: Solicita acceso a cámara, galería y ubicación

---

## Contacto y Soporte

- **Desarrollador:** Lázaro Piñero Sánchez
- **Email:** 3730085@alu.murciaeduca.com | llaalpta@gmail.com
- **GitHub:** [@llaalpta](https://github.com/llaalpta)

Para cualquier consulta técnica, problema de instalación o demostración adicional.

---

## Conclusión

Nooks representa la culminación de los conocimientos adquiridos durante el ciclo DAM, implementando tecnologías modernas y mejores prácticas de desarrollo móvil. La aplicación cumple con los requisitos técnicos establecidos yofrece una buena experiencia de usuario y funcionalidades que resuelven un problema real del día a día.

El proyecto demuestra competencias en desarrollo multiplataforma, gestión de bases de datos, implementación de APIs, diseño de interfaz, y arquitectura de software escalable.

Lázaro Piñero Sánchez

Estudiante DAM - 2024/2025
