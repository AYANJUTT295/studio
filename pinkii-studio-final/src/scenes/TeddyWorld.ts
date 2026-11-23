import * as THREE from 'three';
import { soundEngine } from '../audio/soundEffects';
import confetti from 'canvas-confetti';
import { createFluffyRugTexture, createWoodParquetTexture, createDarkWoodTexture } from '../utils/textureGenerator';

interface BearRig {
  root: THREE.Group;
  torso: THREE.Group;
  head: THREE.Group;
  armLeft: THREE.Group;
  armRight: THREE.Group;
  legLeft: THREE.Group;
  legRight: THREE.Group;
  startX: number;
  targetX: number;
}

export class TeddyWorld {
  public group: THREE.Group;
  private ayaanBear!: BearRig;
  private pinkiiBear!: BearRig;
  private floatingHearts: THREE.Group;
  private heartMeshes: THREE.Mesh[] = [];
  private twinkleLights: THREE.PointLight[] = [];

  // Animation states: 'idle' | 'walking' | 'embracing'
  public state: 'idle' | 'walking' | 'embracing' = 'idle';
  private walkTime: number = 0;
  private hugTime: number = 0;
  public onHugStart?: () => void;

  constructor() {
    this.group = new THREE.Group();
    this.floatingHearts = new THREE.Group();
    this.group.add(this.floatingHearts);

    this.buildCuddleRoomEnvironment();
    this.buildAyaanBear();
    this.buildPinkiiBear();
    this.buildFloatingHeartsPool();
  }

