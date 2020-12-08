import arg from "arg";
import inquirer from "inquirer";
import { createProject } from "./main";
const inquiries = require('./inquirer');

function parseArgumentsIntoOptions(rawArgs) {
  const args = arg(
    { "--auto": Boolean, "--command_path": String, "--env_path" : String },
    { argv: rawArgs.slice(2) }
  );
  return {
    skipInputs: args["--auto"] || false,
    commandPath: args["--command_path"],
    envPath: args["--env_path"]
  };
}

async function promptForMissingOptions(options) {
  const defaultTemplate = "business";
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
    template: answers.template || defaultTemplate,
  };
}

export async function cli(args) {
  let options = parseArgumentsIntoOptions(args);
  options = await promptForMissingOptions(options);

  await createProject(options);
}

// ...
