export async function GET(request) {
  const backend = process.env.API_BASE
  const { searchParams } = new URL(request.url)
  const qs = searchParams.toString()
  const url = backend + '/products?' + qs

  const r = await fetch(url, { cache: 'no-store' })
  const data = await r.json()

  return Response.json(data, { status: r.status })
}