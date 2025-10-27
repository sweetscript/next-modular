import fs from 'fs';
import path from 'path';
import inquirer from 'inquirer';
import chalk from 'chalk';
import ora from 'ora';

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

      const homeRouteContent = `'use client';

import React from 'react';
import Link from 'next/link';

export default function ${ModuleClassName}HomePage() {
  const exampleItems = [
    { id: '123', name: 'Item 123' },
    { id: 'user-42', name: 'User 42' },
    { id: 'abc-xyz', name: 'ABC XYZ' },
  ];

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '1.5rem', color: '#0070f3' }}>
        ${ModuleClassName} Module
      </h1>
      <p style={{ marginBottom: '1rem', fontSize: '1.1rem' }}>
        Welcome to the ${moduleName} module!
      </p>
      
      <div style={{ marginTop: '2rem', padding: '1.5rem', backgroundColor: '#f0f9ff', borderRadius: '8px', border: '1px solid #0070f3' }}>
        <h2 style={{ marginBottom: '1rem', color: '#0070f3' }}>Dynamic Routes</h2>
        <p style={{ marginBottom: '1rem', fontSize: '0.9rem', color: '#666' }}>
          Click on any link below to see the dynamic route in action:
        </p>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {exampleItems.map((item) => (
            <li key={item.id} style={{ marginBottom: '0.5rem' }}>
              <Link 
                href={\`/${moduleName}/\${item.id}\`}
                style={{ 
                  color: '#0070f3', 
                  textDecoration: 'none',
                  padding: '0.5rem 1rem',
                  display: 'block',
                  borderRadius: '4px',
                  transition: 'background-color 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e6f3ff'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <strong>{item.name}</strong>
                <code style={{ marginLeft: '0.5rem', fontSize: '0.85rem', color: '#666' }}>
                  /${moduleName}/{item.id}
                </code>
              </Link>
            </li>
          ))}
        </ul>
      </div>
      
      <div style={{ marginTop: '2rem' }}>
        <h2 style={{ marginBottom: '1rem' }}>Getting Started</h2>
        <ul style={{ lineHeight: '2' }}>
          <li>Customize this page in <code>src/routes/home.${ext}</code></li>
          <li>Add more routes in the module definition</li>
          <li>Configure the module in your app's <code>modules.config.ts</code></li>
        </ul>
      </div>
    </div>
  );
}
`;
      fs.writeFileSync(path.join(routesDir, `home.${ext}`), homeRouteContent);

      // Create a dynamic route
      const detailRouteContent = `import React from 'react';
import Link from 'next/link';

${useTypeScript ? `interface DetailPageProps {
  params: {
    id: string;
  };
}

