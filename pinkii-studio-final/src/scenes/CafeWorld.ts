import * as THREE from 'three';
import { soundEngine } from '../audio/soundEffects';
import {
  createWoodParquetTexture,
  createDarkWoodTexture,
  createChalkboardTexture,
  createLatteArtTexture,
  createFluffyRugTexture,
} from '../utils/textureGenerator';

export class CafeWorld {
  public group: THREE.Group;
  private ayaanCupGroup: THREE.Group | null = null;
  private pinkiiCupGroup: THREE.Group | null = null;
  private steamParticles: THREE.Points | null = null;
  private steamPositions: Float32Array | null = null;
  private steamVels: Float32Array | null = null;
  private pastryDisplay: THREE.Group | null = null;
  private pendantLight: THREE.PointLight | null = null;
  private tableLight: THREE.PointLight | null = null;
  private cityTram: THREE.Group | null = null;

  public isClinking: boolean = false;
  private clinkProgress: number = 0;

  constructor() {
    this.group = new THREE.Group();
    this.buildCafeArchitecture();
    this.buildFrenchWindows();
    this.buildCityBeyondWindow();
    this.buildCaféDetails();
    this.buildModernCaféStyling();
    this.buildBistroFurniture();
    this.buildCeramicCupsWithLatteArt();
    this.buildBakeryDisplayAndPastries();
    this.buildPendantLighting();
    this.buildRisingSteamSimulation();
    this.buildChalkboardMenu();
  }

  private buildCafeArchitecture() {
    // Platform base with rich warm walnut trim
    const baseGeo = new THREE.CylinderGeometry(4.8, 5.0, 0.45, 64);
    const baseMat = new THREE.MeshStandardMaterial({
      map: createDarkWoodTexture(),
      roughness: 0.5,
      metalness: 0.05,
    });
    const base = new THREE.Mesh(baseGeo, baseMat);
    base.position.y = -0.225;
    base.receiveShadow = true;
    this.group.add(base);

    // Rose gold edge trim
    const edgeTrim = new THREE.Mesh(
      new THREE.TorusGeometry(4.85, 0.06, 16, 64),
      new THREE.MeshStandardMaterial({ color: 0xfbbf24, metalness: 0.85, roughness: 0.25 })
    );
    edgeTrim.rotation.x = Math.PI / 2;
    edgeTrim.position.y = 0.01;
    this.group.add(edgeTrim);

    // Warm cafe walls
    const wallHeight = 3.6;
    const wallMat = new THREE.MeshStandardMaterial({
      color: 0xcba99e,
      roughness: 0.7,
    });

    // Actual architectural aperture: the window is NOT a picture placed on a solid wall.
    // Opening is x=-1.55..1.55 and y=1.38..3.34; the 3D city lives behind it.
    const wallParts: [number, number, number, number][] = [
      [-2.33, 1.8, 1.55, wallHeight], [2.33, 1.8, 1.55, wallHeight],
      [0, 0.69, 3.1, 1.38], [0, 3.47, 3.1, 0.26],
    ];
    wallParts.forEach(([x, y, w, h]) => {
      const part = new THREE.Mesh(new THREE.BoxGeometry(w, h, 0.22), wallMat);
      part.position.set(x, y, -2.8);
      part.receiveShadow = true;
      this.group.add(part);
    });

    const leftWall = new THREE.Mesh(new THREE.BoxGeometry(0.22, wallHeight, 5.8), wallMat);
    leftWall.position.set(-2.95, wallHeight / 2, 0.1);
    leftWall.receiveShadow = true;
    this.group.add(leftWall);

    // Lower wainscoting paneling
    const wainscotMat = new THREE.MeshStandardMaterial({
      color: 0xa96f64,
      roughness: 0.68,
    });
    const backWainscot = new THREE.Mesh(new THREE.BoxGeometry(6.2, 1.2, 0.26), wainscotMat);
    backWainscot.position.set(0, 0.6, -2.78);
    this.group.add(backWainscot);

    const leftWainscot = new THREE.Mesh(new THREE.BoxGeometry(0.26, 1.2, 5.8), wainscotMat);
    leftWainscot.position.set(-2.93, 0.6, 0.1);
    this.group.add(leftWainscot);

    // Floor - warm parquet tiles
    const floorGeo = new THREE.CylinderGeometry(4.65, 4.65, 0.04, 64);
    const floorMat = new THREE.MeshStandardMaterial({
      map: createWoodParquetTexture(),
      roughness: 0.4,
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.position.y = 0.02;
    floor.receiveShadow = true;
    this.group.add(floor);

    // Checkered bistro rug
    const rug = new THREE.Mesh(
      new THREE.CylinderGeometry(2.9, 2.9, 0.05, 48),
      new THREE.MeshStandardMaterial({
        map: createFluffyRugTexture('#fff7ed'),
        roughness: 0.85,
      })
    );
    rug.position.y = 0.04;
    rug.receiveShadow = true;
    this.group.add(rug);

    // Burgundy lace rug ring
    const lace = new THREE.Mesh(
      new THREE.TorusGeometry(2.92, 0.04, 16, 48),
      new THREE.MeshStandardMaterial({ color: 0x991b1b, roughness: 0.5 })
    );
    lace.rotation.x = Math.PI / 2;
    lace.position.y = 0.065;
    this.group.add(lace);
  }

  private buildFrenchWindows() {
    const win = new THREE.Group();
    win.position.set(0, 2.33, -2.635);
    const ivory = new THREE.MeshStandardMaterial({ color: 0xffe8d0, roughness: 0.43 });
    const brass = new THREE.MeshStandardMaterial({ color: 0xb9894f, metalness: 0.72, roughness: 0.32 });
    const piece = (w: number, h: number, x: number, y: number, z=0.03, mat: THREE.Material=ivory) => {
      const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, 0.09), mat);
      mesh.position.set(x,y,z); mesh.castShadow = true; win.add(mesh); return mesh;
    };
    piece(3.2, .13, 0, 1.02);
    piece(3.2, .16, 0, -1.01);
    piece(.14, 2.1, -1.57, 0);
    piece(.14, 2.1, 1.57, 0);
    piece(.08, 2.1, 0, 0);
    piece(3.1, .07, 0, -.08);
    piece(3.1, .035, 0, .54, -.012, brass);
    // Faint glass tint only, with actual transparent space behind it.
    const glass = new THREE.Mesh(new THREE.PlaneGeometry(3.04, 1.9),
      new THREE.MeshPhysicalMaterial({ color:0xbddcf3, roughness:.08, metalness:.03,
        transparent:true, opacity:.10, depthWrite:false, side:THREE.DoubleSide }));
    glass.position.z=.012; win.add(glass);
    // Bicolor awning and gold rim, physically outside above the French opening.
    const awning = new THREE.Group(); awning.position.set(0,1.2,.37);
    awning.rotation.x=.19;
    const stripeColors=[0xa93657,0xffedd5,0xa93657,0xffedd5,0xa93657,0xffedd5,0xa93657,0xffedd5];
    stripeColors.forEach((c,i)=>{
      const m=new THREE.Mesh(new THREE.BoxGeometry(.405,.055,.83),new THREE.MeshStandardMaterial({color:c,roughness:.87}));
      m.position.x=-1.415+i*.405; m.castShadow=true; awning.add(m);
    });
    win.add(awning);
    // Wall sconce illumination highlights the frame; doesn't hide the window view.
    for(const x of [-1.78,1.78]){
      const bulb = new THREE.Mesh(new THREE.SphereGeometry(.095,14,12),
        new THREE.MeshStandardMaterial({color:0xffebae,emissive:0xffc767,emissiveIntensity:1.7}));
      bulb.position.set(x,.30,.23);win.add(bulb);
    }
    this.group.add(win);
  }

