export async function GET() {
    const backend = process.env.API_BASE;
    const url = backend + '/categories';

    try {
        const r = await fetch(url, { cache: 'no-store' });

        if (!r.ok) {
            return Response.json({ error: `Failed to fetch categories: ${r.statusText}` }, { status: r.status });
        }

        const data = await r.json();
        return Response.json(data, { status: r.status });
    } catch (error) {
        return Response.json({ error: `An unexpected error occurred: ${error.message}` }, { status: 500 });
    }
}