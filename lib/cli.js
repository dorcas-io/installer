import arg from "arg";
import inquirer from "inquirer";
import { createProject } from "./main";
const inquiries = require('./inquirer');



async function promptForMissingOptions(options) {
  const defaultTemplate = "developer";
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
