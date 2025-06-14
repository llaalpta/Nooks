require('./shims');

try {
  const array = new Uint8Array(10);
  global.crypto.getRandomValues(array);
} catch (error) {
  console.error('3. Error en crypto.getRandomValues:', error.message);
}

try {
} catch (error) {
  console.error('4. Error generando UUID:', error.message);
}
