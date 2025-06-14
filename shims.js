// Polyfills para React Native - DEBE ser la primera importación
import 'react-native-get-random-values';

// Asegurar que crypto esté en el contexto global
if (typeof global.crypto === 'undefined') {
  global.crypto = {};
}

// Polyfill robusto para crypto.getRandomValues
if (typeof global.crypto.getRandomValues === 'undefined') {
  global.crypto.getRandomValues = function (array) {
    for (let i = 0; i < array.length; i++) {
      array[i] = Math.floor(Math.random() * 256);
    }
    return array;
  };
}

// También asegurar en el contexto window si existe (para compatibilidad web)
if (typeof window !== 'undefined' && typeof window.crypto === 'undefined') {
  window.crypto = global.crypto;
}

// Verificar que el polyfill funcione
try {
  const testArray = new Uint8Array(1);
  global.crypto.getRandomValues(testArray);
} catch (error) {
  console.error('Error en polyfill crypto.getRandomValues:', error);
}