  private buildCityBeyondWindow() {
    // A miniature city physically outside the café. Real parallax geometry,
    // layered skyline, glowing apartment windows, sidewalk, lamps and a tram.
    const city=new THREE.Group(); city.name='outside_city';
    const sky = new THREE.Mesh(new THREE.PlaneGeometry(12,6),
      new THREE.MeshBasicMaterial({map:this.makeCitySkyTexture(),side:THREE.DoubleSide}));
    sky.position.set(0,2.5,-11); city.add(sky);
    const starMat=new THREE.MeshBasicMaterial({color:0xfff1bc});
    for(let i=0;i<36;i++){
      const x=Math.sin(i*21.37)*5.3, y=1.6+((i*13)%31)/10;
      const m=new THREE.Mesh(new THREE.SphereGeometry(i%9===0?.04:.019,6,6),starMat);
      m.position.set(x,y,-10.88);city.add(m);
    }
    const moon = new THREE.Mesh(new THREE.SphereGeometry(.47,24,20),
      new THREE.MeshBasicMaterial({color:0xffe9bb}));
    moon.position.set(1.03,3.56,-10.75);city.add(moon);
    const pavementMat=new THREE.MeshStandardMaterial({color:0x393b55,roughness:.96});
    const pavement=new THREE.Mesh(new THREE.BoxGeometry(13,.14,3.8),pavementMat);
    pavement.position.set(0,.05,-5.8);city.add(pavement);
    const road=new THREE.Mesh(new THREE.PlaneGeometry(13,2.5),
      new THREE.MeshStandardMaterial({color:0x222a42,roughness:.34,metalness:.12}));
    road.rotation.x=-Math.PI/2;road.position.set(0,.14,-4.3);city.add(road);
    const palette=[0x394464,0x654964,0x364e62,0x51445f,0x5b3d58,0x354356,0x6a4b54];
    for(let b=0;b<9;b++){
      const x=-5.05+b*1.25;const h=2.1+(b*7%6)*.34;
      const z=-7.1-(b%3)*.47;
      const building=new THREE.Group();building.position.set(x,0,z);
      const front=new THREE.Mesh(new THREE.BoxGeometry(1.12,h,.72),
        new THREE.MeshStandardMaterial({color:palette[b%palette.length],roughness:.93}));
      front.position.y=h/2; building.add(front);
      const lit=[0xffcf87,0xffedb4,0xbfd7fc,0xffad95];
      for(let row=0;row<Math.floor((h-.42)/.46);row++) for(let col=0;col<3;col++){
        const on=(b*17+row*11+col*7)%5!==0;
        const pane=new THREE.Mesh(new THREE.PlaneGeometry(.18,.28),
          new THREE.MeshBasicMaterial({color:on?lit[(b+row+col)%4]:0x20273e,side:THREE.DoubleSide}));
        pane.position.set(-.34+col*.34,.5+row*.44,.372);building.add(pane);
        const sill=new THREE.Mesh(new THREE.BoxGeometry(.23,.023,.10),
          new THREE.MeshStandardMaterial({color:0xbca3a3}));
        sill.position.set(-.34+col*.34,.35+row*.44,.40);building.add(sill);
      }
      if(b%3===0){
        const striped=new THREE.Mesh(new THREE.BoxGeometry(.96,.08,.28),
          new THREE.MeshStandardMaterial({color:0xc45b65}));
        striped.position.set(0,.69,.52);building.add(striped);
        const door=new THREE.Mesh(new THREE.PlaneGeometry(.32,.56),
          new THREE.MeshBasicMaterial({color:0x1c2134}));
        door.position.set(0,.31,.381);building.add(door);
      }
      city.add(building);
    }
    // Tiny tram driving past the real window - clearly visible if the user watches.
    this.cityTram=new THREE.Group();
    const red=new THREE.MeshStandardMaterial({color:0xea7d88,roughness:.48});
    const tramBody=new THREE.Mesh(new THREE.BoxGeometry(1.22,.52,.45),red);
    tramBody.position.y=.43;this.cityTram.add(tramBody);
    for(let i=0;i<4;i++){
      const pane=new THREE.Mesh(new THREE.PlaneGeometry(.23,.24),
        new THREE.MeshBasicMaterial({color:0xffe4b0}));
      pane.position.set(-.42+i*.28,.48,.23);this.cityTram.add(pane);
    }
    for(const x of [-.4,.4]){
      const wheel=new THREE.Mesh(new THREE.CylinderGeometry(.11,.11,.07,12),
        new THREE.MeshStandardMaterial({color:0x262334}));
      wheel.rotation.x=Math.PI/2;wheel.position.set(x,.13,.21);this.cityTram.add(wheel);
    }
    this.cityTram.position.set(-2,.10,-5.45);city.add(this.cityTram);
    // Street lamps on the far pavement - amber pinpoints and reflections.
    for(const x of [-2.25,0,2.25]){
      const stem=new THREE.Mesh(new THREE.CylinderGeometry(.023,.035,1.12,10),
        new THREE.MeshStandardMaterial({color:0x242639,metalness:.5}));
      stem.position.set(x,.66,-6.1);city.add(stem);
      const bulb=new THREE.Mesh(new THREE.SphereGeometry(.13,12,10),
        new THREE.MeshBasicMaterial({color:0xffcc79}));
      bulb.position.set(x,1.23,-6.1);city.add(bulb);
      const glow=new THREE.PointLight(0xffb965,.8,1.7);glow.position.copy(bulb.position);city.add(glow);
    }
    this.group.add(city);
  }

