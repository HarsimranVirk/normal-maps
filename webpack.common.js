const path = require("path");

module.exports = {
  entry: ["@babel/polyfill", "./src/main.js"],
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "main.bundle.js"
  },
  devtool: "inline-source-map"
};
