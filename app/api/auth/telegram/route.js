export async function POST(request) {
    const backend = process.env.API_BASE
    const body = await request.json()
    const url = backend + '/auth/telegram'
  
    const r = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    })
  
    const data = await r.json()
    return Response.json(data, { status: r.status })
  }