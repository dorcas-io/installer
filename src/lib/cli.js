const arg = require("arg");
const inquirer = require("inquirer");
const path = require("path");
const params = require(path.join(__dirname, "./params.js"));
const main = require(path.join(__dirname, "./main.js"));
const inquiries = require(path.join(__dirname, "./inquirer.js"));

async function cli(args) {
  let options = parseArgumentsIntoOptions(args);
  options = await promptForMissingOptions(options);

  function parseArgumentsIntoOptions(rawArgs) {
    const args = arg(
      { "--auto": Boolean, "--command_path": String, "--env_path": String },
      { argv: rawArgs.slice(2) }
    );
    return {
      skipInputs: args["--auto"] || false,
      commandPath: args["--command_path"],
      envPath: args["--env_path"]
    };
  }

  async function promptForMissingOptions(options) {
    const defaultTemplate = "production";
    if (options.skipInputs) {
      return {
        ...options,
        template: options.template || defaultTemplate
      };
    }
    const answers = await inquirer.prompt(inquiries.inquiries);

    return {
      ...options,
      answers,
      template: answers.template || defaultTemplate
    };
  }

  await main.createProject(options);
}

exports.cli = cli;

// ...
