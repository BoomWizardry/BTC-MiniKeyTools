const path = require('path');
const moduleAlias = require('module-alias');

// Register aliases
moduleAlias.addAliases({
  '@core': path.join(__dirname, '../core'),
  '@utils': path.join(__dirname, '../src/utils'),
  '@classes': path.join(__dirname, '../src/classes'),
  '@config': path.join(__dirname, '../config'),
  '@tests': path.join(__dirname, '../tests')
});