  private buildCuddleRoomEnvironment() {
    // Platform base with warm mahogany rose finish
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

    // Golden boundary ring
    const edgeTrim = new THREE.Mesh(
      new THREE.TorusGeometry(4.85, 0.06, 16, 64),
      new THREE.MeshStandardMaterial({ color: 0xfbbf24, metalness: 0.85, roughness: 0.25 })
    );
    edgeTrim.rotation.x = Math.PI / 2;
    edgeTrim.position.y = 0.01;
    this.group.add(edgeTrim);

    // Warm wooden wall backdrop
    const wallHeight = 3.6;
    const wallMat = new THREE.MeshStandardMaterial({
      color: 0x4a2e35,
      roughness: 0.7,
    });

    const backWall = new THREE.Mesh(new THREE.BoxGeometry(6.2, wallHeight, 0.22), wallMat);
    backWall.position.set(0, wallHeight / 2, -2.8);
    backWall.receiveShadow = true;
    this.group.add(backWall);

    const leftWall = new THREE.Mesh(new THREE.BoxGeometry(0.22, wallHeight, 5.8), wallMat);
    leftWall.position.set(-2.95, wallHeight / 2, 0.1);
    leftWall.receiveShadow = true;
    this.group.add(leftWall);

    // Warm wooden flooring
    const floorGeo = new THREE.CylinderGeometry(4.65, 4.65, 0.04, 64);
    const floorMat = new THREE.MeshStandardMaterial({
      map: createWoodParquetTexture(),
      roughness: 0.45,
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.position.y = 0.02;
    floor.receiveShadow = true;
    this.group.add(floor);

    // Plush circular scalloped carpet in center
    const carpetOuter = new THREE.Mesh(
      new THREE.CylinderGeometry(3.1, 3.1, 0.05, 48),
      new THREE.MeshStandardMaterial({
        map: createFluffyRugTexture('#fbcfe8'),
        roughness: 0.9,
      })
    );
    carpetOuter.position.y = 0.04;
    carpetOuter.receiveShadow = true;
    this.group.add(carpetOuter);

    const carpetInner = new THREE.Mesh(
      new THREE.CylinderGeometry(2.7, 2.7, 0.06, 48),
      new THREE.MeshStandardMaterial({
        map: createFluffyRugTexture('#fff1f2'),
        roughness: 0.95,
      })
    );
    carpetInner.position.y = 0.05;
    carpetInner.receiveShadow = true;
    this.group.add(carpetInner);

    // Carpet lace border
    const laceRing = new THREE.Mesh(
      new THREE.TorusGeometry(2.72, 0.04, 16, 48),
      new THREE.MeshStandardMaterial({ color: 0xf472b6, roughness: 0.6 })
    );
    laceRing.rotation.x = Math.PI / 2;
    laceRing.position.y = 0.085;
    this.group.add(laceRing);

    // Enclosing storybook furniture gives the bears a real room instead of a stage.
    const pinkWood=new THREE.MeshStandardMaterial({color:0xe8b3b7,roughness:.79});
    const cream=new THREE.MeshStandardMaterial({color:0xffe9d9,roughness:.94});
    const mutedGold=new THREE.MeshStandardMaterial({color:0xd7ad74,metalness:.4,roughness:.48});
    const backSeat=new THREE.Mesh(new THREE.BoxGeometry(3.3,.56,.54),pinkWood);
    backSeat.position.set(0,.48,-2.22); backSeat.castShadow=true;this.group.add(backSeat);
    const couchBack=new THREE.Mesh(new THREE.BoxGeometry(3.3,1.12,.27),cream);
    couchBack.position.set(0,1.16,-2.51);couchBack.castShadow=true;this.group.add(couchBack);
    for(const x of [-1.27,-.65,.0,.65,1.27]){
      const pillow=new THREE.Mesh(new THREE.SphereGeometry(.38,18,14),
        new THREE.MeshStandardMaterial({color:x===0?0xf7cadc:0xf0dbc6,roughness:1}));
      pillow.scale.set(.94,.57,.40);pillow.position.set(x,.92,-2.06);this.group.add(pillow);
    }
    // Floating cloud lamps and framed keepsakes, kept clear of hug trajectory.
    for(const x of [-2.35,2.35]){
      const star=new THREE.Mesh(new THREE.OctahedronGeometry(.22,0),
        new THREE.MeshStandardMaterial({color:0xfff0a8,emissive:0xffcd70,emissiveIntensity:.6}));
      star.position.set(x,2.3,-2.5);this.group.add(star);
      const warm=new THREE.PointLight(0xffcf9e,.85,2.4);
      warm.position.set(x,2.3,-2.25);this.group.add(warm);
      const stand=new THREE.Mesh(new THREE.CylinderGeometry(.027,.027,.78,10),mutedGold);
      stand.position.set(x,.43,-2.0);this.group.add(stand);
    }

    // Cozy Plush Cushions scattered around the edges
    const cushionConfigs = [
      { x: -1.9, z: -1.7, col: 0xf43f5e, scale: 0.45, rot: 0.2 },
      { x: 1.8, z: -1.8, col: 0x38bdf8, scale: 0.42, rot: -0.3 },
      { x: -2.2, z: 0.6, col: 0xfbbf24, scale: 0.38, rot: 0.5 },
      { x: 2.1, z: 0.7, col: 0xa855f7, scale: 0.4, rot: -0.4 },
    ];
    cushionConfigs.forEach(c => {
      const cush = this.createHeartMesh(c.scale, c.col);
      cush.position.set(c.x, 0.25, c.z);
      cush.rotation.x = -Math.PI / 2 + 0.3;
      cush.rotation.y = c.rot;
      this.group.add(cush);
    });

    // Hanging string fairy lights with warm glowing orbs
    for (let i = 0; i < 12; i++) {
      const angle = -Math.PI * 0.55 + (i / 11) * Math.PI * 1.05;
      const rad = 4.1;
      const px = Math.cos(angle) * rad;
      const pz = Math.sin(angle) * rad;
      const py = 2.7 + Math.sin(i * 0.9) * 0.15;

      const bulb = new THREE.Mesh(
        new THREE.SphereGeometry(0.08, 16, 16),
        new THREE.MeshStandardMaterial({
          color: 0xffedd5,
          emissive: 0xfef08a,
          emissiveIntensity: 0.9,
          roughness: 0.1,
        })
      );
      bulb.position.set(px, py, pz);
      this.group.add(bulb);

      if (i % 3 === 0) {
        const pLight = new THREE.PointLight(0xffedd5, 0.6, 2.5);
        pLight.position.set(px, py - 0.1, pz);
        this.group.add(pLight);
        this.twinkleLights.push(pLight);
      }
    }
  }

  private makeFurWeave(): THREE.CanvasTexture {
    const canvas=document.createElement('canvas');canvas.width=128;canvas.height=128;
    const ctx=canvas.getContext('2d')!;ctx.fillStyle='#a7a7a7';ctx.fillRect(0,0,128,128);
    // Subtle weave-driven bump map, not spiky procedural fur.
    for(let i=0;i<2800;i++){
      const x=(i*73)%128,y=(i*137)%128;
      const n=125+(i*31)%70;
      ctx.strokeStyle=`rgba(${n},${n},${n},.29)`;
      ctx.lineWidth=.7;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+1.4,y+.65);ctx.stroke();
    }
    const t=new THREE.CanvasTexture(canvas);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(2.4,1.8);return t;
  }

  private buildPlushBear(isAyaan: boolean): BearRig {
    const root = new THREE.Group();
    root.name = isAyaan ? 'ayaan_bear' : 'pinkii_bear';

    // Plush fur materials
    const furColor = isAyaan ? 0xb46b38 : 0xfbcfe8; // warm honey caramel vs strawberry cream
    const bellyColor = isAyaan ? 0xf0dfcf : 0xfff1f2; // soft vanilla cream

    const furMat = new THREE.MeshStandardMaterial({
      color: furColor,
      roughness: 0.98,
      metalness: 0,
      bumpMap: this.makeFurWeave(),
      bumpScale: .015,
    });

    const bellyMat = new THREE.MeshStandardMaterial({
      color: bellyColor,
      roughness: 0.92,
    });

    const noseMat = new THREE.MeshStandardMaterial({
      color: 0x1f1715,
      roughness: 0.4,
    });

    const eyeMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.1,
      metalness: 0.9,
    });

