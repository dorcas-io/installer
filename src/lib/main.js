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
const Str = require("@supercharge/strings");
const params = require(path.join(__dirname, "./params.js"));

clear();
console.log(
  chalk.yellow(
    figlet.textSync(params.general.title, { horizontalLayout: "full" })
  )
);

console.log(
  "Welcome to the Business Edition Installer v" +
    require(path.join(__dirname, "../../package.json")).version
);
console.log(
  "You can stop this installation process at any time by hitting CTRL + C"
);

async function createProject(options) {
  const status = new Spinner("Initializing Installation...");
  await status.start();

  options = {
    ...options,
    targetDirectory:
      options.targetDirectory ||
      process.cwd() +
        `/` +
        params.general.install_output_folder +
        `-` +
        options.template.toLowerCase()
  };

  const fullPathName = __dirname + "/main.js";
  const templateDir = path.resolve(
    fullPathName.substr(fullPathName.indexOf("/")),
    "../../templates",
    options.template.toLowerCase()
  );
  options.templateDirectory = templateDir;

  options.port_increment =
    options.template.toLowerCase() == "production" ? 0 : 1000; //separate production & development ports

  options.container_name_addon =
    options.template.toLowerCase() == "production" ? "" : "_development"; //separate production & development ports

  try {
    if (options.answers.agreement === "no") {
      console.log(
        "%s You did not agree to the Terms/Conditions of Use and Privacy Policy available at https://dorcas.io/agreement",
        chalk.red.bold("Installation Failed:")
      );
      process.exit(1);
    }

    await installTemplateFiles(options);

    console.log(
      "%s " +
        options.template.toUpperCase() +
        " Version Template Files Installed",
      chalk.green.bold("Success")
    );

    await access(templateDir, fs.constants.R_OK);

    await setupInstallationENV(options);

    await downloadFiles(options, "core"); //start the trio of activities - core, hub and then installing containers

    status.stop();
  } catch (err) {
    console.error(
      "%s Error Initializing Installation" + err,
      chalk.red.bold("ERROR")
    );
    await status.stop();
    process.exit(1);
  }

  return true;
}

async function installTemplateFiles(options) {
  await copy(options.templateDirectory, `${options.targetDirectory}`, {
    clobber: false
  });
}

