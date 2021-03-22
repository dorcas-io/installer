const arg = require("arg");
const inquirer = require("inquirer");
const path = require("path");
const params = require(path.join(__dirname, "./params.js"));
//const main = require(path.join(__dirname, "./main.js"));
const inquiries = require(path.join(__dirname, "./inquiries.js"));
//const Listr = require("listr");
const CLI = require("clui");
//const Spinner = CLI.Spinner;
//const execa = require("execa");
const chalk = require("chalk");
//const spawn = require("child_process").spawn;
const Str = require("@supercharge/strings");
const actions = require(path.join(__dirname, "./actions.js"));
const installRequirements = require(path.join(
  __dirname,
  "./installRequirements.js"
));
var _ = require("lodash/core");

async function cli(args) {
  let options = parseArgumentsIntoOptions(args);
  options = await promptForMissingOptions(options);

  function parseArgumentsIntoOptions(rawArgs) {
    try {
      const args = arg(
        {
          "--auto": Boolean,
          "--command_path": String,
          "--env_path": String,
          "--business": Boolean,
          "--debug": Boolean,
          "--arguments": Boolean,
          "--interactive": Boolean,
          "--template": String,
          "--firstname": String,
          "--lastname": String,
          "--email": String,
          "--password": String,
          "--company": String,
          "--phone": String,
          "--features": String,
          "--domain": String,
          "--dns": String,
          "--dns_resolver": String,
          "--agreement": String,
          "--platform": String,
          "--premium": Boolean
        },
        { argv: rawArgs.slice(2) }
      );
      return {
        skipInputs: args["--auto"] || false,
        commandPath: args["--command_path"],
        envPath: args["--env_path"],
        businessEdition: args["--business"] || false,
        installInteractive: args["--interactive"] || false,
        installArguments: args["--arguments"] || true,
        defaultAction: rawArgs[2] || "help",
        debugMode: args["--debug"] || false,
        databasePassword: Str.random(18),
        argTemplate: args["--template"] || "production",
        argFirstname: args["--firstname"],
        argLastname: args["--lastname"],
        argEmail: args["--email"],
        argPassword: args["--password"],
        argCompany: args["--company"],
        argPhone: args["--phone"],
        argFeatures: args["--features"] || "all",
        argDomain: args["--domain"],
        argDNS: args["--dns"] || "localhost",
        argDNSResolver: args["--dns_resolver"] || "valet",
        argAgreeementTOS: args["--agreement"],
        deployPlatform: args["--platform"],
        deployPremium: args["--premium"] || false
      };
    } catch (err) {
      console.error(
        "%s " +
          err +
          ". You can view all available commands by entering: " +
          chalk.gray.italic.bold("dorcas help"),
        chalk.red.bold("Command Failed: ")
      );
      console.log("\n");
      process.exit(1);
    }
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
      case "install":
        if (!options.businessEdition && !options.communityEdition) {
          console.error(
            "%s You have not specified an edition to install!",
            chalk.red.bold("Error")
          );
          console.log(
            `You can run either ${chalk.gray.italic.bold(
              "dorcas install --business"
            )} OR ${chalk.gray.italic.bold("dorcas install --community")}` +
              `\n`
          );
          process.exit(1);
        }

        await installRequirements.installRequirements();

        if (options.businessEdition) {
          if (options.installInteractive) {
            const answers = await inquirer.prompt(inquiries.business_inquiries);
            return {
              ...options,
              answers,
              template: answers.template || defaultTemplate
            };
          }
          if (options.installArguments) {
            //lets parse command line arguments
            let optionsArguments = [];
            let missingArguments = {};

            if (
              !options.argTemplate ||
              !["production", "development"].includes(options.argTemplate)
            ) {
              missingArguments["template"] =
                "Template must be either 'production' or 'development'";
            } else {
              optionsArguments["template"] = options.argTemplate;
            }
            if (!options.argFirstname) {
              missingArguments["firstname"] = "Please enter your First Name";
            } else {
              optionsArguments["firstname"] = options.argFirstname;
            }
            if (!options.argLastname) {
              missingArguments["lastname"] = "Please enter your Last Name";
            } else {
              optionsArguments["lastname"] = options.argLastname;
            }
            if (
              !options.argEmail ||
              !/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(
                options.argEmail
              )
            ) {
              missingArguments["email"] = "Please enter a valid login Email";
            } else {
              optionsArguments["email"] = options.argEmail;
            }
            if (!options.argPassword || options.argPassword.length < 8) {
              missingArguments["password"] =
                "Please enter your Login Password (8 characters minimum)";
            } else {
              optionsArguments["password"] = options.argPassword;
            }
            if (!options.argCompany) {
              missingArguments["company"] =
                "Enter your Company or Business Name";
            } else {
              optionsArguments["company"] = options.argCompany;
            }
            if (!options.argPhone) {
              missingArguments["phone"] =
                "Please enter your Phone Number (8 - 14 characters)";
            } else {
              optionsArguments["phone"] = options.argPhone;
            }
            if (
              !options.argFeatures ||
              !["all"].includes(options.argFeatures)
            ) {
              missingArguments["features"] =
                "Please select your needed features";
            } else {
              optionsArguments["feature_select"] = options.argFeatures;
            }
            if (!options.argDomain) {
              //missingArguments["domain"] = "Enter a Domain Name for this installation";
              optionsArguments["domain"] =
                options.argTemplate == "production"
                  ? params.general.default_domain_production
                  : params.general.default_domain_development;
            } else {
              optionsArguments["domain"] = options.argDomain;
            }
            if (
              !options.argDNS ||
              !["dns", "localhost"].includes(options.argDNS)
            ) {
              missingArguments["dns"] =
                "Specify if installation be served using the Domain Name 'dns' or 127.0.0.1 'localhost'";
            } else {
              optionsArguments["dns"] = options.argDNS;
            }
            if (
              !options.argDNSResolver ||
              !["valet"].includes(options.argDNSResolver)
            ) {
              missingArguments["dns_resolver"] =
                "Kindly choose an applicable DNS Resolver for automatic configuration such as 'valet'";
            } else {
              optionsArguments["dns_resolver"] = options.argDNSResolver;
            }
            if (
              !options.argAgreeementTOS ||
              !["yes", "no"].includes(options.argAgreeementTOS)
            ) {
              missingArguments["agreement"] =
                "You need to agree (or disagree) with Terms/Conditions of Use and Privacy Policy available at https://dorcas.io/agreement. Enter 'yes' or 'no'";
            } else {
              optionsArguments["agreement"] = options.argAgreeementTOS;
            }

            //console.log(missingArguments);
            //console.log(optionsArguments);

            if (_.size(missingArguments) > 0) {
              console.error(
                "%s The following argument(s) is/are required but either missing OR in the wrong format: ",
                chalk.red.bold("Error")
              );
              Object.keys(missingArguments).forEach(element => {
                console.log(
                  `- ${chalk.red.bold(element)}: ${chalk.italic(
                    missingArguments[element]
                  )}`
                );
              });
              console.log("\n");
              process.exit(1);
            }

            let answers = optionsArguments;

            return {
              ...options,
              answers,
              template: optionsArguments.template || defaultTemplate
            };
          }
        }

        break;

      case "deploy":
        if (
          !options.deployPlatform ||
          !["heroku", "aws-lightsail"].includes(options.deployPlatform)
        ) {
          console.error(
            "%s Please specify a valid Deployment Platform!",
            chalk.red.bold("Error")
          );
          process.exit(1);
        }
        return {
          ...options,
          template: "deploy"
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
  await actions.initDorcas(options);
}

exports.cli = cli;

// ...