  private makeCitySkyTexture():THREE.CanvasTexture {
    const c=document.createElement('canvas');c.width=512;c.height=256;
    const ctx=c.getContext('2d')!;
    const grad=ctx.createLinearGradient(0,0,0,256);
    grad.addColorStop(0,'#131a38');grad.addColorStop(.57,'#624468');grad.addColorStop(1,'#f2a58b');
    ctx.fillStyle=grad;ctx.fillRect(0,0,512,256);
    // Hazy urban sky beyond the café; keeps a genuine 3D parallax skyline in front.
    for(let i=0;i<6;i++){
      const x=[67,178,300,411,477,213][i], y=[202,170,192,151,211,226][i];
      const glow=ctx.createRadialGradient(x,y,0,x,y,68);
      glow.addColorStop(0,'rgba(255,190,156,.22)');glow.addColorStop(1,'rgba(255,190,156,0)');
      ctx.fillStyle=glow;ctx.fillRect(x-68,y-68,136,136);
    }
    const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;return t;
  }

  private buildModernCaféStyling(){
    // Coordinated contemporary rose-gold / ivory coffee shop; not a dark stage corner.
    const brass=new THREE.MeshStandardMaterial({color:0xc49361,metalness:.65,roughness:.34});
    const pale=new THREE.MeshStandardMaterial({color:0xffe8df,roughness:.87});
    const rose=new THREE.MeshStandardMaterial({color:0xc97a82,roughness:.72});
    const greenery=new THREE.MeshStandardMaterial({color:0x4e8867,roughness:.91});
    // Decorative timber slat wall flanking large street-facing window.
    for(let i=0;i<8;i++){
      for(const side of [-1,1]){
        const x=side*(1.82+i*.145);
        const trim=new THREE.Mesh(new THREE.BoxGeometry(.035,2.12,.067),brass);
        trim.position.set(x,2.02,-2.65);this.group.add(trim);
      }
    }
    // Wide marble countertop near the left rear wall, outside the customer table clearance.
    const service=new THREE.Group();service.position.set(-2.30,0,-1.15);
    const counter=new THREE.Mesh(new THREE.BoxGeometry(.62,.09,1.65),
      new THREE.MeshStandardMaterial({color:0xf9e7dc,roughness:.24,metalness:.08}));
    counter.position.y=1.05;counter.castShadow=true;service.add(counter);
    const cabinet=new THREE.Mesh(new THREE.BoxGeometry(.54,.92,1.58),
      new THREE.MeshStandardMaterial({color:0x9e625c,roughness:.70}));
    cabinet.position.y=.55;cabinet.castShadow=true;service.add(cabinet);
    for(const z of [-.45,0,.45]){
      const line=new THREE.Mesh(new THREE.BoxGeometry(.01,.65,.012),brass);
      line.position.set(.283,.54,z);service.add(line);
    }
    // Three pastry domes with soft glaze, individually visible on a little tier.
    for(let i=0;i<3;i++){
      const z=-.5+i*.48;
      const stand=new THREE.Mesh(new THREE.CylinderGeometry(.17,.19,.035,20),brass);
      stand.position.set(0,1.11,z);service.add(stand);
      const pastry=new THREE.Mesh(new THREE.SphereGeometry(.13,16,12),
        new THREE.MeshStandardMaterial({color:[0xf5ae91,0xd4b1ca,0xf0ddab][i],roughness:.52}));
      pastry.scale.set(1,.65,1);pastry.position.set(0,1.18,z);service.add(pastry);
      const berry=new THREE.Mesh(new THREE.SphereGeometry(.04,12,10),rose);
      berry.position.set(0,1.29,z);service.add(berry);
    }
    this.group.add(service);
    // Modern illuminated brand panel on left interior wall.
    const boardCanvas=document.createElement('canvas');boardCanvas.width=512;boardCanvas.height=260;
    const cx=boardCanvas.getContext('2d')!;
    const bg=cx.createLinearGradient(0,0,512,260);bg.addColorStop(0,'#774c5d');bg.addColorStop(1,'#ad687b');
    cx.fillStyle=bg;cx.fillRect(0,0,512,260);
    cx.strokeStyle='#f3d4ac';cx.lineWidth=8;cx.strokeRect(17,17,478,226);
    cx.textAlign='center';cx.fillStyle='#fff2e0';cx.font='italic 68px Georgia';cx.fillText("Pinkii's",256,118);
    cx.font='bold 52px Georgia';cx.fillText('little café',256,184);
    cx.fillStyle='#f9cfb2';cx.font='22px Georgia';cx.fillText('two cups • countless tomorrows',256,222);
    const bt=new THREE.CanvasTexture(boardCanvas);bt.colorSpace=THREE.SRGBColorSpace;
    const brand=new THREE.Mesh(new THREE.PlaneGeometry(1.15,.62),
      new THREE.MeshBasicMaterial({map:bt,side:THREE.DoubleSide}));
    brand.rotation.y=Math.PI/2;brand.position.set(-2.825,2.75,1.12);this.group.add(brand);
    // Layered arched niche sconces: real warm local pools instead of globally dark brown.
    for(const [x,z] of [[-2.56,-1.94],[2.54,-1.96]]){
      const backplate=new THREE.Mesh(new THREE.SphereGeometry(.19,16,12),brass);
      backplate.scale.set(.65,1.2,.15);backplate.position.set(x,2.65,z);this.group.add(backplate);
      const sphere=new THREE.Mesh(new THREE.SphereGeometry(.085,12,12),
        new THREE.MeshStandardMaterial({color:0xfff2cf,emissive:0xffc994,emissiveIntensity:1.9}));
      sphere.position.set(x,2.58,z+.10);this.group.add(sphere);
      const light=new THREE.PointLight(0xffe2b9,1.4,3.2);light.position.set(x,2.51,z+.13);this.group.add(light);
    }
    // Flower arrangement on side console, avoiding café table intersections.
    const vase=new THREE.Mesh(new THREE.CylinderGeometry(.105,.14,.34,16),pale);
    vase.position.set(-2.3,1.27,-1.25);this.group.add(vase);
    for(let i=0;i<5;i++){
      const a=i*2.4;
      const stem=new THREE.Mesh(new THREE.CylinderGeometry(.008,.008,.45,6),greenery);
      stem.position.set(-2.3+Math.sin(a)*.11,1.61,-1.25+Math.cos(a)*.1);stem.rotation.z=Math.sin(a)*.3;this.group.add(stem);
      const flower=new THREE.Mesh(new THREE.SphereGeometry(.09,12,10),rose);
      flower.position.set(-2.3+Math.sin(a)*.17,1.85+(i%2)*.07,-1.25+Math.cos(a)*.14);this.group.add(flower);
    }
    // Bright ambient fill localized inside this scene only, so garden retains moonlit mood.
    const fill=new THREE.PointLight(0xffe7d0,2.1,7.5);
    fill.position.set(1.45,3.2,2.0);this.group.add(fill);
  }

