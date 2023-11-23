const { getDefaultConfig } = require('metro-config');

module.exports = (async () => {
  const defaultConfig = await getDefaultConfig();
  return {
    resolver: {
      extraNodeModules: {
        'safe-buffer': require.resolve('safe-buffer'),
      },
    },
  };
})();
