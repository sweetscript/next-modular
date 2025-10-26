const fs = require('fs');
const path = require('path');
const inquirer = require('inquirer');
const chalk = require('chalk');
const ora = require('ora');
const { execSync } = require('child_process');

const registry = require('../modules-registry.json');

async function add(moduleName, options) {
  console.log(chalk.cyan.bold('\n📦 Add Module to Next Modular\n'));

  const targetDir = process.cwd();
  const modulesConfigPath = path.join(targetDir, 'modules.config.ts');

  // Check if modules.config.ts exists
  if (!fs.existsSync(modulesConfigPath)) {
    console.log(chalk.red('❌ modules.config.ts not found.'));
    console.log(chalk.yellow('💡 Run: ') + chalk.white('npx next-modular init') + chalk.yellow(' first.\n'));
    process.exit(1);
  }

  let selectedModule;

  // If module name is provided, use it
  if (moduleName) {
    // Check if it's in the registry
    selectedModule = registry.modules.find(m => m.name === moduleName);
    
    if (!selectedModule) {
      // Treat it as a custom npm package
      selectedModule = {
        name: moduleName,
        description: 'Custom module',
        version: 'latest',
        category: 'custom',
      };
    }

    if (!options.yes) {
      const { confirm } = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'confirm',
          message: `Add ${chalk.cyan(selectedModule.name)}?`,
          default: true,
        },
      ]);

      if (!confirm) {
        process.exit(0);
      }
    }
  } else {
    // Show interactive list
    const choices = registry.modules.map(m => ({
      name: `${m.name} - ${chalk.gray(m.description)}`,
      value: m.name,
      short: m.name,
    }));

    choices.push({
      name: chalk.yellow('Custom npm package...'),
      value: '__custom__',
    });

    const { selected } = await inquirer.prompt([
      {
        type: 'list',
        name: 'selected',
        message: 'Select a module to add:',
        choices,
        pageSize: 10,
      },
    ]);

    if (selected === '__custom__') {
      const { customModule } = await inquirer.prompt([
        {
          type: 'input',
          name: 'customModule',
          message: 'Enter npm package name:',
          validate: (input) => input.length > 0 || 'Package name is required',
        },
      ]);

      selectedModule = {
        name: customModule,
        description: 'Custom module',
        version: 'latest',
        category: 'custom',
      };
    } else {
      selectedModule = registry.modules.find(m => m.name === selected);
    }
  }

  const spinner = ora(`Installing ${selectedModule.name}...`).start();

  try {
    // Install the module
    const packageManager = fs.existsSync(path.join(targetDir, 'package-lock.json'))
      ? 'npm'
      : fs.existsSync(path.join(targetDir, 'yarn.lock'))
      ? 'yarn'
      : fs.existsSync(path.join(targetDir, 'pnpm-lock.yaml'))
      ? 'pnpm'
      : 'npm';

    const installCmd = packageManager === 'npm'
      ? `npm install ${selectedModule.name}@${selectedModule.version || 'latest'}`
      : packageManager === 'yarn'
      ? `yarn add ${selectedModule.name}@${selectedModule.version || 'latest'}`
      : `pnpm add ${selectedModule.name}@${selectedModule.version || 'latest'}`;

    execSync(installCmd, { cwd: targetDir, stdio: 'pipe' });
    spinner.succeed(`Installed ${selectedModule.name}`);

    // Update modules.config.ts
    spinner.start('Updating modules.config.ts...');

    let modulesConfig = fs.readFileSync(modulesConfigPath, 'utf8');

    // Extract module variable name from package name
    const moduleVarName = selectedModule.name
      .split('/')
      .pop()
      .replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());

    // Add import if not exists
    const importStatement = `import { ${moduleVarName} } from '${selectedModule.name}';`;
    
    if (!modulesConfig.includes(importStatement)) {
      // Find the last import or add after comment
      const lines = modulesConfig.split('\n');
      let insertIndex = 0;
      
      for (let i = lines.length - 1; i >= 0; i--) {
        if (lines[i].includes('import ') || lines[i].includes('*/')) {
          insertIndex = i + 1;
          break;
        }
      }

      lines.splice(insertIndex, 0, importStatement);
      modulesConfig = lines.join('\n');
    }

    // Add module to array
    const modulesArrayMatch = modulesConfig.match(/export const modules = \[([\s\S]*?)\];/);
    
    if (modulesArrayMatch) {
      const currentModules = modulesArrayMatch[1].trim();
      const newModuleEntry = `  ${moduleVarName},`;
      
      if (!currentModules.includes(moduleVarName)) {
        const updatedModules = currentModules
          ? `${currentModules}\n${newModuleEntry}`
          : `\n${newModuleEntry}\n`;

        modulesConfig = modulesConfig.replace(
          /export const modules = \[([\s\S]*?)\];/,
          `export const modules = [${updatedModules}];`
        );
      }
    }

    fs.writeFileSync(modulesConfigPath, modulesConfig);
    spinner.succeed('Updated modules.config.ts');

    console.log(chalk.green.bold('\n✨ Module added successfully!\n'));
    
    if (selectedModule.features) {
      console.log(chalk.cyan('Features:'));
      selectedModule.features.forEach(feature => {
        console.log(chalk.gray(`  • ${feature}`));
      });
      console.log();
    }

    console.log(chalk.gray('The module has been added to modules.config.ts'));
    console.log(chalk.gray('You can now configure it or start using it!\n'));

  } catch (error) {
    spinner.fail('Failed to add module');
    console.error(chalk.red('\nError:'), error.message);
    process.exit(1);
  }
}

module.exports = add;

