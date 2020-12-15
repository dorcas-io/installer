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
const copy = util.promisify(ncp);
const axios  = require('axios');
const mysql  = require('mysql');


clear();
console.log(
    chalk.yellow(
        figlet.textSync('DORCAS-BUSINESS', { horizontalLayout: 'full' })
    )
);




//this appends env credentials for clientid and secret to env_hub
async function writeFilesToEnv(options) {
  let sourcePath = options.targetDirectory + `/app/env_hub`;
  let data = {
    DORCAS_CLIENT_ID: options.clientId,
    DORCAS_CLIENT_SECRET: options.clientSecret,
    DORCAS_PERSONAL_CLIENT_ID: options.clientId,
    DORCAS_PERSONAL_CLIENT_SECRET: options.clientSecret,
  }

  fs.appendFileSync(sourcePath, envfile.stringify(data))
}

  async function checkDbConnection(option){
    const status = new Spinner('Connecting to Database...');
    status.start();
    try {
      const ls = await spawn('docker', [`exec`,`dorcas_${option.template}_sql`,`mysql`,'-uroot','-proot', `dorcas`,`-e`,`"SELECT * FROM oauth_clients"`]);
      ls.stderr.on( 'data', data => {
        console.log( );
      });
      ls.on('close', async code => {
        await status.stop()
        if(code === 0){
          console.log('connection to db successful')
          return true;
        }
        else{
          console.log('error connecting to db ')
          return false;
        }
      });
    }
    catch (e) {
      console.log(e)
    }
    finally {

    }
  }
async function createUserEntry(body) {
  let res = await axios.post(`http://localhost:18001/register`, body).catch(err => { console.log( chalk.red.bold(`${err}`) )})
  return res.data.data;
}

async function setUp() {
  let res = await axios.post(`http://localhost:18001/setup`).catch(err => { console.log(chalk.red.bold(`${err}`));})
  return res.data;
}
 async function runBaseDockerCompose(options) {
   const status = new Spinner('Setting Up The Dorcas Requirements...');
   status.start();
   try {
    const ls = await spawn('docker-compose', [`-f`, `${options.targetDirectory + `/docker-compose.yml`}`, `up`, `-d`, `core_${options.template}_web`,  `core_${options.template}_php`,  `dorcas_${options.template}_sql`, `dorcas_${options.template}_redis`, `dorcas_${options.template}_smtp`]);
     ls.stderr.on( 'data', data => {
       console.log( data );
     } );
     ls.on('close', async code => {
         await status.stop()
         if(code === 0){
           console.log('%s Api Setup Complete', chalk.green.bold('Success'));
           await handleSetup(options)
         }
         else {
           console.log('%s something went wrong with the Api Setup', chalk.red.bold('Error'));
           process.exit(1);
         }

        });
    }
    catch(err){
      status.stop()

    }
    finally {
  }
}

async function copyTemplateFiles(options) {
  copy(options.templateDirectory, `${options.targetDirectory}`, {
    clobber: false,
  });
}

async function runHubDockerCompose(options){
    const status = new Spinner('Setting Up The Hub...');
    status.start();
    try{
    const ls = await spawn('docker-compose', [`-f`, `${options.targetDirectory +`/docker-compose.yml`}`,`up`, `-d`, `hub_${options.template}_web`,`hub_${options.template}_php`, `dorcas_${options.template}_hub_sql`]);
      ls.on('close', async code => {
        await status.stop();
        if(code === 0){
          console.log('%s Hub Setup Complete', chalk.green.bold('Success'));
          await finalUerSetup(options)
        }

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
     let connection =  await checkDbConnection();
     if(connection){
       setTimeout(async () => {
         let res = await setUp(options)
         options.clientId = res.client_id
         options.clientSecret = res.client_secret
         if (typeof options.clientId !== 'undefined') {
           await writeFilesToEnv(options)
           status.stop();
           console.log('%s Enviroment Variables All Set ', chalk.green.bold('Success'));
           await tasks.run();
         }
       }, 3000)
     }
     else{
       await handleSetup(options);
     }

   }
   catch (e) {
     await status.stop();
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
        // installer: true,
        password: options.answers.password,
        company: options.answers.company,
        phone: options.answers.phone,
        feature_select: options.answers.feature_select,
        client_id: options.clientId,
        client_secret: options.clientSecret,
      }
       let res = await createUserEntry(data)
        if (typeof res !== 'undefined') {
          await status.stop();
          console.log('%s You are all Set', chalk.green.bold('Success'));
          console.log('\n');
          console.log('Thank You for Signing Up ' + res.email + ' Kindly Visit '+ chalk.green.bold('http://localhost:8001/login') + ' To Access The Hub');
       }
     }, 2000)
    
  }
  catch (err) {
    status.stop();
  }
}


async function createProject(options) {
  await checkDbConnection(options);
  //  const status = new Spinner('Initializing...');
  //  status.start();
  //   options = {
  //   ...options,
  //   targetDirectory: options.targetDirectory || process.cwd()+`/dorcas`,
  //   };
  // // const fullPathName = new URL(import.meta.url).pathname;
  // const fullPathName = __dirname + '/main.js';
  // const templateDir = path.resolve(
  //   fullPathName.substr(fullPathName.indexOf('/')),
  //   '../../templates',
  //   options.template.toLowerCase()
  // );
  //  options.templateDirectory = templateDir;
  // try {
  //   await copyTemplateFiles(options)
  //   console.log('%s Template Files Created', chalk.green.bold('Success'));
  //   await access(templateDir, fs.constants.R_OK);
  //   await status.stop();
  //
  // } catch (err) {
  //   console.log(err)
  //   console.error('%s Invalid template name', chalk.red.bold('ERROR'));
  //   status.stop()
  //   process.exit(1);
  // }
  // await runBaseDockerCompose(options)
  // return true;
 }

exports.createProject = createProject;