    const padMat = new THREE.MeshStandardMaterial({
      color: isAyaan ? 0xdda070 : 0xf472b6,
      roughness: 0.85,
    });

    // 1. TORSO GROUP
    const torso = new THREE.Group();
    torso.position.y = 0.58;

    // Chubby pear-shaped body
    const bodyGeo = new THREE.SphereGeometry(0.48, 28, 24);
    bodyGeo.scale(1.0, 1.15, 0.88);
    const bodyMesh = new THREE.Mesh(bodyGeo, furMat);
    bodyMesh.castShadow = true;
    torso.add(bodyMesh);

    // Soft plush belly patch
    const bellyGeo = new THREE.SphereGeometry(0.38, 24, 20);
    bellyGeo.scale(0.85, 1.0, 0.38);
    const bellyMesh = new THREE.Mesh(bellyGeo, bellyMat);
    bellyMesh.position.set(0, -0.06, 0.32);
    torso.add(bellyMesh);

    // 2. HEAD GROUP
    const head = new THREE.Group();
    head.position.set(0, 0.74, 0.05);

    // Chubby head with cute wide cheeks
    const headGeo = new THREE.SphereGeometry(0.48, 28, 24);
    headGeo.scale(1.08, 0.96, 0.94);
    const headMesh = new THREE.Mesh(headGeo, furMat);
    headMesh.castShadow = true;
    head.add(headMesh);

    // Snout / Muzzle
    const snoutGeo = new THREE.SphereGeometry(0.22, 20, 18);
    snoutGeo.scale(1.12, 0.86, 0.92);
    const snoutMesh = new THREE.Mesh(snoutGeo, bellyMat);
    snoutMesh.position.set(0, -0.08, 0.36);
    head.add(snoutMesh);

