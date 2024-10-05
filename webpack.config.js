"use strict"
const path = require("path")

const webpageConfig = {
    mode: "production", //"none" doesn't seem to work for the webview. 
    entry: "./webpage/main.ts",
    output: {
      path: path.resolve(__dirname, "webpage"),
      filename: "compile.js"
    },
    resolve: {
      extensions: [ ".ts", ".tsx", ".js", ".jsx" ]
    },
    module: {
      rules: [
        {
          test: /\.(ts|tsx)$/,
          exclude: /node_modules/,
          use: [
            { loader: "ts-loader" }
          ]
        },
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          include: path.resolve(__dirname, "webpage/main.ts"),
          use: [
            {
              loader: "babel-loader",
              options: {
                presets: [
                  [ "@babel/preset-env", { targets: "defaults" } ],
                  "@babel/preset-react",
                  "@babel/preset-typescript"
                ]
              }
            }
          ]
        }
      ]
    }
  }

module.exports = [ webpageConfig ]
