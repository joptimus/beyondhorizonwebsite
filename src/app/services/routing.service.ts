import { Injectable } from '@angular/core';

// ---- Types (exported) ----
export type Hop = {
  from: { id:number; name:string; x:number; y:number; z:number };
  to:   { id:number; name:string; x:number; y:number; z:number };
  distance: number;
};

export type RouteResponse = {
  ok: boolean;
  hops?: Hop[];
  totalDistance?: number;
  expanded?: number;
  error?: string;
};

// ---- Service ----
@Injectable({ providedIn: 'root' })
export class RoutingService {
  private BASE_URL = 'https://game.beyondhorizononline.com/api/game/route';

  private async postJSON(body: any, timeoutMs = 8000, retries = 2) {
    let lastErr: any;
    for (let i = 0; i <= retries; i++) {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), timeoutMs);
      try {
        const res = await fetch(this.BASE_URL, {
          method: 'POST',
          headers: {
            'content-type': 'application/json',
            'accept': 'application/json'
          },
          body: JSON.stringify(body),
          signal: controller.signal,
        });

        const ct = res.headers.get('content-type') || '';
        const text = await res.text();
        if (!res.ok) throw new Error(`HTTP ${res.status}: ${text.slice(0, 300)}`);
        if (ct.includes('application/json')) return JSON.parse(text);
        throw new Error(`Non-JSON response (${ct}): ${text.slice(0, 300)}`);
      } catch (e) {
        lastErr = e;
        await new Promise(r => setTimeout(r, 300 * (i + 1)));
      } finally {
        clearTimeout(timer);
      }
    }
    throw lastErr;
  }

  async findRoute(params: { from:number; to:number; metric?:'2d'|'3d'; shipJumpMax?: number | null; }) {
    const payload = {
      from: Number(params.from),
      to: Number(params.to),
      metric: params.metric ?? '3d',
      shipJumpMax: params.shipJumpMax ?? null
    };
    return this.postJSON(payload) as Promise<RouteResponse>;
  }
}
