const fs = require("fs");
const Listr = require("listr");
const ncp = require("ncp");
const path = require("path");
const envfile = require("envfile");
const util = require("util");
const chalk = require("chalk");
const clear = require("clear");
const figlet = require("figlet");
const spawn = require("child_process").spawn;
const CLI = require("clui");
const Spinner = CLI.Spinner;
const access = util.promisify(fs.access);
const copy = util.promisify(ncp);
const axios = require("axios");
const mysql = require("mysql");
const dgp = require("download-git-repo");
const download = util.promisify(dgp);
const params = require(path.join(__dirname, "./params.js"));

clear();
console.log(
  chalk.yellow(
    figlet.textSync(params.general.title, { horizontalLayout: "full" })
  )
);

async function createProject(options) {
  const status = new Spinner("Initializing Installation...");
  await status.start();

  options = {
    ...options,
    targetDirectory:
      options.targetDirectory ||
      process.cwd() + `/` + params.general.install_output_folder
  };

  const fullPathName = __dirname + "/main.js";
  const templateDir = path.resolve(
    fullPathName.substr(fullPathName.indexOf("/")),
    "../../templates",
    options.template.toLowerCase()
  );
  options.templateDirectory = templateDir;

  try {
    await installTemplateFiles(options);

    // await access(templateDir, fs.constants.R_OK, (err) => {
    //   console.log('\n> Checking Template Access Permissions...');
    //   if (err)
    //     console.error('Access Not OK' + err);
    //   else
    //     console.log('Access OK');
    // });

    await setupInstallationENV(options);

    status.stop();
  } catch (err) {
    console.error(
      "%s Error Initializing Installation" + err,
      chalk.red.bold("ERROR")
    );
    await status.stop();
    process.exit(1);
  }

  await installContainerServices(options);

  return true;
}

async function installTemplateFiles(options) {
  await copy(
    options.templateDirectory,
    options.targetDirectory,
    { clobber: false },
    function(err) {
      if (err) {
        console.log(chalk.red.bold(`${err}`));
        process.exit(1);
      }
      console.log(
        "%s " +
          options.template.toUpperCase() +
          " Version Template Files Installed",
        chalk.green.bold("Success")
      );
    }
  );
}

async function setupInstallationENV(options) {
  //const status = new Spinner("Setting up Installation ENV...");
  //status.start();

  let sourcePath =
    options.targetDirectory + `/.env.` + options.template.toLowerCase();
  let data = {
    SERVICE_CORE_PHP_NAME: params.docker.services.core_php.name,
    SERVICE_CORE_PHP_PORT: params.docker.services.core_php.port,
    SERVICE_CORE_WEB_NAME: params.docker.services.core_web.name,
    SERVICE_CORE_WEB_PORT: params.docker.services.core_web.port,
    SERVICE_HUB_PHP_NAME: params.docker.services.hub_php.name,
    SERVICE_HUB_PHP_PORT: params.docker.services.hub_php.port,
    SERVICE_HUB_WEB_NAME: params.docker.services.hub_web.name,
    SERVICE_HUB_WEB_PORT: params.docker.services.hub_web.port,
    SERVICE_MYSQL_NAME: params.docker.services.mysql.name,
    SERVICE_MYSQL_PORT: params.docker.services.mysql.port,
    SERVICE_MYSQL_USER: params.docker.services.mysql.user,
    SERVICE_MYSQL_PASSWORD: params.docker.services.mysql.password,
    SERVICE_MYSQL_DB_CORE: params.docker.services.mysql.db_core,
    SERVICE_MYSQL_DB_HUB: params.docker.services.mysql.db_hub,
    SERVICE_REDIS_NAME: params.docker.services.redis.name,
    SERVICE_REDIS_PORT: params.docker.services.redis.port,
    SERVICE_SMTP_NAME: params.docker.services.smtp.name,
    SERVICE_SMTP_PORT: params.docker.services.smtp.port
  };

  await fs.writeFile(sourcePath, envfile.stringify(data), err => {
    if (err) {
      console.log(chalk.red.bold(`${err}`));
      //status.stop;
      process.exit(1);
      //throw err;
    } else {
      //status.stop;
      console.log(
        "%s Installation ENV successfully set Installed",
        chalk.green.bold("Success")
      );
    }
  });
}

