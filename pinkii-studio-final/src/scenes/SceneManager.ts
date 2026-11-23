import * as THREE from 'three';
import { WorldId, WORLDS } from '../types';
import { DollhouseWorld } from './DollhouseWorld';
import { GardenWorld } from './GardenWorld';
import { TeddyWorld } from './TeddyWorld';
import { CafeWorld } from './CafeWorld';
import { soundEngine } from '../audio/soundEffects';

export class SceneManager {
  public container: HTMLElement;
  public scene: THREE.Scene;
  public camera: THREE.PerspectiveCamera;
  public renderer: THREE.WebGLRenderer;

  public dollhouseWorld: DollhouseWorld;
  public gardenWorld: GardenWorld;
  public teddyWorld: TeddyWorld;
  public cafeWorld: CafeWorld;

  public currentWorldId: WorldId = 'dollhouse';

  // Camera targets & smooth damping
  private cameraTargetPos = new THREE.Vector3(3.2, 2.8, 4.2);
  private cameraLookTarget = new THREE.Vector3(0, 0.8, 0);
  private currentLookAt = new THREE.Vector3(0, 0.8, 0);

  // Orbit controls via touch / drag
  private isDragging = false;
  private activePointers = new Map<number, {x:number,y:number}>();
  private pinchDistance = 0;
  private pinchRadius = 5.6;
  private gestureHadTwoPointers = false;
  private unbindInput: (() => void) | null = null;
  private previousPointerPosition = { x: 0, y: 0 };
  private dragStartPos = { x: 0, y: 0 };
  private spherical = { radius: 5.6, theta: 0.52, phi: 1.12 };
  private targetSpherical = { radius: 5.6, theta: 0.52, phi: 1.12 };

  // Lighting
  private dirLight!: THREE.DirectionalLight;
  private ambientLight!: THREE.AmbientLight;
  private hemisphereLight!: THREE.HemisphereLight;
  private rimLight!: THREE.DirectionalLight;

  // Raycaster
  private raycaster = new THREE.Raycaster();
  private pointer = new THREE.Vector2();

  private animationFrameId: number | null = null;
  private clock = new THREE.Clock();

  // Callbacks
  public onWorldInteract?: (action: string) => void;
  public onLetterOpen?: () => void;

