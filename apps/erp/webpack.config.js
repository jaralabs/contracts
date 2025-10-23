const { withModuleFederation } = require('@nx/angular/module-federation');
require('dotenv').config();
const config = require('./module-federation.config');

module.exports = withModuleFederation({
  ...config,
  devServer: {
    liveReload: false,
    hot: false,
  },
});
