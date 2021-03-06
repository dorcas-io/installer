const arg = require("arg");
const inquirer = require("inquirer");
const path = require("path");
//const params = require(path.join(__dirname, "./params.js"));
//const main = require(path.join(__dirname, "./main.js"));
const inquiries = require(path.join(__dirname, "./inquiries.js"));
//const Listr = require("listr");
const CLI = require("clui");
//const Spinner = CLI.Spinner;
//const execa = require("execa");
//const chalk = require("chalk");
//const spawn = require("child_process").spawn;
const Str = require("@supercharge/strings");
const actions = require(path.join(__dirname, "./actions.js"));
const installRequirements = require(path.join(
  __dirname,
  "./installRequirements.js"
));

async function cli(args) {
  await installRequirements.installRequirements();

  let options = parseArgumentsIntoOptions(args);
  options = await promptForMissingOptions(options);

  function parseArgumentsIntoOptions(rawArgs) {
    const args = arg(
      {
        "--auto": Boolean,
        "--command_path": String,
        "--env_path": String,
        "--debug": Boolean
      },
      { argv: rawArgs.slice(2) }
    );
    return {
      skipInputs: args["--auto"] || false,
      commandPath: args["--command_path"],
      envPath: args["--env_path"],
      defaultAction: rawArgs[2] || "help",
      debugMode: args["--debug"] || false,
      databasePassword: Str.random(18)
    };
  }

  async function promptForMissingOptions(options) {
    const defaultTemplate = "production";
    // if (options.skipInputs) {
    //   return {
    //     ...options,
    //     template: options.template || defaultTemplate
    //   };
    // }
    //const answers = await inquirer.prompt(inquiries.inquiries);
    switch (options.defaultAction) {
      case "install-business":
        const business_prompts = await inquirer.prompt(
          inquiries.business_inquiries
        );
        return {
          ...options,
          business_prompts,
          template: business_prompts.template || defaultTemplate
        };
        break;

      case "load":
        return {
          ...options,
          module: args["load"] || "no-module"
        };
        break;

      default:
        return {
          ...options,
          template: options.template || defaultTemplate
        };
    }
  }

  //await main.createProject(options);
  //process the CLI arguments & options into Modullo Actions
  await actions.processCLI(options);
}

exports.cli = cli;

// ...
