// Minimal "three" typing: treat everything as any, but allow `import * as THREE from 'three'`
declare module 'three' {
  const three: any;
  export = three;
}

// GLTFLoader is a *named export*, not default
declare module 'three/examples/jsm/loaders/GLTFLoader.js' {
  export class GLTFLoader {
    constructor(...args: any[]);
    load(
      url: string,
      onLoad?: (gltf: any) => void,
      onProgress?: (event: any) => void,
      onError?: (event: any) => void
    ): void;
  }
}
declare module 'three/examples/jsm/controls/OrbitControls.js' {
  export class OrbitControls {
    constructor(object: any, domElement?: any);
    target: any;
    minDistance: number;
    maxDistance: number;
    enableDamping: boolean;
    update(): void;
    dispose(): void;
    addEventListener(type: string, listener: (...args: any[]) => void): void;
    removeEventListener(type: string, listener: (...args: any[]) => void): void;
  }
}
