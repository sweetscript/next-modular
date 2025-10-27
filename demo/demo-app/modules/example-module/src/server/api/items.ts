/**
 * Item API endpoint - GET /api/example-module/items/[id]
 * Demonstrates dynamic API routes with path parameters
 */
export async function getItemHandler(req: Request, context: { params: { id: string } }) {
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
    name: `Item ${id}`,
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