async function setupInstallationENV(options) {
  //const status = new Spinner("Setting up Installation ENV...");
  //status.start();

  let sourcePath =
    options.targetDirectory + `/.env.` + options.template.toLowerCase();

  let data = {
    HOST_DOMAIN: options.answers.domain,
    SERVICE_PROXY_NAME:
      params.docker.services.proxy.name + options.container_name_addon,
    SERVICE_PROXY_PORT:
      params.docker.services.proxy.port + options.port_increment,
    SERVICE_PROXY_IMAGE: params.docker.services.proxy.image,
    SERVICE_RELOADER_NAME:
      params.docker.services.reloader.name + options.container_name_addon,
    SERVICE_RELOADER_PORT:
      params.docker.services.reloader.port + options.port_increment,
    SERVICE_RELOADER_IMAGE: params.docker.services.reloader.image,
    SERVICE_CORE_PHP_NAME:
      params.docker.services.core_php.name + options.container_name_addon,
    SERVICE_CORE_PHP_PORT:
      params.docker.services.core_php.port + options.port_increment,
    SERVICE_CORE_PHP_IMAGE: params.docker.services.core_php.image,
    SERVICE_CORE_PHP_WORKING_DIR: params.docker.services.core_php.working_dir,
    SERVICE_CORE_PHP_ENV_FILE:
      params.docker.services.core_php.env_file + options.template.toLowerCase(),
    SERVICE_CORE_PHP_VOLUMES_ENV:
      params.docker.services.core_php.env_file +
      options.template.toLowerCase() +
      ":" +
      params.docker.services.core_php.volumes_env,
    SERVICE_CORE_PHP_VOLUMES_PHP_INI:
      params.docker.services.core_php.volumes_php_ini,
    SERVICE_CORE_PHP_SRC_DIR: params.docker.services.core_php.src_dir,
    SERVICE_CORE_PHP_APP_DIR: params.docker.services.core_php.app_dir,
    SERVICE_CORE_WEB_SUBDOMAIN: params.docker.services.core_web.subdomain,
    SERVICE_CORE_WEB_NAME:
      params.docker.services.core_web.name + options.container_name_addon,
    SERVICE_CORE_WEB_PORT:
      params.docker.services.core_web.port + options.port_increment,
    SERVICE_HUB_PHP_NAME:
      params.docker.services.hub_php.name + options.container_name_addon,
    SERVICE_HUB_PHP_PORT:
      params.docker.services.hub_php.port + options.port_increment,
    SERVICE_HUB_PHP_IMAGE: params.docker.services.hub_php.image,
    SERVICE_HUB_PHP_WORKING_DIR: params.docker.services.hub_php.working_dir,
    SERVICE_HUB_PHP_ENV_FILE:
      params.docker.services.hub_php.env_file + options.template.toLowerCase(),
    SERVICE_HUB_PHP_VOLUMES_ENV:
      params.docker.services.hub_php.env_file +
      options.template.toLowerCase() +
      ":" +
      params.docker.services.hub_php.volumes_env,
    SERVICE_HUB_PHP_VOLUMES_PHP_INI:
      params.docker.services.hub_php.volumes_php_ini,
    SERVICE_HUB_PHP_SRC_DIR: params.docker.services.hub_php.src_dir,
    SERVICE_HUB_PHP_APP_DIR: params.docker.services.hub_php.app_dir,
    SERVICE_HUB_WEB_SUBDOMAIN: params.docker.services.hub_web.subdomain,
    SERVICE_HUB_WEB_NAME:
      params.docker.services.hub_web.name + options.container_name_addon,
    SERVICE_HUB_WEB_PORT:
      params.docker.services.hub_web.port + options.port_increment,
    SERVICE_MYSQL_SUBDOMAIN: params.docker.services.mysql.subdomain,
    SERVICE_MYSQL_NAME:
      params.docker.services.mysql.name + options.container_name_addon,
    SERVICE_MYSQL_PORT:
      params.docker.services.mysql.port + options.port_increment,
    SERVICE_MYSQL_USER: params.docker.services.mysql.user,
    SERVICE_MYSQL_PASSWORD: options.databasePassword,
    SERVICE_MYSQL_DB_CORE: params.docker.services.mysql.db_core,
    SERVICE_MYSQL_DB_HUB: params.docker.services.mysql.db_hub,
    SERVICE_REDIS_SUBDOMAIN: params.docker.services.redis.subdomain,
    SERVICE_REDIS_NAME:
      params.docker.services.redis.name + options.container_name_addon,
    SERVICE_REDIS_PORT:
      params.docker.services.redis.port + options.port_increment,
    SERVICE_REDIS_IMAGE: params.docker.services.redis.image,
    SERVICE_SMTP_SUBDOMAIN: params.docker.services.smtp.subdomain,
    SERVICE_SMTP_NAME:
      params.docker.services.smtp.name + options.container_name_addon,
    SERVICE_SMTP_PORT:
      params.docker.services.smtp.port + options.port_increment,
    SERVICE_SMTP_PORT_2:
      params.docker.services.smtp.port_2 + options.port_increment,
    SERVICE_SMTP_IMAGE: params.docker.services.smtp.image
  };

  await fs.writeFile(sourcePath, envfile.stringify(data), err => {
    if (err) {
      console.log(chalk.red.bold(`${err}`));
      //status.stop;
      process.exit(1);
      //throw err;
    } else {
      //status.stop;
      console.log("%s Installation ENV Installed", chalk.green.bold("Success"));
    }
  });
}

