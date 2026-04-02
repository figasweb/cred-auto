interface Env {
  DATA_KV: KVNamespace;
}

const KV_KEY = 'instituicoes';

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const origin = request.headers.get('Origin') || '';

    // CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders(origin) });
    }

    if (request.method !== 'GET') {
      return json({ error: 'Method not allowed' }, 405, origin);
    }

    // Health check
    if (url.pathname === '/health') {
      return json({ status: 'ok' }, 200, origin);
    }

    // GET /api/data — all data or filtered by ?category=novo|usado|eletrico
    if (url.pathname === '/api/data') {
      const raw = await env.DATA_KV.get(KV_KEY, 'text');
      if (!raw) {
        return json({ error: 'No data available' }, 404, origin);
      }

      let data: Record<string, unknown>;
      try {
        data = JSON.parse(raw);
      } catch {
        return json({ error: 'Corrupted data' }, 500, origin);
      }

      const category = url.searchParams.get('category');
      if (category) {
        const categoryData = data[category];
        if (!categoryData) {
          return json({ error: `Category '${category}' not found` }, 404, origin);
        }
        return json(categoryData, 200, origin, 3600);
      }

      return json(data, 200, origin, 3600);
    }

    // GET /api/meta — last update info
    if (url.pathname === '/api/meta') {
      const meta = await env.DATA_KV.get(`${KV_KEY}:meta`, 'text');
      return json(
        meta ? JSON.parse(meta) : { lastUpdate: null },
        200,
        origin,
      );
    }

    return json({ error: 'Not found' }, 404, origin);
  },
};

function corsHeaders(origin: string): Record<string, string> {
  return {
    'Access-Control-Allow-Origin': origin || '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
  };
}

function json(data: unknown, status: number, origin: string, cacheTtl?: number): Response {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...corsHeaders(origin),
  };
  if (cacheTtl && status === 200) {
    headers['Cache-Control'] = `public, max-age=${cacheTtl}`;
  }
  return new Response(JSON.stringify(data), { status, headers });
}