export default function ${ModuleClassName}DetailPage({ params }: DetailPageProps) {` : `export default function ${ModuleClassName}DetailPage({ params }) {`}
  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <Link 
        href="/${moduleName}"
        style={{ 
          color: '#0070f3', 
          textDecoration: 'none',
          display: 'inline-block',
          marginBottom: '1rem'
        }}
      >
        ← Back to {ModuleClassName}
      </Link>
      
      <h1 style={{ marginBottom: '1.5rem', color: '#0070f3' }}>
        ${ModuleClassName} - Detail View
      </h1>
      
      <div style={{ padding: '1.5rem', backgroundColor: '#f0f9ff', borderRadius: '8px', border: '1px solid #0070f3' }}>
        <h2 style={{ marginBottom: '1rem', color: '#0070f3' }}>Dynamic Route Parameter</h2>
        <p style={{ marginBottom: '0.5rem' }}>
          <strong>ID:</strong> <code style={{ padding: '0.25rem 0.5rem', backgroundColor: '#fff', borderRadius: '4px' }}>{params.id}</code>
        </p>
        <p style={{ fontSize: '0.9rem', color: '#666', marginTop: '1rem' }}>
          This page demonstrates a dynamic route pattern: <code>/[id]</code>
        </p>
        <p style={{ fontSize: '0.9rem', color: '#666', marginTop: '0.5rem' }}>
          The ID parameter is extracted from the URL and can be used to fetch data, 
          display specific content, or perform any logic based on the route.
        </p>
      </div>
      
      <div style={{ marginTop: '2rem' }}>
        <h3 style={{ marginBottom: '1rem' }}>What you can do here:</h3>
        <ul style={{ lineHeight: '2' }}>
          <li>Fetch data based on the ID parameter</li>
          <li>Display item-specific information</li>
          <li>Implement CRUD operations</li>
          <li>Handle loading and error states</li>
        </ul>
      </div>
    </div>
  );
}
`;
      fs.writeFileSync(path.join(routesDir, `detail.${ext}`), detailRouteContent);
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

      // Create a dynamic API endpoint
      const itemApiContent = `/**
 * Item API endpoint - GET /api/${moduleName}/items/[id]
 * Demonstrates dynamic API routes with path parameters
 */
export async function getItemHandler(req${useTypeScript ? ': Request' : ''}, context${useTypeScript ? ': { params: { id: string } }' : ''}) {
  if (req.method !== 'GET') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { status: 405, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const { id } = context.params;

  // Example: Fetch item data (replace with your actual logic)
  const item = {
    id,
    name: \`Item \${id}\`,
    description: 'This is a sample item from a dynamic route',
    createdAt: new Date().toISOString(),
  };

  return new Response(
    JSON.stringify({
      success: true,
      data: item,
    }),
    { status: 200, headers: { 'Content-Type': 'application/json' } }
  );
}
`;
      fs.writeFileSync(path.join(apiDir, `items.${configExt}`), itemApiContent);
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
      imports.push(`import ${ModuleClassName}DetailPage from './routes/detail';`);
      routesList.push(`    {
      path: '/',
      component: ${ModuleClassName}HomePage,
    },`);
      routesList.push(`    {
      path: '/[id]',
      component: ${ModuleClassName}DetailPage,
    },`);
    }

    if (features.includes('api')) {
      imports.push(`import { helloHandler } from './server/api/hello';`);
      imports.push(`import { getItemHandler } from './server/api/items';`);
      apiRoutesList.push(`    {
      path: '/hello',
      handler: helloHandler,
    },`);
      apiRoutesList.push(`    {
      path: '/items/[id]',
      handler: getItemHandler,
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
  customOption?: string;
}
` : '';

    const typeAnnotation = useTypeScript ? `<${ModuleClassName}Config>` : '';

    const indexContent = `${defineModuleImport}
${imports.join('\n')}
${configInterface}
/**
 * ${ModuleClassName} Module Definition
 * 
 * Configure this module in modules.config.ts:
 * 
 * import { ${moduleVarName} } from './${confirmPath}/${moduleName}/src';
 * 
 * export const modules = [
 *   // Basic usage with all features enabled by default
 *   ${moduleVarName},
 *   
 *   // Configure base features
 *   ${moduleVarName}({
 *     enabled: true,
 *     features: {
 *       routes: true,      // Enable/disable page routes
 *       apiRoutes: true,   // Enable/disable API endpoints
 *       middleware: true   // Enable/disable middleware
 *     }
 *   }),
 *   
 *   // Or add custom configuration
 *   ${moduleVarName}({
 *     enabled: true,
 *     customOption: 'your value'
 *   })
 * ];
 */
export const ${moduleVarName} = defineModule${typeAnnotation}({
  name: '${moduleName}',
  basePath: '/${moduleName}',
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
  // Basic usage - all features enabled by default
  ${moduleVarName},
  
  // Control module features:
  ${moduleVarName}({
    enabled: true,          // Enable/disable entire module
    features: {
      routes: true,         // Enable/disable page routes
      apiRoutes: true,      // Enable/disable API endpoints
      middleware: true      // Enable/disable middleware
    }
  }),
  
  // Disable specific features:
  ${moduleVarName}({
    features: {
      apiRoutes: false      // Disable API routes, keep pages and middleware
    }
  }),
];
\`\`\`

## Routes

${features.includes('routes') ? `- \`/${moduleName}\` - Home page
- \`/${moduleName}/[id]\` - Detail page with dynamic ID parameter` : 'No routes defined'}

## API Endpoints

${features.includes('api') ? `- \`GET /api/${moduleName}/hello\` - Hello endpoint
- \`GET /api/${moduleName}/items/[id]\` - Get item by ID (dynamic route)` : 'No API endpoints defined'}

## Configuration

The module supports Next Modular's base configuration:

- \`enabled\` (boolean): Enable/disable the entire module
- \`features.routes\` (boolean): Enable/disable page routes
- \`features.apiRoutes\` (boolean): Enable/disable API endpoints
- \`features.middleware\` (boolean): Enable/disable middleware

You can also add custom configuration by extending the config interface.

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

export default create;

