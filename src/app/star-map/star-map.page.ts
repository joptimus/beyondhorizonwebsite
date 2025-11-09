import {
  Component, ElementRef, OnDestroy, OnInit, ViewChild,
  signal, CUSTOM_ELEMENTS_SCHEMA
} from '@angular/core';
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

type P = { x: number; y: number; z: number };

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
  metric: '2d' | '3d' = '3d';
  optimize: 'distance' | 'hops' = 'distance';
  apiKey: string = ''; // optional

  loading = signal(false);
  error = signal<string | null>(null);
  route = signal<RouteResponse | null>(null);

  // canvas/camera
  private ctx!: CanvasRenderingContext2D;
  private w = 800; private h = 500;
  private dpr = 1;
  private zoom = 1.0;
  private offsetX = 0; private offsetY = 0;
  private dragging = false; private dragStartX = 0; private dragStartY = 0;
  private lastX = 0; private lastY = 0;

  // listeners to clean up
  private onResize = () => {};
  private onWheel = (e: WheelEvent) => {};
  private onMouseDown = (e: MouseEvent) => {};
  private onMouseUp = (e: MouseEvent) => {};
  private onMouseMove = (e: MouseEvent) => {};

  constructor(private routing: RoutingService) {}

  ngOnInit() {
    const c = this.canvasRef.nativeElement;
    this.ctx = c.getContext('2d')!;

    const resize = () => {
      this.w = c.clientWidth || 800;
      this.h = 500; // adjust if you want responsive height
      this.dpr = Math.max(1, window.devicePixelRatio || 1);
      c.width = Math.max(1, Math.floor(this.w * this.dpr));
      c.height = Math.max(1, Math.floor(this.h * this.dpr));
      this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
      this.draw();
    };
    this.onResize = resize;
    resize();
    window.addEventListener('resize', this.onResize);

    // wheel zoom (cursor-anchored)
    this.onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const delta = Math.sign(e.deltaY);
      const factor = delta > 0 ? 0.9 : 1.1;

      const rect = c.getBoundingClientRect();
      const cx = e.clientX - rect.left;
      const cy = e.clientY - rect.top;

      const before = this.screenToWorld(cx, cy);
      this.zoom = Math.max(0.1, Math.min(5, this.zoom * factor));
      const after = this.screenToWorld(cx, cy);

      // keep point under cursor stable
      this.offsetX += (before.x - after.x);
      this.offsetY += (after.z - before.z); // note sign due to -(z) mapping

      this.draw();
    };
    c.addEventListener('wheel', this.onWheel, { passive: false });

    // drag to pan
    this.onMouseDown = (e: MouseEvent) => {
      this.dragging = true;
      this.dragStartX = e.clientX;
      this.dragStartY = e.clientY;
      this.lastX = this.offsetX;
      this.lastY = this.offsetY;
    };
    this.onMouseUp = () => { this.dragging = false; };
    this.onMouseMove = (e: MouseEvent) => {
      if (!this.dragging) return;
      const dx = (e.clientX - this.dragStartX) / this.zoom;
      const dy = (e.clientY - this.dragStartY) / this.zoom;
      this.offsetX = this.lastX - dx;
      this.offsetY = this.lastY - dy;
      this.draw();
    };

    c.addEventListener('mousedown', this.onMouseDown);
    window.addEventListener('mouseup', this.onMouseUp);
    window.addEventListener('mousemove', this.onMouseMove);
  }

  ngOnDestroy() {
    const c = this.canvasRef?.nativeElement;
    if (c) {
      c.removeEventListener('wheel', this.onWheel as any);
      c.removeEventListener('mousedown', this.onMouseDown as any);
    }
    window.removeEventListener('resize', this.onResize as any);
    window.removeEventListener('mouseup', this.onMouseUp as any);
    window.removeEventListener('mousemove', this.onMouseMove as any);
  }

  private worldToScreen(p: P) {
    // project 3D -> 2D top-down (x vs z). y ignored for view.
    const sx = (p.x - this.offsetX) * this.zoom + this.w / 2;
    const sy = (-(p.z) - this.offsetY) * this.zoom + this.h / 2;
    return { x: sx, y: sy };
  }

  private screenToWorld(sx: number, sy: number): { x: number; z: number } {
    const x = (sx - this.w / 2) / this.zoom + this.offsetX;
    const z = -((sy - this.h / 2) / this.zoom + this.offsetY);
    return { x, z };
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
        shipJumpMax: this.shipJumpMax ?? null,
        optimize: this.optimize,
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

  /** Center on the midpoint between first-from and last-to */
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

  /** Fit the whole route into view with padding */
  fitToRoute() {
    const b = this.getRouteBounds();
    if (!b) return;

    const worldWidth = Math.max(1, b.maxX - b.minX);
    const worldHeight = Math.max(1, b.maxZ - b.minZ);

    const pad = 40; // px
    const zx = (this.w - pad * 2) / worldWidth;
    const zy = (this.h - pad * 2) / worldHeight;
    this.zoom = Math.max(0.1, Math.min(5, Math.min(zx, zy)));

    const cx = (b.minX + b.maxX) / 2;
    const cz = (b.minZ + b.maxZ) / 2;
    this.offsetX = cx;
    this.offsetY = -cz;

    this.draw();
  }

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

  private centerViewOnRoute() {
    const r = this.route();
    if (!r?.hops?.length) return;
    const f = r.hops[0].from;
    const t = r.hops[r.hops.length - 1].to;
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

    // grid
    ctx.save();
    ctx.strokeStyle = 'rgba(255,255,255,0.06)';
    for (let x = -2000; x <= 2000; x += 200) {
      const s1 = this.worldToScreen({ x, y: 0, z: -2000 });
      const s2 = this.worldToScreen({ x, y: 0, z: 2000 });
      ctx.beginPath(); ctx.moveTo(s1.x, s1.y); ctx.lineTo(s2.x, s2.y); ctx.stroke();
    }
    for (let z = -2000; z <= 2000; z += 200) {
      const s1 = this.worldToScreen({ x: -2000, y: 0, z });
      const s2 = this.worldToScreen({ x: 2000, y: 0, z });
      ctx.beginPath(); ctx.moveTo(s1.x, s1.y); ctx.lineTo(s2.x, s2.y); ctx.stroke();
    }
    ctx.restore();

    const r = this.route();
    if (!r?.hops?.length) return;

    // route polyline
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

    // points + labels
    ctx.fillStyle = '#fff';
    r.hops.forEach((h, i) => {
      const a = this.worldToScreen(h.from);
      const b = this.worldToScreen(h.to);
      ctx.beginPath(); ctx.arc(a.x, a.y, 3.5, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(b.x, b.y, 3.5, 0, Math.PI * 2); ctx.fill();

      if (i === 0) {
        ctx.fillStyle = '#ccc';
        ctx.fillText(`${h.from.name || h.from.id}`, a.x + 6, a.y - 6);
        ctx.fillStyle = '#fff';
      }
      if (i === r.hops!.length - 1) {
        ctx.fillStyle = '#ccc';
        ctx.fillText(`${h.to.name || h.to.id}`, b.x + 6, b.y - 6);
        ctx.fillStyle = '#fff';
      }
    });
  }
}
