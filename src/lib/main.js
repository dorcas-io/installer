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

 async function checkTable(callback){
   const  connection =  mysql.createConnection({
     host: "127.0.0.1",
     user:"root",
     password: "root",
     port: '18008',
     database: "dorcas"
   });
   const status = new Spinner('Connecting to Database...');
   status.start();
   connection.query("SELECT * FROM oauth_clients",   async function(err, result, fields) {
     if (err) {
        console.log('%s Still Initializing Tables', chalk.red.bold('error'));
         await status.stop();
         connection.end();
          callback(false)
     } else {
       console.log('%s Connection Instantiated', chalk.green.bold('success'));
        await status.stop();
        connection.end();
         callback(true)
     }
   });
 }

 async function checkConnection(callback) {
   const  connection =  mysql.createConnection({
     host: "127.0.0.1",
     user:"root",
     password: "root",
     port: '18008',
     database: "dorcas"
   });
    const status = new Spinner('Connecting to Database...');
     status.start();
     connection.connect(   async function(err) {
      if (err) {
        callback(false)
        console.log('%s Connection Failed', chalk.red.bold('error'));
        connection.end();
        await status.stop()
      }
      else {
        await status.stop()
        console.log('%s Connection Established', chalk.green.bold('success'));
        connection.end();
        callback(true)

      }
    });

  }

async function createUserEntry(body) {
  let res = await axios.post(`http://localhost:18001/register`, body).catch(err => {
    console.log(chalk.red.bold(`${err}`))
    // console.log(chalk.red.bold(`${err.response.data.errors.source}`))
    // if(err.response.data.errors.source){
    //   let errors = err.response.data.errors.source
    //   if(errors.email){
    //     console.log(`%s email`, chalk.green.bold(`${errors.email}`));
    //   }
    //   if(errors.phone){
    //     console.log(`%s phone`, chalk.green.bold(`${errors.phone}`));
    //   }
    //   if(errors.password){
    //     console.log(`%s password`, chalk.green.bold(`${errors.password}`));
    //   }
    // }
    process.exit()
  });
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
    const ls = await spawn('docker-compose', [`-f`, `${options.targetDirectory + `/docker-compose.yml`}`, `up`, `-d`, `core_${options.template}_web`,  `core_${options.template}_php`,  `dorcas_${options.template}_sql`, `dorcas_${options.template}_hub_sql`,`dorcas_${options.template}_redis`, `dorcas_${options.template}_smtp`]);
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
    const ls = await spawn('docker-compose', [`-f`, `${options.targetDirectory +`/docker-compose.yml`}`,`up`, `-d`, `hub_${options.template}_web`,`hub_${options.template}_php`]);
      ls.on('close', async code => {
        await status.stop();
        if(code === 0){
          console.log('%s Hub Setup Complete', chalk.green.bold('Success'));
          await finalUerSetup(options)
        }

      });
    }
    catch(err){
      await status.stop();
    }
    finally {

    }


}

async function resetServices(options){
    const status = new Spinner('Pulling Down Services...');
    status.start();
    try{
    const ls = await spawn('docker-compose', [`-f`, `${options.targetDirectory +`/docker-compose.yml`}`,`down`, `-v`]);
      ls.on('close', async code => {
        await status.stop();
        if(code === 0){
          console.log('%s All  Services Removed', chalk.green.bold('Success'));
          await runBaseDockerCompose(options)

        }

      })
    }
    catch(err){
      await status.stop();
    }
    finally {

    }


}

async function handleSetup(options) {
  const status = new Spinner('Setting Up Enviroment Variables...');
  const tasks = new Listr([{ title: 'Setting Up Dorcas Hub', task: () => runHubDockerCompose(options), },], { exitOnError: false, });
  status.start();
   try {
     await checkConnection(async function(result) {
      if (result){
        await checkTable(async function(result) {
          if(result){
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
            }, 3000)
          }
          else{
            setTimeout(async () => {
              console.log('creating required tables');
              await status.stop()
              await handleSetup(options);
            },3000)
          }
        })
      }
      else{
         setTimeout(async () => {
         console.log('retrying the connection');
          await status.stop();
          await handleSetup(options);
        },3000)
      }
     });

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
        installer: true,
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
    await status.stop();
  }
}


async function createProject(options) {
  // checkConnection(async function(result) {
  //   if (result){
  //     await checkTable(async function(result) {
  //       if(result){
  //         setTimeout(async () => {
  //           console.log('we good')
  //         }, 3000)
  //       }
  //       else{
  //         setTimeout(async () => {
  //           console.log('creating required tables\n');
  //           await createProject(options);
  //         },3000)
  //       }
  //     })
  //   }
  //   else{
  //     setTimeout(async () => {
  //       console.log('retrying the connection\n');
  //       await createProject(options);
  //     },3000)
  //   }
  // });
   const status = new Spinner('Initializing...');
   await status.start();
    options = {
    ...options,
    targetDirectory: options.targetDirectory || process.cwd()+`/dorcas`,
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
    await copyTemplateFiles(options)
    console.log('%s Template Files Created', chalk.green.bold('Success'));
    await access(templateDir, fs.constants.R_OK);
    await status.stop();

  } catch (err) {
    console.log(err)
    console.error('%s Invalid template name', chalk.red.bold('ERROR'));
    await status.stop()
    process.exit(1);
  }
  await resetServices(options)
  return true;
 }

exports.createProject = createProject;
