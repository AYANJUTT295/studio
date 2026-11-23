import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { soundEngine } from '../audio/soundEffects';
import {
  createWoodParquetTexture,
  createWallpaperTexture,
  createCheckeredTexture,
  createPortraitTexture,
  createFluffyRugTexture,
  createDarkWoodTexture,
} from '../utils/textureGenerator';

export class DollhouseWorld {
  public group: THREE.Group;

  // 1. Gift Box
  private giftLid: THREE.Group | null = null;
  private surpriseHeart: THREE.Group | null = null;
  public isGiftOpen: boolean = false;
  private targetLidRotX: number = 0;
  private targetLidPosY: number = 0.52;
  private currentLidRotX: number = 0;
  private currentLidPosY: number = 0.52;

  // 2. Envelope & Letter
  private envelopeFlap: THREE.Group | null = null;
  private letterSheet: THREE.Mesh | null = null;
  public isLetterOpen: boolean = false;
  private targetFlapRotX: number = 0;
  private currentFlapRotX: number = 0;
  private targetLetterY: number = 0;
  private currentLetterY: number = 0;

  // 3. Lamp
  public isLampOn: boolean = true;
  private lampLight: THREE.PointLight | null = null;
  private lampBulb: THREE.Mesh | null = null;

  // 4. Window & Curtains
  public isWindowOpen: boolean = false;
  private leftCurtain: THREE.Mesh | null = null;
  private rightCurtain: THREE.Mesh | null = null;
  private leftWindowPane: THREE.Mesh | null = null;
  private rightWindowPane: THREE.Mesh | null = null;
  private targetCurtainSpread: number = 0;
  private currentCurtainSpread: number = 0;

  // 5. Drawer
  public isDrawerOpen: boolean = false;
  private drawerMesh: THREE.Group | null = null;
  private targetDrawerZ: number = 0;
  private currentDrawerZ: number = 0;

  // 6. Wardrobe
  public isWardrobeOpen: boolean = false;
  private leftDoor: THREE.Group | null = null;
  private rightDoor: THREE.Group | null = null;
  private targetDoorRot: number = 0;
  private currentDoorRot: number = 0;

  // 7. Vanity Mirror
  public isMirrorSparkling: boolean = false;
  private mirrorBulbs: THREE.Mesh[] = [];
  private mirrorLight: THREE.PointLight | null = null;
  private mirrorTimer: number = 0;

  // 8. Music Box
  public isMusicBoxPlaying: boolean = false;
  private musicBoxLid: THREE.Group | null = null;
  private ballerinaFigure: THREE.Group | null = null;
  private targetMusicLidRot: number = 0;
  private currentMusicLidRot: number = 0;

  // 9. Flower Vase
  public isVasePulsing: boolean = false;
  private vaseHearts: THREE.Group | null = null;
  private vaseTimer: number = 0;

  // 10. Photo Frame
  public isPhotoFlipped: boolean = false;
  private photoFrameGroup: THREE.Group | null = null;
  private targetPhotoRotY: number = 0;
  private currentPhotoRotY: number = 0;

  // Two animated mini keepsake dolls in the room, built as separate articulated rigs.
  private keepsakeDolls: THREE.Group[] = [];
  private dollWaving = false;
  private dollWaveTime = 0;
  private dollArms: THREE.Group[] = [];
  // Ambient fairy lights
  private fairyLights: THREE.PointLight[] = [];
  private fairyBulbs: THREE.Mesh[] = [];

  public onOpenLetterCallback?: () => void;
  public onMirrorCompliment?: () => void;

  constructor() {
    this.group = new THREE.Group();

    this.buildGabledRoomArchitecture();
    this.buildBedArea();
    this.buildInteractiveWardrobe();
    this.buildInteractiveVanity();
    this.buildInteractiveDeskAndDrawer();
    this.buildInteractiveWindow();
    this.buildInteractiveGiftBox();
    this.buildInteractiveVaseAndShelves();
    this.buildInteractivePhotoFrame();
    this.buildFairyLightCanopy();
    this.buildKeepsakeDolls();
    this.buildCozyFinishingTouches();
  }

