#!/usr/bin/env node

const { program } = require('commander');
const packageJson = require('../package.json');

program
  .name('next-modular')
  .description('CLI for Next Modular - Modular architecture for Next.js')
  .version(packageJson.version);

program
  .command('init')
  .description('Initialize Next.js app to use Next Modular')
  .option('-d, --directory <path>', 'Target directory', '.')
  .action(require('./commands/init'));

program
  .command('add [module]')
  .description('Add a module from the registry or npm')
  .option('-y, --yes', 'Skip confirmation prompts')
  .action(require('./commands/add'));

program
  .command('create')
  .description('Create a new local module')
  .option('-n, --name <name>', 'Module name')
  .option('-p, --path <path>', 'Module path', 'modules')
  .action(require('./commands/create'));

program.parse(process.argv);

// Show help if no command provided
if (!process.argv.slice(2).length) {
  program.outputHelp();
}

