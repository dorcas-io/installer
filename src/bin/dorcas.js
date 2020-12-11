#!/usr/bin/env node

//
// // require = require('esm')(module /*, options*/);
// const arg = require('arg')
// const inquirer = require('inquirer')
// const inquiries =   [
//   {
//     name: "template",
//     type: "list",
//     message: "Please Select Dorcas Version ",
//     choices: ["business", "developer"],
//     default: "service"
//   },
//   {
//     name: "firstname",
//     type: "input",
//     message: "Please Provide Your First name",
//     when: answers => answers.template === "business" || answers.template === "developer"  ,
//     validate: function(value) {
//       if (value.length) {
//         return true;
//       } else {
//         return "Please enter your first name";
//       }
//     }
//   },
//   {
//     name: "lastname",
//     type: "input",
//     message: "Please Provide Your Last name",
//     when: answers => answers.template === "business" || answers.template === "developer"  ,
//     validate: function(value) {
//       if (value.length) {
//         return true;
//       } else {
//         return "Please enter your laest nam";
//       }
//     }
//   },
//   {
//     name: "email",
//     type: "input",
//     message: "Create Your Login Email Address",
//     validate: function(value) {
//       if (value.length) {
//         return true;
//       } else {
//         return "Please enter your email address";
//       }
//     }
//   },
//
//   {
//     name: "password",
//     type: "password",
//     message: "Create Your Login Password",
//     validate: function(value) {
//       if (value.length) {
//         return true;
//       } else {
//         return "Please enter your email address";
//       }
//     }
//   },
//   {
//     name: "company",
//     type: "input",
//     message: "Please Provide Your company name",
//     when: answers => answers.template === "business" || answers.template === "developer"  ,
//     validate: function(value) {
//       if (value.length) {
//         return true;
//       } else {
//         return "Please enter your company name";
//       }
//     }
//   },
//   {
//     name: "phone",
//     type: "input",
//     message: "Please Provide Your phone  number",
//     when: answers => answers.template === "business" || answers.template === "developer"  ,
//     validate: function (value) {
//       if (value.length) {
//         return true;
//       } else {
//         return "Please enter a valid phone number";
//       }
//     }
//   },
//   {
//     name: "feature_select",
//     type: "list",
//     message: "Please Select The  Business Features Do You Need?",
//     choices: [
//       {
//         name: "Everything!",
//         value: "all"
//       },
//       {
//         name: "Payroll",
//         value: "payroll"
//       },
//       {
//         name: "Selling Online",
//         value: "selling_online"
//       },
//     ],
//     default: "service"
//   },
//
//
// ];
// const fs = require('fs');
// const Listr = require('listr')
// const ncp = require('ncp')
// const path = require('path')
// const envfile = require('envfile')
// const util = require('util')
// const chalk = require('chalk');
// const clear = require('clear');
// const figlet = require('figlet');
// const spawn = require("child_process").spawn;
// const CLI = require('clui');
// const Spinner = CLI.Spinner;
// const access = util.promisify(fs.access);
// const writeFile = util.promisify(fs.writeFile);
// const copy = util.promisify(ncp);
// const logSymbols = require('log-symbols');
// const axios  = require('axios');
//
//
//
// function parseArgumentsIntoOptions(rawArgs) {
//   const args = arg(
//     { "--auto": Boolean, "--command_path": String, "--env_path" : String },
//     { argv: rawArgs.slice(2) }
//   );
//   return {
//     skipInputs: args["--auto"] || false,
//     commandPath: args["--command_path"],
//     envPath: args["--env_path"]
//   };
// }
//
// async function promptForMissingOptions(options) {
//   const defaultTemplate = "business";
//   if (options.skipInputs) {
//     return {
//       ...options,
//       template: options.template || defaultTemplate
//     };
//   }
//   const answers = await inquirer.prompt(inquiries.inquiries).catch(err => {});
//
//   return {
//     ...options,
//     answers,
//     template: answers.template || defaultTemplate,
//   };
// }
//
// async function cli(args) {
//   let options = parseArgumentsIntoOptions(args);
//   options = await promptForMissingOptions(options);
//
//   await main.createProject(options).catch(err => {});
// }
//
//
//
// //this appends env credentials for clientid and secret to env_hub
// async function writeFilesToEnv(options) {
//   let sourcePath = options.targetDirectory + `/app/env_hub`;
//   let data = {
//     DORCAS_CLIENT_ID: options.clientId,
//     DORCAS_CLIENT_SECRET: options.clientSecret,
//     DORCAS_PERSONAL_CLIENT_ID: options.clientId,
//     DORCAS_PERSONAL_CLIENT_SECRET: options.clientSecret,
//   }
//
//   fs.appendFileSync(sourcePath, envfile.stringify(data))
// }
//
// async function createUserEntry(body) {
//   let res = await axios.post(`http://localhost:18001/register`, body).catch(err => { console.log( chalk.red.bold(`${err}`) )})
//   return res.data.data;
// }
//
// async function setUp() {
//   let res = await axios.post(`http://localhost:18001/setup`).catch(err => { console.log(chalk.red.bold(`${err}`));})
//   return res.data;
// }
//
// async function runBaseDockerCompose(options) {
//   const status = new Spinner('Setting Up The Dorcas Requirements...');
//   status.start();
//   try {
//     const ls = await spawn('docker-compose', [`-f`, `${options.targetDirectory + `/docker-compose.yml`}`, `up`, `-d`, `core_web`,  `core_php`,  `dorcas_sql`, `dorcas_redis`, `dorcas_smtp`]);
//     ls.on('close', async code => {
//       status.stop()
//       console.log('%s Api Setup Complete', chalk.green.bold('Success'));
//       await handleSetup(options)
//     });
//   }
//   catch(err){
//     status.stop()
//
//   }
//   finally {
//   }
// }
//
// async function copyTemplateFiles(options) {
//   copy(options.templateDirectory, `${options.targetDirectory}`, {
//     clobber: false,
//   });
// }
//
// async function runHubDockerCompose(options){
//   const status = new Spinner('Setting Up The Hub...');
//   status.start();
//   try{
//     const ls = await spawn('docker-compose', [`-f`, `${options.targetDirectory +`/docker-compose.yml`}`,`up`, `-d`, `hub_web`,`hub_php`, `dorcas_hub_sql`]);
//     ls.on('close', async code => {
//       await status.stop();
//       console.log('%s Hub Setup Complete', chalk.green.bold('Success'));
//       await finalUerSetup(options)
//     });
//   }
//   catch(err){
//     status.stop();
//   }
//   finally {
//
//   }
// }
//
// async function handleSetup(options) {
//   const status = new Spinner('Setting Up Enviroment Variables...');
//   const tasks = new Listr([{ title: 'Setting Up Dorcas Hub', task: () => runHubDockerCompose(options), },], { exitOnError: false, });
//   status.start();
//   try {
//     setTimeout(async () => {
//       let res = await setUp(options)
//       options.clientId = res.client_id
//       options.clientSecret = res.client_secret
//       if (typeof options.clientId !== 'undefined') {
//         await writeFilesToEnv(options)
//         status.stop();
//         console.log('%s Enviroment Variables All Set ', chalk.green.bold('Success'));
//         await tasks.run();
//       }
//     }, 100000)
//   }
//   catch (e) {
//     status.stop();
//   }
//   finally {
//
//   }
// }
//
// async function finalUerSetup(options) {
//   const status = new Spinner('Setting Up User Credentials...');
//   status.start();
//   try {
//     setTimeout(async () => {
//       let data = {
//         firstname: options.answers.firstname,
//         lastname: options.answers.lastname,
//         email: options.answers.email,
//         // installer: true,
//         password: options.answers.password,
//         company: options.answers.company,
//         phone: options.answers.phone,
//         feature_select: options.answers.feature_select,
//         client_id: options.clientId,
//         client_secret: options.clientSecret,
//       }
//       let res = await createUserEntry(data)
//       if (typeof res !== 'undefined') {
//         status.stop();
//         console.log('%s You are all Set', chalk.green.bold('Success'));
//         console.log('\n');
//         console.log('Thank You for Signing Up ' + res.email + ' Kindly Visit '+ chalk.green.bold('http://localhost:8001/login') + ' To Access The Hub');
//       }
//     }, 2000)
//
//   }
//   catch (err) {
//     status.stop();
//   }
// }
//
//
// async function createProject(options) {
//   clear();
//   console.log(
//     chalk.yellow(
//       figlet.textSync('DORCAS-INSTALLER', { horizontalLayout: 'full' })
//     )
//   );
//
//   const status = new Spinner('Initializing...');
//   status.start();
//   options = {
//     ...options,
//     targetDirectory: options.targetDirectory || process.cwd()+`/dorcas`,
//   };
//
//
//
//   // const fullPathName = new URL(import.meta.url).pathname;
//   const fullPathName = __dirname + '/main.js';
//   const templateDir = path.resolve(
//     fullPathName.substr(fullPathName.indexOf('/')),
//     '../../templates',
//     options.template.toLowerCase()
//   );
//   options.templateDirectory = templateDir;
//   try {
//     await copyTemplateFiles(options)
//     await access(templateDir, fs.constants.R_OK);
//     status.stop();
//
//   } catch (err) {
//     console.log(err)
//     console.error('%s Invalid template name', chalk.red.bold('ERROR'));
//     status.stop()
//     process.exit(1);
//   }
//   await runBaseDockerCompose(options)
//   return true;
// }
//
// exports.createProject = createProject;
//
// exports.cli = cli;

require = require('esm')(module /*, options*/);
const path = require( 'path' );
// cli(process)
require(path.join(__dirname,'../lib/cli.js')).cli(process.argv);
