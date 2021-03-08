const fs = require("fs");
const Listr = require("listr");
const ncp = require("ncp");
exports.ncp = ncp;
const path = require("path");
const envfile = require("envfile");
const util = require("util");
exports.util = util;
const chalk = require("chalk");
const clear = require("clear");
const figlet = require("figlet");
const spawn = require("child_process").spawn;
const CLI = require("clui");
const Spinner = CLI.Spinner;
exports.Spinner = Spinner;
const access = util.promisify(fs.access);
exports.access = access;
const params = require(path.join(__dirname, "./params.js"));
exports.params = params;
const installBusiness = require(path.join(__dirname, "./installBusiness.js"));

clear();
console.log(
  chalk.yellow(
    figlet.textSync(params.general.title, { horizontalLayout: "full" })
  )
);

console.log(
  `Welcome to the ${params.general.title_full} v` +
    require(path.join(__dirname, "../../package.json")).version
);
console.log(
  `You can exit the ${params.general.title} CLI at any time by hitting CTRL + C`
);

function installerHelp() {
  console.log(chalk.yellow(`BELOW ARE THEY COMMANDS YOU CAN RUN: \n`));
  console.log(
    "- " +
      chalk.green.bold("install-business") +
      ` Run the ${
        params.general.title
      } Business Edition Installer like so: ${chalk.gray.italic.bold(
        "dorcas install-business"
      )}. ` +
      `Add the ${chalk.gray.italic.bold(
        "--interactive"
      )} argument for an interactive prompt for each argument. ` +
      `Add the ${chalk.gray.italic.bold(
        "--argument"
      )} argument to specify all arguments via command line.` +
      `\n`
  );
  console.log(
    "- " +
      chalk.green.bold("help") +
      ` Show all available commands like so: ` +
      chalk.gray.italic.bold("dorcas help")
  );

  console.log(
    `You can exit the ${params.general.title} CLI at any time by hitting CTRL + C`
  );
  console.log("\n");
}

async function initDorcas(options) {
  switch (options.defaultAction) {
    case "install-business":
      installBusiness.installBusiness(options);
      break;
    case "load":
      if (options.module == "no-module") {
        console.log("%s No Module Specified", chalk.blue.bold("Modullo LOAD:"));
      } else {
        //installBusinessModule.installBusinessModule(options);
      }
      break;
    case "help":
      installerHelp();
      break;
    default:
      installerHelp();
  }
}

exports.processCLI = initDorcas;
