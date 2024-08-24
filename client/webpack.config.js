const path = require('path');

module.exports = {
  resolve: {
    alias: {
      'components': path.resolve(__dirname, 'src/components'),
      'images': path.resolve(__dirname, 'src/images/') 
    },
    extensions: ['.jsx', '.js', '.scss', '.json'],
  },
  devServer: {
    allowedHosts: 'auto' | 'all' | Array[string]
  }
};