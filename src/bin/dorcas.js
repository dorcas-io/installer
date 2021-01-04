#!/usr/bin/env node

/*
Dorcas Installer
*/

// require = require('esm')(module /*, options*/);
const path = require("path");

// cli(process)
require(path.join(__dirname, "../lib/cli.js")).cli(process.argv);
