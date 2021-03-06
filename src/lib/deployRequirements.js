const arg = require("arg");
const path = require("path");
const params = require(path.join(__dirname, "./params.js"));
const Listr = require("listr");
const CLI = require("clui");
const Spinner = CLI.Spinner;
const execa = require("execa");
const chalk = require("chalk");
//const Str = require("@supercharge/strings");
var _ = require("lodash/core");

async function init(platform, additionalRequirements, additionalChecks) {
  const status = new Spinner(
    `Checking for ${platform.toUpperCase()} Deployment Requirements...`
  );
  status.start();

  var count_requirements = 2;
  var count_checks = 0;

  let listOfRequirements = [
    {
      title: "Basic Automation",
      task: () => {
        return new Listr(
          [
            {
              title: "Checking for Ansible",
              task: (ctx, task) =>
                execa("ansible", ["--version"])
                  .then(result => {
                    if (
                      result.stdout.includes("ansible python module location")
                    ) {
                      count_checks++;
                    } else {
                      task.skip("Ansible not available");
                      throw new Error("Ansible not available");
                    }
                  })
                  .catch(() => {
                    ctx.ansible = false;
                    task.skip("Ansible not available");
                    throw new Error("Ansible not available");
                  })
            },
            {
              title: "Checking for Terraform",
              task: (ctx, task) =>
                execa("terraform", ["-v"])
                  .then(result => {
                    if (result.stdout.includes("Terraform v")) {
                      count_checks++;
                    } else {
                      task.skip("Terraform not available");
                      throw new Error("Terraform not available");
                    }
                  })
                  .catch(() => {
                    ctx.ansible = false;
                    task.skip("Terraform not available");
                    throw new Error("Terraform not available");
                  })
            }
          ],
          { concurrent: false }
        );
      }
    }
  ];

  if (!_.isEmpty(additionalRequirements)) {
    listOfRequirements.push(additionalRequirements);
    count_requirements += additionalChecks;
  }

  //console.log(listOfRequirements);

  const deployRequirements = new Listr(listOfRequirements);

  await deployRequirements
    .run()
    .then(result => {
      if (count_checks >= count_requirements) {
        //console.log("\n");
        console.log(
          `%s All ${count_checks} of ${count_requirements} Deployment Requirement(s) passed`,
          chalk.green.bold("Success")
        );
        console.log("\n");

        status.stop();
      } else {
        //console.log("\n");
        console.log(
          `%s ${count_checks} of ${count_requirements} Deployment Requirement(s) passed. All must be met to proceed`,
          chalk.yellow.bold("Warning")
        );
        console.log("\n");

        process.exit(1);
      }
    })
    .catch(err => {
      //console.log("\n");
      console.error(
        "%s Deployment Requirements failed: " + err,
        chalk.red.bold("Error")
      );
      console.log("\n");
      process.exit(1);
    });
}

exports.init = init;