async function installContainerServices(options) {
  let status = new Spinner(
    "Removing any existing Docker Container Services..."
  );
  status.start();

  try {
    let ls = await spawn("docker-compose", [
      `--env-file`,
      `${options.targetDirectory + `/.env.` + options.template.toLowerCase()}`,
      `-f`,
      `${options.targetDirectory + `/docker-compose.yml`}`,
      `down`,
      `-v`,
      `--remove-orphans`
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

  await setupCoreENV(options);

  try {
    let dockerComposeArgs = [];

    if (options.template.toLowerCase() == "production") {
      dockerComposeArgs = [
        `--env-file`,
        `${options.targetDirectory +
          `/.env.` +
          options.template.toLowerCase()}`,
        `-f`,
        `${options.targetDirectory + `/docker-compose.yml`}`,
        `up`,
        `-d`,
        `--build`,
        `${params.docker.services.proxy.name + options.container_name_addon}`,
        `${params.docker.services.core_php.name +
          options.container_name_addon}`,
        `${params.docker.services.core_web.name +
          options.container_name_addon}`,
        `${params.docker.services.mysql.name + options.container_name_addon}`,
        `${params.docker.services.redis.name + options.container_name_addon}`,
        `${params.docker.services.smtp.name + options.container_name_addon}`
      ];
    } else if (options.template.toLowerCase() == "development") {
      //`--build` - necessary  for dev hot reloading?
      dockerComposeArgs = [
        `--env-file`,
        `${options.targetDirectory +
          `/.env.` +
          options.template.toLowerCase()}`,
        `-f`,
        `${options.targetDirectory + `/docker-compose.yml`}`,
        `-f`,
        `${options.targetDirectory + `/docker-compose-reloader-core.yml`}`,
        `up`,
        `-d`,
        `--build`,
        `${params.docker.services.proxy.name + options.container_name_addon}`,
        `${params.docker.services.core_php.name +
          options.container_name_addon}`,
        `${params.docker.services.core_web.name +
          options.container_name_addon}`,
        `${params.docker.services.mysql.name + options.container_name_addon}`,
        `${params.docker.services.redis.name + options.container_name_addon}`,
        `${params.docker.services.smtp.name + options.container_name_addon}`,
        `${params.docker.services.reloader.name +
          options.container_name_addon +
          `_core`}`
      ];
    }

    if (options.debugMode == "yes") {
      console.log("DEBUG: Spawning docker-compose: ");
      console.log(dockerComposeArgs);
    }

    const ls = spawn("docker-compose", dockerComposeArgs);

    ls.on("close", async code => {
      await status.stop();
      if (code === 0) {
        console.log(
          "%s Dorcas CORE Installation Complete",
          chalk.green.bold("Success")
        );
        await initializeContainersForHub(options);
      } else {
        console.log(
          "%s Dorcas CORE Installation Code: " + code,
          chalk.red.bold("Error")
        );
        process.exit(1);
      }
    });
  } catch (err) {
    console.log(
      "%s Dorcas CORE Installation Error: " + err,
      chalk.red.bold("Error")
    );
    status.stop();
  } finally {
  }
}

async function initializeContainersForHub(options) {
  const status = new Spinner("Initializing Dorcas HUB Installation...");
  status.start();

  const tasks = new Listr(
    [
      {
        title: "Dorcas HUB Installation",
        task: () => installContainersForHub(options)
      }
    ],
    { exitOnError: false }
  );

  try {
    await checkDatabaseConnectionCORE(options, async function(result) {
      if (result) {
        await checkOAuthTablesCORE(options, async function(result) {
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
                await setupHubENV(options);
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
              await initializeContainersForHub(options);
            }, 7500);
          }
        });
      } else {
        setTimeout(async () => {
          console.log("retrying connection...");
          await status.stop();
          await initializeContainersForHub(options);
        }, 7500);
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
    let dockerComposeArgs = [];

    if (options.template.toLowerCase() == "production") {
      dockerComposeArgs = [
        `--env-file`,
        `${options.targetDirectory +
          `/.env.` +
          options.template.toLowerCase()}`,
        `-f`,
        `${options.targetDirectory + `/docker-compose.yml`}`,
        `up`,
        `-d`,
        `--build`,
        `${params.docker.services.hub_php.name + options.container_name_addon}`,
        `${params.docker.services.hub_web.name + options.container_name_addon}`
      ];
    } else if (options.template.toLowerCase() == "development") {
      dockerComposeArgs = [
        `--env-file`,
        `${options.targetDirectory +
          `/.env.` +
          options.template.toLowerCase()}`,
        `-f`,
        `${options.targetDirectory + `/docker-compose.yml`}`,
        `-f`,
        `${options.targetDirectory + `/docker-compose-reloader-hub.yml`}`,
        `up`,
        `-d`,
        `--build`,
        `${params.docker.services.hub_php.name + options.container_name_addon}`,
        `${params.docker.services.hub_web.name + options.container_name_addon}`,
        `${params.docker.services.reloader.name +
          options.container_name_addon +
          `_hub`}`
      ];
    }

    console.log(dockerComposeArgs);

    const ls = spawn("docker-compose", dockerComposeArgs);
    ls.on("close", async code => {
      await status.stop();
      if (code === 0) {
        console.log(
          "%s Dorcas HUB Installation Complete",
          chalk.green.bold("Success")
        );
        await installDNSResolver(options);
      } else {
        console.log(
          "%s Dorcas Hub Installation Code: " + code,
          chalk.red.bold("Error")
        );
        process.exit(1);
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
        installer: "true",
        domain: options.answers.domain,
        password: options.answers.password,
        company: options.answers.company,
        phone: options.answers.phone,
        feature_select: options.answers.feature_select,
        client_id: options.clientId,
        client_secret: options.clientSecret
      };
      let res = await createUser(data, options);
      if (typeof res !== "undefined") {
        await status.stop();
        console.log(
          "%s Account Creation Successful!",
          chalk.green.bold("Success")
        );
        console.log("\n");

        let open_domain_localhost =
          params.general.http_scheme +
          "://" +
          params.general.host +
          ":" +
          (params.docker.services.hub_web.port + options.port_increment);
        let open_domain_dns =
          (options.answers.dns_resolver === "valet"
            ? "https"
            : params.general.http_scheme) +
          "://" +
          options.answers.domain;
        let open_domain =
          options.answers.dns === "dns"
            ? open_domain_dns
            : open_domain_localhost;
        let open_url = open_domain + "/" + params.general.path_hub_admin_login;

        console.log(
          "Dear " +
            res.firstname +
            " (" +
            res.email +
            "), " +
            "thank you for installing the Dorcas Hub." +
            " Visit this URL address " +
            chalk.green.bold(open_url) +
            " and login with your earlier provided Admin " +
            chalk.green.bold("email") +
            " and " +
            chalk.green.bold("password") +
            "."
        );
        console.log("\n");
      }
    }, 7500);
  } catch (err) {
    await status.stop();
    console.log(chalk.red.bold(`Admin Account Creation Error: ${err}`));
  }
}

async function createUser(body, options) {
  let create_url =
    params.general.http_scheme +
    "://" +
    params.general.host +
    ":" +
    (params.docker.services.core_web.port + options.port_increment) +
    "/" +
    params.general.path_core_user_register;

  if (options.debugMode) {
    console.log("DEBUG: Admin User Creation String: ");
    console.log(create_url);
    console.log(body);
  }

  let res = await axios.post(create_url, body).catch(err => {
    console.log(chalk.red.bold(`User Creation Error: ${err}`));
    process.exit();
  });
  return res.data.data;
}

//this appends env credentials for clientid and secret to env_hub
async function setupHubENV(options) {
  let sourcePath =
    options.targetDirectory + `/app/env_hub_` + options.template.toLowerCase();

  //let host_url = params.general.http_scheme + "://" + params.general.host;
  //determine proper url format for both localhost and dns
  let host_scheme =
    options.answers.dns === "dns" ? "https" : params.general.http_scheme;
  let host_domain_core =
    options.answers.dns === "dns"
      ? params.docker.services.core_web.subdomain + "." + options.answers.domain
      : params.general.host;
  let host_domain_hub =
    options.answers.dns === "dns"
      ? options.answers.domain
      : params.general.host;
  let host_domain =
    options.answers.dns === "dns"
      ? options.answers.domain
      : params.general.host;
  let host_port_core =
    options.answers.dns === "dns"
      ? ""
      : ":" + (params.docker.services.core_web.port + options.port_increment);
  let host_port_hub =
    options.answers.dns === "dns"
      ? ""
      : ":" + (params.docker.services.hub_web.port + options.port_increment);
  //"base64:I3NFdR+AFWLg8OlU535RGibdUiJlFhQzoHTyhVylNec="
  let data = {
    APP_NAME: "Hub",
    APP_ENV:
      options.template.toLowerCase() == "production"
        ? "production"
        : "development",
    APP_KEY: Str.random(32),
    APP_DEBUG: options.template.toLowerCase() == "production" ? "true" : "true",
    APP_LOG_LEVEL: "debug",
    DORCAS_EDITION: "business",
    SDK_HOST_PRODUCTION:
      "http://" +
      params.docker.services.core_web.name +
      options.container_name_addon +
      ":80",
    APP_URL: `${host_scheme}://${host_domain_hub}${host_port_hub}`,
    APP_URL_STATIC: `${host_scheme}://${host_domain_hub}${host_port_hub}`,
    DEPLOY_ENV: "docker",
    STANDARD_HOST:
      options.answers.dns === "dns"
        ? options.answers.domain
        : `localhost:${params.docker.services.hub_web.port}`,
    DORCAS_BASE_URL: `http://${params.docker.services.core_web.name +
      options.container_name_addon}:80`,
    DORCAS_BASE_DOMAIN: options.answers.domain,
    DORCAS_ENV:
      options.template.toLowerCase() == "production"
        ? "production"
        : "development",
    DB_CONNECTION: "mysql",
    DB_HOST: params.docker.services.mysql.name + options.container_name_addon,
    DB_PORT: "3306",
    DB_DATABASE: params.docker.services.mysql.db_hub,
    DB_USERNAME: params.docker.services.mysql.user,
    DB_PASSWORD: options.databasePassword,
    BROADCAST_DRIVER: "pusher",
    CACHE_DRIVER: "redis",
    QUEUE_DRIVER: "redis",
    FILESYSTEM_DRIVER: "file",
    SESSION_DRIVER: "redis",
    SESSION_LIFETIME: "120",
    SESSION_CONNECTION: "default",
    REDIS_HOST:
      params.docker.services.redis.name + options.container_name_addon,
    REDIS_PASSWORD: "null",
    REDIS_PORT: "6379",
    REDIS_CLIENT: "predis",
    MAIL_DRIVER: "smtp",
    MAIL_HOST: params.docker.services.smtp.name + options.container_name_addon,
    MAIL_PORT: "1025",
    DORCAS_CLIENT_ID: options.clientId,
    DORCAS_CLIENT_SECRET: options.clientSecret,
    DORCAS_PERSONAL_CLIENT_ID: options.clientId,
    DORCAS_PERSONAL_CLIENT_SECRET: options.clientSecret
  };

  fs.writeFile(sourcePath, envfile.stringify(data), err => {
    if (err) {
      console.log(chalk.red.bold(`${err}`));
      //status.stop;
      process.exit(1);
      //throw err;
    } else {
      //status.stop;
      console.log(
        "%s Hub ENV successfully Installed",
        chalk.green.bold("Success")
      );
    }
  });
}

async function checkDatabaseConnectionCORE(options, callback) {
  let connection_string = {
    host: params.docker.services.mysql.host,
    user: params.docker.services.mysql.user,
    password: options.databasePassword,
    port: params.docker.services.mysql.port + options.port_increment,
    database: params.docker.services.mysql.db_core
  };

  const connection = mysql.createConnection(connection_string);

  if (options.debugMode) {
    console.log("DEBUG: Core DB Connection String: ");
    console.log(connection_string);
  }

  const status = new Spinner("Connecting to Database...");
  status.start();
  connection.connect(async function(err) {
    if (err) {
      callback(false);
      console.log("%s Database Connection Failed", chalk.red.bold("error"));
      connection.end();
      await status.stop();
    } else {
      await status.stop();
      console.log(
        "%s Database Connection Established",
        chalk.green.bold("success")
      );
      connection.end();
      callback(true);
    }
  });
}

async function checkOAuthTablesCORE(options, callback) {
  let connection_string = {
    host: params.docker.services.mysql.host,
    user: params.docker.services.mysql.user,
    password: options.databasePassword,
    port: params.docker.services.mysql.port + options.port_increment,
    database: params.docker.services.mysql.db_core
  };
  const connection = mysql.createConnection(connection_string);

  if (options.debugMode == "yes") {
    console.log("DEBUG: OAuth DB Connection String: ");
    console.log(connection_string);
  }

  const status = new Spinner("Connecting to Database...");
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
      console.log(
        "%s OAuth Connection Instantiated",
        chalk.green.bold("success")
      );
      await status.stop();
      connection.end();
      callback(true);
    }
  });
}

