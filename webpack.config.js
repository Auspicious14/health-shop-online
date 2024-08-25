const path = require("path");

module.exports = {
  entry: "./server.ts",
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist"),
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: {
          loader: "ts-loader",
          options: {
            configFile: "tsconfig.build.json",
          },
        },
        exclude: /node_modules/,
      },
    ],
  },
  target: "node",
  mode: "production",
};
