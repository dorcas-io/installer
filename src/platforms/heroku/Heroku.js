const fs = require("fs");
const path = require("path");
const Listr = require("listr");
const execa = require("execa");
const chalk = require("chalk");
const clear = require("clear");
const figlet = require("figlet");
const spawn = require("child_process").spawn;
const CLI = require("clui");
const Spinner = CLI.Spinner;
const Str = require("@supercharge/strings");
const params = require(path.join(__dirname, "../../lib/params.js"));
var _ = require("lodash/core");

function deployRequirements(options) {
  var count_checks = 0;
  const requirementsHeroku = {
    title: "Heroku Automation",
    task: () => {
      return new Listr(
        [
          {
            title: "Checking for Heroku CLI",
            task: (ctx, task) =>
              execa("heroku", ["--version"])
                .then(result => {
                  if (result.stdout.includes("heroku")) {
                    count_checks++;
                  } else {
                    //task.skip("Heroku CLI not available. Download at https://devcenter.heroku.com/articles/heroku-cli");
                    throw new Error(
                      "Heroku CLI not available. Download at https://devcenter.heroku.com/articles/heroku-cli"
                    );
                  }
                })
                .catch(e => {
                  console.log(e);
                  ctx.heroku = false;
                  //task.skip("Heroku CLI not available");
                  throw new Error(
                    "Heroku CLI not available. Download at https://devcenter.heroku.com/articles/heroku-cli"
                  );
                })
          }
        ],
        { concurrent: false }
      );
    }
  };

  return [requirementsHeroku, count_checks];
}

exports.deployRequirements = deployRequirements;

async function deployInit(options) {
  const status = new Spinner("Initializing Heroku Deployment...");
  status.start();

  console.log(
    `%s Please Login to Heroku Account. ${chalk.gray.italic(
      "Hit the enter key to log Inputs"
    )}`,
    chalk.green.bold("Heroku: ")
  );

  status.stop();

  try {
    let herokuLogin = [`login`];
    let ls = await spawn("heroku", herokuLogin);

    ls.stdout.on("data", async data => {
      console.log(`%s ${data}`, chalk.magenta.bold("Output: "));

      if (data.includes("Logged in as")) {
        await deployContainers(options);
        process.exit(1);
      }
    });

    ls.stderr.on("data", async data => {
      console.log(`%s ${data}`, chalk.magenta.bold("Input: "));
      process.stdin.pipe(ls.stdin);
      if (data.includes("quit")) {
        process.exit(1);
      }
    });
    ls.on("close", async code => {
      //console.log(code)
      if (code === 0) {
        console.log("%s Login successful", chalk.green.bold("Heroku: "));
      }
    });
    ls.on("error", async error => {
      console.log(`%s ${error.message}`, chalk.green.bold("Error: "));
    });
  } catch (err) {
    console.log("%s Login error: " + err, chalk.red.bold("Heroku: "));
    //await status.stop();
  }
}

async function deployContainers(options) {
  const status = new Spinner("Deploying Containers to Heroku...");
  status.start();

  //heroku container:push web

  try {
    let herokuLogin = [`login`];
    let ls = await spawn("heroku", herokuLogin);

    ls.stdout.on("data", async data => {
      console.log(`%s ${data}`, chalk.magenta.bold("Output: "));

      if (data.includes("Logged in as")) {
        await deployRepo(options);
        process.exit(1);
      }
    });

    ls.stderr.on("data", async data => {
      console.log(`%s ${data}`, chalk.magenta.bold("Input: "));
      process.stdin.pipe(ls.stdin);
      if (data.includes("quit")) {
        process.exit(1);
      }
    });
    ls.on("close", async code => {
      //console.log(code)
      if (code === 0) {
        console.log("%s Login successful", chalk.green.bold("Heroku: "));
      }
    });
    ls.on("error", async error => {
      console.log(`%s ${error.message}`, chalk.green.bold("Error: "));
    });
  } catch (err) {
    console.log("%s Login error: " + err, chalk.red.bold("Heroku: "));
    //await status.stop();
  }
}

exports.deployInit = deployInit;
