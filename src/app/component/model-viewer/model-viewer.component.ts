import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild,
  Input,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonCard, IonCardContent, IonSpinner } from '@ionic/angular/standalone';


import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

@Component({
  standalone: true,
  selector: 'bh-model-viewer',
  templateUrl: './model-viewer.component.html',
  styleUrls: ['./model-viewer.component.scss'],
  imports: [CommonModule, IonCard, IonCardContent, IonSpinner],
})
export class ModelViewerComponent implements AfterViewInit, OnDestroy {
  @ViewChild('canvas', { static: true })
  canvasRef!: ElementRef<HTMLCanvasElement>;

  /** Path to the GLB file (relative to /assets). */
  @Input() src = 'assets/models/vulcan.glb';
  isLoading = true;   // 👈 NEW
  private renderer: any;
  private scene: any;
  private camera: any;
  private controls: any;
  private model: any;

ngAfterViewInit(): void {
  // Wait for Ionic/Angular to finish layout so canvas has real size
  requestAnimationFrame(() => {
    this.initThree();
    this.loadModel();
    window.addEventListener('resize', this.onResize);

    // Force one correct resize AFTER everything is ready
    this.onResize();
  });
}

  ngOnDestroy(): void {
    window.removeEventListener('resize', this.onResize);
    if (this.controls) {
      this.controls.removeEventListener('change', this.renderScene);
      this.controls.dispose();
    }
    if (this.renderer) {
      this.renderer.dispose();
    }
  }

  // ---------------------------------------------------------------------
  // THREE SETUP (scene, camera, renderer, controls)
  // ---------------------------------------------------------------------
  private initThree(): void {
  const canvas = this.canvasRef.nativeElement;

  // --- RENDERER -------------------------------------------------
  this.renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
  });
  this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // Color / tone mapping – makes PBR glTF look right
  this.renderer.outputEncoding = THREE.sRGBEncoding;
  this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
  this.renderer.toneMappingExposure = 3.6; // bump this if still too dark

  const width = canvas.clientWidth || canvas.parentElement?.clientWidth || 400;
  const height = canvas.clientHeight || 300;
  this.renderer.setSize(width, height, false);

  // --- SCENE ----------------------------------------------------
  this.scene = new THREE.Scene();
  this.scene.background = null; // keep page background

  // --- CAMERA ---------------------------------------------------
  this.camera = new THREE.PerspectiveCamera(45, width / height, 0.25, 5000);
  this.camera.position.set(-1.8, 0.8, 3.2);
  this.camera.lookAt(0, 0, 0);

  // --- LIGHTING: strong 3-point rig ------------------------------
  // Ambient fill – lifts all dark areas a bit
  const ambient = new THREE.AmbientLight(0xffffff, 0.6);
  this.scene.add(ambient);

  // Key light from front-left
  const key = new THREE.DirectionalLight(0xffffff, 2.4);
  key.position.set(-5, 8, 10);
  this.scene.add(key);

  // Fill light from front-right, softer
  const fill = new THREE.DirectionalLight(0xffffff, 1.4);
  fill.position.set(6, 4, 6);
  this.scene.add(fill);

  // Rim light from behind to outline silhouette
  const rim = new THREE.DirectionalLight(0xffffff, 1.2);
  rim.position.set(0, 6, -10);
  this.scene.add(rim);

  // --- ORBIT CONTROLS -------------------------------------------
  this.controls = new OrbitControls(this.camera, canvas);
  this.controls.enableDamping = false;
  this.controls.minDistance = 50;
  this.controls.maxDistance = 2000;
  this.controls.addEventListener('change', this.renderScene);

  this.renderScene();
}

  // ---------------------------------------------------------------------
  // LOAD MODEL
  // ---------------------------------------------------------------------
  private loadModel(): void {
    const loader = new GLTFLoader();
    console.log('[ModelViewer] Loading model from', this.src);
    this.isLoading = true;
    loader.load(
      this.src,
      (gltf: any) => {
        this.model = gltf.scene;

        // Use original materials – no debug overrides
        this.scene.add(this.model);


        // Frame camera & controls around the model
        this.frameCameraToObject(this.model);
        this.isLoading = false;
        // Render once after load
        this.renderScene();
      },
      undefined,
      (err: any) => {console.error('[ModelViewer] Error loading GLB:', err);
      this.isLoading = false;
      this.renderScene();
      }
    );
  }

  // Center camera / controls on the model like the example
private frameCameraToObject(object: any): void {
  const box = new THREE.Box3().setFromObject(object);
  const size = box.getSize(new THREE.Vector3());
  const center = box.getCenter(new THREE.Vector3());

  const maxDim = Math.max(size.x, size.y, size.z);
  const fitDistance = maxDim * 1.8;

  // 3/4 top-left view
  const dir = new THREE.Vector3(-1, 1.6, 1.5).normalize();
  const newPos = center.clone().add(dir.multiplyScalar(fitDistance));

  this.camera.position.copy(newPos);
  this.camera.near = maxDim / 100;
  this.camera.far = maxDim * 50;
  this.camera.updateProjectionMatrix();
  this.camera.lookAt(center);

  if (this.controls) {
    this.controls.target.copy(center);
    this.controls.minDistance = maxDim * 0.6;
    this.controls.maxDistance = maxDim * 5;
    this.controls.update();
  }

  this.renderScene();
}


  // ---------------------------------------------------------------------
  // RENDER & RESIZE (no animation loop)
  // ---------------------------------------------------------------------
  private renderScene = () => {
    if (!this.renderer || !this.scene || !this.camera) return;
    this.renderer.render(this.scene, this.camera);
  };

private onResize = () => {
  if (!this.renderer || !this.camera) return;

  const canvas = this.canvasRef.nativeElement;
  const parent = canvas.parentElement;

  const width = parent?.clientWidth || canvas.clientWidth || 400;
  const height = parent?.clientHeight || canvas.clientHeight || 300;

  this.renderer.setSize(width, height, false);
  this.camera.aspect = width / height;
  this.camera.updateProjectionMatrix();

  this.renderScene();
};
}
