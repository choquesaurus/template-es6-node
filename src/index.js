#!/usr/bin/env node
//require("core-js");
require("regenerator-runtime/runtime");
//require("@babel/polyfill");
require("@babel/register")({
  extends: "./.babelrc",
  ignore: [/node_modules/],
});
require("./app");
