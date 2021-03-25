const fs = require("fs");
const path = require("path");
const Listr = require("listr");
const execa = require("execa");
const chalk = require("chalk");
const clear = require("clear");
const figlet = require("figlet");
const spawn = require("child_process").spawn;
const CLI = require("clui");
const util = require("util");
const access = util.promisify(fs.access);
const Spinner = CLI.Spinner;
const Str = require("@supercharge/strings");
const params = require(path.join(__dirname, "../../lib/params.js"));
var _ = require("lodash/core");
const utilities = require(path.join(__dirname, "../../lib/utilities.js"));
const open = require("open");

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

  await utilities.installTemplateFiles(options);

  console.log(
    "%s " +
      options.template.toUpperCase() +
      " Version Template Files Installed",
    chalk.green.bold("Success")
  );

  await access(options.templateDirectory, fs.constants.R_OK);

  console.log(
    `%s Please Login to Heroku Account. ${chalk.gray.italic(
      "Hit the enter key to log any Inputs"
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
        process.setMaxListeners(0);
        await createApp(options, "core", "default"); // create CORE app
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

async function createApp(options, app, heroku_type) {
  const status = new Spinner(
    `Creating the Dorcas ${app.toUpperCase()} Application...`
  );
  status.start();

  status.stop();

  try {
    let randomString = Str.random(8);
    randomString = Str(randomString)
      .replaceAll("_", "0")
      .replaceAll("-", "1");
    let herokuAppName = `dorcas-business-${app}-${randomString}`.toLowerCase();

    if (app == "core") {
      options = {
        ...options,
        herokuAppNameCore: herokuAppName
      };
    } else if (app == "hub") {
      options = {
        ...options,
        herokuAppNameHub: herokuAppName
      };
    }

    let herokuAppURL = "";
    let herokuGitURL = "";

    let herokuAppCreate = [`apps:create`, herokuAppName]; //, `--manifest`

    let ls = await spawn("heroku", herokuAppCreate);

    ls.stdout.on("data", async data => {
      console.log(`%s ${data}`, chalk.magenta.bold("Output: "));
      if (data.includes("done")) {
        //await processDorcasApp(options);
      }
      if (data.includes(" | ")) {
        //extract the App & GIt URLs - https://dorcas-business-8kuu4rq1.herokuapp.com/ | https://git.heroku.com/dorcas-business-8kuu4rq1.git

        let extract = Str(data).split("|");
        herokuAppURL = Str(extract[0]).trim();
        herokuGitURL = Str(extract[1]).trim();

        if (app == "core") {
          options = {
            ...options,
            deployHostCore: Str(herokuAppURL)
              .replace("https://", "")
              .replace("/", "")
              .trim()
              .get(),
            deployDomain: Str(herokuAppURL)
              .replace("https://", "")
              .replace("/", "")
              .trim()
              .get(),
            deployURLCore: Str(herokuAppURL)
              .trim()
              .get(),
            deployGitCore: Str(herokuGitURL)
              .trim()
              .get()
          };
        }

        if (app == "hub") {
          options = {
            ...options,
            deployHostHub: Str(herokuAppURL)
              .replace("https://", "")
              .replace("/", "")
              .trim()
              .get(),
            deployDomain: Str(herokuAppURL)
              .replace("https://", "")
              .replace("/", "")
              .trim()
              .get(),
            deployURLHub: Str(herokuAppURL)
              .trim()
              .get(),
            deployGitHub: Str(herokuGitURL)
              .trim()
              .get()
          };
        }
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
          `%s ${app.toUpperCase()} App Created successfully`,
          chalk.green.bold("Heroku: ")
        );

        if (heroku_type == "default") {
          if (app == "core") {
            await createAddons(options, app);
          } else if (app == "hub") {
            let results = await utilities.setupHubENV(options);

            console.log("\n");
            console.log(
              `%s Preparing Dorcas ${app.toUpperCase()} Application for Heroku...\n`,
              chalk.green.bold("CLI: ")
            );
            await utilities.downloadFiles(results.options, app);
          }
        } else {
          await createManifest(options, app);
        }
      }
    });
    ls.on("error", async error => {
      console.log(`%s ${error.message}`, chalk.green.bold("Error: "));
    });
  } catch (err) {
    console.log("%s Create error: " + err, chalk.red.bold("Heroku: "));
    //await status.stop();
  }
}

async function createManifest(options, app) {
  let heroku_yml = {
    build: {
      docker: {
        web: "Dockerfile"
      }
    },
    run: {
      web: "bundle exec puma -C config/puma.rb"
    }
  };

  let herokuYAMLPath =
    options.targetDirectory + `/heroku.yaml.` + options.template.toLowerCase();

  options = {
    ...options,
    deployHerokuYAMLPathHub: herokuYAMLPath
  };

  await utilities.writeYAML(options, heroku_yml, herokuYAMLPath, async function(
    result
  ) {
    if (result) {
      console.log(
        `%s Heroku.yaml successfully written \n`,
        chalk.green.bold("CLI: ")
      );

      console.log("\n");
      console.log(
        `%s Preparing Dorcas ${app.toUpperCase()} Application for Heroku...\n`,
        chalk.green.bold("CLI: ")
      );
      await utilities.downloadFiles(options, app);
    } else {
    }
  });
}

async function createAddons(options, app) {
  const status = new Spinner("Provisioning Heroku Addons...");
  status.start();

  status.stop();

  let herokuAppName =
    app == "core" ? options.herokuAppNameCore : options.herokuAppNameHub;

  try {
    let addonsCommand = ``;
    addonsCommand += `heroku addons:create jawsdb:kitefin --version=5.7 --app ${herokuAppName} `; //mysql
    addonsCommand += `&& heroku addons:create rediscloud:30 --app ${herokuAppName}`; //redis heroku-redis:hobby-dev
    addonsCommand += `&& heroku addons:create mailgun:starter --app ${herokuAppName} `; //mail

    if (options.debugMode) {
      console.log(
        `%s Spawning ` + `${addonsCommand} ...\n`,
        chalk.yellow.bold("DEBUG: ")
      );
    }

    process.setMaxListeners(0);
    let ls = await spawn(addonsCommand, { shell: true });

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
        console.log(
          "%s Addons Provisioning Successful. Checking on Configuration Values... \n",
          chalk.green.bold("CLI: ")
        );

        waitOnConfigs(options, app);
      }
    });
  } catch (err) {
    console.log(
      "%s Addons Provisioning Error: " + err,
      chalk.red.bold("Heroku: ")
    );
    process.exit(1);
    //await status.stop();
  }
}

async function waitOnConfigs(options, app) {
  try {
    await checkConfigs(options, app, async function(result, data) {
      if (result) {
        setTimeout(async () => {
          let res = await extractConfigs(data, options);
          options = res;
          console.log(
            "%s Extracted Configuration Values \n",
            chalk.green.bold("CLI:")
          );
          console.log("\n");
          console.log("%s Configuring Addons...", chalk.green.bold("CLI: "));

          configureAddons(options, app);
        }, 5000);
      } else {
        setTimeout(async () => {
          console.log(
            "%s Re-Checking on Configuration Values...\n",
            chalk.green.bold("CLI: ")
          );
          await waitOnConfigs(options, app);
        }, 5000);
      }
    });
  } catch (e) {
    console.log("%s Error" + e, chalk.green.bold("Error: "));
  }
}

async function checkConfigs(options, app, callback) {
  var configChecks = 0;

  var configOK = false;

  var configData = "";

  let herokuAppName =
    app == "core" ? options.herokuAppNameCore : options.herokuAppNameHub;

  let checkCommand = `heroku config  --app ${herokuAppName} `;

  let ls = await spawn(checkCommand, { shell: true });

  ls.stdout.on("data", async data => {
    console.log(`%s ${data}`, chalk.magenta.bold("Output: "));

    if (Str(data).contains("JAWSDB_URL")) {
      configChecks++;
    }

    if (Str(data).contains("cloud.redislabs.com")) {
      configChecks++;
    }

    if (Str(data).contains("MAILGUN_API_KEY")) {
      configChecks++;
    }

    //console.log(configChecks)
    if (configChecks == 3) {
      configData = data;
      callback(true, data);
    }
  });

  ls.stderr.on("data", async data => {
    console.log(`%s ${data}`, chalk.magenta.bold("Input: "));
    if (
      Str(data).contains("ERROR") ||
      Str(data).contains("error") ||
      Str(data).contains("Error")
    ) {
      //throw data;
    }
    process.stdin.pipe(ls.stdin);
  });

  ls.on("close", async code => {
    if (code === 0) {
      if (configChecks == 3) {
        callback(true, configData);
      } else {
        callback(false, configData);
      }
    }
  });
  ls.on("error", async error => {
    callback(false, configData);
    console.log(`%s ${error.message}`, chalk.green.bold("Error: "));
  });
}

async function extractConfigs(configData, options) {
  try {
    let configLines = Str(configData).split("\n");

    //console.log(configLines);

    configLines.forEach(data => {
      //console.log(data);
      //CLEARDB_DATABASE_URL: mysql://be56afc6ae2ee5:0e662c4f@us-cdbr-east-03.cleardb.com/heroku_4e6251f35513a12?reconnect=true
      //mysql://user:pass@instance:port/default_schema
      if (Str(data).startsWith("JAWSDB_URL")) {
        // extract database details
        let extract = Str(data).split("@");
        //console.log(extract)
        let username_password = Str(extract[0])
          .replace("JAWSDB_URL:", "")
          .replace("mysql://", "")
          .ltrim()
          .split(":");
        let host_db = Str(extract[1])
          .replace(":3306", "")
          .split("/");

        options = {
          ...options,
          deployDBUser: Str(username_password[0])
            .trim()
            .get(),
          deployDBPass: Str(username_password[1])
            .trim()
            .get(),
          deployDBHost: Str(host_db[0])
            .trim()
            .get(),
          deployDBCore: Str(host_db[1])
            .trim()
            .get(),
          deployDBHub: Str(host_db[1])
            .trim()
            .get(),
          deployDBPort: "3306"
        };
      }
      //REDIS_TLS_URL: rediss://:pdb73e792007bd8f61ff0b78cabab913ae596429d4c78881a215f5b974a6f6067@ec2-18-205-8-92.compute-1.amazonaws.com:13310
      // REDIS_URL:     redis://:pdb73e792007bd8f61ff0b78cabab913ae596429d4c78881a215f5b974a6f6067@ec2-18-205-8-92.compute-1.amazonaws.com:13309
      //REDISCLOUD_URL:        redis://default:Ll2KctRq9Exe6UxSI4uJKFFMeeW1Go3A@redis-17440.c258.us-east-1-4.ec2.cloud.redislabs.com:17440
      let redisMatch2 = options.deployPremium ? "REDIS_TLS_URL" : "REDIS_URL";
      let redisReplace2 = options.deployPremium
        ? "REDIS_TLS_URL: rediss://"
        : "REDIS_URL:     redis://";
      let redisMatch = options.deployPremium
        ? "cloud.redislabs.com"
        : "cloud.redislabs.com";
      let redisReplace = options.deployPremium
        ? "REDISCLOUD_URL:        redis://"
        : "REDISCLOUD_URL:        redis://";
      if (Str(data).contains(redisMatch)) {
        // extract redis details
        let extract = Str(data).split("@");
        //console.log(extract)
        let username_password = Str(extract[0])
          .replace("REDISCLOUD_URL:", "")
          .replace("redis://", "")
          .ltrim()
          .split(":");
        let host_port = Str(extract[1]).split(":");

        options = {
          ...options,
          deployRedisUser: Str(username_password[0])
            .trim()
            .get(),
          deployRedisPass: Str(username_password[1])
            .trim()
            .get(),
          deployRedisHost: Str(host_port[0])
            .trim()
            .get(),
          deployRedisPort: Str(host_port[1])
            .trim()
            .get()
        };
      }

      if (Str(data).startsWith("MAILGUN")) {
        let extract = Str(data).split(":");
        let key = Str(extract[0])
          .trim()
          .get();
        let value = Str(extract[1])
          .trim()
          .get();
        if (key == "MAILGUN_API_KEY") {
          options = {
            ...options,
            deployMailDriver: "mailgun",
            deployMailgunAPIKey: value
          };
        }
        if (key == "MAILGUN_DOMAIN") {
          options = { ...options, deployMailgunDomain: value };
        }
        if (key == "MAILGUN_PUBLIC_KEY") {
          options = { ...options, deployMailgunPublicKey: value };
        }
        if (key == "MAILGUN_SMTP_LOGIN") {
          options = { ...options, deployMailUser: value };
        }
        if (key == "MAILGUN_SMTP_PASSWORD") {
          options = { ...options, deployMailPass: value };
        }
        if (key == "MAILGUN_SMTP_PORT") {
          options = { ...options, deployMailPort: value };
        }
        if (key == "MAILGUN_SMTP_SERVER") {
          options = { ...options, deployMailHost: value };
        }
      }
    });

    return options;
  } catch (err) {
    console.log(
      "%s Configuration Extraction Error: " + err,
      chalk.red.bold("CLI: ")
    );
    process.exit(1);
  }
}

async function configureAddons(options, app) {
  const status = new Spinner("Configuration Heroku Addons...");
  status.start();

  status.stop();

  try {
    let configureCommand = `mysql --host=${options.deployDBHost} --user=${options.deployDBUser} --password=${options.deployDBPass} --reconnect ${options.deployDBCore} < ${options.templateDirectory}/mysql/core_shareddb.sql && mysql --host=${options.deployDBHost} --user=${options.deployDBUser} --password=${options.deployDBPass} --reconnect ${options.deployDBCore} < ${options.templateDirectory}/mysql/hub_shareddb.sql`;

    if (options.debugMode) {
      console.log(
        `%s Configuring databases...(please wait) \n`,
        chalk.green.bold("CLI: ")
      );
    }

    if (options.debugMode) {
      console.log(
        `%s Spawning ` + `${configureCommand} ...\n`,
        chalk.yellow.bold("DEBUG: ")
      );
    }

    let ls = await spawn(configureCommand, { shell: true });

    ls.stdout.on("data", async data => {
      console.log(`%s ${data}`, chalk.magenta.bold("Output: "));
    });

    ls.stderr.on("data", async data => {
      console.log(`%s ${data}`, chalk.magenta.bold("Input: "));
      if (
        Str(data).contains("ERROR") ||
        Str(data).contains("error") ||
        Str(data).contains("Error")
      ) {
        //throw data;
      }
      process.stdin.pipe(ls.stdin);
    });
    ls.on("close", async code => {
      //console.log(code)
      if (code === 0) {
        console.log(
          "%s Addons Configuration Completed \n",
          chalk.green.bold("Heroku: ")
        );
        let results = await utilities.setupCoreENV(options);

        //console.log(results)

        console.log("\n");
        console.log(
          `%s Preparing Dorcas ${app.toUpperCase()} Application for Heroku... \n`,
          chalk.green.bold("CLI: ")
        );
        await utilities.downloadFiles(results.options, app);
      }
    });
  } catch (err) {
    console.log(
      "%s Addons Configuration Error: " + err,
      chalk.red.bold("Heroku: ")
    );
    process.exit(1);
  }
}

async function deployDorcasApp(options, app, appFolder) {
  const status = new Spinner(
    `Deploying Dorcas ${app.toUpperCase()} Application...`
  );
  status.start();

  status.stop();

  let herokuAppName =
    app == "core" ? options.herokuAppNameCore : options.herokuAppNameHub;

  let deployPath = options.targetDirectory;

  //create random deploy signature file (a hack to force heroku git recognize this as a unique & valid push)
  let deploySignature = Str.random(8);

  await utilities.writeFile(
    options,
    `Dorcas Deploy Signature: ${deploySignature}`,
    `${deployPath}/${deploySignature}`,
    async function(result) {
      if (result) {
        console.log(
          `%s Deploy Signature file successfully written \n`,
          chalk.green.bold("CLI: ")
        );
      } else {
      }
    }
  );

  try {
    let deployCommands = `cp ${deployPath}/${deploySignature} ${appFolder}deploy_${deploySignature}`;

    if (app == "core") {
      let sourcePath =
        deployPath + `/.env.deploy.` + options.template.toLowerCase();

      options = {
        ...options,
        deployENVCore: sourcePath
      };

      //lets start with environmental (heroku config) variables
      deployCommands += ` && heroku config:set --app ${herokuAppName} ${options.herokuConfigsCore}`;

      //add final deploy commannds
      deployCommands += ` && cp ${
        options.deployENVCore
      } ${appFolder}/.env && cd ${appFolder} && git init && heroku git:remote -a ${herokuAppName} && echo "web: vendor/bin/heroku-php-apache2 public/" > Procfile && git add . && git commit -am "Heroku Dorcas ${app.toUpperCase()} Deploy" && git push heroku master`;
    } else if (app == "hub") {
      //lets start with environmental (heroku config) variables
      //deployCommands += `heroku stack:set container --app ${herokuAppName}`;
      //add final deploy commannds
      //deployCommands += ` && cp ${options.deployHerokuYAMLPathHub} ${appFolder}/heroku.yaml && cd ${appFolder} && git init && heroku git:remote -a ${herokuAppName} && git add . && git commit -am "Heroku Dorcas HUB Deploy" && git push heroku master`;
      let sourcePath =
        deployPath + `/.env.deploy.` + options.template.toLowerCase();

      options = {
        ...options,
        deployENVHub: sourcePath
      };

      //lets start with environmental (heroku config) variables
      deployCommands += ` && heroku config:set --app ${herokuAppName} ${options.herokuConfigsHub}`;

      //add final deploy commannds
      deployCommands += ` && cp ${
        options.deployENVHub
      } ${appFolder}/.env && cd ${appFolder} && git init && heroku git:remote -a ${herokuAppName} && echo "web: vendor/bin/heroku-php-apache2 public/" > Procfile && git add . && git commit -am "Heroku Dorcas ${app.toUpperCase()} Deploy" && git push heroku master`;
    }

    console.log(
      `%s Deploying Dorcas ${app.toUpperCase()} App... \n`,
      chalk.green.bold("CLI: ")
    );

    if (options.debugMode) {
      console.log(
        `%s Spawning ` + `${deployCommands} ... \n`,
        chalk.yellow.bold("DEBUG: ")
      );
    }

    let ls = await spawn(deployCommands, { shell: true });

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
        console.log(
          `%s Deployment of App (Dorcas ${app.toUpperCase()}) Completed`,
          chalk.green.bold("CLI: ")
        );
        console.log(
          "%s Launching App in browser...",
          chalk.green.bold("CLI: ")
        );

        let deployURL =
          app == "core" ? options.deployURLCore : options.deployURLHub;

        await open(deployURL);
        //await open('https://sindresorhus.com', {app: {name: 'google chrome', arguments: ['--incognito']}});
        if (app == "core") {
          //createApp(options, "hub", "default"); //start work on Hub
          checkApp(options, app);
        } else {
          await utilities.setupAdminAccount(options);
          process.exit(1);
        }
      }
    });
  } catch (err) {
    console.log("%s Create error: " + err, chalk.red.bold("Heroku: "));
    //await status.stop();
  }
}

exports.deployDorcasApp = deployDorcasApp;

async function checkApp(options, app) {
  const status = new Spinner(
    `Checking the ${app.toUpperCase()} App Installation...`
  );
  status.start();
  status.stop();

  if (app == "core") {
    try {
      await utilities.checkDatabaseConnectionCORE(options, async function(
        result
      ) {
        if (result) {
          await utilities.checkOAuthTablesCORE(options, async function(result) {
            if (result) {
              setTimeout(async () => {
                let res = await utilities.setupDorcasCoreOAuth(options);
                options.clientId = res.client_id;
                options.clientSecret = res.client_secret;
                if (typeof options.clientId !== "undefined") {
                  console.log(
                    "%s Dorcas CORE OAuth Set",
                    chalk.green.bold("Success")
                  );
                  createApp(options, "hub", "default"); //start work on Hub
                }
              }, 7500);
            } else {
              setTimeout(async () => {
                console.log("Creating CORE OAuth Entries...");
                await status.stop();
                await checkApp(options, app);
              }, 3000);
            }
          });
        } else {
          setTimeout(async () => {
            console.log("retrying connection...");
            await status.stop();
            await checkApp(options, app);
          }, 3000);
        }
      });
    } catch (e) {
      await status.stop();
    }
  }
}
