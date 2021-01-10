#!/usr/bin/env node

/*
Dorcas Installer
*/

const path = require("path");

// CLI Processor
require(path.join(__dirname, "../lib/cli.js")).cli(process.argv);