async function installContainerServices(options) {
  const status = new Spinner(
    "Removing any existing Docker Container Services..."
  );
  status.start();

  try {
    const ls = await spawn("docker-compose", [
      `--env-file`,
      `${options.targetDirectory + `/.env.` + options.template.toLowerCase()}`,
      `-f`,
      `${options.targetDirectory + `/docker-compose.yml`}`,
      `down`,
      `-v`
    ]);
    ls.on("close", async code => {
      status.stop();

      if (code === 0) {
        console.log(
          "%s All Docker Container Services Removed",
          chalk.green.bold("Success")
        );

        await installContainersForCore(options, params);
      }
    });
  } catch (err) {
    console.log(
      "%s Error Removing Docker Container Services:" + err,
      chalk.red.bold("Error")
    );
    await status.stop();
  } finally {
  }
}

async function installContainersForCore(options, params) {
  const status = new Spinner("Installing Containers for Dorcas CORE");
  status.start();
  try {
    // add `-d`, flag back
    const ls = spawn("docker-compose", [
      `--env-file`,
      `${options.targetDirectory + `/.env`}`,
      `-f`,
      `${options.targetDirectory + `/docker-compose.yml`}`,
      `up`,
      `-d`,
      `${params.docker.services.core_php.name}`,
      `${params.docker.services.core_web.name}`,
      `${params.docker.services.mysql.name}`,
      `${params.docker.services.redis.name}`,
      `${params.docker.services.smtp.name}`
    ]);

    ls.on("close", async code => {
      await status.stop();
      if (code === 0) {
        console.log(
          "%s Dorcas CORE Installation Complete",
          chalk.green.bold("Success")
        );
        await prepareContainersForHub(options);
      } else {
        console.log(
          "%s Dorcas CORE Installation Error: " + code,
          chalk.red.bold("Error")
        );
        process.exit(1);
      }
    });
  } catch (err) {
    console.log(
      "%s Dorcas CORE Installation Error:" + err,
      chalk.red.bold("Error")
    );
    status.stop();
  } finally {
  }
}

async function prepareContainersForHub(options) {
  const status = new Spinner("Preparing Dorcas HUB Installation...");

  const tasks = new Listr(
    [
      {
        title: "Setting Up Dorcas HUB",
        task: () => installContainersForHub(options)
      }
    ],
    { exitOnError: false }
  );

  status.start();

  try {
    await checkDatabaseConnectionCORE(async function(result) {
      if (result) {
        await checkOAuthTablesCORE(async function(result) {
          if (result) {
            setTimeout(async () => {
              let res = await setupDorcasCoreOAuth(options);
              options.clientId = res.client_id;
              options.clientSecret = res.client_secret;
              if (typeof options.clientId !== "undefined") {
                console.log(
                  "%s Dorcas CORE OAuth Set",
                  chalk.green.bold("Success")
                );
                await setupDorcasHubENV(options);
                await status.stop();
                console.log(
                  "%s Dorcas HUB ENV Set",
                  chalk.green.bold("Success")
                );
                await tasks.run();
              }
            }, 7500);
          } else {
            setTimeout(async () => {
              console.log("Creating CORE OAuth Entries...");
              await status.stop();
              await prepareContainersForHub(options);
            }, 7500);
          }
        });
      } else {
        setTimeout(async () => {
          console.log("Retrying connection...");
          await status.stop();
          await prepareContainersForHub(options);
        }, 3000);
      }
    });
  } catch (e) {
    await status.stop();
  } finally {
  }
}

async function installContainersForHub(options) {
  const status = new Spinner("Installing Containers for Dorcas HUB");
  status.start();

  try {
    const ls = await spawn("docker-compose", [
      `--env-file`,
      `${options.targetDirectory + `/.env`}`,
      `-f`,
      `${options.targetDirectory + `/docker-compose.yml`}`,
      `up`,
      `-d`,
      `${params.docker.services.hub_php.name}`,
      `${params.docker.services.hub_web.name}`
    ]);
    ls.on("close", async code => {
      await status.stop();
      if (code === 0) {
        console.log(
          "%s Dorcas HUB Installation Complete",
          chalk.green.bold("Success")
        );
        await setupAdminAccount(options);
      }
    });
  } catch (err) {
    console.log("%s Dorcas HUB Installation Error!", chalk.red.bold("Error"));
    await status.stop();
  } finally {
  }
}

