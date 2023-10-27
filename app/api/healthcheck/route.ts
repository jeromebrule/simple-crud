import Server from 'next/server';

/**
 * @swagger
 * /api/healthcheck:
 *   get:
 *     description:
 *     responses:
 *       200:
 *         description: Health Check!
 */
export async function GET() {
  const timestamp = new Date().toISOString();
  
  return Server.NextResponse.json({
    message: "API is running smoothly",
    timestamp: timestamp,
    status: 200
  }, { status: 200 });
}
