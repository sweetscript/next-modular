import { NextRequest, NextResponse } from 'next/server';

/**
 * ExampleModule middleware
 */
export async function exampleModuleMiddleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;
  
  // Log requests
  console.log(`[ExampleModule] ${req.method} ${pathname}`);
  
  // Add your middleware logic here
  
  return;
}