async function setupAdminAccount(options) {
  const status = new Spinner("Creating Admin Login Account...");
  status.start();
  try {
    setTimeout(async () => {
      let data = {
        firstname: options.answers.firstname,
        lastname: options.answers.lastname,
        email: options.answers.email,
        installer: true,
        password: options.answers.password,
        company: options.answers.company,
        phone: options.answers.phone,
        feature_select: options.answers.feature_select,
        client_id: options.clientId,
        client_secret: options.clientSecret
      };
      let res = await createUser(data);
      if (typeof res !== "undefined") {
        await status.stop();
        console.log(
          "%s Account Creation Successful!",
          chalk.green.bold("Success")
        );
        console.log("\n");
        console.log(
          "Dear " +
            res.firstname +
            "(" +
            res.email +
            "), " +
            "thank you for installing the Dorcas Hub." +
            " Visit this URL address " +
            chalk.green.bold(
              params.general.http_scheme +
                "://" +
                params.general.host +
                ":" +
                params.docker.services.hub_web.port +
                "/" +
                params.general.path_hub_admin_login
            ) +
            " and login with your earlier provided Admin " +
            chalk.green.italic("email") +
            " and " +
            chalk.green.italic("password") +
            "."
        );
      }
    }, 2000);
  } catch (err) {
    await status.stop();
  }
}

async function createUser(body) {
  let res = await axios
    .post(
      params.general.http_scheme +
        "://" +
        params.general.host +
        ":" +
        params.docker.services.core_web.port +
        "/" +
        params.general.path_core_user_register,
      body
    )
    .catch(err => {
      console.log(chalk.red.bold(`${err}`));
      process.exit();
    });
  return res.data.data;
}

//this appends env credentials for clientid and secret to env_hub
async function setupDorcasHubENV(options) {
  let sourcePath =
    options.targetDirectory + `/app/env_hub_` + options.template.toLowerCase();
  let data = {
    DORCAS_CLIENT_ID: options.clientId,
    DORCAS_CLIENT_SECRET: options.clientSecret,
    DORCAS_PERSONAL_CLIENT_ID: options.clientId,
    DORCAS_PERSONAL_CLIENT_SECRET: options.clientSecret
  };

  fs.appendFileSync(sourcePath, envfile.stringify(data));
}

async function checkDatabaseConnectionCORE(callback) {
  const connection = mysql.createConnection({
    host: params.docker.services.mysql.host,
    user: params.docker.services.mysql.user,
    password: params.docker.services.mysql.password,
    port: params.docker.services.mysql.port,
    database: params.docker.services.mysql.db_core
  });
  const status = new Spinner("Connecting to CORE Database...");
  status.start();
  connection.connect(async function(err) {
    if (err) {
      callback(false);
      console.log(
        "%s Database Connection to CORE Failed",
        chalk.red.bold("error")
      );
      connection.end();
      await status.stop();
    } else {
      await status.stop();
      console.log(
        "%s Database Connection to CORE Established",
        chalk.green.bold("success")
      );
      connection.end();
      callback(true);
    }
  });
}

async function checkOAuthTablesCORE(callback) {
  const connection = mysql.createConnection({
    host: params.docker.services.mysql.host,
    user: params.docker.services.mysql.user,
    password: params.docker.services.mysql.password,
    port: params.docker.services.mysql.port,
    database: params.docker.services.mysql.db_core
  });
  const status = new Spinner("Connecting to CORE Database...");
  status.start();
  connection.query("SELECT * FROM oauth_clients", async function(
    err,
    result,
    fields
  ) {
    if (err) {
      console.log("%s Still Initializing Tables", chalk.red.bold("error"));
      await status.stop();
      connection.end();
      callback(false);
    } else {
      console.log("%s Connection Instantiated", chalk.green.bold("success"));
      await status.stop();
      connection.end();
      callback(true);
    }
  });
}

async function setupDorcasCoreOAuth(options) {
  let res = await axios
    .post(
      params.general.http_scheme +
        "://" +
        params.general.host +
        ":" +
        params.docker.services.core_web.port +
        "/" +
        params.general.path_core_oauth_setup
    )
    .catch(err => {
      console.log(chalk.red.bold(`${err}`));
    });
  return res.data;
}

async function downloadPublicFiles(options) {
  let destinationPath = options.targetDirectory + `/src/core-public/`;

  await download(
    "direct:https://github.com/dorcas-io/core-business/archive/ft-develop.zip",
    destinationPath,
    function(err) {
      console.log(err ? "Error" : "Success");
    }
  ); //not working  o
}

exports.createProject = createProject;