  private buildCaféDetails() {
    // Visible interior details: a small bakery service shelf, picture gallery,
    // pots and sconces. Kept away from the central table's clear interaction area.
    const rosewood=new THREE.MeshStandardMaterial({color:0x875b48,roughness:.65});
    const brass=new THREE.MeshStandardMaterial({color:0xd9ac71,metalness:.64,roughness:.30});
    for(const x of [-2.30,2.3]){
      const shelf=new THREE.Mesh(new THREE.BoxGeometry(.94,.075,.34),rosewood);
      shelf.position.set(x,2.22,-2.50); shelf.castShadow=true;this.group.add(shelf);
      for(let i=0;i<3;i++){
        const jar=new THREE.Mesh(new THREE.CylinderGeometry(.105,.11,.2,18),
          new THREE.MeshStandardMaterial({color:[0xf4b6bc,0xe0c69e,0xcbbde9][i],roughness:.3}));
        jar.position.set(x-.28+i*.28,2.36,-2.5); this.group.add(jar);
      }
      const pictureFrame=new THREE.Mesh(new THREE.BoxGeometry(.67,.65,.045),brass);
      pictureFrame.position.set(x,2.95,-2.65);this.group.add(pictureFrame);
      const picture=new THREE.Mesh(new THREE.PlaneGeometry(.57,.55),
        new THREE.MeshBasicMaterial({color:0xf6c4b2}));
      picture.position.set(x,2.95,-2.617);this.group.add(picture);
    }
    const greenery=new THREE.MeshStandardMaterial({color:0x579273,roughness:.93});
    const potmat=new THREE.MeshStandardMaterial({color:0xf2d0c3,roughness:.76});
    for(const [x,z] of [[-2.27,.72],[2.4,-1.35]]){
      const pot=new THREE.Mesh(new THREE.CylinderGeometry(.20,.16,.37,16),potmat);
      pot.position.set(x,.21,z);this.group.add(pot);
      for(let i=0;i<7;i++){
        const a=i*Math.PI*2/7;
        const leaf=new THREE.Mesh(new THREE.SphereGeometry(.18,10,8),greenery);
        leaf.scale.set(.30,1.7,.6);leaf.position.set(x+Math.sin(a)*.18,.63+(i%2)*.1,z+Math.cos(a)*.15);
        leaf.rotation.z=Math.sin(a)*.7;this.group.add(leaf);
      }
    }
    // Tiny ambient candle that illuminates the dessert plate without clipping it.
    const candle=new THREE.PointLight(0xffc195,.75,1.8);candle.position.set(.9,1.56,-.35);this.group.add(candle);
  }

