// Test para verificar que crypto.getRandomValues() funciona
require('./shims');
const { v4: uuidv4 } = require('uuid');

console.log('=== CRYPTO POLYFILL TEST ===');

// Test 1: Verificar que crypto.getRandomValues esté disponible
console.log('1. crypto disponible:', typeof global.crypto !== 'undefined');
console.log(
  '2. crypto.getRandomValues disponible:',
  typeof global.crypto.getRandomValues !== 'undefined'
);

// Test 2: Probar crypto.getRandomValues directamente
try {
  const array = new Uint8Array(10);
  global.crypto.getRandomValues(array);
  console.log(
    '3. crypto.getRandomValues funciona:',
    array.some((x) => x > 0)
  );
} catch (error) {
  console.log('3. Error en crypto.getRandomValues:', error.message);
}

// Test 3: Probar UUID que usa crypto.getRandomValues internamente
try {
  const id = uuidv4();
  console.log('4. UUID generado exitosamente:', id);
} catch (error) {
  console.log('4. Error generando UUID:', error.message);
}

console.log('=== FIN DEL TEST ===');
