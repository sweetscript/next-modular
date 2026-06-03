import React from 'react';
import { moduleRegistry, getModuleConfig } from 'next-modular';
import { SitemapXmlRenderer } from '../components/SitemapXmlRenderer';
import { SitemapModuleConfig } from '../index';

interface SitemapUrl {
  loc: string;
  lastmod?: string;
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
}

interface RouteInfo {
  path: string;
  isDynamic: boolean;
  dynamicSegments: string[];
}

export default function SitemapPage() {
  // Get sitemap module configuration
  const sitemapConfig = getModuleConfig<SitemapModuleConfig>('sitemap-module');
  
  // Get all registered modules
  const modules = moduleRegistry.getAllModules();
  
  // Extract all routes from modules
  const routes: RouteInfo[] = [];
  
  for (const module of modules) {
    // Check if module is enabled
    const moduleConfig = module.config;
    if (moduleConfig?.enabled === false) continue;
    if (moduleConfig?.features?.routes === false) continue;
    
    if (!module.routes) continue;
    
    for (const route of module.routes) {
      // Construct full path
      const fullPath = module.basePath === '/' && route.path === '/' 
        ? '/'
        : module.basePath + (route.path === '/' ? '' : route.path);
      
      // Check if route has dynamic segments
      const isDynamic = /\[.*\]/.test(fullPath);
      const dynamicSegments: string[] = [];
      
      if (isDynamic) {
        const matches = fullPath.match(/\[([^\]]+)\]/g);
        if (matches) {
          dynamicSegments.push(...matches.map(m => m.slice(1, -1)));
        }
      }
      
      routes.push({
        path: fullPath,
        isDynamic,
        dynamicSegments,
      });
    }
  }

  // Get base URL from config, environment, or default
  const baseUrl = 
    sitemapConfig?.baseUrl || 
    process.env.NEXT_PUBLIC_SITE_URL || 
    'http://localhost:3000';
  
  // Get defaults from config
  const defaultChangefreq = sitemapConfig?.defaultChangefreq || 'weekly';
  const defaultPriority = sitemapConfig?.defaultPriority ?? 0.8;
  
  // Generate sitemap URLs
  const urls: SitemapUrl[] = [];
  
  // Add homepage if not already included
  const hasHome = routes.some(r => r.path === '/');
  if (!hasHome) {
    urls.push({
      loc: baseUrl + '/',
      lastmod: new Date().toISOString(),
      changefreq: 'daily',
      priority: 1.0,
    });
  }
  
  // Add all static routes
  for (const route of routes) {
    if (route.isDynamic) {
      // Handle dynamic routes if configuration is provided
      if (sitemapConfig?.dynamicRoutes) {
        const expandedUrls = expandDynamicRoute(
          route.path,
          route.dynamicSegments,
          sitemapConfig.dynamicRoutes
        );
        
        for (const expandedPath of expandedUrls) {
          urls.push({
            loc: baseUrl + expandedPath,
            lastmod: new Date().toISOString(),
            changefreq: defaultChangefreq,
            priority: defaultPriority,
          });
        }
      }
      continue;
    }
    
    urls.push({
      loc: baseUrl + route.path,
      lastmod: new Date().toISOString(),
      changefreq: defaultChangefreq,
      priority: route.path === '/' ? 1.0 : defaultPriority,
    });
  }
  
  // Sort URLs by priority (descending) and then by path
  urls.sort((a, b) => {
    if (a.priority !== b.priority) {
      return (b.priority || 0) - (a.priority || 0);
    }
    return a.loc.localeCompare(b.loc);
  });

  return <SitemapXmlRenderer urls={urls} routes={routes} />;
}

/**
 * Expand a dynamic route pattern with provided values
 * Example: expandDynamicRoute('/blog/[slug]', ['slug'], { '[slug]': ['post-1', 'post-2'] })
 * Returns: ['/blog/post-1', '/blog/post-2']
 */
function expandDynamicRoute(
  pattern: string,
  segments: string[],
  dynamicValues: Record<string, string[]>
): string[] {
  // Find the first dynamic segment that has values
  const segment = segments.find(seg => {
    const key = `[${seg}]`;
    return dynamicValues[key] && dynamicValues[key].length > 0;
  });
  
  if (!segment) {
    return [];
  }
  
  const key = `[${segment}]`;
  const values = dynamicValues[key];
  
  // Replace the segment with each value
  return values.map(value => pattern.replace(key, value));
}
