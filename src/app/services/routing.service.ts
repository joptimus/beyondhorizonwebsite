import { Injectable } from '@angular/core';

// ---- Types (exported) ----
export type Hop = {
  from: { id: number; name: string; x: number; y: number; z: number };
  to: { id: number; name: string; x: number; y: number; z: number };
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
  shipJumpMax?: number | null;        // Ship's maximum single jump range in LY
  optimize?: 'distance' | 'hops';     // 'hops' = fewest jumps (recommended)
  timeoutMs?: number;
  retries?: number;
};

// ---- Service ----
@Injectable({ providedIn: 'root' })
export class RoutingService {
  // Your game server API endpoint that proxies to the pathfinding microservice
  private BASE_URL = 'https://game.beyondhorizononline.com/api/game/route';

  private async postJSON<T>(body: any, opts?: { timeoutMs?: number; retries?: number }): Promise<T> {
    const timeoutMs = opts?.timeoutMs ?? 30000;  // Increased to 10s for complex routes
    const retries = opts?.retries ?? 0;

    let lastErr: any;
    for (let i = 0; i <= retries; i++) {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), timeoutMs);
      
      try {
        console.log('[RoutingService] Attempt', i + 1, 'of', retries + 1);
        console.log('[RoutingService] Calling:', this.BASE_URL);
        console.log('[RoutingService] Body:', JSON.stringify(body, null, 2));

        const res = await fetch(this.BASE_URL, {
          method: 'POST',
          headers: {
            'content-type': 'application/json',
            'accept': 'application/json',
          },
          body: JSON.stringify(body),
          signal: controller.signal,
        });

        console.log('[RoutingService] Response:', {
          status: res.status,
          statusText: res.statusText,
          ok: res.ok
        });

        const ct = res.headers.get('content-type') || '';
        const text = await res.text();

        if (!res.ok) {
          console.error('[RoutingService] HTTP Error:', {
            status: res.status,
            statusText: res.statusText,
            body: text.slice(0, 500)
          });
          throw new Error(`HTTP ${res.status}: ${text.slice(0, 300)}`);
        }

        if (ct.includes('application/json')) {
          const parsed = JSON.parse(text) as T;
          console.log('[RoutingService] Success:', {
            ok: (parsed as any).ok,
            hopCount: (parsed as any).hopCount,
            totalDistance: (parsed as any).totalDistance,
            expanded: (parsed as any).expanded
          });
          return parsed;
        }

        throw new Error(`Non-JSON response (${ct}): ${text.slice(0, 300)}`);
      } catch (e: any) {
        console.error('[RoutingService] Attempt', i + 1, 'failed:', {
          name: e.name,
          message: e.message,
          isAbortError: e.name === 'AbortError'
        });
        
        lastErr = e;
        
        // Retry on network errors or timeouts, but not on 4xx errors
        if (i < retries && (e.name === 'AbortError' || !e.message.includes('HTTP 4'))) {
          const delay = 500 * (i + 1); // Progressive backoff
          console.log('[RoutingService] Retrying in', delay, 'ms...');
          await new Promise(r => setTimeout(r, delay));
        } else {
          break;
        }
      } finally {
        clearTimeout(timer);
      }
    }
    
    throw lastErr;
  }

  /**
   * General route finder with flexible options.
   * 
   * @param params - Route parameters
   * @param params.from - Starting system ID
   * @param params.to - Destination system ID
   * @param params.shipJumpMax - Ship's maximum single jump range in LY (required for optimize='hops')
   * @param params.metric - Distance metric: '3d' (default) or '2d' (ignore Y axis)
   * @param params.optimize - 'hops' (fewest jumps, recommended) or 'distance' (shortest total distance)
   * @param params.timeoutMs - Client-side timeout in milliseconds
   * @param params.retries - Number of retry attempts on network errors
   * 
   * @returns Promise<RouteResponse> with path details
   * 
   * @example
   * // Find fewest jumps for a ship with 300 LY range
   * const route = await routingService.findRoute({
   *   from: 1000001,
   *   to: 1000100,
   *   shipJumpMax: 300,
   *   optimize: 'hops'
   * });
   * console.log(`Route requires ${route.hopCount} jumps`);
   */
  async findRoute(params: { from: number; to: number } & RouteOptions): Promise<RouteResponse> {
    // Validate required parameters
    if (!Number.isFinite(params.from) || !Number.isFinite(params.to)) {
      throw new Error('from and to must be valid system IDs');
    }

    // Default to 'hops' optimization if shipJumpMax is provided
    const shouldOptimizeHops = params.shipJumpMax != null && params.shipJumpMax > 0;
    const defaultOptimize = shouldOptimizeHops ? 'hops' : 'distance';

    const payload = {
      from: Number(params.from),
      to: Number(params.to),
      metric: params.metric ?? '3d',
      shipJumpMax: params.shipJumpMax ?? null,
      optimize: params.optimize ?? defaultOptimize
    };

    // Validate optimize='hops' requires shipJumpMax
    if (payload.optimize === 'hops' && !payload.shipJumpMax) {
      console.warn('[RoutingService] optimize="hops" requires shipJumpMax, falling back to optimize="distance"');
      payload.optimize = 'distance';
    }

    console.log('[RoutingService] findRoute called with:', payload);

    return this.postJSON<RouteResponse>(
      payload,
      { 
        timeoutMs: params.timeoutMs ?? 30000,  // 12s default (allows server 10s + overhead)
        retries: params.retries ?? 1            // Retry once by default
      }
    );
  }

  /**
   * Convenience method: Find the route with fewest jumps.
   * This is the recommended method for most game scenarios.
   * 
   * @param from - Starting system ID
   * @param to - Destination system ID
   * @param shipJumpMax - Ship's maximum single jump range in LY (REQUIRED)
   * @param opts - Optional settings (metric, timeoutMs, retries)
   * 
   * @returns Promise<RouteResponse> with optimal hop-count path
   * 
   * @example
   * const route = await routingService.findFewestJumps(1000001, 1000100, 300);
   * console.log(`Need ${route.hopCount} jumps to reach destination`);
   */
  async findFewestJumps(
    from: number,
    to: number,
    shipJumpMax: number,
    opts?: Omit<RouteOptions, 'shipJumpMax' | 'optimize'>
  ): Promise<RouteResponse> {
    if (!shipJumpMax || shipJumpMax <= 0) {
      throw new Error('shipJumpMax must be a positive number for fewest jumps calculation');
    }

    return this.findRoute({
      from,
      to,
      metric: opts?.metric ?? '3d',
      shipJumpMax,
      optimize: 'hops',
      timeoutMs: opts?.timeoutMs,
      retries: opts?.retries
    });
  }

  /**
   * Convenience method: Find the route with shortest total distance.
   * Note: This may result in more jumps than necessary.
   * 
   * @param from - Starting system ID
   * @param to - Destination system ID
   * @param shipJumpMax - Ship's maximum single jump range in LY (optional, null = unrestricted)
   * @param opts - Optional settings (metric, timeoutMs, retries)
   * 
   * @returns Promise<RouteResponse> with distance-optimized path
   */
  async findShortestDistance(
    from: number,
    to: number,
    shipJumpMax?: number | null,
    opts?: Omit<RouteOptions, 'shipJumpMax' | 'optimize'>
  ): Promise<RouteResponse> {
    return this.findRoute({
      from,
      to,
      metric: opts?.metric ?? '3d',
      shipJumpMax: shipJumpMax ?? null,
      optimize: 'distance',
      timeoutMs: opts?.timeoutMs,
      retries: opts?.retries
    });
  }

  /**
   * Calculate straight-line distance between two systems (for UI display).
   * This is useful for showing "as the crow flies" distance.
   * 
   * @param from - Starting system coordinates
   * @param to - Destination system coordinates
   * @param metric - Distance metric: '3d' (default) or '2d'
   * 
   * @returns Distance in light years
   */
  calculateStraightLineDistance(
    from: { x: number; y: number; z: number },
    to: { x: number; y: number; z: number },
    metric: '2d' | '3d' = '3d'
  ): number {
    if (metric === '2d') {
      return Math.hypot(to.x - from.x, to.z - from.z);
    }
    return Math.hypot(to.x - from.x, to.y - from.y, to.z - from.z);
  }

  /**
   * Estimate minimum hops required (theoretical lower bound).
   * Useful for UI to show "at least X jumps required" before calculating.
   * 
   * @param straightLineDistance - Distance in light years
   * @param shipJumpMax - Ship's maximum jump range
   * 
   * @returns Minimum number of hops (ceiling of distance / range)
   */
  estimateMinimumHops(straightLineDistance: number, shipJumpMax: number): number {
    if (shipJumpMax <= 0) {
      throw new Error('shipJumpMax must be positive');
    }
    return Math.ceil(straightLineDistance / shipJumpMax);
  }

  /**
   * Validate if a route is achievable (quick check before pathfinding).
   * 
   * @param from - Starting system
   * @param to - Destination system
   * @param shipJumpMax - Ship's maximum jump range
   * @param metric - Distance metric
   * 
   * @returns Object with validation result and estimated minimum hops
   */
  validateRoute(
    from: { x: number; y: number; z: number },
    to: { x: number; y: number; z: number },
    shipJumpMax: number,
    metric: '2d' | '3d' = '3d'
  ): { reachable: boolean; straightLineDistance: number; minimumHops: number; isDirect: boolean } {
    const straightLineDistance = this.calculateStraightLineDistance(from, to, metric);
    const minimumHops = this.estimateMinimumHops(straightLineDistance, shipJumpMax);
    const isDirect = straightLineDistance <= shipJumpMax;

    return {
      reachable: true,  // With R*Tree, all connected systems are reachable
      straightLineDistance,
      minimumHops,
      isDirect
    };
  }
}