#!/usr/bin/env node

import { program } from 'commander';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import init from './commands/init.mjs';
import add from './commands/add.mjs';
import create from './commands/create.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const packageJson = JSON.parse(
  readFileSync(join(__dirname, '../package.json'), 'utf8')
);

program
  .name('next-modular')
  .description('CLI for Next Modular - Modular architecture for Next.js')
  .version(packageJson.version);

program
  .command('init')
  .description('Initialize Next.js app to use Next Modular')
  .option('-d, --directory <path>', 'Target directory', '.')
  .option('-y, --yes', 'Skip confirmation prompts and install everything')
  .action(init);

program
  .command('add [module]')
  .description('Add a module from the registry or npm')
  .option('-y, --yes', 'Skip confirmation prompts')
  .action(add);

program
  .command('create')
  .description('Create a new local module')
  .option('-n, --name <name>', 'Module name')
  .option('-p, --path <path>', 'Module path', 'modules')
  .action(create);

program.parse(process.argv);

// Show help if no command provided
if (!process.argv.slice(2).length) {
  program.outputHelp();
}

