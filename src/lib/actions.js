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
const deployRequirements = require(path.join(
  __dirname,
  "./deployRequirements.js"
));
const heroku = require(path.join(__dirname, "../platforms/heroku/Heroku.js"));

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
console.log("\n\n");

function cmdHelp() {
  console.log(chalk.yellow(`BELOW ARE THEY COMMANDS YOU CAN RUN: \n`));
  console.log(
    "- " +
      chalk.green.bold("install --business") +
      ` Run the ${
        params.general.title
      } Business Edition Installer like so: ${chalk.gray.italic.bold(
        "dorcas install --business"
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
  console.log("\n");
  console.log(
    `You can exit the ${params.general.title} CLI at any time by hitting CTRL + C`
  );
  console.log("\n");
}

async function initDorcas(options) {
  switch (options.defaultAction) {
    case "install":
      if (options.businessEdition) {
        installBusiness.installBusiness(options);
      }
      break;
    case "deploy":
      if (options.deployPlatform == "heroku") {
        let req = heroku.deployRequirements();
        //console.log(req);
        await deployRequirements.init("heroku", req[0], req[1]);
        heroku.deployInit();
      }
      break;
    case "help":
      cmdHelp();
      break;
    default:
      installerHelp();
  }
}

exports.initDorcas = initDorcas;