  /* -------------------------------------------------------------
   * ROOM STRUCTURE: Cozy Gabled Penthouse Attic (Matches Reference)
   * ------------------------------------------------------------- */
  private buildGabledRoomArchitecture() {
    // Room base platform
    const floorGeo = new THREE.CylinderGeometry(5.2, 5.4, 0.45, 64);
    const darkWoodMat = new THREE.MeshStandardMaterial({
      map: createDarkWoodTexture(),
      roughness: 0.5,
      metalness: 0.1,
    });
    const floorBase = new THREE.Mesh(floorGeo, darkWoodMat);
    floorBase.position.y = -0.225;
    floorBase.receiveShadow = true;
    this.group.add(floorBase);

    // Golden boundary rim
    const goldRim = new THREE.Mesh(
      new THREE.TorusGeometry(5.25, 0.05, 16, 64),
      new THREE.MeshStandardMaterial({ color: 0xfbbf24, metalness: 0.85, roughness: 0.2 })
    );
    goldRim.rotation.x = Math.PI / 2;
    goldRim.position.y = 0.01;
    this.group.add(goldRim);

    // Warm parquet wood flooring with procedural oak plank texture
    const parquetMat = new THREE.MeshStandardMaterial({
      map: createWoodParquetTexture(),
      roughness: 0.4,
      metalness: 0.05,
    });
    const woodFloor = new THREE.Mesh(new THREE.CylinderGeometry(5.1, 5.1, 0.04, 64), parquetMat);
    woodFloor.position.y = 0.02;
    woodFloor.receiveShadow = true;
    this.group.add(woodFloor);

    // Back Wall with luxury romantic wallpaper
    const wallpaperMat = new THREE.MeshStandardMaterial({
      map: createWallpaperTexture(),
      roughness: 0.65,
    });
    const backWall = new THREE.Mesh(new THREE.BoxGeometry(6.6, 3.8, 0.22), wallpaperMat);
    backWall.position.set(0, 1.9, -3.05);
    backWall.receiveShadow = true;
    this.group.add(backWall);

    // Left Wall
    const leftWallMat = new THREE.MeshStandardMaterial({
      color: 0xf5dbe7,
      roughness: 0.82,
    });
    const leftWall = new THREE.Mesh(new THREE.BoxGeometry(0.22, 3.8, 6.2), leftWallMat);
    leftWall.position.set(-3.18, 1.9, 0.0);
    leftWall.receiveShadow = true;
    this.group.add(leftWall);

    // Left Porthole window with wooden rim
    const portholeRim = new THREE.Mesh(
      new THREE.TorusGeometry(0.55, 0.06, 16, 32),
      new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3 })
    );
    portholeRim.position.set(-3.05, 2.3, 0.8);
    portholeRim.rotation.y = Math.PI / 2;
    this.group.add(portholeRim);

    const portholeGlass = new THREE.Mesh(
      new THREE.CircleGeometry(0.5, 32),
      new THREE.MeshBasicMaterial({ color: 0x1e1b4b })
    );
    portholeGlass.position.set(-3.06, 2.3, 0.8);
    portholeGlass.rotation.y = Math.PI / 2;
    this.group.add(portholeGlass);

    // Sloped Gabled Roof Beams
    const beamMat = new THREE.MeshStandardMaterial({ color: 0xfce7f3, roughness: 0.4 });
    const roofBeamL = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.16, 0.35), beamMat);
    roofBeamL.position.set(-1.7, 3.65, -2.95);
    roofBeamL.rotation.z = Math.PI * 0.12;
    this.group.add(roofBeamL);

    const roofBeamR = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.16, 0.35), beamMat);
    roofBeamR.position.set(1.7, 3.65, -2.95);
    roofBeamR.rotation.z = -Math.PI * 0.12;
    this.group.add(roofBeamR);

    // Lower Pink Wainscoting Panel
    const wainscotMat = new THREE.MeshStandardMaterial({ color: 0xeebbcf, roughness: 0.70 });
    const backWainscot = new THREE.Mesh(new THREE.BoxGeometry(6.6, 1.1, 0.25), wainscotMat);
    backWainscot.position.set(0, 0.55, -3.02);
    this.group.add(backWainscot);

    const leftWainscot = new THREE.Mesh(new THREE.BoxGeometry(0.25, 1.1, 6.2), wainscotMat);
    leftWainscot.position.set(-3.15, 0.55, 0.0);
    this.group.add(leftWainscot);

    // Fluffy circular plush rug in center
    const rugMat = new THREE.MeshStandardMaterial({
      map: createFluffyRugTexture('#fbcfe8'),
      roughness: 0.95,
    });
    const rug = new THREE.Mesh(new THREE.CylinderGeometry(1.6, 1.6, 0.05, 48), rugMat);
    rug.position.set(0.2, 0.045, 0.3);
    rug.receiveShadow = true;
    this.group.add(rug);

    const innerRugMat = new THREE.MeshStandardMaterial({
      map: createFluffyRugTexture('#fff1f2'),
      roughness: 0.95,
    });
    const rugInner = new THREE.Mesh(new THREE.CylinderGeometry(1.35, 1.35, 0.06, 48), innerRugMat);
    rugInner.position.set(0.2, 0.05, 0.3);
    rugInner.receiveShadow = true;
    this.group.add(rugInner);
  }

  /* -------------------------------------------------------------
   * 1. BED AREA & 3. INTERACTIVE LAMP
   * ------------------------------------------------------------- */
  private buildBedArea() {
    const bedGroup = new THREE.Group();
    bedGroup.position.set(-1.8, 0, -1.2);
    bedGroup.rotation.y = Math.PI * 0.15;

    // Bed frame
    const frameMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3 });
    const bedBase = new THREE.Mesh(new THREE.BoxGeometry(2.3, 0.38, 2.7), frameMat);
    bedBase.position.y = 0.22;
    bedBase.castShadow = true;
    bedGroup.add(bedBase);

    // Individually upholstered, scalloped headboard — no giant cylinder across the mattress.
    const velvet = new THREE.MeshStandardMaterial({ color: 0xeaa6bd, roughness: 0.94 });
    const piping = new THREE.MeshStandardMaterial({ color: 0xffe5c7, roughness: 0.5, metalness: 0.12 });
    const tuftButton = new THREE.MeshStandardMaterial({ color: 0xffe7d4, roughness: 0.25, metalness: 0.3 });
    for(let i=0;i<7;i++) {
      const x = (i-3)*0.335;
      const crown = 1.10 + .36 * Math.sqrt(Math.max(0,1-(x/1.12)**2));
      const panel = new THREE.Mesh(new RoundedBoxGeometry(.35,crown-.45,.21,4,.085),velvet);
      panel.position.set(x,.45+(crown-.45)/2,-1.40);panel.castShadow=true;bedGroup.add(panel);
      const button = new THREE.Mesh(new THREE.SphereGeometry(.025,12,8),tuftButton);
      button.position.set(x,.84,-1.278);bedGroup.add(button);
    }
    const headboardFoot = new THREE.Mesh(new RoundedBoxGeometry(2.4,.16,.26,4,.055),piping);
    headboardFoot.position.set(0,.46,-1.43);bedGroup.add(headboardFoot);

    // Mattress
    const mattress = new THREE.Mesh(
      new RoundedBoxGeometry(2.15, 0.42, 2.55, 4, .13),
      new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.8 })
    );
    mattress.position.y = 0.52;
    mattress.castShadow = true;
    bedGroup.add(mattress);

    // Pink checkered comforter with fabric weave texture
    const duvetMat = new THREE.MeshStandardMaterial({
      map: createCheckeredTexture('#f472b6', '#ffffff', '#fbcfe8', 6),
      roughness: 0.65,
    });
    const duvet = new THREE.Mesh(new RoundedBoxGeometry(2.2, 0.28, 1.8, 5, .12), duvetMat);
    duvet.position.set(0, 0.68, 0.35);
    duvet.castShadow = true;
    bedGroup.add(duvet);

    // Fluffy pillows
    const pillowMat = new THREE.MeshStandardMaterial({ color: 0xfff1f2, roughness: 0.8 });
    const p1 = new THREE.Mesh(new RoundedBoxGeometry(0.85, 0.22, 0.52, 4, .10), pillowMat);
    p1.position.set(-0.55, 0.8, -0.85);
    p1.rotation.x = 0.18;
    bedGroup.add(p1);

    const p2 = new THREE.Mesh(new RoundedBoxGeometry(0.85, 0.22, 0.52, 4, .10), pillowMat);
    p2.position.set(0.55, 0.8, -0.85);
    p2.rotation.x = 0.18;
    bedGroup.add(p2);

    // Hand-sewn flower cushion: six distinct plush petals, not a vertical disk.
    const flower = new THREE.Group();flower.position.set(-.08,.87,-.36);
    const petalMat = new THREE.MeshStandardMaterial({color:0xf5a0bb,roughness:1});
    for(let i=0;i<6;i++){
      const a=i*Math.PI/3;
      const petal=new THREE.Mesh(new THREE.SphereGeometry(.17,16,12),petalMat);
      petal.scale.set(.88,.37,.85);petal.position.set(Math.cos(a)*.17,.01,Math.sin(a)*.17);
      flower.add(petal);
    }
    const middle=new THREE.Mesh(new THREE.SphereGeometry(.10,16,12),
      new THREE.MeshStandardMaterial({color:0xffe2a7,roughness:.8}));
    middle.scale.y=.5;middle.position.y=.055;flower.add(middle);bedGroup.add(flower);
    // Neatly folded linen throw at the foot of the bed.
    const throwMesh=new THREE.Mesh(new RoundedBoxGeometry(2.12,.055,.43,3,.025),
      new THREE.MeshStandardMaterial({color:0xe5cbe9,roughness:.97}));
    throwMesh.position.set(0,.855,1.06);bedGroup.add(throwMesh);
    // Mini decorative piping down either side of the comforter.
    const seamMat=new THREE.MeshStandardMaterial({color:0xffe9ef,roughness:.8});
    for(const x of [-1.07,1.07]){
      const seam=new THREE.Mesh(new THREE.BoxGeometry(.025,.013,1.58),seamMat);
      seam.position.set(x,.83,.33);bedGroup.add(seam);
    }

    this.group.add(bedGroup);

    // BEDSIDE NIGHTSTAND with INTERACTIVE LAMP (Clickable #3)
    const nightstand = new THREE.Group();
    nightstand.position.set(-0.35, 0, -2.4);

    const standMesh = new THREE.Mesh(
      new THREE.BoxGeometry(0.75, 0.75, 0.65),
      new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3 })
    );
    standMesh.position.y = 0.375;
    standMesh.castShadow = true;
    nightstand.add(standMesh);

    // INTERACTIVE LAMP
    const lampGroup = new THREE.Group();
    lampGroup.position.set(0, 0.75, 0);
    lampGroup.name = 'interactive_lamp';

    const stem = new THREE.Mesh(
      new THREE.CylinderGeometry(0.04, 0.08, 0.38, 16),
      new THREE.MeshStandardMaterial({ color: 0xfbbf24, metalness: 0.85, roughness: 0.2 })
    );
    stem.position.y = 0.19;
    lampGroup.add(stem);

    // Lamp shade with warm glow
    this.lampBulb = new THREE.Mesh(
      new THREE.ConeGeometry(0.24, 0.32, 24, 1, true),
      new THREE.MeshStandardMaterial({
        color: 0xfef08a,
        emissive: 0xfef08a,
        emissiveIntensity: 0.9,
        roughness: 0.2,
        side: THREE.DoubleSide,
      })
    );
    this.lampBulb.position.y = 0.42;
    lampGroup.add(this.lampBulb);

    this.lampLight = new THREE.PointLight(0xffedd5, 1.6, 4.0);
    this.lampLight.position.set(0, 0.45, 0);
    lampGroup.add(this.lampLight);

    nightstand.add(lampGroup);

    // 2. INTERACTIVE ENVELOPE on the nightstand (Clickable #2)
    const envGroup = new THREE.Group();
    envGroup.position.set(0.18, 0.76, 0.12);
    envGroup.rotation.y = -0.3;
    envGroup.name = 'interactive_envelope';

    const envBase = new THREE.Mesh(
      new THREE.BoxGeometry(0.38, 0.02, 0.26),
      new THREE.MeshStandardMaterial({ color: 0xfffdfa, roughness: 0.4 })
    );
    envGroup.add(envBase);

    // Heart seal
    const seal = this.createHeartMesh(0.06, 0xd97706);
    seal.position.set(0, 0.025, 0.03);
    envGroup.add(seal);

    // Envelope flap hinge
    this.envelopeFlap = new THREE.Group();
    this.envelopeFlap.position.set(0, 0.015, -0.13);
    const flapShape = new THREE.Shape();
    flapShape.moveTo(-0.19, 0);
    flapShape.lineTo(0.19, 0);
    flapShape.lineTo(0, 0.14);
    flapShape.closePath();
    const flap = new THREE.Mesh(
      new THREE.ShapeGeometry(flapShape),
      new THREE.MeshStandardMaterial({ color: 0xfff1f2, side: THREE.DoubleSide })
    );
    flap.rotation.x = Math.PI / 2;
    this.envelopeFlap.add(flap);
    envGroup.add(this.envelopeFlap);

    // Letter sheet
    this.letterSheet = new THREE.Mesh(
      new THREE.BoxGeometry(0.34, 0.015, 0.22),
      new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3 })
    );
    this.letterSheet.position.set(0, 0.012, 0);
    envGroup.add(this.letterSheet);

    nightstand.add(envGroup);
    this.group.add(nightstand);
  }

  /* -------------------------------------------------------------
   * 4. INTERACTIVE WINDOW & CURTAINS (Clickable #4)
   * ------------------------------------------------------------- */
  private buildInteractiveWindow() {
    const winGroup = new THREE.Group();
    winGroup.position.set(0.85, 2.3, -2.94);
    winGroup.name = 'interactive_window';

    const frameMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3 });
    const winFrame = new THREE.Mesh(new THREE.BoxGeometry(1.8, 1.8, 0.1), frameMat);
    winGroup.add(winFrame);

    // Night starry sky outside window
    const glass = new THREE.Mesh(
      new THREE.PlaneGeometry(1.6, 1.6),
      new THREE.MeshBasicMaterial({ color: 0x111638 })
    );
    glass.position.z = 0.055;
    winGroup.add(glass);

    // Moon & stars in window
    const moon = new THREE.Mesh(
      new THREE.CircleGeometry(0.2, 24),
      new THREE.MeshBasicMaterial({ color: 0xfef08a })
    );
    moon.position.set(0.35, 0.45, 0.06);
    winGroup.add(moon);

    const starCoords = [[-0.45, 0.45], [-0.2, 0.58], [0.1, 0.35], [-0.35, 0.1], [0.45, 0.15]];
    starCoords.forEach(([sx, sy]) => {
      const star = new THREE.Mesh(new THREE.CircleGeometry(0.025, 8), new THREE.MeshBasicMaterial({ color: 0xffffff }));
      star.position.set(sx, sy, 0.06);
      winGroup.add(star);
    });

    // Window panes that swing open
    const paneMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3, transparent: true, opacity: 0.7 });
    this.leftWindowPane = new THREE.Mesh(new THREE.BoxGeometry(0.75, 1.5, 0.04), paneMat);
    this.leftWindowPane.position.set(-0.38, 0, 0.08);
    winGroup.add(this.leftWindowPane);

    this.rightWindowPane = new THREE.Mesh(new THREE.BoxGeometry(0.75, 1.5, 0.04), paneMat);
    this.rightWindowPane.position.set(0.38, 0, 0.08);
    winGroup.add(this.rightWindowPane);

    // Window Curtain Rod & Curtains
    const rod = new THREE.Mesh(
      new THREE.CylinderGeometry(0.03, 0.03, 2.2, 16),
      new THREE.MeshStandardMaterial({ color: 0xfbbf24, metalness: 0.85, roughness: 0.2 })
    );
    rod.rotation.z = Math.PI / 2;
    rod.position.set(0, 1.0, 0.16);
    winGroup.add(rod);

    const curtainMat = new THREE.MeshStandardMaterial({ color: 0xf472b6, roughness: 0.7, side: THREE.DoubleSide });

    this.leftCurtain = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.28, 1.85, 16, 1, false, 0, Math.PI), curtainMat);
    this.leftCurtain.position.set(-0.75, 0, 0.14);
    this.leftCurtain.rotation.y = Math.PI / 2;
    winGroup.add(this.leftCurtain);

    this.rightCurtain = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.28, 1.85, 16, 1, false, 0, Math.PI), curtainMat);
    this.rightCurtain.position.set(0.75, 0, 0.14);
    this.rightCurtain.rotation.y = -Math.PI / 2;
    winGroup.add(this.rightCurtain);

    this.group.add(winGroup);
  }

  /* -------------------------------------------------------------
   * 5. INTERACTIVE DESK & DRAWER (Clickable #5) & 8. MUSIC BOX
   * ------------------------------------------------------------- */
  private buildInteractiveDeskAndDrawer() {
    const deskGroup = new THREE.Group();
    deskGroup.position.set(-2.25, 0, 1.25);
    deskGroup.rotation.y = Math.PI * 0.45;

    const deskMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3 });
    const deskTop = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.08, 0.85), deskMat);
    deskTop.position.y = 0.85;
    deskTop.castShadow = true;
    deskGroup.add(deskTop);

    // Desk legs
    const legGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.85, 12);
    const legPos = [[-0.65, 0.425, -0.35], [0.65, 0.425, -0.35], [-0.65, 0.425, 0.35], [0.65, 0.425, 0.35]];
    legPos.forEach(([lx, ly, lz]) => {
      const leg = new THREE.Mesh(legGeo, deskMat);
      leg.position.set(lx, ly, lz);
      deskGroup.add(leg);
    });

    // INTERACTIVE DRAWER (Clickable #5) - Slides forward on rails
    this.drawerMesh = new THREE.Group();
    this.drawerMesh.position.set(0, 0.68, 0);
    this.drawerMesh.name = 'interactive_drawer';

    const box = new THREE.Mesh(
      new THREE.BoxGeometry(0.9, 0.22, 0.7),
      new THREE.MeshStandardMaterial({ color: 0xfce7f3, roughness: 0.4 })
    );
    this.drawerMesh.add(box);

    const goldKnob = new THREE.Mesh(
      new THREE.SphereGeometry(0.04, 12, 12),
      new THREE.MeshStandardMaterial({ color: 0xfbbf24, metalness: 0.85, roughness: 0.2 })
    );
    goldKnob.position.set(0, 0, 0.36);
    this.drawerMesh.add(goldKnob);

    // Glowing star surprise inside drawer
    const surpriseInDrawer = new THREE.Mesh(
      new THREE.SphereGeometry(0.09, 12, 12),
      new THREE.MeshStandardMaterial({ color: 0xfde047, emissive: 0xfbbf24, emissiveIntensity: 0.8 })
    );
    surpriseInDrawer.position.set(0, 0.05, 0);
    this.drawerMesh.add(surpriseInDrawer);

    deskGroup.add(this.drawerMesh);

    // 8. INTERACTIVE MUSIC BOX - Resting PROPERLY on the desk top
    const mbGroup = new THREE.Group();
    mbGroup.position.set(0.35, 0.89, -0.05); // perfectly grounded on desk top
    mbGroup.name = 'interactive_music_box';

    const mbBaseMat = new THREE.MeshStandardMaterial({ color: 0xfbcfe8, roughness: 0.3 });
    const mbBase = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.14, 24), mbBaseMat);
    mbBase.position.y = 0.07;
    mbGroup.add(mbBase);

    // Hinged Lid
    this.musicBoxLid = new THREE.Group();
    this.musicBoxLid.position.set(0, 0.14, -0.18);

    const lidMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.21, 0.21, 0.035, 24), mbBaseMat);
    lidMesh.position.z = 0.18;
    this.musicBoxLid.add(lidMesh);
    mbGroup.add(this.musicBoxLid);

    // Miniature Dancing Ballerina Figure
    this.ballerinaFigure = new THREE.Group();
    this.ballerinaFigure.position.set(0, 0.15, 0);
    this.ballerinaFigure.visible = false;

    const figMat = new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 0.5, roughness: 0.2 });
    const skirt = new THREE.Mesh(new THREE.ConeGeometry(0.07, 0.15, 16), new THREE.MeshStandardMaterial({ color: 0xf472b6, roughness: 0.4 }));
    skirt.position.y = 0.075;
    this.ballerinaFigure.add(skirt);

    const bTorso = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.1, 12), figMat);
    bTorso.position.y = 0.19;
    this.ballerinaFigure.add(bTorso);

    const bHead = new THREE.Mesh(new THREE.SphereGeometry(0.035, 12, 12), figMat);
    bHead.position.y = 0.28;
    this.ballerinaFigure.add(bHead);

    mbGroup.add(this.ballerinaFigure);
    deskGroup.add(mbGroup);

    this.group.add(deskGroup);
  }

  /* -------------------------------------------------------------
   * 6. INTERACTIVE WARDROBE (Clickable #6) - HOLLOW Realistic Closet!
   * ------------------------------------------------------------- */
  private buildInteractiveWardrobe() {
    const wardGroup = new THREE.Group();
    wardGroup.position.set(2.4, 0, -1.8);
    wardGroup.rotation.y = -Math.PI * 0.15;
    wardGroup.name = 'interactive_wardrobe';

    const frameMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3 });
    const innerMat = new THREE.MeshStandardMaterial({ color: 0xfff0f5, roughness: 0.5 });

    const W = 1.5, H = 2.5, D = 0.75, T = 0.04;

    // Back panel
    const backPanel = new THREE.Mesh(new THREE.BoxGeometry(W, H, T), innerMat);
    backPanel.position.set(0, H / 2, -D / 2 + T / 2);
    wardGroup.add(backPanel);

    // Left side panel
    const sideL = new THREE.Mesh(new THREE.BoxGeometry(T, H, D), frameMat);
    sideL.position.set(-W / 2 + T / 2, H / 2, 0);
    sideL.castShadow = true;
    wardGroup.add(sideL);

    // Right side panel
    const sideR = new THREE.Mesh(new THREE.BoxGeometry(T, H, D), frameMat);
    sideR.position.set(W / 2 - T / 2, H / 2, 0);
    sideR.castShadow = true;
    wardGroup.add(sideR);

    // Top panel
    const topPanel = new THREE.Mesh(new THREE.BoxGeometry(W, T, D), frameMat);
    topPanel.position.set(0, H - T / 2, 0);
    wardGroup.add(topPanel);

    // Bottom base panel
    const botPanel = new THREE.Mesh(new THREE.BoxGeometry(W, T, D), frameMat);
    botPanel.position.set(0, T / 2, 0);
    wardGroup.add(botPanel);

    // Top decorative crown pediment
    const crown = new THREE.Mesh(
      new THREE.CylinderGeometry(0.78, 0.78, 0.14, 32, 1, false, 0, Math.PI),
      frameMat
    );
    crown.rotation.x = Math.PI / 2;
    crown.position.set(0, H + 0.05, 0);
    wardGroup.add(crown);

    // Inside Clothes rail
    const rail = new THREE.Mesh(
      new THREE.CylinderGeometry(0.02, 0.02, W - 2 * T, 12),
      new THREE.MeshStandardMaterial({ color: 0xfbbf24, metalness: 0.8, roughness: 0.2 })
    );
    rail.rotation.z = Math.PI / 2;
    rail.position.set(0, H - 0.5, 0);
    wardGroup.add(rail);

    // Miniature wardrobe with actual hanging outfits, not three cones.
    // Each outfit is assembled from a shaped bodice, flared skirt, collar,
    // sleeves and a separate wire hanger, with shelves and folded knits below.
    const fabrics = [0xea7fa8,0xb8a1df,0xa5d6bd];
    const trimMat=new THREE.MeshStandardMaterial({color:0xfff2d4,roughness:.75});
    const gold=new THREE.MeshStandardMaterial({color:0xc69d65,metalness:.69,roughness:.32});
    for (let d=0;d<3;d++) {
      const outfit=new THREE.Group();
      outfit.position.set(-.42+d*.42, H-.96, .035);
      const silk=new THREE.MeshStandardMaterial({color:fabrics[d],roughness:.78,side:THREE.DoubleSide});
      // Hanger rod at y=H-.50, hook down to the garment.
      const hook=new THREE.Mesh(new THREE.TorusGeometry(.052,.011,8,18,Math.PI*1.64),gold);
      hook.position.set(0,.36,0);outfit.add(hook);
      const hanger=new THREE.Mesh(new THREE.ConeGeometry(.20,.11,3),gold);
      hanger.rotation.z=Math.PI;hanger.position.y=.285;outfit.add(hanger);
      const bodice=new THREE.Mesh(new THREE.CylinderGeometry(.10,.13,.23,12),silk);
      bodice.position.y=.17;outfit.add(bodice);
      const skirt=new THREE.Mesh(new THREE.CylinderGeometry(.125,.235,.40,22),silk);
      skirt.position.y=-.14;outfit.add(skirt);
      const hem=new THREE.Mesh(new THREE.TorusGeometry(.226,.017,8,22),trimMat);
      hem.rotation.x=Math.PI/2;hem.position.y=-.34;outfit.add(hem);
      for(const side of [-1,1]){
        const sleeve=new THREE.Mesh(new THREE.SphereGeometry(.105,12,9),silk);
        sleeve.scale.set(.82,.7,1);sleeve.position.set(side*.145,.23,0);outfit.add(sleeve);
      }
      const waist=new THREE.Mesh(new THREE.TorusGeometry(.127,.015,8,20),gold);
      waist.rotation.x=Math.PI/2;waist.position.y=.055;outfit.add(waist);
      wardGroup.add(outfit);
    }
    // Bottom shelf with folded sweaters + miniature shoes.
    const shelf = new THREE.Mesh(new THREE.BoxGeometry(W-.1,.045,D-.10),frameMat);
    shelf.position.set(0,.60,0);wardGroup.add(shelf);
    for(let i=0;i<3;i++){
      const stack=new THREE.Mesh(new THREE.BoxGeometry(.32,.09,.26),
        new THREE.MeshStandardMaterial({color:[0xffc6d9,0xc9e5de,0xe1d2f6][i],roughness:.92}));
      stack.position.set(-.40+i*.40,.69,0);wardGroup.add(stack);
      const fold=new THREE.Mesh(new THREE.BoxGeometry(.27,.012,.045),trimMat);
      fold.position.set(-.40+i*.40,.74,.04);wardGroup.add(fold);
    }
    for(let side of [-1,1]){
      const shoe=new THREE.Mesh(new THREE.SphereGeometry(.15,12,10),
        new THREE.MeshStandardMaterial({color:side===-1?0xf5afbb:0xb4a6d9,roughness:.64}));
      shoe.scale.set(1.3,.42,.72);shoe.position.set(side*.30,.14,.05);wardGroup.add(shoe);
    }

    // LEFT DOOR (Hinged at left edge)
    this.leftDoor = new THREE.Group();
    this.leftDoor.position.set(-W / 2 + T / 2, H / 2, D / 2);

    const doorMeshL = new THREE.Mesh(
      new THREE.BoxGeometry(W / 2 - T, H - 2 * T, T),
      new THREE.MeshStandardMaterial({ color: 0xfff0f5, roughness: 0.4 })
    );
    doorMeshL.position.x = (W / 2 - T) / 2;
    this.leftDoor.add(doorMeshL);

    const knobL = new THREE.Mesh(
      new THREE.SphereGeometry(0.035, 12, 12),
      new THREE.MeshStandardMaterial({ color: 0xfbbf24, metalness: 0.85, roughness: 0.2 })
    );
    knobL.position.set(W / 2 - T - 0.06, 0, T / 2 + 0.02);
    this.leftDoor.add(knobL);
    wardGroup.add(this.leftDoor);

    // RIGHT DOOR (Hinged at right edge)
    this.rightDoor = new THREE.Group();
    this.rightDoor.position.set(W / 2 - T / 2, H / 2, D / 2);

    const doorMeshR = new THREE.Mesh(
      new THREE.BoxGeometry(W / 2 - T, H - 2 * T, T),
      new THREE.MeshStandardMaterial({ color: 0xfff0f5, roughness: 0.4 })
    );
    doorMeshR.position.x = -(W / 2 - T) / 2;
    this.rightDoor.add(doorMeshR);

    const knobR = new THREE.Mesh(
      new THREE.SphereGeometry(0.035, 12, 12),
      new THREE.MeshStandardMaterial({ color: 0xfbbf24, metalness: 0.85, roughness: 0.2 })
    );
    knobR.position.set(-(W / 2 - T - 0.06), 0, T / 2 + 0.02);
    this.rightDoor.add(knobR);
    wardGroup.add(this.rightDoor);

    this.group.add(wardGroup);
  }

  /* -------------------------------------------------------------
   * 7. INTERACTIVE VANITY & MIRROR (Clickable #7)
   * ------------------------------------------------------------- */
  private buildInteractiveVanity() {
    const vanityGroup = new THREE.Group();
    vanityGroup.position.set(2.4, 0, 0.4);
    vanityGroup.rotation.y = -Math.PI * 0.45;
    vanityGroup.name = 'interactive_mirror';

    const vanityMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3 });

    // Table
    const table = new THREE.Mesh(new THREE.BoxGeometry(1.3, 0.8, 0.65), vanityMat);
    table.position.y = 0.4;
    table.castShadow = true;
    vanityGroup.add(table);

    // Vanity Stool with plush pink cushion
    const stool = new THREE.Mesh(
      new THREE.CylinderGeometry(0.28, 0.28, 0.38, 24),
      new THREE.MeshStandardMaterial({ color: 0xfbcfe8, roughness: 0.7 })
    );
    stool.position.set(0, 0.19, 0.65);
    vanityGroup.add(stool);

    // Mirror Frame
    const mirrorFrame = new THREE.Mesh(
      new THREE.TorusGeometry(0.48, 0.08, 16, 32),
      new THREE.MeshStandardMaterial({ color: 0xfbcfe8, roughness: 0.3 })
    );
    mirrorFrame.position.set(0, 1.35, -0.15);
    vanityGroup.add(mirrorFrame);

    // Mirror Glass Surface
    const mirrorGlass = new THREE.Mesh(
      new THREE.CircleGeometry(0.46, 32),
      new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.05, metalness: 0.9 })
    );
    mirrorGlass.position.set(0, 1.35, -0.14);
    vanityGroup.add(mirrorGlass);

    // Hollywood Vanity Bulbs around the mirror rim
    const bulbMat = new THREE.MeshStandardMaterial({
      color: 0xfef08a,
      emissive: 0xfef08a,
      emissiveIntensity: 0.6,
      roughness: 0.2,
    });
    for (let b = 0; b < 10; b++) {
      const ang = (b * Math.PI * 2) / 10;
      const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.045, 12, 12), bulbMat.clone());
      bulb.position.set(Math.cos(ang) * 0.48, 1.35 + Math.sin(ang) * 0.48, -0.12);
      vanityGroup.add(bulb);
      this.mirrorBulbs.push(bulb);
    }

    this.mirrorLight = new THREE.PointLight(0xffedd5, 0.8, 2.5);
    this.mirrorLight.position.set(0, 1.35, 0.1);
    vanityGroup.add(this.mirrorLight);

    this.group.add(vanityGroup);
  }

  /* -------------------------------------------------------------
   * 1. INTERACTIVE GIFT BOX (Clickable #1) - Perfectly Resting on Low Table!
   * ------------------------------------------------------------- */
  private buildInteractiveGiftBox() {
    const giftGroup = new THREE.Group();
    // Centered on the center rug
    giftGroup.position.set(0.2, 0, 0.3);
    giftGroup.name = 'interactive_gift';

    // Round low table for the gift box (resting on rug at y = 0.05)
    const tableTopY = 0.42;
    const tableMesh = new THREE.Mesh(
      new THREE.CylinderGeometry(0.65, 0.65, 0.36, 32),
      new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3 })
    );
    tableMesh.position.y = 0.24;
    tableMesh.castShadow = true;
    giftGroup.add(tableMesh);

    // Gift box base (sitting flush on the low table top at y = 0.42)
    const boxMat = new THREE.MeshStandardMaterial({
      color: 0xf472b6,
      roughness: 0.25,
      metalness: 0.15,
    });
    const boxHeight = 0.46;
    const boxBase = new THREE.Mesh(new THREE.BoxGeometry(0.85, boxHeight, 0.85), boxMat);
    boxBase.position.y = tableTopY + boxHeight / 2;
    boxBase.castShadow = true;
    giftGroup.add(boxBase);

    // Gold silk ribbon
    const ribMat = new THREE.MeshStandardMaterial({
      color: 0xfde047,
      metalness: 0.7,
      roughness: 0.2,
    });
    const ribV = new THREE.Mesh(new THREE.BoxGeometry(0.15, boxHeight + 0.01, 0.87), ribMat);
    ribV.position.y = tableTopY + boxHeight / 2;
    giftGroup.add(ribV);

    const ribH = new THREE.Mesh(new THREE.BoxGeometry(0.87, boxHeight + 0.01, 0.15), ribMat);
    ribH.position.y = tableTopY + boxHeight / 2;
    giftGroup.add(ribH);

    // Gift Box Lid Group (Hinged at back)
    this.giftLid = new THREE.Group();
    this.targetLidPosY = tableTopY + boxHeight;
    this.currentLidPosY = this.targetLidPosY;
    this.giftLid.position.set(0, this.targetLidPosY, -0.46);

    const lidTop = new THREE.Mesh(new THREE.BoxGeometry(0.92, 0.1, 0.92), boxMat);
    lidTop.position.set(0, 0.05, 0.46);
    lidTop.castShadow = true;
    this.giftLid.add(lidTop);

    // Lid ribbons
    const ribLidV = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.11, 0.94), ribMat);
    ribLidV.position.set(0, 0.05, 0.46);
    this.giftLid.add(ribLidV);

    const ribLidH = new THREE.Mesh(new THREE.BoxGeometry(0.94, 0.11, 0.15), ribMat);
    ribLidH.position.set(0, 0.05, 0.46);
    this.giftLid.add(ribLidH);

    // 4-Loop ribbon bow on top
    for (let b = 0; b < 4; b++) {
      const ang = (b * Math.PI) / 2;
      const loop = new THREE.Mesh(new THREE.TorusGeometry(0.14, 0.045, 14, 20), ribMat);
      loop.position.set(Math.cos(ang) * 0.1, 0.16, 0.46 + Math.sin(ang) * 0.1);
      loop.rotation.y = ang + Math.PI / 4;
      loop.rotation.x = Math.PI / 3;
      this.giftLid.add(loop);
    }

    giftGroup.add(this.giftLid);

    // Glowing faceted crystal heart that rises upon opening
    this.surpriseHeart = new THREE.Group();
    this.surpriseHeart.position.set(0, tableTopY + boxHeight / 2, 0);
    this.surpriseHeart.visible = false;

    const jewelMat = new THREE.MeshPhysicalMaterial({
      color: 0xff1493,
      emissive: 0xf43f5e,
      emissiveIntensity: 0.9,
      roughness: 0.1,
      metalness: 0.1,
      transmission: 0.6,
      ior: 1.5,
    });
    const jewelHeart = this.createHeartMesh(0.36, 0xff1493);
    jewelHeart.material = jewelMat;
    this.surpriseHeart.add(jewelHeart);

    const heartLight = new THREE.PointLight(0xff69b4, 1.8, 2.5);
    this.surpriseHeart.add(heartLight);

    giftGroup.add(this.surpriseHeart);
    this.group.add(giftGroup);
  }

  /* -------------------------------------------------------------
   * 9. INTERACTIVE FLOWER VASE & WALL SHELVES (Clickable #9)
   * ------------------------------------------------------------- */
  private buildInteractiveVaseAndShelves() {
    // Wall shelf mounted flush against the left wall
    const shelf = new THREE.Mesh(
      new THREE.BoxGeometry(1.4, 0.06, 0.32),
      new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3 })
    );
    shelf.position.set(-3.02, 2.2, 0.0);
    shelf.rotation.y = Math.PI / 2;
    this.group.add(shelf);

    // Brass mounting brackets
    const bracketMat = new THREE.MeshStandardMaterial({ color: 0xfbbf24, metalness: 0.85 });
    [-0.5, 0.5].forEach(bz => {
      const bMesh = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.18, 0.28), bracketMat);
      bMesh.position.set(-3.02, 2.1, bz);
      this.group.add(bMesh);
    });

    // INTERACTIVE FLOWER VASE
    const vaseGroup = new THREE.Group();
    vaseGroup.position.set(-3.02, 2.23, -0.35);
    vaseGroup.name = 'interactive_vase';

    const vaseMesh = new THREE.Mesh(
      new THREE.CylinderGeometry(0.09, 0.13, 0.28, 16),
      new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.15 })
    );
    vaseMesh.position.y = 0.14;
    vaseGroup.add(vaseMesh);

    // Tulips / roses in vase
    const flowerColors = [0xf472b6, 0xfda4af, 0xfde047];
    for (let f = 0; f < 3; f++) {
      const fl = new THREE.Mesh(
        new THREE.SphereGeometry(0.07, 12, 12),
        new THREE.MeshStandardMaterial({ color: flowerColors[f], roughness: 0.5 })
      );
      fl.position.set((f - 1) * 0.06, 0.32 + (f === 1 ? 0.04 : 0), 0);
      vaseGroup.add(fl);
    }

    // Floating hearts container (erupts on tap)
    this.vaseHearts = new THREE.Group();
    this.vaseHearts.position.set(0, 0.35, 0);
    this.vaseHearts.visible = false;

    for (let h = 0; h < 6; h++) {
      const hMesh = this.createHeartMesh(0.12, 0xf43f5e);
      hMesh.position.set((Math.random() - 0.5) * 0.2, h * 0.12, (Math.random() - 0.5) * 0.2);
      this.vaseHearts.add(hMesh);
    }
    vaseGroup.add(this.vaseHearts);

    this.group.add(vaseGroup);
  }

  /* -------------------------------------------------------------
   * 10. INTERACTIVE PHOTO FRAME (Clickable #10) - Ayaan & Ayra Keepsake!
   * ------------------------------------------------------------- */
  private buildInteractivePhotoFrame() {
    this.photoFrameGroup = new THREE.Group();
    this.photoFrameGroup.position.set(-1.4, 2.5, -2.93);
    this.photoFrameGroup.name = 'interactive_photo_frame';

    // Gold picture frame
    const frameMesh = new THREE.Mesh(
      new THREE.BoxGeometry(0.95, 1.2, 0.05),
      new THREE.MeshStandardMaterial({ color: 0xfbbf24, metalness: 0.85, roughness: 0.2 })
    );
    this.photoFrameGroup.add(frameMesh);

    // Front: Watercolor keepsake portrait of Ayaan & Ayra
    const photoFront = new THREE.Mesh(
      new THREE.PlaneGeometry(0.8, 1.05),
      new THREE.MeshBasicMaterial({ map: createPortraitTexture() })
    );
    photoFront.position.z = 0.028;
    this.photoFrameGroup.add(photoFront);

    // Reverse side keepsake
    const photoBack = new THREE.Mesh(
      new THREE.PlaneGeometry(0.8, 1.05),
      new THREE.MeshBasicMaterial({ map: createPortraitTexture() })
    );
    photoBack.rotation.y = Math.PI;
    photoBack.position.z = -0.028;
    this.photoFrameGroup.add(photoBack);

    this.group.add(this.photoFrameGroup);
  }

  /* -------------------------------------------------------------
   * FAIRY LIGHT CANOPY
   * ------------------------------------------------------------- */
  private buildFairyLightCanopy() {
    const bulbCount = 18;
    for (let i = 0; i < bulbCount; i++) {
      const t = i / (bulbCount - 1);
      const angle = -Math.PI * 0.55 + t * Math.PI * 1.05;
      const rad = 4.4;
      const px = Math.cos(angle) * rad;
      const pz = Math.sin(angle) * rad;
      const py = 3.25 + Math.sin(t * Math.PI * 2) * 0.18;

      const bulb = new THREE.Mesh(
        new THREE.SphereGeometry(0.075, 16, 16),
        new THREE.MeshStandardMaterial({
          color: 0xffedd5,
          emissive: 0xfef08a,
          emissiveIntensity: 0.95,
          roughness: 0.1,
        })
      );
      bulb.position.set(px, py, pz);
      this.group.add(bulb);
      this.fairyBulbs.push(bulb);

      if (i % 3 === 0) {
        const pl = new THREE.PointLight(0xffedd5, 0.5, 2.5);
        pl.position.set(px, py - 0.1, pz);
        this.group.add(pl);
        this.fairyLights.push(pl);
      }
    }
  }

  /** A small pair of interactive chibi keepsake dolls; their heads bob and one waves. */
  private buildKeepsakeDolls(){
    const cream=new THREE.MeshStandardMaterial({color:0xffd8c4,roughness:.87});
    const eyes=new THREE.MeshStandardMaterial({color:0x38293a,roughness:.18});
    const pink=new THREE.MeshStandardMaterial({color:0xf6a3bb,roughness:.89});
    const blush=new THREE.MeshStandardMaterial({color:0xf78ba1,roughness:1});
    const make=(isPinkii:boolean,x:number,z:number)=>{
      const rig=new THREE.Group();rig.name='interactive_doll';rig.position.set(x,0,z);rig.scale.setScalar(.80);
      const hair=new THREE.MeshStandardMaterial({color:isPinkii?0x392737:0x593b30,roughness:.94});
      const dress=new THREE.MeshStandardMaterial({color:isPinkii?0xeab2d3:0xa7c0d4,roughness:.89});
      const head=new THREE.Group();head.position.y=.84;rig.add(head);
      const hairBack=new THREE.Mesh(new THREE.SphereGeometry(.36,22,18),hair);hairBack.scale.set(1.07,1.06,.95);head.add(hairBack);
      const face=new THREE.Mesh(new THREE.SphereGeometry(.30,24,18),cream);face.position.z=.12;head.add(face);
      for(const side of [-1,1]){
        const eye=new THREE.Mesh(new THREE.SphereGeometry(.043,12,10),eyes);
        eye.scale.set(.9,1.16,.65);eye.position.set(side*.125,.024,.382);head.add(eye);
        const cheek=new THREE.Mesh(new THREE.SphereGeometry(.066,12,10),blush);
        cheek.scale.set(1,.48,.34);cheek.position.set(side*.207,-.085,.341);head.add(cheek);
      }
      const smile=new THREE.Mesh(new THREE.TorusGeometry(.060,.010,7,16,Math.PI),eyes);
      smile.rotation.z=Math.PI;smile.position.set(0,-.105,.42);head.add(smile);
      const fringe=new THREE.Mesh(new THREE.SphereGeometry(.24,18,14),hair);
      fringe.scale.set(1.37,.45,.65);fringe.position.set(0,.218,.22);head.add(fringe);
      if(isPinkii){
        const bow=new THREE.Group();bow.position.set(.235,.25,.06);
        for(const sx of [-1,1]){const wing=new THREE.Mesh(new THREE.SphereGeometry(.095,12,10),pink);
          wing.scale.set(.8,.5,.3);wing.position.x=sx*.075;bow.add(wing);}
        bow.add(new THREE.Mesh(new THREE.SphereGeometry(.055,12,10),cream));head.add(bow);
      }
      const body=new THREE.Mesh(new THREE.CylinderGeometry(.155,.275,.40,20),dress);
      body.position.y=.38;rig.add(body);
      const apron=new THREE.Mesh(new THREE.SphereGeometry(.20,18,10),
        new THREE.MeshStandardMaterial({color:isPinkii?0xfff3f6:0xc8dbe6,roughness:.95}));
      apron.scale.set(.83,.83,.15);apron.position.set(0,.37,.205);rig.add(apron);
      for(let side of [-1,1]){
        const foot=new THREE.Mesh(new THREE.SphereGeometry(.105,12,10),
          new THREE.MeshStandardMaterial({color:0xeed5bb,roughness:.84}));
        foot.scale.set(1,.56,1.34);foot.position.set(side*.125,.105,.065);rig.add(foot);
        const arm=new THREE.Group();arm.position.set(side*.205,.53,0);
        const sleeve=new THREE.Mesh(new THREE.CapsuleGeometry(.07,.19,4,10),dress);
        sleeve.rotation.z=side*.26;sleeve.position.set(side*.065,-.135,0);arm.add(sleeve);
        const hand=new THREE.Mesh(new THREE.SphereGeometry(.072,12,10),cream);
        hand.position.set(side*.092,-.285,.025);arm.add(hand);rig.add(arm);
        if(side===1)this.dollArms.push(arm);
      }
      // Keep the characters on the rug beside the gift, never through the bed.
      this.group.add(rig);this.keepsakeDolls.push(rig);
    };
    make(true,1.25,1.65);make(false,2.00,1.63);
  }
  public waveDolls(){ this.dollWaving=true;this.dollWaveTime=3.8;soundEngine.playSparkle(); }

  private buildCozyFinishingTouches(){
    const gold=new THREE.MeshStandardMaterial({color:0xc8a377,metalness:.43,roughness:.46});
    const cream=new THREE.MeshStandardMaterial({color:0xfff0e3,roughness:.88});
    // Delicate decorative wainscoting rails make the room read as architecture.
    for(const y of [.42,1.08]){
      const rail=new THREE.Mesh(new THREE.BoxGeometry(6.6,.035,.035),gold);
      rail.position.set(0,y,-2.876);this.group.add(rail);
    }
    // Bedside soft wall sconces with separate warm light falloff.
    for(const x of [-2.6,-.5]){
      const mount=new THREE.Mesh(new THREE.SphereGeometry(.095,14,10),gold);
      mount.position.set(x,2.5,-2.86);this.group.add(mount);
      const light=new THREE.Mesh(new THREE.SphereGeometry(.14,16,12),
        new THREE.MeshStandardMaterial({color:0xffe8bf,emissive:0xffc98d,emissiveIntensity:1.7}));
      light.position.set(x,2.35,-2.80);this.group.add(light);
      const glow=new THREE.PointLight(0xffbb91,.65,2.8);glow.position.set(x,2.32,-2.7);this.group.add(glow);
    }
    // Pretty books, plants and ceramics make the left shelf feel lived-in.
    for(let i=0;i<5;i++){
      const book=new THREE.Mesh(new RoundedBoxGeometry(.07,.26+i%2*.06,.18,2,.012),
        new THREE.MeshStandardMaterial({color:[0xa7c7d4,0xe4acc5,0xdfcb93,0xb8d2b4,0xd1b9db][i],roughness:.87}));
      book.position.set(-3,2.35,-.42+i*.17);this.group.add(book);
    }
    const beads=[[-2.65,1.1,.85],[-1.00,.95,.8],[1.45,1.07,.56]];
    beads.forEach(([x,y,z])=>{const c=new THREE.Mesh(new THREE.SphereGeometry(.10,12,10),cream);c.position.set(x,y,z);this.group.add(c);});
  }

  /* -------------------------------------------------------------
   * INTERACTION HANDLERS FOR ALL 10 OBJECTS
   * ------------------------------------------------------------- */
  public toggleGift() {
    this.isGiftOpen = !this.isGiftOpen;
    if (this.isGiftOpen) {
      soundEngine.playPop();
      soundEngine.playSparkle();
      this.targetLidRotX = -Math.PI * 0.62;
      this.targetLidPosY = 0.88;
      if (this.surpriseHeart) this.surpriseHeart.visible = true;
    } else {
      this.targetLidRotX = 0;
      this.targetLidPosY = 0.88;
      if (this.surpriseHeart) this.surpriseHeart.visible = false;
    }
  }

  public toggleLetter() {
    this.isLetterOpen = !this.isLetterOpen;
    if (this.isLetterOpen) {
      soundEngine.playLetterSound();
      this.targetFlapRotX = Math.PI * 0.92;
      this.targetLetterY = 0.32;
      setTimeout(() => this.onOpenLetterCallback?.(), 450);
    } else {
      this.targetFlapRotX = 0;
      this.targetLetterY = 0;
    }
  }

  public toggleLamp() {
    this.isLampOn = !this.isLampOn;
    soundEngine.playPop();
    if (this.lampLight && this.lampBulb) {
      this.lampLight.intensity = this.isLampOn ? 1.6 : 0.05;
      const mat = this.lampBulb.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = this.isLampOn ? 0.9 : 0.05;
    }
  }

  public toggleWindow() {
    this.isWindowOpen = !this.isWindowOpen;
    soundEngine.playSparkle();
    this.targetCurtainSpread = this.isWindowOpen ? 0.45 : 0;
  }

  public toggleDrawer() {
    this.isDrawerOpen = !this.isDrawerOpen;
    soundEngine.playPop();
    this.targetDrawerZ = this.isDrawerOpen ? 0.32 : 0;
  }

  public toggleWardrobe() {
    this.isWardrobeOpen = !this.isWardrobeOpen;
    soundEngine.playPop();
    this.targetDoorRot = this.isWardrobeOpen ? Math.PI * 0.48 : 0;
  }

  public triggerMirror() {
    soundEngine.playSparkle();
    this.isMirrorSparkling = true;
    this.mirrorTimer = 2.5;
    this.onMirrorCompliment?.();
  }

  public toggleMusicBox() {
    this.isMusicBoxPlaying = !this.isMusicBoxPlaying;
    soundEngine.playSparkle();
    soundEngine.playHugMelody();
    this.targetMusicLidRot = this.isMusicBoxPlaying ? -Math.PI * 0.55 : 0;
    if (this.ballerinaFigure) {
      this.ballerinaFigure.visible = this.isMusicBoxPlaying;
    }
  }

  public triggerVase() {
    soundEngine.playSparkle();
    this.isVasePulsing = true;
    this.vaseTimer = 3.0;
    if (this.vaseHearts) this.vaseHearts.visible = true;
  }

  public togglePhotoFrame() {
    this.isPhotoFlipped = !this.isPhotoFlipped;
    soundEngine.playSparkle();
    this.targetPhotoRotY = this.isPhotoFlipped ? Math.PI : 0;
  }

  private createHeartMesh(scale: number, color: number): THREE.Mesh {
    const shape = new THREE.Shape();
    const x = 0, y = 0;
    shape.moveTo(x + 0.25, y + 0.25);
    shape.bezierCurveTo(x + 0.25, y + 0.25, x + 0.2, y, x, y);
    shape.bezierCurveTo(x - 0.3, y, x - 0.3, y + 0.35, x - 0.3, y + 0.35);
    shape.bezierCurveTo(x - 0.3, y + 0.55, x - 0.1, y + 0.77, x + 0.25, y + 0.95);
    shape.bezierCurveTo(x + 0.6, y + 0.77, x + 0.8, y + 0.55, x + 0.8, y + 0.35);
    shape.bezierCurveTo(x + 0.8, y + 0.35, x + 0.8, y, x + 0.5, y);
    shape.bezierCurveTo(x + 0.35, y, x + 0.25, y + 0.25, x + 0.25, y + 0.25);

    const geo = new THREE.ExtrudeGeometry(shape, {
      depth: 0.14,
      bevelEnabled: true,
      bevelSegments: 4,
      steps: 1,
      bevelSize: 0.05,
      bevelThickness: 0.05,
    });
    geo.center();

    const mat = new THREE.MeshStandardMaterial({
      color,
      roughness: 0.3,
      metalness: 0.15,
      emissive: color,
      emissiveIntensity: 0.25,
    });

    const mesh = new THREE.Mesh(geo, mat);
    mesh.scale.set(scale, scale, scale);
    mesh.rotation.z = Math.PI;
    return mesh;
  }

  /* -------------------------------------------------------------
   * RENDER & ANIMATION LOOP
   * ------------------------------------------------------------- */
  public update(delta: number, time: number) {
    // 1. Gift lid
    this.currentLidRotX += (this.targetLidRotX - this.currentLidRotX) * 0.12;
    this.currentLidPosY += (this.targetLidPosY - this.currentLidPosY) * 0.12;
    if (this.giftLid) {
      this.giftLid.position.y = this.currentLidPosY;
      this.giftLid.rotation.x = this.currentLidRotX;
    }
    if (this.surpriseHeart && this.isGiftOpen) {
      this.surpriseHeart.rotation.y = time * 2.5;
      this.surpriseHeart.position.y = 1.05 + Math.sin(time * 3.5) * 0.08;
    }

    // 2. Envelope flap & letter
    this.currentFlapRotX += (this.targetFlapRotX - this.currentFlapRotX) * 0.15;
    this.currentLetterY += (this.targetLetterY - this.currentLetterY) * 0.12;
    if (this.envelopeFlap) this.envelopeFlap.rotation.x = this.currentFlapRotX;
    if (this.letterSheet) this.letterSheet.position.y = 0.012 + this.currentLetterY;

    // 4. Window & Curtains
    this.currentCurtainSpread += (this.targetCurtainSpread - this.currentCurtainSpread) * 0.1;
    if (this.leftCurtain && this.rightCurtain) {
      this.leftCurtain.position.x = -0.75 - this.currentCurtainSpread;
      this.rightCurtain.position.x = 0.75 + this.currentCurtainSpread;
    }
    if (this.leftWindowPane && this.rightWindowPane) {
      this.leftWindowPane.rotation.y = this.isWindowOpen ? -0.8 : 0;
      this.rightWindowPane.rotation.y = this.isWindowOpen ? 0.8 : 0;
    }

    // 5. Drawer slide
    this.currentDrawerZ += (this.targetDrawerZ - this.currentDrawerZ) * 0.12;
    if (this.drawerMesh) this.drawerMesh.position.z = this.currentDrawerZ;

    // 6. Wardrobe doors swing
    this.currentDoorRot += (this.targetDoorRot - this.currentDoorRot) * 0.12;
    if (this.leftDoor) this.leftDoor.rotation.y = -this.currentDoorRot;
    if (this.rightDoor) this.rightDoor.rotation.y = this.currentDoorRot;

    // 7. Vanity Mirror Sparkle
    if (this.isMirrorSparkling) {
      this.mirrorTimer -= delta;
      const intensity = 0.6 + Math.sin(time * 12) * 0.4;
      this.mirrorBulbs.forEach(b => {
        (b.material as THREE.MeshStandardMaterial).emissiveIntensity = intensity;
      });
      if (this.mirrorLight) this.mirrorLight.intensity = 0.8 + intensity * 0.8;
      if (this.mirrorTimer <= 0) {
        this.isMirrorSparkling = false;
        this.mirrorBulbs.forEach(b => {
          (b.material as THREE.MeshStandardMaterial).emissiveIntensity = 0.6;
        });
        if (this.mirrorLight) this.mirrorLight.intensity = 0.8;
      }
    }

    // 8. Music Box Ballerina
    this.currentMusicLidRot += (this.targetMusicLidRot - this.currentMusicLidRot) * 0.1;
    if (this.musicBoxLid) this.musicBoxLid.rotation.x = this.currentMusicLidRot;
    if (this.ballerinaFigure && this.isMusicBoxPlaying) {
      this.ballerinaFigure.rotation.y += delta * 4.0;
    }

    // 9. Flower Vase Floating Hearts
    if (this.isVasePulsing && this.vaseHearts) {
      this.vaseTimer -= delta;
      this.vaseHearts.position.y = 0.35 + Math.sin(time * 3.0) * 0.1;
      this.vaseHearts.rotation.y += delta * 1.5;
      if (this.vaseTimer <= 0) {
        this.isVasePulsing = false;
        this.vaseHearts.visible = false;
      }
    }

    // 10. Photo Frame Flip
    this.currentPhotoRotY += (this.targetPhotoRotY - this.currentPhotoRotY) * 0.1;
    if (this.photoFrameGroup) this.photoFrameGroup.rotation.y = this.currentPhotoRotY;

    // Animated chibi dolls have a subtle breathing bounce; the hand wave is a real articulated animation.
    this.keepsakeDolls.forEach((d,i)=>{d.position.y=Math.sin(time*2.0+i*1.2)*.016;d.rotation.y=Math.sin(time*.75+i)*.04;});
    if(this.dollWaving){
      this.dollWaveTime-=delta;
      this.dollArms.forEach((arm,i)=>{arm.rotation.z=-.9+Math.sin(time*10+i)*.24;});
      if(this.dollWaveTime<=0)this.dollWaving=false;
    }else this.dollArms.forEach(arm=>{arm.rotation.z*=.82;});
    // Fairy light gentle pulse
    this.fairyLights.forEach((l, i) => {
      l.intensity = 0.5 + Math.sin(time * 2.8 + i * 1.5) * 0.18;
    });
  }
}
