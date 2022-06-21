module.exports = {
  debug: true,
  useProxy: true,
  proxyVerbose: true,
  /**
   * Change to false after your app is registered in configuration files
   */
  interceptChromeConfig: false,
  appUrl: '/staging/starter',
  routes: {
    '/api/content_sources/': { host: 'http://localhost:8000' },
  },
  /**
   * Add additional webpack plugins
   */
  plugins: [],
};
