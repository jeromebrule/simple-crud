import Server from 'next/server';

/**
 * @swagger
 * /api:
 *   get:
 *     summary: API Health Check!
 *     description: API Health Check!
 *     responses:
 *       200:
 *         description: Up and Running!
 */
export async function GET() {
  const timestamp = new Date().toISOString();
  
  return Server.NextResponse.json({
    message: "API is running smoothly",
    timestamp: timestamp,
    status: 200
  }, { status: 200 });
}
