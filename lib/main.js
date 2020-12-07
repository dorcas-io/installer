import chalk from 'chalk';
import fs, { stat } from 'fs';
import Listr from 'listr';
import ncp from 'ncp';
import path from 'path';
import {stringify} from 'envfile';
import { projectInstall } from 'pkg-install';
import { promisify } from 'util';
import clear from 'clear';
import figlet from 'figlet';
const spawn = require("child_process").spawn;
const CLI = require('clui');
const Spinner = CLI.Spinner;
const access = promisify(fs.access);
const writeFile = promisify(fs.writeFile);
const copy = promisify(ncp);
const logSymbols = require('log-symbols');
// const writeGitignore = promisify(gitignore.writeFile);


clear();
console.log(
    chalk.yellow(
        figlet.textSync('OCX-NODE', { horizontalLayout: 'full' })
    )
);

async function copyTemplateFiles(options) {
  return copy(options.templateDirectory, options.targetDirectory, {
    clobber: false,
  });
}

async function writeFilesToEnv(options){
    if(!options.skipInputs){
        fs.writeFileSync(options.targetDirectory+ `/.env`, stringify(options.data))
    }
    else{
        return ncp(options.commandPath, options.targetDirectory+`/.env`, (res) => {

        });
    }
}

async function createDomainEntry() {
  
}

async function createAuthUser() {
  
}

async function createProfileEntry() {
  
}

async function createAccessNtry() {
  
}

async function RunDockerCompose(options){
    const status = new Spinner('Process Started...');
    await status.start();
    try{
        const ls = await spawn('docker-compose', [`-f`, `${options.targetDirectory +`/docker-compose.yml`}`,`up`, `-d`]);
        ls.stdout.on( 'data', data => {
            console.log( chalk.red.bold(`${logSymbols.success}`) + ` ${data}` );

        } );

        ls.stderr.on( 'data', data => {
            console.log( chalk.red.bold(`${logSymbols.error}`) + ` ${data}` );
        } );

        ls.on( 'close', code => {
            console.log(chalk.green('All Services Initialized !'));
        } );
    }
    finally{
        // const ls = await spawn('docker', [`ps`]);
        // ls.stdout.on( 'data', data => {
        //     console.log( chalk.red.bold(`${logSymbols.success}`) + ` ${data}` );

        // } );
        status.stop();
    }
}


export async function createProject(options) {

  options = {
    ...options,
    targetDirectory: options.targetDirectory || process.cwd()+`/octopusx`,
  };

  const fullPathName = new URL(import.meta.url).pathname;
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

//   const tasks = new Listr(
//     [
//       {
//         title: 'Setup  Servces',
//         task: () => RunDockerCompose(options),
//       },
//       {
//         title: 'Copy project files',
//         task: () => copyTemplateFiles(options),
//       },
//       {
//         title: 'Writing Credentials',
//         task: () => writeFilesToEnv(options),
//       },
//     ],
//     {
//       exitOnError: false,
//     }
//   );

//   await tasks.run();
  return true;
}
