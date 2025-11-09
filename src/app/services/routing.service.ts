import { Injectable } from '@angular/core';

// ---- Types (exported) ----
export type Hop = {
  from: { id:number; name:string; x:number; y:number; z:number };
  to:   { id:number; name:string; x:number; y:number; z:number };
  distance: number;
};

export type RouteResponse = {
  ok: boolean;
  optimize?: 'distance' | 'hops';
  metric?: '2d' | '3d';
  maxEdgeLength?: number | null;
  hopCount?: number;
  hops?: Hop[];
  totalDistance?: number;
  expanded?: number;
  error?: string;
};

export type RouteOptions = {
  metric?: '2d' | '3d';
  shipJumpMax?: number | null;        // maps to server's maxEdgeLength
  optimize?: 'distance' | 'hops';     // 'hops' = fewest jumps
  timeoutMs?: number;
  retries?: number;
};

// ---- Service ----
@Injectable({ providedIn: 'root' })
export class RoutingService {
  // FIXED: This is the complete endpoint URL - no path appending needed
  private BASE_URL = 'https://game.beyondhorizononline.com/api/game/route';

  private async postJSON<T>(body: any, opts?: { timeoutMs?: number; retries?: number }): Promise<T> {
    const timeoutMs = opts?.timeoutMs ?? 8000;
    const retries   = opts?.retries   ?? 2;

    let lastErr: any;
    for (let i = 0; i <= retries; i++) {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), timeoutMs);
      try {
        console.log('[RoutingService] Calling:', this.BASE_URL);
        console.log('[RoutingService] Body:', body);
        
        const res = await fetch(this.BASE_URL, {
          method: 'POST',
          headers: {
            'content-type': 'application/json',
            'accept': 'application/json',
          },
          body: JSON.stringify(body),
          signal: controller.signal,
        });

        console.log('[RoutingService] Response status:', res.status, res.statusText);
        
        const ct = res.headers.get('content-type') || '';
        const text = await res.text();
        
        console.log('[RoutingService] Response body:', text.slice(0, 500));
        
        if (!res.ok) {
          console.error('[RoutingService] HTTP Error:', res.status, text);
          throw new Error(`HTTP ${res.status}: ${text.slice(0, 300)}`);
        }
        
        if (ct.includes('application/json')) {
          const parsed = JSON.parse(text) as T;
          console.log('[RoutingService] Success:', parsed);
          return parsed;
        }
        
        throw new Error(`Non-JSON response (${ct}): ${text.slice(0, 300)}`);
      } catch (e) {
        console.error('[RoutingService] Attempt', i + 1, 'failed:', e);
        lastErr = e;
        if (i < retries) {
          await new Promise(r => setTimeout(r, 300 * (i + 1)));
        }
      } finally {
        clearTimeout(timer);
      }
    }
    throw lastErr;
  }

  /**
   * General route finder.
   * - For automated routing, prefer optimize:'hops' and metric:'3d'
   */
  async findRoute(params: { from:number; to:number } & RouteOptions): Promise<RouteResponse> {
    const payload = {
      from: Number(params.from),
      to:   Number(params.to),
      metric: params.metric ?? '3d',
      shipJumpMax: params.shipJumpMax ?? null,  // FIXED: Use shipJumpMax directly
      optimize: params.optimize ?? 'distance'
    };
    
    console.log('[RoutingService] findRoute called with:', payload);
    
    return this.postJSON<RouteResponse>(
      payload,
      { timeoutMs: params.timeoutMs, retries: params.retries }
    );
  }

  /**
   * Convenience: fewest jumps subject to shipJumpMax.
   */
  async findFewestJumps(from: number, to: number, shipJumpMax: number, opts?: Omit<RouteOptions,'shipJumpMax'|'optimize'>): Promise<RouteResponse> {
    return this.findRoute({
      from, to,
      metric: opts?.metric ?? '3d',
      shipJumpMax,
      optimize: 'hops',
      timeoutMs: opts?.timeoutMs,
      retries: opts?.retries
    });
  }
}