async function setupDorcasCoreOAuth(options) {
  let setup_url =
    params.general.http_scheme +
    "://" +
    params.general.host +
    ":" +
    (params.docker.services.core_web.port + options.port_increment) +
    "/" +
    params.general.path_core_oauth_setup;

  if (options.debugMode) {
    console.log("DEBUG: OAuth Setup URL: ");
    console.log(setup_url);
  }

  let res = await axios.post(setup_url).catch(err => {
    console.log("Error setting up CORE OAuth: " + chalk.red.bold(`${err}`));
    process.exit(1);
  });
  return res.data;
}

async function setupCoreENV(options) {
  let sourcePath =
    options.targetDirectory + `/app/env_core_` + options.template.toLowerCase();

  //let host_url = params.general.http_scheme + "://" + params.general.host;
  //determine proper url format for both localhost and dns
  let host_scheme =
    options.answers.dns === "dns" ? "https" : params.general.http_scheme;
  let host_domain_core =
    options.answers.dns === "dns"
      ? params.docker.services.core_web.subdomain + "." + options.answers.domain
      : params.general.host;
  let host_domain_hub =
    options.answers.dns === "dns"
      ? options.answers.domain
      : params.general.host;
  let host_domain =
    options.answers.dns === "dns"
      ? options.answers.domain
      : params.general.host;
  let host_port_core =
    options.answers.dns === "dns"
      ? ""
      : ":" + (params.docker.services.core_web.port + options.port_increment);
  let host_port_hub =
    options.answers.dns === "dns"
      ? ""
      : ":" + (params.docker.services.hub_web.port + options.port_increment);

  let data = {
    APP_NAME: "Dorcas",
    APP_ENV:
      options.template.toLowerCase() == "production"
        ? "production"
        : "development",
    APP_KEY: Str.random(32),
    APP_DEBUG:
      options.template.toLowerCase() == "production" ? "false" : "true",
    APP_LOG_LEVEL: "debug",
    DORCAS_EDITION: "business",
    DORCAS_HOST_API: `${host_scheme}://${host_domain_core}${host_port_core}`,
    DORCAS_HOST_HUB: `${host_scheme}://${host_domain_hub}${host_port_hub}`,
    DORCAS_BASE_DOMAIN: options.answers.domain,
    APP_URL: `${host_scheme}://${host_domain_core}${host_port_core}`,
    APP_SITE_URL: `${host_scheme}://${host_domain_hub}${host_port_hub}`,
    APP_URL_STATIC: `${host_scheme}://${host_domain_core}${host_port_core}`,
    DEPLOY_ENV: "docker",
    DB_CONNECTION: "mysql",
    DB_HOST: params.docker.services.mysql.name + options.container_name_addon,
    DB_PORT: "3306",
    DB_DATABASE: params.docker.services.mysql.db_core,
    DB_USERNAME: params.docker.services.mysql.user,
    DB_PASSWORD: options.databasePassword,
    DB_HUB_HOST:
      params.docker.services.mysql.name + options.container_name_addon,
    DB_HUB_PORT: "3306",
    DB_HUB_DATABASE: params.docker.services.mysql.db_hub,
    DB_HUB_USERNAME: params.docker.services.mysql.user,
    DB_HUB_PASSWORD: options.databasePassword,
    CACHE_DRIVER: "redis",
    QUEUE_DRIVER: "redis",
    FILESYSTEM_DRIVER: "file",
    REDIS_HOST:
      params.docker.services.redis.name + options.container_name_addon,
    REDIS_PASSWORD: "null",
    REDIS_PORT: "6379",
    REDIS_CLIENT: "predis",
    MAIL_DRIVER: "smtp",
    MAIL_HOST: params.docker.services.smtp.name + options.container_name_addon,
    MAIL_PORT: "1025"
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
        "%s Core ENV successfully Installed",
        chalk.green.bold("Success")
      );
    }
  });
}

