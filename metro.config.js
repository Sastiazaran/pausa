const { getDefaultConfig } = require('expo/metro-config');

/**
 * Metro configuration.
 *
 * The WASM asset and the cross-origin headers are what expo-sqlite needs in
 * the browser, so the same database code can be previewed on web.
 */
const config = getDefaultConfig(__dirname);

config.resolver.assetExts.push('wasm');

config.server.enhanceMiddleware = (middleware) => {
  return (request, response, next) => {
    response.setHeader('Cross-Origin-Embedder-Policy', 'credentialless');
    response.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
    middleware(request, response, next);
  };
};

module.exports = config;
