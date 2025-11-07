// src/app/star-map/star-map.page.ts
import { Component, ElementRef, OnDestroy, OnInit, ViewChild, signal, CUSTOM_ELEMENTS_SCHEMA  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RoutingService, RouteResponse } from '../services/routing.service';
import {
  IonHeader, IonToolbar, IonTitle, IonContent,
  IonGrid, IonRow, IonCol,
  IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent,
  IonItem, IonLabel, IonNote, IonInput,
  IonSegment, IonSegmentButton,
  IonButton, IonIcon, IonChip,
} from '@ionic/angular/standalone';

type P = { x:number; y:number; z:number };

@Component({
  standalone: true,
  selector: 'app-star-map',
  imports: [
    CommonModule, FormsModule,
    IonHeader, IonToolbar, IonTitle, IonContent,
    IonGrid, IonRow, IonCol,
    IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent,
    IonItem, IonLabel, IonNote, IonInput,
    IonSegment, IonSegmentButton,
    IonButton, IonIcon, IonChip,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA], 
  templateUrl: './star-map.page.html',
  styleUrls: ['./star-map.page.scss']
})
export class StarMapPage implements OnInit, OnDestroy {
  @ViewChild('canvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;

  fromId = 2244677;
  toId = 9008810;
  shipJumpMax: number | null = null;
  metric: '2d'|'3d' = '3d';

  loading = signal(false);
  error = signal<string | null>(null);
  route = signal<RouteResponse | null>(null);

  // camera
  private ctx!: CanvasRenderingContext2D;
  private w = 800; private h = 500;
  private zoom = 1.0;
  private offsetX = 0; private offsetY = 0;
  private dragging = false; private dragStartX = 0; private dragStartY = 0;
  private lastX = 0; private lastY = 0;

  constructor(private routing: RoutingService) {}

  ngOnInit() {
    const c = this.canvasRef.nativeElement;
    this.ctx = c.getContext('2d')!;
    const resize = () => {
      this.w = c.clientWidth || 800;
      this.h = 500;
      c.width = this.w * devicePixelRatio;
      c.height = this.h * devicePixelRatio;
      this.ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
      this.draw();
    };
    resize();
    window.addEventListener('resize', resize);

    // wheel zoom
    c.addEventListener('wheel', (e) => {
      e.preventDefault();
      const delta = Math.sign(e.deltaY);
      const factor = delta > 0 ? 0.9 : 1.1;
      // zoom relative to cursor
      const rect = c.getBoundingClientRect();
      const cx = e.clientX - rect.left, cy = e.clientY - rect.top;
      const worldBefore = this.screenToWorld(cx, cy);
      this.zoom = Math.max(0.1, Math.min(5, this.zoom * factor));
      const worldAfter = this.screenToWorld(cx, cy);
      this.offsetX += (worldBefore.x - worldAfter.x);
      this.offsetY += (worldBefore.y - worldAfter.y);
      this.draw();
    }, { passive: false });

    // drag pan
    c.addEventListener('mousedown', (e) => {
      this.dragging = true;
      this.dragStartX = e.clientX;
      this.dragStartY = e.clientY;
      this.lastX = this.offsetX;
      this.lastY = this.offsetY;
    });
    window.addEventListener('mouseup', () => { this.dragging = false; });
    window.addEventListener('mousemove', (e) => {
      if (!this.dragging) return;
      const dx = (e.clientX - this.dragStartX) / this.zoom;
      const dy = (e.clientY - this.dragStartY) / this.zoom;
      this.offsetX = this.lastX - dx;
      this.offsetY = this.lastY - dy;
      this.draw();
    });
  }

  ngOnDestroy() { /* no-op */ }

  private worldToScreen(p: P) {
    // project 3D -> 2D top-down (x,z), ignore y for view (we still use full 3D for distance calc)
    const sx = (p.x - this.offsetX) * this.zoom + this.w / 2;
    const sy = (-(p.z) - this.offsetY) * this.zoom + this.h / 2;
    return { x: sx, y: sy };
  }
  private screenToWorld(sx: number, sy: number) {
    return {
      x: (sx - this.w / 2) / this.zoom + this.offsetX,
      y: (sy - this.h / 2) / this.zoom + this.offsetY,
    };
  }

  async run() {
    this.loading.set(true);
    this.error.set(null);
    this.route.set(null);
    try {
      const out = await this.routing.findRoute({
        from: Number(this.fromId),
        to: Number(this.toId),
        metric: this.metric,
        shipJumpMax: this.shipJumpMax ?? null
      });
      if (!out.ok) {
        this.error.set(out.error || 'Route failed');
      }
      this.route.set(out);
      this.centerViewOnRoute();
      this.draw();
    } catch (e: any) {
      this.error.set(e?.message || 'Network error');
    } finally {
      this.loading.set(false);
    }
  }

  private centerViewOnRoute() {
    const r = this.route();
    if (!r?.hops?.length) return;
    // center on midpoint of first hop for a start
    const f = r.hops[0].from, t = r.hops[r.hops.length-1].to;
    const midX = (f.x + t.x) / 2;
    const midZ = (f.z + t.z) / 2;
    this.offsetX = midX;
    this.offsetY = -midZ;
    this.zoom = 0.6;
  }

  private draw() {
    const ctx = this.ctx;
    if (!ctx) return;
    ctx.clearRect(0, 0, this.w, this.h);

    // grid (light)
    ctx.save();
    ctx.strokeStyle = 'rgba(255,255,255,0.05)';
    for (let x = -2000; x <= 2000; x += 200) {
      const s1 = this.worldToScreen({ x, y:0, z: -2000 });
      const s2 = this.worldToScreen({ x, y:0, z:  2000 });
      ctx.beginPath(); ctx.moveTo(s1.x, s1.y); ctx.lineTo(s2.x, s2.y); ctx.stroke();
    }
    for (let z = -2000; z <= 2000; z += 200) {
      const s1 = this.worldToScreen({ x: -2000, y:0, z });
      const s2 = this.worldToScreen({ x:  2000, y:0, z });
      ctx.beginPath(); ctx.moveTo(s1.x, s1.y); ctx.lineTo(s2.x, s2.y); ctx.stroke();
    }
    ctx.restore();

    const r = this.route();
    if (!r?.hops?.length) return;

    // draw lines
    ctx.save();
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#57a6ff';
    ctx.beginPath();
    r.hops.forEach((h, i) => {
      const a = this.worldToScreen(h.from);
      const b = this.worldToScreen(h.to);
      if (i === 0) ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
    });
    ctx.stroke();
    ctx.restore();

    // draw points
    ctx.fillStyle = '#fff';
    r.hops.forEach((h, i) => {
      const a = this.worldToScreen(h.from);
      const b = this.worldToScreen(h.to);
      // from
      ctx.beginPath(); ctx.arc(a.x, a.y, 3.5, 0, Math.PI*2); ctx.fill();
      // to
      ctx.beginPath(); ctx.arc(b.x, b.y, 3.5, 0, Math.PI*2); ctx.fill();

      // labels (light)
      if (i === 0) {
        ctx.fillStyle = '#ccc';
        ctx.fillText(`${h.from.name||h.from.id}`, a.x + 6, a.y - 6);
        ctx.fillStyle = '#fff';
      }
      if (i === r.hops!.length - 1) {
        ctx.fillStyle = '#ccc';
        ctx.fillText(`${h.to.name||h.to.id}`, b.x + 6, b.y - 6);
        ctx.fillStyle = '#fff';
      }
    });
  }
  centerView() {
  this.centerViewOnRoute();
  this.draw();
}

/** Reset pan/zoom to defaults */
resetView() {
  this.zoom = 1.0;
  this.offsetX = 0;
  this.offsetY = 0;
  this.draw();
}

/** Compute tight bounds of the current route in world space (x vs z-plane) */
private getRouteBounds(): { minX: number; maxX: number; minZ: number; maxZ: number } | null {
  const r = this.route();
  if (!r?.hops?.length) return null;

  let minX = Infinity, maxX = -Infinity, minZ = Infinity, maxZ = -Infinity;
  for (const h of r.hops) {
    const pts = [h.from, h.to];
    for (const p of pts) {
      if (p.x < minX) minX = p.x;
      if (p.x > maxX) maxX = p.x;
      if (p.z < minZ) minZ = p.z;
      if (p.z > maxZ) maxZ = p.z;
    }
  }
  return { minX, maxX, minZ, maxZ };
}

/** Fit the whole route into view with a little padding */
fitToRoute() {
  const b = this.getRouteBounds();
  if (!b) return;

  const worldWidth  = Math.max(1, b.maxX - b.minX);
  const worldHeight = Math.max(1, b.maxZ - b.minZ);

  // target zoom so that both dimensions fit, with padding
  const pad = 40; // px padding inside the canvas
  const zx = (this.w - pad * 2) / worldWidth;
  const zy = (this.h - pad * 2) / worldHeight;
  this.zoom = Math.max(0.1, Math.min(5, Math.min(zx, zy)));

  // center on the route bounds center
  const cx = (b.minX + b.maxX) / 2;
  const cz = (b.minZ + b.maxZ) / 2;

  // remember: worldToScreen uses (x, -z) for Y
  this.offsetX = cx;
  this.offsetY = -cz;

  this.draw();
}
}