  constructor(container: HTMLElement) {
    this.container = container;

    // 1. Scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(WORLDS.dollhouse.fogColor);
    this.scene.fog = new THREE.FogExp2(WORLDS.dollhouse.fogColor, 0.04);

    // 2. Camera
    const w = container.clientWidth || window.innerWidth || 800;
    const h = container.clientHeight || window.innerHeight || 600;
    const aspect = w / (h || 1);
    this.camera = new THREE.PerspectiveCamera(38, aspect, 0.1, 100);
    this.camera.position.copy(this.cameraTargetPos);
    this.camera.lookAt(this.cameraLookTarget);

    // 3. Renderer (calibrated exposure, sRGB color space, soft shadows)
    this.renderer = new THREE.WebGLRenderer({
      powerPreference: 'high-performance',
      antialias: true,
      alpha: true,
      preserveDrawingBuffer: true,
    });
    this.renderer.setSize(w, h);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2.0));
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.08;

    container.appendChild(this.renderer.domElement);

    // 4. Lights
    this.setupLighting();

    // 5. Initialize 4 Worlds
    this.dollhouseWorld = new DollhouseWorld();
    this.gardenWorld = new GardenWorld();
    this.teddyWorld = new TeddyWorld();
    this.cafeWorld = new CafeWorld();

    this.dollhouseWorld.onOpenLetterCallback = () => {
      this.onLetterOpen?.();
    };

    this.scene.add(this.dollhouseWorld.group);
    this.scene.add(this.gardenWorld.group);
    this.scene.add(this.teddyWorld.group);
    this.scene.add(this.cafeWorld.group);

    // Show only the starting world
    this.applyWorldVisibility('dollhouse');

    // 6. Bind Events
    this.bindEvents();

    // 7. Start render loop
    this.animate();
  }

  private setupLighting() {
    this.ambientLight = new THREE.AmbientLight(0xfff0f5, 0.5);
    this.scene.add(this.ambientLight);

    this.hemisphereLight = new THREE.HemisphereLight(0xfff0f5, 0xd8b4fe, 0.3);
    this.hemisphereLight.position.set(0, 10, 0);
    this.scene.add(this.hemisphereLight);

    this.dirLight = new THREE.DirectionalLight(0xfffaf0, 0.85);
    this.dirLight.position.set(5.5, 9, 6.5);
    this.dirLight.castShadow = true;
    this.dirLight.shadow.mapSize.width = 1024;
    this.dirLight.shadow.mapSize.height = 1024;
    this.dirLight.shadow.camera.near = 0.5;
    this.dirLight.shadow.camera.far = 25;
    this.dirLight.shadow.camera.left = -4.5;
    this.dirLight.shadow.camera.right = 4.5;
    this.dirLight.shadow.camera.top = 4.5;
    this.dirLight.shadow.camera.bottom = -4.5;
    this.dirLight.shadow.bias = -0.0001;
    this.dirLight.shadow.normalBias = 0.02;
    this.scene.add(this.dirLight);

    // Soft Rim Light
    this.rimLight = new THREE.DirectionalLight(0xffccd5, 0.35);
    this.rimLight.position.set(-5, 7, -5);
    this.scene.add(this.rimLight);
  }

  public setWorld(worldId: WorldId) {
    if (this.currentWorldId === worldId) return;
    this.currentWorldId = worldId;

    this.applyWorldVisibility(worldId);

    const meta = WORLDS[worldId];
    const targetFog = new THREE.Color(meta.fogColor);
    this.scene.background = targetFog;
    if (this.scene.fog) {
      (this.scene.fog as THREE.FogExp2).color = targetFog;
    }

    if (worldId === 'garden') {
      this.ambientLight.color.set(0x0c0f24);
      this.ambientLight.intensity = 0.45;
      this.dirLight.color.set(0x93c5fd);
      this.dirLight.intensity = 0.7;
      this.rimLight.color.set(0x818cf8);
      this.rimLight.intensity = 0.45;
      this.targetSpherical = { radius: 5.6, theta: 0.18, phi: 1.16 };
      this.cameraLookTarget.set(0, 0.95, 0);
    } else if (worldId === 'teddy') {
      this.ambientLight.color.set(0x4a2e35);
      this.ambientLight.intensity = 0.55;
      this.dirLight.color.set(0xfef08a);
      this.dirLight.intensity = 0.75;
      this.rimLight.color.set(0xfbcfe8);
      this.rimLight.intensity = 0.4;
      this.targetSpherical = { radius: 4.85, theta: 0.0, phi: 1.25 };
      this.cameraLookTarget.set(0, 0.92, 0);
    } else if (worldId === 'cafe') {
      this.ambientLight.color.set(0xffe7de);
      this.ambientLight.intensity = 0.95;
      this.dirLight.color.set(0xffead1);
      this.dirLight.intensity = 1.65;
      this.rimLight.color.set(0xffb7a6);
      this.rimLight.intensity = 0.75;
      this.targetSpherical = { radius: 4.65, theta: 0.28, phi: 1.18 };
      this.cameraLookTarget.set(0, 1.15, 0);
    } else {
      // dollhouse
      this.ambientLight.color.set(0xfff0f5);
      this.ambientLight.intensity = 0.63;
      this.dirLight.color.set(0xffeadf);
      this.dirLight.intensity = 1.15;
      this.rimLight.color.set(0xffccd5);
      this.rimLight.intensity = 0.35;
      this.targetSpherical = { radius: 5.6, theta: 0.52, phi: 1.12 };
      this.cameraLookTarget.set(0, 1.05, 0);
    }
  }

  private applyWorldVisibility(activeWorld: WorldId) {
    this.dollhouseWorld.group.visible = activeWorld === 'dollhouse';
    this.gardenWorld.group.visible = activeWorld === 'garden';
    this.teddyWorld.group.visible = activeWorld === 'teddy';
    this.cafeWorld.group.visible = activeWorld === 'cafe';
  }

  private bindEvents() {
    const el = this.renderer.domElement;
    const distance = () => {
      const pts = [...this.activePointers.values()];
      if (pts.length < 2) return 0;
      return Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
    };
    const onPointerDown = (e: PointerEvent) => {
      this.activePointers.set(e.pointerId,{x:e.clientX,y:e.clientY});
      this.isDragging = true;
      this.dragStartPos = {x:e.clientX,y:e.clientY};
      this.previousPointerPosition = {x:e.clientX,y:e.clientY};
      if (this.activePointers.size >= 2) {
        this.gestureHadTwoPointers=true;
        this.pinchDistance=distance();
        this.pinchRadius=this.targetSpherical.radius;
      }
    };
    const onPointerMove = (e: PointerEvent) => {
      if (!this.activePointers.has(e.pointerId)) return;
      this.activePointers.set(e.pointerId,{x:e.clientX,y:e.clientY});
      if (this.activePointers.size >= 2) {
        if (!this.pinchDistance) {
          this.pinchDistance=distance();this.pinchRadius=this.targetSpherical.radius;
        }
        const next=distance();
        if(next>10 && this.pinchDistance>10){
          this.targetSpherical.radius=THREE.MathUtils.clamp(this.pinchRadius*this.pinchDistance/next,3.4,8.2);
        }
        return;
      }
      if (!this.isDragging) return;
      const dx=e.clientX-this.previousPointerPosition.x;
      const dy=e.clientY-this.previousPointerPosition.y;
      this.targetSpherical.theta-=dx*.006;
      this.targetSpherical.phi=THREE.MathUtils.clamp(this.targetSpherical.phi-dy*.006,.42,Math.PI/2-.08);
      this.previousPointerPosition={x:e.clientX,y:e.clientY};
    };
    const onPointerUp = (e: PointerEvent) => {
      if (!this.activePointers.has(e.pointerId)) return;
      const canTap=this.activePointers.size===1&&!this.gestureHadTwoPointers &&
        Math.hypot(e.clientX-this.dragStartPos.x,e.clientY-this.dragStartPos.y)<7;
      this.activePointers.delete(e.pointerId);
      this.isDragging=this.activePointers.size>0;
      if(this.activePointers.size<2){this.pinchDistance=0;}
      if(this.activePointers.size===0){this.gestureHadTwoPointers=false;}
      else {
        const point=[...this.activePointers.values()][0];
        this.previousPointerPosition={x:point.x,y:point.y};
      }
      if(canTap) this.handlePointerClick(e);
    };
    const onPointerCancel=(e:PointerEvent)=>{
      this.activePointers.delete(e.pointerId);
      this.isDragging=this.activePointers.size>0;
      this.pinchDistance=0;
      if(!this.isDragging) this.gestureHadTwoPointers=false;
    };
    const onWheel=(e:WheelEvent)=>{
      e.preventDefault();
      this.targetSpherical.radius=THREE.MathUtils.clamp(this.targetSpherical.radius+e.deltaY*.004,3.4,8.2);
    };
    el.addEventListener('pointerdown',onPointerDown);
    window.addEventListener('pointermove',onPointerMove);
    window.addEventListener('pointerup',onPointerUp);
    window.addEventListener('pointercancel',onPointerCancel);
    el.addEventListener('wheel',onWheel,{passive:false});
    window.addEventListener('resize',this.onWindowResize);
    this.unbindInput=()=>{
      el.removeEventListener('pointerdown',onPointerDown);
      window.removeEventListener('pointermove',onPointerMove);
      window.removeEventListener('pointerup',onPointerUp);
      window.removeEventListener('pointercancel',onPointerCancel);
      el.removeEventListener('wheel',onWheel);
      window.removeEventListener('resize',this.onWindowResize);
    };
  }

  private handlePointerClick(e: MouseEvent | TouchEvent) {
    const rect = this.renderer.domElement.getBoundingClientRect();
    const clientX = 'clientX' in e ? e.clientX : (e as TouchEvent).touches[0].clientX;
    const clientY = 'clientY' in e ? e.clientY : (e as TouchEvent).touches[0].clientY;

    this.pointer.x = ((clientX - rect.left) / rect.width) * 2 - 1;
    this.pointer.y = -((clientY - rect.top) / rect.height) * 2 + 1;

    this.raycaster.setFromCamera(this.pointer, this.camera);

    let activeGroup: THREE.Group | null = null;
    if (this.currentWorldId === 'dollhouse') activeGroup = this.dollhouseWorld.group;
    else if (this.currentWorldId === 'garden') activeGroup = this.gardenWorld.group;
    else if (this.currentWorldId === 'teddy') activeGroup = this.teddyWorld.group;
    else if (this.currentWorldId === 'cafe') activeGroup = this.cafeWorld.group;

    if (!activeGroup) return;

    const intersects = this.raycaster.intersectObjects(activeGroup.children, true);
    if (intersects.length > 0) {
      // Traverse up to find named interactive targets
      let hitObj: THREE.Object3D | null = intersects[0].object;
      let handled = false;

      while (hitObj && hitObj !== activeGroup) {
        const name = hitObj.name;
        // 1. Gift Box
        if (name === 'interactive_gift') {
          this.dollhouseWorld.toggleGift();
          this.onWorldInteract?.(this.dollhouseWorld.isGiftOpen ? 'Opened the surprise gift! ✨' : 'Closed gift box');
          handled = true;
          break;
        }
        // 2. Envelope
        else if (name === 'interactive_envelope') {
          this.dollhouseWorld.toggleLetter();
          this.onWorldInteract?.('Unfolding Ayaan’s letter... ✉️');
          handled = true;
          break;
        }
        // 3. Lamp
        else if (name === 'interactive_lamp') {
          this.dollhouseWorld.toggleLamp();
          this.onWorldInteract?.(this.dollhouseWorld.isLampOn ? 'Warm bedside lamp turned on 💡' : 'Bedside lamp turned off');
          handled = true;
          break;
        }
        // 4. Window & Curtains
        else if (name === 'interactive_window') {
          this.dollhouseWorld.toggleWindow();
          this.onWorldInteract?.(this.dollhouseWorld.isWindowOpen ? 'Window opened to the starry moon 🌙✨' : 'Curtains closed cozy');
          handled = true;
          break;
        }
        // 5. Drawer
        else if (name === 'interactive_drawer') {
          this.dollhouseWorld.toggleDrawer();
          this.onWorldInteract?.(this.dollhouseWorld.isDrawerOpen ? 'Secret drawer opened! Found a glowing star 🌟' : 'Drawer closed');
          handled = true;
          break;
        }
        // 6. Wardrobe
        else if (name === 'interactive_wardrobe') {
          this.dollhouseWorld.toggleWardrobe();
          this.onWorldInteract?.(this.dollhouseWorld.isWardrobeOpen ? 'Wardrobe opened! Cute pink outfits inside 👗' : 'Wardrobe closed');
          handled = true;
          break;
        }
        // 7. Vanity Mirror
        else if (name === 'interactive_mirror') {
          this.dollhouseWorld.triggerMirror();
          this.onWorldInteract?.('Mirror glow: "Ayra, the prettiest girl in the universe ✨"');
          handled = true;
          break;
        }
        // 8. Music Box
        else if (name === 'interactive_music_box') {
          this.dollhouseWorld.toggleMusicBox();
          this.onWorldInteract?.(this.dollhouseWorld.isMusicBoxPlaying ? 'Music box playing sweet melody for Ayra 🎶' : 'Music box paused');
          handled = true;
          break;
        }
        // 9. Flower Vase
        else if (name === 'interactive_vase') {
          this.dollhouseWorld.triggerVase();
          this.onWorldInteract?.('Blossoms sent floating hearts to Ayra! 🌸💖');
          handled = true;
          break;
        }
        // 10. Photo Frame
        else if (name === 'interactive_photo_frame') {
          this.dollhouseWorld.togglePhotoFrame();
          this.onWorldInteract?.(this.dollhouseWorld.isPhotoFlipped ? 'Keepsake revealed: "Ayaan & Ayra Forever" 📸' : 'Portrait frame flipped');
          handled = true;
          break;
        }
        // Garden Roses
        else if (name.startsWith('interactive_rose')) {
          const roseIdx = parseInt(name.replace('interactive_rose_', ''), 10);
          this.gardenWorld.toggleRose(isNaN(roseIdx) ? undefined : roseIdx);
          this.onWorldInteract?.('Blue rose blossomed with magic starlight! 🌹✨');
          handled = true;
          break;
        }
        else if (name === 'interactive_bunny') {
          soundEngine.playSparkle();
          this.onWorldInteract?.('Cute garden bunny hopped with joy! 🐰✨');
          handled = true;
          break;
        }
        // Teddy Hug
        else if (name === 'ayaan_bear' || name === 'pinkii_bear') {
          this.teddyWorld.triggerHug();
          this.onWorldInteract?.('Holding you tight, jana! 🧸💖');
          handled = true;
          break;
        }
        // Café Cups
        else if (name === 'interactive_pinkii_cup' || name === 'interactive_ayaan_cup') {
          this.cafeWorld.triggerClink();
          this.onWorldInteract?.('Cheers, jana! Clinked our latte cups ☕✨');
          handled = true;
          break;
        }
        else if (name === 'interactive_pastry') {
          this.cafeWorld.triggerClink();
          this.onWorldInteract?.('Shared a sweet strawberry macaron! 🍰');
          handled = true;
          break;
        }
        hitObj = hitObj.parent;
      }

      // If user clicked the floor or anywhere on Teddy room, trigger hug if in teddy room
      if (!handled && this.currentWorldId === 'teddy') {
        this.teddyWorld.triggerHug();
      }
    }
  }

  public resetCamera() {
    if (this.currentWorldId === 'dollhouse') {
      this.targetSpherical = { radius: 5.6, theta: 0.52, phi: 1.12 };
      this.cameraLookTarget.set(0, 1.05, 0);
    } else if (this.currentWorldId === 'garden') {
      this.targetSpherical = { radius: 5.6, theta: 0.18, phi: 1.16 };
      this.cameraLookTarget.set(0, 0.95, 0);
    } else if (this.currentWorldId === 'teddy') {
      this.targetSpherical = { radius: 4.85, theta: 0.0, phi: 1.25 };
      this.cameraLookTarget.set(0, 0.92, 0);
    } else if (this.currentWorldId === 'cafe') {
      this.targetSpherical = { radius: 4.65, theta: 0.28, phi: 1.18 };
      this.cameraLookTarget.set(0, 1.15, 0);
    }
  }

  private onWindowResize = () => {
    if (!this.container) return;
    const w = this.container.clientWidth || window.innerWidth || 800;
    const h = this.container.clientHeight || window.innerHeight || 600;
    this.camera.aspect = w / (h || 1);
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h);
  };

  private animate = () => {
    this.animationFrameId = requestAnimationFrame(this.animate);

    const delta = this.clock.getDelta();
    const time = this.clock.getElapsedTime();

    // Damping spherical camera coordinates
    this.spherical.theta += (this.targetSpherical.theta - this.spherical.theta) * 0.08;
    this.spherical.phi += (this.targetSpherical.phi - this.spherical.phi) * 0.08;
    this.spherical.radius += (this.targetSpherical.radius - this.spherical.radius) * 0.08;

    // Smooth LookAt interpolation
    this.currentLookAt.lerp(this.cameraLookTarget, 0.08);

    // Calculate camera cartesian from spherical
    const cx = this.currentLookAt.x + this.spherical.radius * Math.sin(this.spherical.phi) * Math.sin(this.spherical.theta);
    const cy = this.currentLookAt.y + this.spherical.radius * Math.cos(this.spherical.phi);
    const cz = this.currentLookAt.z + this.spherical.radius * Math.sin(this.spherical.phi) * Math.cos(this.spherical.theta);

    this.camera.position.set(cx, cy, cz);
    this.camera.lookAt(this.currentLookAt);

    // Update active world
    if (this.currentWorldId === 'dollhouse') {
      this.dollhouseWorld.update(delta, time);
    } else if (this.currentWorldId === 'garden') {
      this.gardenWorld.update(delta, time);
    } else if (this.currentWorldId === 'teddy') {
      this.teddyWorld.update(delta, time);
    } else if (this.currentWorldId === 'cafe') {
      this.cafeWorld.update(delta, time);
    }

    this.renderer.render(this.scene, this.camera);
  };

  public captureSnapshot(): string {
    return this.renderer.domElement.toDataURL('image/png');
  }

  public dispose() {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
    }
    this.unbindInput?.();
    this.activePointers.clear();
    this.renderer.dispose();
  }
}