async function downloadFiles(options, app) {
  let status = new Spinner(
    "Downloading " + app.toUpperCase() + " application files (from source)..."
  );
  status.start();

  let template = options.template.toLowerCase();

  let destinationDir =
    `${options.targetDirectory}` + `/src/tmp/` + `${app}` + `/`;
  let destinationFile = `${app}` + `.tar.gz`;
  let destinationPath = `${destinationDir}` + `${destinationFile}`;
  let destinationExtractPath = destinationDir;

  let repoDownloadLink = "";

  let repoArray = params.versions[template];

  repoDownloadLink = `https://github.com/${repoArray[`git_repo_${app}`] +
    "/tarball/" +
    repoArray[`git_branch_${app}`]}`;

  if (repoDownloadLink.length == 0) {
    console.log("%s Invalid repository URL", chalk.red.bold("Error"));
  }

  try {
    let ls = await spawn("curl", [
      `-LJ`,
      repoDownloadLink,
      `-o`,
      `${destinationPath}`
    ]);

    ls.on("close", async code => {
      if (code === 0) {
        console.log("%s Download Complete", chalk.green.bold("Success"));
        status.stop();
        let result = await extractFiles(
          options,
          template,
          app,
          destinationDir,
          destinationFile,
          destinationExtractPath
        );
      }
    });
  } catch (err) {
    console.log("%s Download Error!", chalk.red.bold("Error"));
    return "download_failed";
  } finally {
  }
}

