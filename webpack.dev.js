const common = require("./webpack.common");
const merge = require("webpack-merge");
const path = require("path");

module.exports = merge(common, {
  devServer: {
    historyApiFallback: {
      index: 'index.html'
    },
    compress: true,
    port: 9000
  },
  mode: "development"
});
