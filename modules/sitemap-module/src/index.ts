import { defineModule } from 'next-modular';
import SitemapPage from './routes/sitemap';

export interface SitemapModuleConfig {
  /**
   * Base URL for the sitemap (e.g., 'https://example.com')
   * If not provided, falls back to NEXT_PUBLIC_SITE_URL env variable
   */
  baseUrl?: string;
  
  /**
   * Dynamic route values to include in the sitemap
   * Example: { '[id]': ['123', '456'], '[slug]': ['about', 'contact'] }
   */
  dynamicRoutes?: Record<string, string[]>;
  
  /**
   * Default change frequency for routes
   */
  defaultChangefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  
  /**
   * Default priority for routes (0.0 to 1.0)
   */
  defaultPriority?: number;
}

/**
 * Sitemap Module Definition
 * 
 * Automatically generates a sitemap by discovering all routes from registered modules
 * in your Next Modular application.
 * 
 * Configure this module in modules.config.ts:
 * 
 * import { sitemapModule } from './modules/sitemap-module/src';
 * 
 * export const modules = [
 *   // Basic usage - automatically discovers all static routes
 *   sitemapModule,
 *   
 *   // With custom base URL and defaults
 *   sitemapModule({
 *     baseUrl: 'https://example.com',
 *     defaultChangefreq: 'daily',
 *     defaultPriority: 0.8,
 *   }),
 *   
 *   // Include dynamic routes by providing values
 *   sitemapModule({
 *     baseUrl: 'https://example.com',
 *     dynamicRoutes: {
 *       '[id]': ['123', '456', '789'],           // For routes like /items/[id]
 *       '[slug]': ['about', 'contact', 'blog'],  // For routes like /[slug]
 *     },
 *   }),
 * ];
 * 
 * Features:
 * - Automatically discovers all routes from all registered modules
 * - Generates standard sitemap.xml format
 * - Supports dynamic route expansion via configuration
 * - Respects module enabled/disabled states
 * - Download and copy-to-clipboard functionality
 * 
 * Environment Variables:
 * - NEXT_PUBLIC_SITE_URL: Default base URL if not specified in config
 */
export const sitemapModule = defineModule<SitemapModuleConfig>({
  name: 'sitemap-module',
  basePath: '/sitemap',
  routes: [
    {
      path: '/',
      component: SitemapPage,
    }
  ],
  apiRoutes: [],
});

export default sitemapModule;