async function extractFiles(
  options,
  template,
  app,
  extractDir,
  extractFile,
  extractDestinationPath
) {
  let status = new Spinner("Extracting " + app.toUpperCase() + " Files...");
  status.start();
  let { spawn, exec } = require("child_process");
  try {
    let ls2 = await spawn("tar", [
      `-zxf`,
      `${extractDir}` + `${extractFile}`,
      `-C`,
      extractDestinationPath
    ]);

    ls2.on("close", async code => {
      if (code === 0) {
        console.log("%s Extract Complete", chalk.green.bold("Success"));
        status.stop();
        //In development, destination copypath is src folder; In Production, destination copypath is a nginx public folder ;
        let copyPath =
          options.template.toLowerCase() == "development"
            ? `${options.targetDirectory}` + `/src/` + `${app}` + `/`
            : `${options.targetDirectory}` + `/nginx/` + `${app}` + `/public/`;
        let result = await copyFiles(
          options,
          app,
          extractDestinationPath,
          copyPath
        );
      }
    });
  } catch (err) {
    console.log("%s Extract Error!" + err, chalk.red.bold("Error"));
    return "extract_failed";
  } finally {
  }
}

async function copyFiles(options, app, sourceFolder, destinationFolder) {
  let status = new Spinner("Copying " + app.toUpperCase() + " Files...");
  status.start();
  let { spawn, exec } = require("child_process");
  let sourceFile = "";
  //cp -a src/tmp/core/dorcas-io-*/. src/templates/production/src/core/
  try {
    let fs = require("fs"),
      path = require("path");

    let sourceDir = sourceFolder;
    const files = fs.readdirSync(sourceDir);
    for (const file_or_folder of files) {
      let stat = fs.lstatSync(path.join(sourceDir, file_or_folder));
      if (stat.isDirectory()) {
        //since only one zip file and one extracted folder
        sourceFile = file_or_folder; //we choose the folder
        break;
      }
    }

    //In development, copy all source files folder; In production, copy ONLY public source files;
    sourceFile =
      options.template.toLowerCase() == "development"
        ? sourceFile
        : sourceFile + "/public";

    // console.log(
    //   `Copying ` +
    //     `${sourceFolder}` +
    //     `${sourceFile}` +
    //     ` to ` +
    //     `${destinationFolder}`
    // );

    let ls3 = await spawn("cp", [
      `-a`,
      `${sourceFolder}` + `${sourceFile}/.`,
      `${destinationFolder}`
    ]);

    ls3.on("close", async code => {
      if (code === 0) {
        console.log("%s Copy Complete", chalk.green.bold("Success"));
        status.stop();
        let cleanupFolder = `${sourceFolder}`;
        let result = await cleanupFiles(options, app, cleanupFolder);
      }
    });
  } catch (err) {
    //console.log(err)
    console.log("%s Copy Error!" + err, chalk.red.bold("Error"));
    return "copy_failed";
  } finally {
  }
}