  private buildBistroFurniture() {
    const tableGroup = new THREE.Group();
    tableGroup.position.set(0, 0, 0);

    // Polished Honey Oak Bistro Table Top
    const topGeo = new THREE.CylinderGeometry(1.45, 1.45, 0.1, 48);
    const topMat = new THREE.MeshStandardMaterial({
      map: createWoodParquetTexture(),
      roughness: 0.25,
      metalness: 0.05,
    });
    const tableTop = new THREE.Mesh(topGeo, topMat);
    tableTop.position.y = 1.18;
    tableTop.castShadow = true;
    tableTop.receiveShadow = true;
    tableGroup.add(tableTop);

    // Brass edge rim
    const rim = new THREE.Mesh(
      new THREE.TorusGeometry(1.45, 0.035, 16, 48),
      new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.85, roughness: 0.2 })
    );
    rim.rotation.x = Math.PI / 2;
    rim.position.y = 1.18;
    tableGroup.add(rim);

    // Delicate linen lace table runner / cloth in center
    const runner = new THREE.Mesh(
      new THREE.CylinderGeometry(1.05, 1.05, 0.015, 32),
      new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.8 })
    );
    runner.position.y = 1.235;
    tableGroup.add(runner);

    // Cast-iron bistro pedestal base with scrolling curves
    const ironMat = new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.5 });
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.12, 1.15, 24), ironMat);
    pole.position.y = 0.58;
    pole.castShadow = true;
    tableGroup.add(pole);

    const base = new THREE.Mesh(new THREE.CylinderGeometry(0.72, 0.78, 0.09, 32), ironMat);
    base.position.y = 0.045;
    base.receiveShadow = true;
    tableGroup.add(base);

    // Two Elegant Parisian Bistro Chairs with curved backs
    this.buildChair(-1.55, 0, Math.PI * 0.45, ironMat, topMat);
    this.buildChair(1.55, 0, -Math.PI * 0.45, ironMat, topMat);

    // Small flower vase in center of table
    const vaseMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.2 });
    const vase = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.1, 0.24, 16), vaseMat);
    vase.position.set(0, 1.35, -0.2);
    tableGroup.add(vase);

    // Tiny pink rose in vase
    const roseBud = new THREE.Mesh(
      new THREE.SphereGeometry(0.07, 12, 12),
      new THREE.MeshStandardMaterial({ color: 0xf43f5e, roughness: 0.4 })
    );
    roseBud.position.set(0, 1.5, -0.2);
    tableGroup.add(roseBud);

    this.group.add(tableGroup);
  }

  private buildChair(x: number, z: number, rotY: number, metalMat: THREE.Material, woodMat: THREE.Material) {
    const chair = new THREE.Group();
    chair.position.set(x, 0, z);
    chair.rotation.y = rotY;

    // Curved seat
    const seat = new THREE.Mesh(new THREE.CylinderGeometry(0.52, 0.52, 0.07, 32), woodMat);
    seat.position.y = 0.68;
    seat.castShadow = true;
    chair.add(seat);

    // Legs
    const legGeo = new THREE.CylinderGeometry(0.035, 0.035, 0.68, 12);
    const offsets = [
      [-0.32, -0.32], [0.32, -0.32],
      [-0.32, 0.32], [0.32, 0.32]
    ];
    offsets.forEach(([lx, lz]) => {
      const leg = new THREE.Mesh(legGeo, metalMat);
      leg.position.set(lx, 0.34, lz);
      chair.add(leg);
    });

    // Ornate curved backrest
    const back = new THREE.Mesh(new THREE.TorusGeometry(0.48, 0.035, 12, 24, Math.PI), metalMat);
    back.position.set(0, 1.15, -0.38);
    back.rotation.x = Math.PI * 0.09;
    chair.add(back);

    this.group.add(chair);
  }

  private buildCeramicCupsWithLatteArt() {
    // Pinkii's Rose Ceramic Cup
    this.pinkiiCupGroup = new THREE.Group();
    this.pinkiiCupGroup.position.set(0.45, 1.24, 0.1);
    this.pinkiiCupGroup.name = 'interactive_pinkii_cup';

    const pinkCupMat = new THREE.MeshStandardMaterial({
      color: 0xf472b6,
      roughness: 0.2,
      metalness: 0.1,
    });
    this.buildSingleCup(this.pinkiiCupGroup, pinkCupMat, true);
    this.group.add(this.pinkiiCupGroup);

    // Ayaan's Sky Blue Ceramic Cup
    this.ayaanCupGroup = new THREE.Group();
    this.ayaanCupGroup.position.set(-0.45, 1.24, 0.1);
    this.ayaanCupGroup.name = 'interactive_ayaan_cup';

    const ayaanCupMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      roughness: 0.2,
      metalness: 0.1,
    });
    this.buildSingleCup(this.ayaanCupGroup, ayaanCupMat, false);
    this.group.add(this.ayaanCupGroup);
  }

  private buildSingleCup(parent: THREE.Group, cupMat: THREE.Material, isPinkii: boolean) {
    // Ceramic cup body
    const cup = new THREE.Mesh(new THREE.CylinderGeometry(0.19, 0.14, 0.28, 32), cupMat);
    cup.position.y = 0.14;
    cup.castShadow = true;
    parent.add(cup);

    // Gold rim
    const goldRim = new THREE.Mesh(
      new THREE.TorusGeometry(0.192, 0.015, 12, 32),
      new THREE.MeshStandardMaterial({ color: 0xfbbf24, metalness: 0.85, roughness: 0.2 })
    );
    goldRim.rotation.x = Math.PI / 2;
    goldRim.position.y = 0.28;
    parent.add(goldRim);

    // Handle
    const handle = new THREE.Mesh(
      new THREE.TorusGeometry(0.1, 0.028, 12, 24, Math.PI),
      cupMat
    );
    handle.rotation.z = Math.PI / 2;
    handle.position.set(isPinkii ? 0.2 : -0.2, 0.14, 0);
    parent.add(handle);

    // Saucer
    const saucer = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.25, 0.035, 32), cupMat);
    saucer.position.y = 0.018;
    saucer.receiveShadow = true;
    parent.add(saucer);

    // Realistic Heart Latte Art on coffee foam surface
    const latteArtMat = new THREE.MeshStandardMaterial({
      map: createLatteArtTexture(),
      roughness: 0.4,
    });
    const espresso = new THREE.Mesh(new THREE.CircleGeometry(0.18, 32), latteArtMat);
    espresso.rotation.x = -Math.PI / 2;
    espresso.position.y = 0.265;
    parent.add(espresso);
  }

  private buildBakeryDisplayAndPastries() {
    this.pastryDisplay = new THREE.Group();
    this.pastryDisplay.position.set(0, 1.24, -0.48);
    this.pastryDisplay.name = 'interactive_pastry';

    // 2-Tier porcelain dessert stand
    const standMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.2 });
    const goldPostMat = new THREE.MeshStandardMaterial({ color: 0xfbbf24, metalness: 0.85, roughness: 0.2 });

    const plate1 = new THREE.Mesh(new THREE.CylinderGeometry(0.46, 0.4, 0.04, 32), standMat);
    plate1.position.y = 0.02;
    this.pastryDisplay.add(plate1);

    const post = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.35, 16), goldPostMat);
    post.position.y = 0.18;
    this.pastryDisplay.add(post);

    const plate2 = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.28, 0.035, 32), standMat);
    plate2.position.y = 0.35;
    this.pastryDisplay.add(plate2);

    // Colorful French macarons on bottom tier
    const macaronColors = [0xf472b6, 0x86efac, 0xfde047, 0xa855f7];
    for (let m = 0; m < 4; m++) {
      const ang = (m * Math.PI) / 2;
      const mac = new THREE.Group();
      mac.position.set(Math.cos(ang) * 0.24, 0.06, Math.sin(ang) * 0.24);

      const shellMat = new THREE.MeshStandardMaterial({ color: macaronColors[m], roughness: 0.6 });
      const topShell = new THREE.Mesh(new THREE.SphereGeometry(0.08, 16, 12, 0, Math.PI * 2, 0, Math.PI * 0.5), shellMat);
      topShell.position.y = 0.03;
      mac.add(topShell);

      const botShell = new THREE.Mesh(new THREE.SphereGeometry(0.08, 16, 12, 0, Math.PI * 2, 0, Math.PI * 0.5), shellMat);
      botShell.rotation.x = Math.PI;
      botShell.position.y = 0.03;
      mac.add(botShell);

      this.pastryDisplay.add(mac);
    }

    // Top tier heart strawberry cake
    const cakeShape = new THREE.Shape();
    const x = 0, y = 0;
    cakeShape.moveTo(x + 0.1, y + 0.1);
    cakeShape.bezierCurveTo(x + 0.1, y + 0.1, x + 0.08, y, x, y);
    cakeShape.bezierCurveTo(x - 0.12, y, x - 0.12, y + 0.14, x - 0.12, y + 0.14);
    cakeShape.bezierCurveTo(x - 0.12, y + 0.22, x - 0.04, y + 0.3, x + 0.1, y + 0.38);
    cakeShape.bezierCurveTo(x + 0.24, y + 0.3, x + 0.32, y + 0.22, x + 0.32, y + 0.14);
    cakeShape.bezierCurveTo(x + 0.32, y + 0.14, x + 0.32, y, x + 0.2, y);
    cakeShape.bezierCurveTo(x + 0.14, y, x + 0.1, y + 0.1, x + 0.1, y + 0.1);

    const cakeGeo = new THREE.ExtrudeGeometry(cakeShape, { depth: 0.08, bevelEnabled: true, bevelSize: 0.02, bevelThickness: 0.02 });
    cakeGeo.center();
    const cake = new THREE.Mesh(cakeGeo, new THREE.MeshStandardMaterial({ color: 0xfff1f2, roughness: 0.5 }));
    cake.rotation.x = -Math.PI / 2;
    cake.position.set(0, 0.42, 0);
    this.pastryDisplay.add(cake);

    this.group.add(this.pastryDisplay);
  }

  private buildPendantLighting() {
    const lampGroup = new THREE.Group();
    // Offset the pendant so it does not block the cityscape beyond the window.
    lampGroup.position.set(-1.45, 3.75, 0.25);

    // Brass chain cord
    const cord = new THREE.Mesh(
      new THREE.CylinderGeometry(0.015, 0.015, 1.4, 8),
      new THREE.MeshStandardMaterial({ color: 0x78716c })
    );
    cord.position.y = -0.7;
    lampGroup.add(cord);

    // Warm vintage bronze lamp shade
    const shade = new THREE.Mesh(
      new THREE.ConeGeometry(0.6, 0.42, 24, 1, true),
      new THREE.MeshStandardMaterial({ color: 0x27272a, roughness: 0.4, side: THREE.DoubleSide })
    );
    shade.position.y = -1.4;
    lampGroup.add(shade);

    // Glowing Edison filament bulb
    const bulb = new THREE.Mesh(
      new THREE.SphereGeometry(0.14, 16, 16),
      new THREE.MeshStandardMaterial({
        color: 0xfef08a,
        emissive: 0xf59e0b,
        emissiveIntensity: 1.2,
        roughness: 0.1,
      })
    );
    bulb.position.y = -1.52;
    lampGroup.add(bulb);

    // Warm table lighting
    this.pendantLight = new THREE.PointLight(0xffeed8, 4.2, 6.8);
    this.pendantLight.position.set(0, -1.55, 0);
    this.pendantLight.castShadow = true;
    lampGroup.add(this.pendantLight);

    this.tableLight = new THREE.PointLight(0xffcdac, 1.9, 4.8);
    this.tableLight.position.set(0, -2.2, 0);
    lampGroup.add(this.tableLight);

    this.group.add(lampGroup);
  }

  private buildChalkboardMenu() {
    // Vintage chalkboard easel menu board in corner
    const menuGroup = new THREE.Group();
    menuGroup.position.set(-2.0, 0, 1.4);
    menuGroup.rotation.y = Math.PI * 0.35;

    // Wooden A-frame easel
    const woodMat = new THREE.MeshStandardMaterial({
      map: createDarkWoodTexture(),
      roughness: 0.6,
    });
    const boardMat = new THREE.MeshStandardMaterial({
      map: createChalkboardTexture(),
      roughness: 0.8,
    });

    const board = new THREE.Mesh(new THREE.BoxGeometry(0.75, 1.15, 0.05), boardMat);
    board.position.set(0, 0.9, 0);
    board.castShadow = true;
    menuGroup.add(board);

    // Easel frame legs
    const frameL = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 1.6, 8), woodMat);
    frameL.position.set(-0.4, 0.8, 0);
    menuGroup.add(frameL);

    const frameR = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 1.6, 8), woodMat);
    frameR.position.set(0.4, 0.8, 0);
    menuGroup.add(frameR);

    this.group.add(menuGroup);
  }

  private buildRisingSteamSimulation() {
    const count = 48;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const vels = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const isPinkCup = i % 2 === 0;
      const cupX = isPinkCup ? 0.45 : -0.45;
      positions[i * 3] = cupX + (Math.random() - 0.5) * 0.12;
      positions[i * 3 + 1] = 1.5 + Math.random() * 0.7;
      positions[i * 3 + 2] = 0.1 + (Math.random() - 0.5) * 0.12;

      vels[i * 3] = (Math.random() - 0.5) * 0.005;
      vels[i * 3 + 1] = 0.009 + Math.random() * 0.009;
      vels[i * 3 + 2] = (Math.random() - 0.5) * 0.005;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.09,
      transparent: true,
      opacity: 0.5,
    });

    this.steamParticles = new THREE.Points(geometry, material);
    this.steamPositions = positions;
    this.steamVels = vels;
    this.group.add(this.steamParticles);
  }

  public triggerClink() {
    if (this.isClinking) return;
    this.isClinking = true;
    this.clinkProgress = 0;
    soundEngine.playCoffeeClink();
    soundEngine.playSparkle();
  }

  public update(delta: number, time: number) {
    // Rising steam simulation
    if (this.steamParticles && this.steamPositions && this.steamVels) {
      const pos = this.steamPositions;
      const vel = this.steamVels;
      const count = pos.length / 3;

      for (let i = 0; i < count; i++) {
        pos[i * 3] += vel[i * 3] + Math.sin(time * 3.5 + i) * 0.003;
        pos[i * 3 + 1] += vel[i * 3 + 1];
        pos[i * 3 + 2] += vel[i * 3 + 2] + Math.cos(time * 3.5 + i) * 0.003;

        if (pos[i * 3 + 1] > 2.3) {
          const isPinkCup = i % 2 === 0;
          pos[i * 3] = (isPinkCup ? 0.45 : -0.45) + (Math.random() - 0.5) * 0.1;
          pos[i * 3 + 1] = 1.5;
          pos[i * 3 + 2] = 0.1 + (Math.random() - 0.5) * 0.1;
        }
      }
      this.steamParticles.geometry.attributes.position.needsUpdate = true;
    }

    // Interactive cheers clink
    if (this.isClinking && this.pinkiiCupGroup && this.ayaanCupGroup) {
      this.clinkProgress += delta * 3.6;
      const t = this.clinkProgress;

      if (t < 1.0) {
        const swing = Math.sin(t * Math.PI);
        // Lift over the table before moving inward; no clipping into the tabletop.
        this.pinkiiCupGroup.position.x = 0.45 - swing * 0.25;
        this.ayaanCupGroup.position.x = -0.45 + swing * 0.25;
        this.pinkiiCupGroup.position.y = 1.24 + .27 * swing;
        this.ayaanCupGroup.position.y = 1.24 + .27 * swing;
        this.pinkiiCupGroup.rotation.z = -swing * 0.14;
        this.ayaanCupGroup.rotation.z = swing * 0.14;
      } else {
        this.pinkiiCupGroup.position.x = 0.45;
        this.ayaanCupGroup.position.x = -0.45;
        this.pinkiiCupGroup.position.y = 1.24;
        this.ayaanCupGroup.position.y = 1.24;
        this.pinkiiCupGroup.rotation.z = 0;
        this.ayaanCupGroup.rotation.z = 0;
        this.isClinking = false;
      }
    }

    // Pastry display ambient slow spin
    if (this.pastryDisplay) {
      this.pastryDisplay.rotation.y = Math.sin(time * 0.5) * 0.15;
    }

    if (this.cityTram) {
      // Small motion loop behind the café window: unmistakable outside life.
      this.cityTram.position.x = Math.sin(time * .24) * 3.0;
    }

    // Pendant lamp subtle glow
    if (this.pendantLight) {
      this.pendantLight.intensity = 2.4 + Math.sin(time * 4) * 0.1;
    }
  }
}