    // Cute Embroidered Velvet Nose
    const noseGeo = new THREE.SphereGeometry(0.065, 14, 14);
    noseGeo.scale(1.2, 0.85, 0.9);
    const noseMesh = new THREE.Mesh(noseGeo, noseMat);
    noseMesh.position.set(0, -0.03, 0.55);
    head.add(noseMesh);

    // Smile crease underneath nose
    const smileGeo = new THREE.CylinderGeometry(0.015, 0.015, 0.08, 8);
    const smileMesh = new THREE.Mesh(smileGeo, noseMat);
    smileMesh.position.set(0, -0.09, 0.54);
    head.add(smileMesh);

    // Glistening plush eyes with dual catchlights
    const eyeGeo = new THREE.SphereGeometry(0.05, 16, 16);
    const leftEye = new THREE.Mesh(eyeGeo, eyeMat);
    leftEye.position.set(-0.16, 0.07, 0.42);
    head.add(leftEye);

    const rightEye = new THREE.Mesh(eyeGeo, eyeMat);
    rightEye.position.set(0.16, 0.07, 0.42);
    head.add(rightEye);

    // Primary & secondary eye glints
    const glintMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const glintGeo = new THREE.SphereGeometry(0.016, 8, 8);
    const glintSmallGeo = new THREE.SphereGeometry(0.008, 8, 8);

    const glintL1 = new THREE.Mesh(glintGeo, glintMat);
    glintL1.position.set(-0.145, 0.085, 0.465);
    head.add(glintL1);

    const glintL2 = new THREE.Mesh(glintSmallGeo, glintMat);
    glintL2.position.set(-0.17, 0.055, 0.46);
    head.add(glintL2);

    const glintR1 = new THREE.Mesh(glintGeo, glintMat);
    glintR1.position.set(0.175, 0.085, 0.465);
    head.add(glintR1);

    const glintR2 = new THREE.Mesh(glintSmallGeo, glintMat);
    glintR2.position.set(0.15, 0.055, 0.46);
    head.add(glintR2);

    // Soft Embroidered Eyebrows
    const browGeo = new THREE.CylinderGeometry(0.014, 0.014, 0.09, 8);
    browGeo.rotateZ(Math.PI / 2);
    const browL = new THREE.Mesh(browGeo, noseMat);
    browL.position.set(-0.17, 0.16, 0.41);
    browL.rotation.z = 0.2;
    head.add(browL);

    const browR = new THREE.Mesh(browGeo, noseMat);
    browR.position.set(0.17, 0.16, 0.41);
    browR.rotation.z = -0.2;
    head.add(browR);

    // Ears with pastel inner lining
    const earGeo = new THREE.SphereGeometry(0.16, 20, 16);
    const inEarGeo = new THREE.SphereGeometry(0.1, 16, 14);
    const inEarMat = new THREE.MeshStandardMaterial({ color: 0xfda4af, roughness: 0.9 });

    const leftEar = new THREE.Mesh(earGeo, furMat);
    leftEar.position.set(-0.36, 0.35, 0.02);
    const inEarL = new THREE.Mesh(inEarGeo, inEarMat);
    inEarL.position.set(-0.36, 0.35, 0.07);
    head.add(leftEar, inEarL);

    const rightEar = new THREE.Mesh(earGeo, furMat);
    rightEar.position.set(0.36, 0.35, 0.02);
    const inEarR = new THREE.Mesh(inEarGeo, inEarMat);
    inEarR.position.set(0.36, 0.35, 0.07);
    head.add(rightEar, inEarR);