async function cleanupFiles(options, app, destinationFolder) {
  let status = new Spinner(
    "Cleaning up " + app.toUpperCase() + " downloads..."
  );
  status.start();
  let { spawn, exec } = require("child_process");

  //console.log(`Cleaning ` + `${destinationFolder}...`)

  try {
    let ls = await spawn("rm", [`-rf`, `${destinationFolder}`]);

    ls.on("close", async code => {
      if (code === 0) {
        console.log("%s Cleanup Complete", chalk.green.bold("Success"));
        status.stop();
        // process next activities
        if (app == "core") {
          await downloadFiles(options, "hub");
        } else if (app == "hub") {
          await installContainerServices(options);
        }
      }
    });
  } catch (err) {
    console.log("%s Cleanup Error!", chalk.red.bold("Error"));
    return "cleanup_failed";
  } finally {
  }
}

async function installDNSResolver(options) {
  if (
    options.answers.dns === "dns" &&
    options.answers.dns_resolver === "valet"
  ) {
    let status = new Spinner(
      "Setting Up..." + chalk.green.bold(options.answers.domain) + " via Valet:"
    );
    status.start();

    let domain = options.answers.domain.split(".");
    let domain_count = domain.length;
    //console.log(domain_count)
    let domain_prefix = "",
      domain_tld = "";

    if (domain_count == 2) {
      domain_prefix = domain[0];
      domain_tld = domain[1];
    } else {
      domain_tld = domain[domain_count - 1];
      let domain_left = domain.splice(-1, 1);
      domain_prefix = domain_left.join("");
    }

    console.log("Hub Domain Prefix is: " + chalk.yellow.bold(domain_prefix));
    console.log("Hub Domain TLD is: " + chalk.yellow.bold(domain_tld));
    console.log(
      "Please enter your (mac) system password to enable Valet DNS site configuration for " +
        chalk.green.bold(options.answers.domain) +
        " and " +
        chalk.green.bold("core." + options.answers.domain) +
        "..."
    );
    status.stop();

    let localhost_url_web =
      params.general.http_scheme +
      "://" +
      params.general.host +
      ":" +
      (params.docker.services.hub_web.port + options.port_increment);

    let localhost_url_core =
      params.general.http_scheme +
      "://" +
      params.general.host +
      ":" +
      (params.docker.services.core_web.port + options.port_increment);

    let dockerComposeArgsWeb = [
      `proxy`,
      `${domain_prefix}`,
      `${localhost_url_web}`
    ];

    let dockerComposeArgsCore = [
      `proxy`,
      `core.${domain_prefix}`,
      `${localhost_url_core}`
    ];

    try {
      let ls = await spawn("valet", dockerComposeArgsWeb);

      ls.on("close", async code => {
        //status.stop();

        if (code === 0) {
          console.log(
            "%s WEB Site configuration successful",
            chalk.green.bold("Success")
          );
          await setupAdminAccount(options);
        }
      });

      let ls2 = await spawn("valet", dockerComposeArgsCore);

      ls2.on("close", async code => {
        //status.stop();

        if (code === 0) {
          console.log(
            "%s CORE Site configuration successful",
            chalk.green.bold("Success")
          );
          //await setupAdminAccount(options);
        }
      });
    } catch (err) {
      console.log(
        "%s Valet Site configuration error:" + err,
        chalk.red.bold("Error")
      );
      await status.stop();
    } finally {
    }
  }
}

exports.createProject = createProject;
