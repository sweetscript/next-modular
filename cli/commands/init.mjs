import fs from 'fs';
import path from 'path';
import inquirer from 'inquirer';
import chalk from 'chalk';
import ora from 'ora';
import { execSync } from 'child_process';

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
    
    if (!options.yes) {
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
    } else {
      console.log(chalk.yellow('Continuing anyway (--yes mode)...\n'));
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
  let features;
  
  if (options.yes) {
    // Install everything in non-interactive mode
    features = ['catchAllRoute', 'catchAllApi', 'middleware', 'modulesConfig', 'runtime'];
    console.log(chalk.cyan('Installing all features (--yes mode)...\n'));
  } else {
    const response = await inquirer.prompt([
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
    features = response.features;
  }

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
 * Module configuration
 * Add your list of modules here to use in your project
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

    // Create modules directory
    const modulesDir = path.join(targetDir, 'modules');
    if (!fs.existsSync(modulesDir)) {
      fs.mkdirSync(modulesDir, { recursive: true });
      // Create .gitkeep to ensure the directory is tracked by git
      fs.writeFileSync(path.join(modulesDir, '.gitkeep'), '');
      spinner.succeed('Created modules directory');
      spinner.start();
    }

    spinner.succeed('Next Modular setup complete!');

    // Install next-modular package
    spinner.start('Installing next-modular package...');
    
    try {
      // Detect package manager
      const packageManager = fs.existsSync(path.join(targetDir, 'package-lock.json'))
        ? 'npm'
        : fs.existsSync(path.join(targetDir, 'yarn.lock'))
        ? 'yarn'
        : fs.existsSync(path.join(targetDir, 'pnpm-lock.yaml'))
        ? 'pnpm'
        : 'npm';

      const installCmd = packageManager === 'npm'
        ? 'npm install next-modular'
        : packageManager === 'yarn'
        ? 'yarn add next-modular'
        : 'pnpm add next-modular';

      execSync(installCmd, { cwd: targetDir, stdio: 'inherit' });
      spinner.succeed('Installed next-modular package');
    } catch (installError) {
      spinner.fail('Failed to install next-modular package');
      console.log(chalk.yellow('Please install manually: ') + chalk.white('npm install next-modular'));
      console.log(chalk.gray('Error: ') + installError.message);
    }

    console.log(chalk.green.bold('\n✨ Setup complete!\n'));
    console.log(chalk.cyan('Next steps:'));
    console.log(chalk.gray('  1. Add modules with: ') + chalk.white('npx next-modular add'));
    console.log(chalk.gray('  2. Or create a module: ') + chalk.white('npx next-modular create\n'));

  } catch (error) {
    spinner.fail('Setup failed');
    console.error(chalk.red('\nError:'), error.message);
    process.exit(1);
  }
}

export default init;

