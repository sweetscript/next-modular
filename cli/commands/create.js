const fs = require('fs');
const path = require('path');
const inquirer = require('inquirer');
const chalk = require('chalk');
const ora = require('ora');

async function create(options) {
  console.log(chalk.cyan.bold('\n🎨 Create New Module\n'));

  const targetDir = process.cwd();

  // Get module name
  let moduleName = options.name;
  if (!moduleName) {
    const { name } = await inquirer.prompt([
      {
        type: 'input',
        name: 'name',
        message: 'Module name (e.g., my-module):',
        validate: (input) => {
          if (!input) return 'Module name is required';
          if (!/^[a-z0-9-]+$/.test(input)) {
            return 'Module name must contain only lowercase letters, numbers, and hyphens';
          }
          return true;
        },
      },
    ]);
    moduleName = name;
  }

  // Get module path
  const modulePath = options.path || 'modules';
  
  const { confirmPath } = await inquirer.prompt([
    {
      type: 'input',
      name: 'confirmPath',
      message: 'Where should the module be created?',
      default: modulePath,
    },
  ]);

  const fullModulePath = path.join(targetDir, confirmPath, moduleName);

  // Check if module already exists
  if (fs.existsSync(fullModulePath)) {
    console.log(chalk.red(`❌ Module already exists at ${fullModulePath}`));
    process.exit(1);
  }

  // Ask for module features
  const { features } = await inquirer.prompt([
    {
      type: 'checkbox',
      name: 'features',
      message: 'What features should this module include?',
      choices: [
        { name: 'Routes (pages)', value: 'routes', checked: true },
        { name: 'API endpoints', value: 'api', checked: true },
        { name: 'Middleware', value: 'middleware', checked: true },
        { name: 'TypeScript', value: 'typescript', checked: true },
      ],
    },
  ]);

  const useTypeScript = features.includes('typescript');
  const ext = useTypeScript ? 'tsx' : 'jsx';
  const configExt = useTypeScript ? 'ts' : 'js';

  const spinner = ora('Creating module...').start();

  try {
    // Create module directory structure
    fs.mkdirSync(fullModulePath, { recursive: true });

    const srcDir = path.join(fullModulePath, 'src');
    fs.mkdirSync(srcDir);

    // Convert module-name to moduleName (camelCase)
    const moduleVarName = moduleName.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
    const ModuleClassName = moduleVarName.charAt(0).toUpperCase() + moduleVarName.slice(1);

    // Create routes if selected
    if (features.includes('routes')) {
      const routesDir = path.join(srcDir, 'routes');
      fs.mkdirSync(routesDir);

      const homeRouteContent = `import React from 'react';

export default function ${ModuleClassName}HomePage() {
  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '1.5rem', color: '#0070f3' }}>
        ${ModuleClassName} Module
      </h1>
      <p style={{ marginBottom: '1rem', fontSize: '1.1rem' }}>
        Welcome to the ${moduleName} module!
      </p>
      
      <div style={{ marginTop: '2rem' }}>
        <h2 style={{ marginBottom: '1rem' }}>Getting Started</h2>
        <ul style={{ lineHeight: '2' }}>
          <li>Customize this page in <code>src/routes/home.${ext}</code></li>
          <li>Add more routes in the module definition</li>
          <li>Configure the module in your app's modules.config.ts</li>
        </ul>
      </div>
    </div>
  );
}
`;
      fs.writeFileSync(path.join(routesDir, `home.${ext}`), homeRouteContent);
    }

    // Create API endpoints if selected
    if (features.includes('api')) {
      const apiDir = path.join(srcDir, 'server', 'api');
      fs.mkdirSync(apiDir, { recursive: true });

      const helloApiContent = `/**
 * Hello API endpoint - GET /api/${moduleName}/hello
 */
export async function helloHandler(req${useTypeScript ? ': Request' : ''}) {
  if (req.method !== 'GET') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { status: 405, headers: { 'Content-Type': 'application/json' } }
    );
  }

  return new Response(
    JSON.stringify({
      message: 'Hello from ${moduleName}!',
      timestamp: new Date().toISOString(),
    }),
    { status: 200, headers: { 'Content-Type': 'application/json' } }
  );
}
`;
      fs.writeFileSync(path.join(apiDir, `hello.${configExt}`), helloApiContent);
    }

    // Create middleware if selected
    if (features.includes('middleware')) {
      const serverDir = path.join(srcDir, 'server');
      fs.mkdirSync(serverDir, { recursive: true });

      const middlewareImports = useTypeScript
        ? "import { NextRequest, NextResponse } from 'next/server';"
        : '';

      const middlewareContent = `${middlewareImports}

/**
 * ${ModuleClassName} middleware
 */
export async function ${moduleVarName}Middleware(req${useTypeScript ? ': NextRequest' : ''}) {
  const pathname = req.nextUrl.pathname;
  
  // Log requests
  console.log(\`[${ModuleClassName}] \${req.method} \${pathname}\`);
  
  // Add your middleware logic here
  
  return;
}
`;
      fs.writeFileSync(path.join(serverDir, `middleware.${configExt}`), middlewareContent);
    }

    // Create index file
    const defineModuleImport = useTypeScript
      ? "import { defineModule } from 'next-modular';"
      : "const { defineModule } = require('next-modular');";

    const imports = [];
    const routesList = [];
    const apiRoutesList = [];
    let middlewareExport = '';

    if (features.includes('routes')) {
      imports.push(`import ${ModuleClassName}HomePage from './routes/home';`);
      routesList.push(`    {
      path: '/',
      component: ${ModuleClassName}HomePage,
    },`);
    }

    if (features.includes('api')) {
      imports.push(`import { helloHandler } from './server/api/hello';`);
      apiRoutesList.push(`    {
      path: '/hello',
      handler: helloHandler,
    },`);
    }

    if (features.includes('middleware')) {
      imports.push(`import { ${moduleVarName}Middleware } from './server/middleware';`);
      middlewareExport = `  middleware: {
    handler: ${moduleVarName}Middleware,
  },`;
    }

    const configInterface = useTypeScript ? `
export interface ${ModuleClassName}Config {
  // Add your custom config here
  // Example:
  // enableFeature?: boolean;
}
` : '';

    const typeAnnotation = useTypeScript ? `<${ModuleClassName}Config>` : '';

    const indexContent = `${defineModuleImport}
${imports.join('\n')}
${configInterface}
/**
 * ${ModuleClassName} Module Definition
 */
export const ${moduleVarName} = defineModule${typeAnnotation}({
  name: '${moduleName}',
  basePath: '/${moduleName}',${useTypeScript ? `
  config: {
    // Add default configuration here
  },` : ''}
  routes: [
${routesList.join('\n')}
  ],
  apiRoutes: [
${apiRoutesList.join('\n')}
  ],${middlewareExport}
});

export default ${moduleVarName};
`;

    fs.writeFileSync(path.join(srcDir, `index.${configExt}`), indexContent);

    // Create package.json
    const packageJsonContent = {
      name: moduleName,
      version: '0.1.0',
      main: `./src/index.${configExt}`,
      private: true,
    };

    fs.writeFileSync(
      path.join(fullModulePath, 'package.json'),
      JSON.stringify(packageJsonContent, null, 2)
    );

    // Create README
    const readmeContent = `# ${ModuleClassName} Module

A Next Modular module.

## Features

${features.includes('routes') ? '- Routes (pages)\n' : ''}${features.includes('api') ? '- ✅ API endpoints\n' : ''}${features.includes('middleware') ? '- ✅ Middleware\n' : ''}

## Usage

Add to your \`modules.config.ts\`:

\`\`\`typescript
import { ${moduleVarName} } from './${confirmPath}/${moduleName}/src';

export const modules = [
  ${moduleVarName},
  
  // Or with configuration:
  // ${moduleVarName}({
  //   // your config
  // }),
];
\`\`\`

## Routes

${features.includes('routes') ? `- \`/${moduleName}\` - Home page` : 'No routes defined'}

## API Endpoints

${features.includes('api') ? `- \`GET /api/${moduleName}/hello\` - Hello endpoint` : 'No API endpoints defined'}

## Development

Edit the files in \`src/\` to customize your module.
`;

    fs.writeFileSync(path.join(fullModulePath, 'README.md'), readmeContent);

    spinner.succeed('Module created');

    // Update modules.config.ts
    const modulesConfigPath = path.join(targetDir, 'modules.config.ts');
    
    if (fs.existsSync(modulesConfigPath)) {
      spinner.start('Updating modules.config.ts...');

      let modulesConfig = fs.readFileSync(modulesConfigPath, 'utf8');

      // Add import
      const importStatement = `import { ${moduleVarName} } from './${confirmPath}/${moduleName}/src';`;
      
      if (!modulesConfig.includes(importStatement)) {
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

      // Add to modules array
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
    }

    console.log(chalk.green.bold('\n✨ Module created successfully!\n'));
    console.log(chalk.cyan('Location:'), chalk.white(fullModulePath));
    console.log(chalk.cyan('Features:'), chalk.white(features.join(', ')));
    
    console.log(chalk.gray('\n📝 Next steps:'));
    console.log(chalk.gray('  1. Customize your module in: ') + chalk.white(fullModulePath));
    console.log(chalk.gray('  2. Module is already added to modules.config.ts'));
    console.log(chalk.gray('  3. Start your dev server to see it in action\n'));

  } catch (error) {
    spinner.fail('Failed to create module');
    console.error(chalk.red('\nError:'), error.message);
    process.exit(1);
  }
}

module.exports = create;

