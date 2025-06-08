const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

config.resolver.unstable_enablePackageExports = false;

// Resolver configuration to exclude react-native-maps on web
config.resolver.resolverMainFields = ['react-native', 'browser', 'main'];
config.resolver.platforms = ['ios', 'android', 'native', 'web'];

// Asegurar que Hermes esté habilitado para debugging
config.transformer.hermes = {
  enabled: true,
};

// Configuración de polyfills
config.resolver.alias = {
  crypto: 'react-native-get-random-values',
};

// Solo bloqueamos react-native-maps en plataforma web
if (process.env.EXPO_PUBLIC_PLATFORM === 'web') {
  config.resolver.blockList = [/.*react-native-maps.*/];
}

module.exports = config;