    // Distinctive Accessories:
    if (isAyaan) {
      // Ayaan's smart teal knitted bowtie with golden center button
      const bowGroup = new THREE.Group();
      bowGroup.position.set(0, -0.26, 0.42);
      const bowMat = new THREE.MeshStandardMaterial({ color: 0x0f766e, roughness: 0.4 });
      const bowKnot = new THREE.Mesh(new THREE.SphereGeometry(0.055, 12, 12), new THREE.MeshStandardMaterial({ color: 0xfbbf24, metalness: 0.8, roughness: 0.2 }));
      const wing1 = new THREE.Mesh(new THREE.ConeGeometry(0.1, 0.18, 16), bowMat);
      wing1.rotation.z = Math.PI / 2;
      wing1.position.x = -0.1;
      const wing2 = new THREE.Mesh(new THREE.ConeGeometry(0.1, 0.18, 16), bowMat);
      wing2.rotation.z = -Math.PI / 2;
      wing2.position.x = 0.1;
      bowGroup.add(bowKnot, wing1, wing2);
      head.add(bowGroup);
    } else {
      // Pinkii's cute pink blush on cheeks
      const blushMat = new THREE.MeshBasicMaterial({ color: 0xf43f5e, transparent: true, opacity: 0.45 });
      const blushGeo = new THREE.CircleGeometry(0.075, 16);

      const blushL = new THREE.Mesh(blushGeo, blushMat);
      blushL.position.set(-0.26, -0.06, 0.4);
      blushL.rotation.y = -0.45;
      head.add(blushL);

      const blushR = new THREE.Mesh(blushGeo, blushMat);
      blushR.position.set(0.26, -0.06, 0.4);
      blushR.rotation.y = 0.45;
      head.add(blushR);

      // Pinkii's satin rose ribbon on her right ear
      const ribbonGroup = new THREE.Group();
      ribbonGroup.position.set(0.38, 0.4, 0.1);
      const ribFlower = new THREE.Mesh(
        new THREE.TorusGeometry(0.08, 0.035, 12, 18),
        new THREE.MeshStandardMaterial({ color: 0xe11d48, roughness: 0.35 })
      );
      const ribPearl = new THREE.Mesh(
        new THREE.SphereGeometry(0.035, 10, 10),
        new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.1, metalness: 0.8 })
      );
      ribbonGroup.add(ribFlower, ribPearl);
      head.add(ribbonGroup);
    }

    torso.add(head);

    // 3. ARMS WITH PAW PADS
    const armGeo = new THREE.CylinderGeometry(0.11, 0.14, 0.5, 18);
    armGeo.translate(0, -0.21, 0);

    const armLeft = new THREE.Group();
    armLeft.position.set(-0.46, 0.25, 0.04);
    const armMeshL = new THREE.Mesh(armGeo, furMat);
    armMeshL.castShadow = true;
    armLeft.add(armMeshL);

    // Hand paw pad
    const pawL = new THREE.Mesh(new THREE.CircleGeometry(0.065, 14), padMat);
    pawL.rotation.x = Math.PI / 2;
    pawL.position.set(0, -0.44, 0.07);
    armLeft.add(pawL);
    torso.add(armLeft);

    const armRight = new THREE.Group();
    armRight.position.set(0.46, 0.25, 0.04);
    const armMeshR = new THREE.Mesh(armGeo, furMat);
    armMeshR.castShadow = true;
    armRight.add(armMeshR);

    const pawR = new THREE.Mesh(new THREE.CircleGeometry(0.065, 14), padMat);
    pawR.rotation.x = Math.PI / 2;
    pawR.position.set(0, -0.44, 0.07);
    armRight.add(pawR);
    torso.add(armRight);

    // 4. LEGS WITH FOOT PADS
    const legGeo = new THREE.CylinderGeometry(0.13, 0.16, 0.46, 18);
    legGeo.translate(0, -0.23, 0);

    const legLeft = new THREE.Group();
    legLeft.position.set(-0.24, -0.42, 0);
    const legMeshL = new THREE.Mesh(legGeo, furMat);
    legMeshL.castShadow = true;
    legLeft.add(legMeshL);

    const footPadL = new THREE.Mesh(new THREE.CircleGeometry(0.085, 14), padMat);
    footPadL.rotation.x = Math.PI / 2;
    footPadL.position.set(0, -0.46, 0.05);
    legLeft.add(footPadL);
    torso.add(legLeft);

    const legRight = new THREE.Group();
    legRight.position.set(0.24, -0.42, 0);
    const legMeshR = new THREE.Mesh(legGeo, furMat);
    legMeshR.castShadow = true;
    legRight.add(legMeshR);

    const footPadR = new THREE.Mesh(new THREE.CircleGeometry(0.085, 14), padMat);
    footPadR.rotation.x = Math.PI / 2;
    footPadR.position.set(0, -0.46, 0.05);
    legRight.add(footPadR);
    torso.add(legRight);

    root.add(torso);

    return {
      root,
      torso,
      head,
      armLeft,
      armRight,
      legLeft,
      legRight,
      startX: isAyaan ? -1.45 : 1.45,
      // Target position brings bellies into gentle soft contact at 0.88 distance (no clipping!)
      targetX: isAyaan ? -0.44 : 0.44,
    };
  }

  private buildAyaanBear() {
    this.ayaanBear = this.buildPlushBear(true);
    this.ayaanBear.root.position.set(-1.45, 0.25, 0);
    this.ayaanBear.root.rotation.y = Math.PI * 0.42;
    this.group.add(this.ayaanBear.root);
  }

  private buildPinkiiBear() {
    this.pinkiiBear = this.buildPlushBear(false);
    this.pinkiiBear.root.position.set(1.45, 0.25, 0);
    this.pinkiiBear.root.rotation.y = -Math.PI * 0.42;
    this.group.add(this.pinkiiBear.root);
  }

  private buildFloatingHeartsPool() {
    const heartShape = new THREE.Shape();
    const x = 0, y = 0;
    heartShape.moveTo(x + 0.25, y + 0.25);
    heartShape.bezierCurveTo(x + 0.25, y + 0.25, x + 0.2, y, x, y);
    heartShape.bezierCurveTo(x - 0.3, y, x - 0.3, y + 0.35, x - 0.3, y + 0.35);
    heartShape.bezierCurveTo(x - 0.3, y + 0.55, x - 0.1, y + 0.77, x + 0.25, y + 0.95);
    heartShape.bezierCurveTo(x + 0.6, y + 0.77, x + 0.8, y + 0.55, x + 0.8, y + 0.35);
    heartShape.bezierCurveTo(x + 0.8, y + 0.35, x + 0.8, y, x + 0.5, y);
    heartShape.bezierCurveTo(x + 0.35, y, x + 0.25, y + 0.25, x + 0.25, y + 0.25);

    const geo = new THREE.ExtrudeGeometry(heartShape, {
      depth: 0.1,
      bevelEnabled: true,
      bevelSegments: 3,
      steps: 1,
      bevelSize: 0.04,
      bevelThickness: 0.04,
    });
    geo.center();

    const colors = [0xff1493, 0xf43f5e, 0xf472b6, 0xfb7185, 0xfde047, 0x38bdf8];

    for (let i = 0; i < 30; i++) {
      const col = colors[i % colors.length];
      const mat = new THREE.MeshStandardMaterial({
        color: col,
        emissive: col,
        emissiveIntensity: 0.7,
        roughness: 0.2,
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.scale.set(0.16, 0.16, 0.16);
      mesh.rotation.z = Math.PI;
      mesh.visible = false;
      mesh.userData = {
        baseY: 0.9,
        speedY: 0.025 + Math.random() * 0.035,
        rotSpeed: (Math.random() - 0.5) * 4.5,
        driftX: (Math.random() - 0.5) * 0.025,
        driftZ: (Math.random() - 0.5) * 0.025,
      };
      this.floatingHearts.add(mesh);
      this.heartMeshes.push(mesh);
    }
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
      bevelSegments: 3,
      steps: 1,
      bevelSize: 0.06,
      bevelThickness: 0.06,
    });
    geo.center();

    const mat = new THREE.MeshStandardMaterial({
      color,
      roughness: 0.4,
      metalness: 0.1,
    });

    const mesh = new THREE.Mesh(geo, mat);
    mesh.scale.set(scale, scale, scale);
    mesh.rotation.z = Math.PI;
    return mesh;
  }

  public triggerHug() {
    if (this.state === 'embracing') {
      soundEngine.playSparkle();
      this.spawnConfetti();
      return;
    }

    this.state = 'walking';
    this.walkTime = 0;
    this.hugTime = 0;
    this.onHugStart?.();
  }

  private spawnConfetti() {
    confetti({
      particleCount: 65,
      spread: 75,
      origin: { y: 0.6 },
      colors: ['#f472b6', '#fda4af', '#fcd34d', '#38bdf8', '#c084fc', '#fb7185'],
    });
  }

  public update(delta: number, time: number) {
    if (this.state === 'idle') {
      // Gentle breathing
      const breathe = Math.sin(time * 2.2) * 0.03;
      this.ayaanBear.torso.scale.set(1.0 + breathe * 0.5, 1.0 - breathe * 0.5, 1.0 + breathe * 0.5);
      this.pinkiiBear.torso.scale.set(1.0 + breathe * 0.5, 1.0 - breathe * 0.5, 1.0 + breathe * 0.5);

      this.ayaanBear.head.rotation.z = Math.sin(time * 1.6) * 0.04;
      this.pinkiiBear.head.rotation.z = -Math.sin(time * 1.6 + 0.5) * 0.04;

      this.ayaanBear.armLeft.rotation.set(0, 0, 0.18);
      this.ayaanBear.armRight.rotation.set(0, 0, -0.18);
      this.pinkiiBear.armLeft.rotation.set(0, 0, 0.18);
      this.pinkiiBear.armRight.rotation.set(0, 0, -0.18);

      this.ayaanBear.legLeft.rotation.x = 0;
      this.ayaanBear.legRight.rotation.x = 0;
      this.pinkiiBear.legLeft.rotation.x = 0;
      this.pinkiiBear.legRight.rotation.x = 0;

      this.heartMeshes.forEach(h => (h.visible = false));
    } else if (this.state === 'walking') {
      this.walkTime += delta * 2.5;

      this.ayaanBear.root.rotation.y = Math.PI * 0.5;
      this.pinkiiBear.root.rotation.y = -Math.PI * 0.5;

      const walkProgress = Math.min(this.walkTime / 2.8, 1.0);
      const ease = Math.min(1.0, walkProgress * 1.15);

      this.ayaanBear.root.position.x = this.ayaanBear.startX + (this.ayaanBear.targetX - this.ayaanBear.startX) * ease;
      this.pinkiiBear.root.position.x = this.pinkiiBear.startX + (this.pinkiiBear.targetX - this.pinkiiBear.startX) * ease;

      // Waddling step cycle
      const legAngle = Math.sin(this.walkTime * 8) * 0.58;
      this.ayaanBear.legLeft.rotation.x = legAngle;
      this.ayaanBear.legRight.rotation.x = -legAngle;
      this.pinkiiBear.legLeft.rotation.x = -legAngle;
      this.pinkiiBear.legRight.rotation.x = legAngle;

      const waddle = Math.sin(this.walkTime * 8) * 0.08;
      this.ayaanBear.torso.rotation.z = waddle;
      this.pinkiiBear.torso.rotation.z = -waddle;

      // Bounce
      const bounce = Math.abs(Math.sin(this.walkTime * 8)) * 0.05;
      this.ayaanBear.torso.position.y = 0.58 + bounce;
      this.pinkiiBear.torso.position.y = 0.58 + bounce;

      if (ease > 0.45) {
        // Reaching arms open to embrace
        const reach = (ease - 0.45) * 1.8;
        this.ayaanBear.armLeft.rotation.x = -reach * 1.3;
        this.ayaanBear.armRight.rotation.x = -reach * 1.3;
        this.ayaanBear.armLeft.rotation.z = reach * 0.4;
        this.ayaanBear.armRight.rotation.z = -reach * 0.4;

        this.pinkiiBear.armLeft.rotation.x = -reach * 1.3;
        this.pinkiiBear.armRight.rotation.x = -reach * 1.3;
        this.pinkiiBear.armLeft.rotation.z = reach * 0.4;
        this.pinkiiBear.armRight.rotation.z = -reach * 0.4;
      } else {
        this.ayaanBear.armLeft.rotation.x = -legAngle * 0.5;
        this.ayaanBear.armRight.rotation.x = legAngle * 0.5;
        this.pinkiiBear.armLeft.rotation.x = legAngle * 0.5;
        this.pinkiiBear.armRight.rotation.x = -legAngle * 0.5;
      }

      if (walkProgress >= 1.0) {
        this.state = 'embracing';
        this.hugTime = 0;
        soundEngine.playHugMelody();
        this.spawnConfetti();

        this.heartMeshes.forEach(h => {
          h.visible = true;
          h.position.set((Math.random() - 0.5) * 0.45, 0.95 + Math.random() * 0.25, (Math.random() - 0.5) * 0.45);
        });
      }
    } else if (this.state === 'embracing') {
      this.hugTime += delta;

      this.ayaanBear.legLeft.rotation.x = 0;
      this.ayaanBear.legRight.rotation.x = 0;
      this.pinkiiBear.legLeft.rotation.x = 0;
      this.pinkiiBear.legRight.rotation.x = 0;

      this.ayaanBear.root.position.x = this.ayaanBear.targetX;
      this.pinkiiBear.root.position.x = this.pinkiiBear.targetX;

      // Realistic wrap-around hug kinematics:
      // On +Z side: Ayaan left arm wraps upper back (over shoulder); Pinkii right arm wraps lower waist.
      // On -Z side: Pinkii left arm wraps upper back (over shoulder); Ayaan right arm wraps lower waist.
      // The arm poses are controlled; inspect in motion from multiple camera angles.
      this.ayaanBear.armLeft.rotation.set(-1.42, 0.36, 0.62);
      this.pinkiiBear.armRight.rotation.set(-1.32, -0.32, -0.56);

      this.pinkiiBear.armLeft.rotation.set(-1.42, 0.36, 0.62);
      this.ayaanBear.armRight.rotation.set(-1.32, -0.32, -0.56);

      // Loving cheek cuddle & gentle romantic sway
      const cuddleSway = Math.sin(this.hugTime * 1.8) * 0.04;
      this.ayaanBear.head.rotation.set(0.12, 0, 0.22 + cuddleSway);
      this.pinkiiBear.head.rotation.set(0.12, 0, -0.22 - cuddleSway);

      this.ayaanBear.torso.rotation.z = cuddleSway * 0.6;
      this.pinkiiBear.torso.rotation.z = cuddleSway * 0.6;

      // Floating hearts fountain
      this.heartMeshes.forEach((h, idx) => {
        const u = h.userData;
        h.position.y += u.speedY;
        h.position.x += u.driftX + Math.sin(time * 2.2 + idx) * 0.003;
        h.position.z += u.driftZ + Math.cos(time * 2.2 + idx) * 0.003;
        h.rotation.y += u.rotSpeed * delta;

        if (h.position.y > 3.2) {
          h.position.y = 0.95;
          h.position.x = (Math.random() - 0.5) * 0.4;
          h.position.z = (Math.random() - 0.5) * 0.4;
        }
      });
    }

    // Twinkling cuddle lights
    this.twinkleLights.forEach((light, i) => {
      light.intensity = 0.5 + Math.sin(time * 2.5 + i * 1.5) * 0.2;
    });
  }
}
