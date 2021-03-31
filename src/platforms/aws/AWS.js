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
    title: "AWS Automation",
    task: () => {
      return new Listr(
        [
          {
            title: "Checking for AWS CLI",
            task: (ctx, task) =>
              execa("aws", ["--version"])
                .then(result => {
                  if (result.stdout.includes("aws-cli")) {
                    count_checks++;
                  } else {
                    throw new Error(
                      "AWS CLI not available. Download at https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2.html"
                    );
                  }
                })
                .catch(e => {
                  console.log(e);
                  ctx.aws = false;
                  throw new Error(
                    "AWS CLI not available. Download at https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2.html"
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

async function deployInit(options, platform) {
  const status = new Spinner(
    `Initializing AWS ${platform.toUpperCase()} Deployment...`
  );
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
        await createDorcasApp(options);
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

async function createDorcasApp(options) {
  const status = new Spinner("Creating the Dorcas Application...");
  status.start();

  //heroku container:push web
  //heroku stack:set container

  status.stop();

  try {
    let herokuAppName = `dorcas-business-${Str.random(8)}`.toLowerCase();

    let herokuAppURL = "";
    let herokuGitURL = "";

    let herokuAppCreate = [`apps:create`, herokuAppName, `--manifest`];

    let ls = await spawn("heroku", herokuAppCreate);

    ls.stdout.on("data", async data => {
      console.log(`%s ${data}`, chalk.magenta.bold("Output: "));
      if (data.includes("done")) {
        await processDorcasApp(options);
      }
      if (data.includes(" | ")) {
        //extract the App & GIt URLs
      }
    });

    ls.stderr.on("data", async data => {
      console.log(`%s ${data}`, chalk.magenta.bold("Input: "));
      process.stdin.pipe(ls.stdin);
    });

    ls.on("close", async code => {
      //console.log(code)
      if (code === 0) {
        console.log(
          "%s App Created successfully",
          chalk.green.bold("Heroku: ")
        );
      }
      processDorcasApp;
    });
    ls.on("error", async error => {
      console.log(`%s ${error.message}`, chalk.green.bold("Error: "));
    });
  } catch (err) {
    console.log("%s Create error: " + err, chalk.red.bold("Heroku: "));
    //await status.stop();
  }
}

async function processDorcasApp(options) {
  const status = new Spinner("Processing Dorcas Application...");
  status.start();

  //heroku container:push web
  //heroku stack:set container

  status.stop();

  try {
    let herokuAppOpen = [`open`];
    let ls = await spawn("heroku", herokuAppOpen);

    ls.stdout.on("data", async data => {
      console.log(`%s ${data}`, chalk.magenta.bold("Output: "));
    });

    ls.stderr.on("data", async data => {
      console.log(`%s ${data}`, chalk.magenta.bold("Input: "));
      process.stdin.pipe(ls.stdin);
    });
    ls.on("close", async code => {
      //console.log(code)
      if (code === 0) {
        console.log("%s Opened", chalk.green.bold("Heroku: "));
      }
    });
  } catch (err) {
    console.log("%s Create error: " + err, chalk.red.bold("Heroku: "));
    //await status.stop();
  }
}
