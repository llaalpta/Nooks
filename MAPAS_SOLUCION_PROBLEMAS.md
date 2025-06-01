# Solución al problema de los mapas en la APK de Android

Si estás experimentando que la aplicación se cierra cuando intentas abrir la pantalla de mapas en la versión APK instalada (pero funciona bien en Expo Go), sigue estos pasos:

## Causa del problema

La versión compilada como APK requiere una clave API válida de Google Maps para Android, mientras que Expo Go utiliza una clave genérica de desarrollo.

## Pasos para solucionar el problema

1. **Obtener una clave API de Google Maps**

   - Ve a la [Consola de Google Cloud Platform](https://console.cloud.google.com/)
   - Crea un nuevo proyecto o selecciona uno existente
   - Activa la API de Google Maps para Android
   - Crea una clave de API con restricciones para aplicaciones Android
   - Anota la clave API generada

2. **Configurar la clave API en tu proyecto**

   Edita el archivo `app.json` y reemplaza `YOUR_GOOGLE_MAPS_API_KEY` con tu clave real:

   ```json
   "android": {
     "adaptiveIcon": {
       "foregroundImage": "./assets/images/adaptive-icon.png",
       "backgroundColor": "#667eea"
     },
     "package": "com.nooks.app",
     "versionCode": 1,
     "jsEngine": "hermes",
     "config": {
       "googleMaps": {
         "apiKey": "TU_CLAVE_API_REAL_AQUÍ"
       }
     }
   }
   ```

3. **Volver a compilar la APK**

   ```
   npx eas-cli build -p android --profile preview
   ```

4. **Instalar la nueva APK en tu dispositivo**

   Escanea el QR generado o descárgala desde el enlace proporcionado

## Problema alternativo: Permisos de ubicación

Si configurar la API no resuelve el problema, asegúrate de:

1. Que la aplicación tiene permisos de ubicación concedidos en el dispositivo
2. Que el GPS esté activado al abrir la aplicación

## Troubleshooting adicional

Si continúas teniendo problemas:

1. Verifica que tu dispositivo Android tenga Google Play Services actualizado
2. Comprueba que la versión de `react-native-maps` (actualmente 1.20.1) es compatible con tu versión de Android
3. Considera usar un componente de mapa fallback cuando falle la carga del mapa principal

Para más información, consulta la documentación de [Expo Maps](https://docs.expo.dev/versions/latest/sdk/map-view/).
