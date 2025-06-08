# 📦 Entrega del Proyecto Final - Nooks

**Autor:** Lázaro Piñero Sánchez  
**Ciclo:** Desarrollo de Aplicaciones Multiplataforma (DAM)  
**Fecha de entrega:** 8 de junio de 2025  
**Asignatura:** [Nombre de la asignatura]

---

## 📱 Sobre Nooks
Nooks es una aplicación móvil desarrollada en React Native que revoluciona la forma de organizar y encontrar objetos personales. Mediante un sistema jerárquico intuitivo (Realms → Nooks → Treasures) y funciones avanzadas como geolocalización, gestión de imágenes y etiquetas personalizables, los usuarios nunca más olvidarán dónde guardaron sus pertenencias.

### ✨ Características principales
- 🏠 **Realms:** Ubicaciones generales (casa, oficina, almacén)
- 📦 **Nooks:** Espacios específicos dentro de cada Realm (cajón, estantería, armario)
- 💎 **Treasures:** Objetos catalogados con fotos y detalles
- 🗺️ **Geolocalización:** Ubicación exacta de Realms en mapa interactivo
- 🏷️ **Sistema de etiquetas:** Organización y filtrado inteligente
- 🔍 **Búsqueda avanzada:** Encuentra cualquier objeto rápidamente

---

## 🔗 Enlaces del Proyecto

### 📋 Repositorio de Código
- GitHub: [https://github.com/llaalpta/Nooks](https://github.com/llaalpta/Nooks)

El repositorio contiene todo el código fuente, documentación técnica, scripts de base de datos y archivos de configuración necesarios para ejecutar el proyecto.

### 📱 Aplicación para Testing (Android)
- **APK Direct Download:** [Descargar APK de Nooks (Expo Build)](https://expo.dev/accounts/llaalpta/projects/Nooks/builds/3fdb8a6f-316d-4df4-bc6e-b720bef80217)
- **QR Code para instalación:**

<p align="center">
  <img src="assets/images/nooks-qr.png" alt="QR Build Nooks" width="220" />
</p>

### iOS (En desarrollo)
- TestFlight: Estará disponible el día de la presentación
- Simulator Build: Disponible para testing en simulador iOS

---

## 🛠️ Stack Tecnológico

### Frontend
- React Native con Expo SDK
- TypeScript para tipado estático
- Expo Router para navegación
- React Query para gestión de estado del servidor
- React Hook Form + Zod para formularios y validación

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

## 📋 Instrucciones de Instalación y Testing

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

## 🎯 Funcionalidades Implementadas

### ✅ Completadas
- Sistema de autenticación completo (registro, login, perfil)
- CRUD completo para Realms, Nooks y Treasures
- Geolocalización con mapas interactivos
- Gestión de imágenes (captura, galería, optimización)
- Sistema de etiquetas con colores personalizables
- Búsqueda avanzada con filtros múltiples
- Navegación jerárquica intuitiva
- Interfaz responsive y accesible
- Tema claro/oscuro automático
- Almacenamiento seguro en la nube

### 🔄 En desarrollo para la presentación
- Build de iOS para TestFlight
- Optimizaciones de rendimiento adicionales
- Funciones de exportación de datos

---

## 📊 Estado del Proyecto
- Desarrollo: 95% Completado
- ✅ Funcionalidades core implementadas
- ✅ Base de datos configurada y poblada
- ✅ Testing en dispositivos Android
- ✅ Documentación técnica completa

### Distribución:
- ✅ Android: APK funcionando correctamente
- 🔄 iOS: En proceso para el día de presentación

---

## 🔍 Notas Importantes para Evaluación
- Credenciales de prueba: Se proporcionarán credenciales de usuario demo si es necesario
- Base de datos: Completamente funcional con datos de ejemplo
- Rendimiento: Optimizado para dispositivos con 2GB+ RAM
- Conectividad: Requiere conexión a internet para sincronización
- Permisos: Solicita acceso a cámara, galería y ubicación

---

## 📞 Contacto y Soporte
- **Desarrollador:** Lázaro Piñero Sánchez
- **Email:** [tu-email@dominio.com]
- **GitHub:** [@llaalpta](https://github.com/llaalpta)

Para cualquier consulta técnica, problema de instalación o demostración adicional, no dudes en contactarme.

---

## 📝 Conclusión
Nooks representa la culminación de los conocimientos adquiridos durante el ciclo DAM, implementando tecnologías modernas y mejores prácticas de desarrollo móvil. La aplicación no solo cumple con los requisitos técnicos establecidos, sino que ofrece una experiencia de usuario pulida y funcionalidades que resuelven un problema real del día a día.

El proyecto demuestra competencias en desarrollo multiplataforma, gestión de bases de datos, implementación de APIs, diseño de interfaz, y arquitectura de software escalable.

Gracias por la oportunidad de presentar este proyecto. Espero que la evaluación de Nooks sea tan satisfactoria como ha sido su desarrollo.

Lázaro Piñero Sánchez  
Estudiante DAM - 2024/2025
