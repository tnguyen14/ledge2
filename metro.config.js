/**
 * Metro configuration for React Native
 * https://github.com/facebook/react-native
 *
 * @format
 */

const Resolver = require('metro-resolver');
const path = require('path');

module.exports = {
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true,
      },
    }),
  },
  resolver: {
    // simplistic hack to allow resolving skypack assets
    // with node_modules in native
    resolveRequest: (context, realModuleName, platform, moduleName) => {
      let name = moduleName;
      if (moduleName.startsWith('https://')) {
        name = moduleName.replace(/https:\/\/cdn\.skypack\.dev\//, '').replace(/@\d+/, '')
        console.log(`Replacing ${moduleName} with ${name}`);
      }
      return Resolver.resolve({...context, resolveRequest: undefined}, name, platform)
    },
    nodeModulesPaths: [path.resolve('native/node_modules')]
  }
};
