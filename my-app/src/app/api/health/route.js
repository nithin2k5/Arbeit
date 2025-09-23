export async function GET() {
  return Response.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'arbeit-frontend',
    version: '1.0.0'
  });
}
