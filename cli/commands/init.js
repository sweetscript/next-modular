const fs = require('fs');
const path = require('path');
const inquirer = require('inquirer');
const chalk = require('chalk');
const ora = require('ora');

async function init(options) {
  console.log(chalk.cyan.bold('\n🚀 Next Modular Initialization\n'));

  const targetDir = path.resolve(process.cwd(), options.directory);

  // Check if it's a Next.js project
  const packageJsonPath = path.join(targetDir, 'package.json');
  if (!fs.existsSync(packageJsonPath)) {
    console.log(chalk.red('❌ package.json not found. Are you in a Next.js project?'));
    process.exit(1);
  }

  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  const hasNext = packageJson.dependencies?.next || packageJson.devDependencies?.next;

  if (!hasNext) {
    console.log(chalk.yellow('⚠️  Warning: Next.js not found in dependencies'));
    const { continueAnyway } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'continueAnyway',
        message: 'Continue anyway?',
        default: false,
      },
    ]);

    if (!continueAnyway) {
      process.exit(0);
    }
  }

  // Check for app directory
  const appDir = path.join(targetDir, 'app');
  if (!fs.existsSync(appDir)) {
    console.log(chalk.red('❌ app directory not found. This CLI requires Next.js App Router.'));
    process.exit(1);
  }

  console.log(chalk.green('✓ Next.js App Router detected\n'));

  // Ask what to set up
  const { features } = await inquirer.prompt([
    {
      type: 'checkbox',
      name: 'features',
      message: 'What would you like to set up?',
      choices: [
        { name: 'Catch-all route for modules', value: 'catchAllRoute', checked: true },
        { name: 'Catch-all API route', value: 'catchAllApi', checked: true },
        { name: 'Middleware/Proxy file', value: 'middleware', checked: true },
        { name: 'modules.config.ts file', value: 'modulesConfig', checked: true },
        { name: 'Runtime initialization file', value: 'runtime', checked: true },
      ],
    },
  ]);

  const spinner = ora('Setting up Next Modular...').start();

  try {
    // Create catch-all route
    if (features.includes('catchAllRoute')) {
      const catchAllDir = path.join(appDir, '[...module]');
      fs.mkdirSync(catchAllDir, { recursive: true });

      const catchAllContent = `import { handleRoute } from 'next-modular';
import { notFound } from 'next/navigation';
import '../../next-modular.runtime'; // Initialize modules

export default async function ModulePage({
  params,
}: {
  params: Promise<{ module: string[] }>;
}) {
  const { module } = await params;
  const pathname = '/' + module.join('/');

  const result = await handleRoute(pathname);

  if (!result) {
    notFound();
  }

  const { component: Component, params: routeParams } = result;

  return <Component params={routeParams} />;
}
`;

      fs.writeFileSync(path.join(catchAllDir, 'page.tsx'), catchAllContent);
      spinner.succeed('Created catch-all route');
      spinner.start();
    }

    // Create catch-all API route
    if (features.includes('catchAllApi')) {
      const apiDir = path.join(appDir, 'api', '[...module]');
      fs.mkdirSync(apiDir, { recursive: true });

      const apiContent = `import { handleApiRoute } from 'next-modular';
import '../../../next-modular.runtime'; // Initialize modules

export async function GET(
  req: Request,
  context: { params: Promise<{ module: string[] }> }
) {
  const params = await context.params;
  const pathname = '/api/' + params.module.join('/');
  
  return handleApiRoute(req, pathname, { params });
}

export async function POST(
  req: Request,
  context: { params: Promise<{ module: string[] }> }
) {
  const params = await context.params;
  const pathname = '/api/' + params.module.join('/');
  
  return handleApiRoute(req, pathname, { params });
}

export async function PUT(
  req: Request,
  context: { params: Promise<{ module: string[] }> }
) {
  const params = await context.params;
  const pathname = '/api/' + params.module.join('/');
  
  return handleApiRoute(req, pathname, { params });
}

export async function DELETE(
  req: Request,
  context: { params: Promise<{ module: string[] }> }
) {
  const params = await context.params;
  const pathname = '/api/' + params.module.join('/');
  
  return handleApiRoute(req, pathname, { params });
}

export async function PATCH(
  req: Request,
  context: { params: Promise<{ module: string[] }> }
) {
  const params = await context.params;
  const pathname = '/api/' + params.module.join('/');
  
  return handleApiRoute(req, pathname, { params });
}
`;

      fs.writeFileSync(path.join(apiDir, 'route.ts'), apiContent);
      spinner.succeed('Created catch-all API route');
      spinner.start();
    }

    // Create middleware/proxy file
    if (features.includes('middleware')) {
      const proxyContent = `import { NextRequest, NextResponse } from 'next/server';
import { handleMiddleware } from 'next-modular';
import './next-modular.runtime'; // Initialize modules

export async function proxy(req: NextRequest) {
  // Handle module middleware
  const result = await handleMiddleware(req);
  
  if (result) {
    return result;
  }

  // Continue to next middleware or route
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
`;

      fs.writeFileSync(path.join(targetDir, 'proxy.ts'), proxyContent);
      spinner.succeed('Created proxy.ts middleware file');
      spinner.start();
    }

    // Create modules.config.ts
    if (features.includes('modulesConfig')) {
      const modulesConfigContent = `/**
 * Centralized module configuration
 * Import this file in both next.config.ts and route handlers
 */

export const modules = [
  // Add your modules here
  // Example:
  // authModule,
  // testModule({ enableLogging: true }),
];
`;

      fs.writeFileSync(path.join(targetDir, 'modules.config.ts'), modulesConfigContent);
      spinner.succeed('Created modules.config.ts');
      spinner.start();
    }

    // Create runtime initialization file
    if (features.includes('runtime')) {
      const runtimeContent = `/**
 * Runtime module initialization
 * This file is imported by the catch-all routes to ensure modules are registered at runtime
 */
import { configureModules } from 'next-modular';
import { modules } from './modules.config';

// Initialize modules for runtime
configureModules({
  modules,
});

export { modules };
`;

      fs.writeFileSync(path.join(targetDir, 'next-modular.runtime.ts'), runtimeContent);
      spinner.succeed('Created next-modular.runtime.ts');
      spinner.start();
    }

    // Update next.config.ts if needed
    const nextConfigPath = path.join(targetDir, 'next.config.ts');
    const nextConfigJsPath = path.join(targetDir, 'next.config.js');
    const nextConfigExists = fs.existsSync(nextConfigPath) || fs.existsSync(nextConfigJsPath);

    if (nextConfigExists) {
      const configPath = fs.existsSync(nextConfigPath) ? nextConfigPath : nextConfigJsPath;
      const configContent = fs.readFileSync(configPath, 'utf8');

      if (!configContent.includes('withNextModular')) {
        console.log(chalk.yellow('\n⚠️  Please update your next.config file:'));
        console.log(chalk.gray(`
import type { NextConfig } from "next";
import { withNextModular } from "next-modular/config";
import { modules } from "./modules.config";

const nextConfig: NextConfig = {
  /* config options here */
};

export default withNextModular({
  modules,
})(nextConfig);
        `));
      }
    }

    spinner.succeed('Next Modular setup complete!');

    console.log(chalk.green.bold('\n✨ Setup complete!\n'));
    console.log(chalk.cyan('Next steps:'));
    console.log(chalk.gray('  1. Add modules with: ') + chalk.white('npx next-modular add'));
    console.log(chalk.gray('  2. Or create a module: ') + chalk.white('npx next-modular create'));
    console.log(chalk.gray('  3. Update next.config.ts as shown above'));
    console.log(chalk.gray('  4. Run: ') + chalk.white('npm install next-modular\n'));

  } catch (error) {
    spinner.fail('Setup failed');
    console.error(chalk.red('\nError:'), error.message);
    process.exit(1);
  }
}

module.exports = init;

