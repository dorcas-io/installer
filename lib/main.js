const fs = require('fs');
const Listr = require('listr')
const ncp = require('ncp')
const path = require('path')
const envfile = require('envfile')
const util = require('util')
const chalk = require('chalk');
const clear = require('clear');
const figlet = require('figlet');
const spawn = require("child_process").spawn;
const CLI = require('clui');
const Spinner = CLI.Spinner;
const access = util.promisify(fs.access);
const writeFile = util.promisify(fs.writeFile);
const copy = util.promisify(ncp);
const logSymbols = require('log-symbols');
const axios  = require('axios');
// const writeGitignore = promisify(gitignore.writeFile);


clear();
console.log(
    chalk.yellow(
        figlet.textSync('DORCAS-INSTALLER', { horizontalLayout: 'full' })
    )
);




//this appends env credentials for clientid and secret to env_hub
async function writeFilesToEnv(options) {
  let sourcePath = options.templateDirectory + `/app/env_hub`;
  let data = {
    DORCAS_CLIENT_ID: options.clientId,
    DORCAS_CLIENT_SECRET: options.clientSecret,
    DORCAS_PERSONAL_CLIENT_ID: options.clientId,
    DORCAS_PERSONAL_CLIENT_SECRET: options.clientSecret,
  }

  fs.appendFileSync(sourcePath, envfile.stringify(data))
}

async function createUserEntry(body) {
  let res = await axios.post(`http://localhost:8001/api/installer/register`, body).catch(err => { console.log( chalk.red.bold(`${err}`) )})
  return res.data;
}

async function setUp() {
  let res = await axios.post(`http://localhost:18001/setup`).catch(err => { console.log(chalk.red.bold(`${err}`));})
  return res.data;
}
 async function runBaseDockerCompose(options) {
   const status = new Spinner('Setting Up The Dorcas Requirements...');
   status.start();
   try {
    const ls = await spawn('docker-compose', [`-f`, `${options.templateDirectory + `/docker-compose.yml`}`, `up`, `-d`, `core_web`,  `core_php`,  `dorcas_sql`, `dorcas_redis`, `dorcas_smtp`]);
    ls.on('close', async code => {
         status.stop()
       console.log('%s Api Setup Complete', chalk.green.bold('Success'));
         await handleSetup(options)
        });
    }
    catch(err){
      status.stop()

    }
    finally {
  }
}
async function runHubDockerCompose(options){
    const status = new Spinner('Setting Up The Hub...');
    status.start();
    try{
    const ls = await spawn('docker-compose', [`-f`, `${options.templateDirectory +`/docker-compose.yml`}`,`up`, `-d`, `hub_web`,`hub_php`, `dorcas_hub_sql`]);
      ls.on('close', async code => {
      status.stop();
      console.log('%s Hub Setup Complete', chalk.green.bold('Success'));
      await finalUerSetup(options)
      });
    }
    catch(err){
      status.stop();
    }
    finally {

    }
}

async function handleSetup(options) {
  const status = new Spinner('Setting Up Enviroment Variables...');
  const tasks = new Listr([{ title: 'Setting Up Dorcas Hub', task: () => runHubDockerCompose(options), },], { exitOnError: false, });
  status.start();
   try {
     setTimeout(async () => {
       let res = await setUp(options)
       options.clientId = res.client_id
       options.clientSecret = res.client_secret
       if (typeof options.clientId !== 'undefined') {
         await writeFilesToEnv(options)
         await status.stop();
         console.log('%s Enviroment Variables All Set ', chalk.green.bold('Success'));
         await tasks.run();
       }
     }, 20000)
   }
   catch (e) {
     status.stop();
   }
   finally {

   }
}

async function finalUerSetup(options) {
  const status = new Spinner('Setting Up User Credentials...');
  status.start();
  try {
    setTimeout(async () => {
      let data = {
        firstname: options.answers.firstname,
        lastname: options.answers.lastname,
        email: options.answers.email,
        password: options.answers.password,
        company: options.answers.company,
        phone: options.answers.phone,
        feature_select: options.answers.feature_select,
        client_id: options.clientId,
        client_secret: options.clientSecret,
      }
       let res = await createUserEntry(data)
        if (typeof res.user !== 'undefined') {
         await status.stop();
          console.log('%s You are all Set', chalk.green.bold('Success'));
          console.log('\n');
          console.log('Thank You for Signing Up ' + res.user.email + ' Kindly Visit '+ chalk.green.bold('http://localhost:8001/login') + ' To Access The Hub');
       }
     }, 20000)
    
  }
  catch (err) {
    status.stop();
  }
}


export async function createProject(options) {
    options = {
    ...options,
    targetDirectory: options.targetDirectory,
  };


  // const fullPathName = new URL(import.meta.url).pathname;
  const fullPathName = __dirname + '/main.js';
  const templateDir = path.resolve(
    fullPathName.substr(fullPathName.indexOf('/')),
    '../../templates',
    options.template.toLowerCase()
  );
    options.templateDirectory = templateDir;
  try {
    await access(templateDir, fs.constants.R_OK);

  } catch (err) {
    console.error('%s Invalid template name', chalk.red.bold('ERROR'));
    process.exit(1);
  }
  await runBaseDockerCompose(options)

  return true;
}
