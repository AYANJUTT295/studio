import * as THREE from 'three';
import { soundEngine } from '../audio/soundEffects';
import { createWaterTexture, createDarkWoodTexture } from '../utils/textureGenerator';

interface BloomingRose {
  group: THREE.Group;
  petals: THREE.Mesh[];
  light: THREE.PointLight;
  isBloomed: boolean;
  bloomProgress: number;
  targetBloom: number;
}

export class GardenWorld {
  public group: THREE.Group;
  private roses: BloomingRose[] = [];
  private fireflies: THREE.Points | null = null;
  private fireflyPositions: Float32Array | null = null;
  private fireflySpeeds: Float32Array | null = null;
  private floatingPetals: THREE.Points | null = null;
  private petalPositions: Float32Array | null = null;
  private moonMesh: THREE.Mesh | null = null;
  private moonHalo: THREE.Mesh | null = null;
  private glowingMushrooms: THREE.Mesh[] = [];

  constructor() {
    this.group = new THREE.Group();
    this.buildEnchantedTerrain();
    this.buildCelestialMoon();
    this.buildMeanderingMoonlitStream();
    this.buildFairyArchedBridge();
    this.buildPathwayAndRocks();
    this.buildEnchantedBlueRoses();
    this.buildEnchantedBunny();
    this.buildBioluminescentFlora();
    this.buildFireflySwarm();
    this.buildFloatingPetals();
    this.buildDistantCanopySilhouettes();
    this.buildRoseArcade();
  }

  private buildEnchantedTerrain() {
    // Platform base with deep obsidian & lavender rim
    const baseGeo = new THREE.CylinderGeometry(4.8, 5.0, 0.45, 64);
    const baseMat = new THREE.MeshStandardMaterial({
      color: 0x0c0f24,
      roughness: 0.6,
      metalness: 0.1,
    });
    const base = new THREE.Mesh(baseGeo, baseMat);
    base.position.y = -0.225;
    base.receiveShadow = true;
    this.group.add(base);

    // Glowing lavender boundary ring
    const edgeTrim = new THREE.Mesh(
      new THREE.TorusGeometry(4.85, 0.06, 16, 64),
      new THREE.MeshStandardMaterial({
        color: 0x818cf8,
        emissive: 0x6366f1,
        emissiveIntensity: 0.6,
        roughness: 0.25,
      })
    );
    edgeTrim.rotation.x = Math.PI / 2;
    edgeTrim.position.y = 0.01;
    this.group.add(edgeTrim);

    // Lush rolling mossy island surface
    const groundGeo = new THREE.CylinderGeometry(4.65, 4.65, 0.08, 64);
    const groundMat = new THREE.MeshStandardMaterial({
      color: 0x141b34, // mystical midnight moss
      roughness: 0.85,
      metalness: 0.05,
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.position.y = 0.04;
    ground.receiveShadow = true;
    this.group.add(ground);

    // Undulating moss mounds in the background
    const hillMat = new THREE.MeshStandardMaterial({ color: 0x0f152d, roughness: 0.9 });
    const mounds = [
      { x: -2.0, y: 0.18, z: -2.3, r: 1.8, sy: 0.4 },
      { x: 2.1, y: 0.18, z: -2.1, r: 1.7, sy: 0.35 },
      { x: 0.0, y: 0.14, z: -2.8, r: 2.0, sy: 0.45 },
    ];
    mounds.forEach(m => {
      const hill = new THREE.Mesh(new THREE.SphereGeometry(m.r, 24, 16, 0, Math.PI * 2, 0, Math.PI * 0.45), hillMat);
      hill.position.set(m.x, m.y, m.z);
      hill.scale.set(1.1, m.sy, 1.1);
      hill.receiveShadow = true;
      this.group.add(hill);
    });
  }

  private buildCelestialMoon() {
    const moonGroup = new THREE.Group();
    moonGroup.position.set(-2.8, 4.4, -3.8);

    // Glowing ethereal moon sphere
    const moonGeo = new THREE.SphereGeometry(1.15, 32, 32);
    const moonMat = new THREE.MeshStandardMaterial({
      color: 0xfef9c3,
      emissive: 0xfef08a,
      emissiveIntensity: 0.95,
      roughness: 0.2,
    });
    this.moonMesh = new THREE.Mesh(moonGeo, moonMat);
    moonGroup.add(this.moonMesh);

    // Crater indentations
    const craterMat = new THREE.MeshStandardMaterial({ color: 0xfef08a, roughness: 0.5 });
    const craterCoords = [
      { x: -0.3, y: 0.2, z: 1.05, r: 0.22 },
      { x: 0.4, y: -0.25, z: 1.0, r: 0.28 },
      { x: 0.1, y: 0.45, z: 0.95, r: 0.16 },
    ];
    craterCoords.forEach(c => {
      const cr = new THREE.Mesh(new THREE.SphereGeometry(c.r, 12, 12), craterMat);
      cr.position.set(c.x, c.y, c.z);
      cr.scale.set(1.0, 1.0, 0.2);
      moonGroup.add(cr);
    });

    // Outer celestial nebula halo
    const haloGeo = new THREE.SphereGeometry(1.5, 24, 24);
    const haloMat = new THREE.MeshBasicMaterial({
      color: 0xc7d2fe,
      transparent: true,
      opacity: 0.22,
      side: THREE.BackSide,
    });
    this.moonHalo = new THREE.Mesh(haloGeo, haloMat);
    moonGroup.add(this.moonHalo);

    // Soft cool moonlight cast
    const moonLight = new THREE.PointLight(0xc7d2fe, 2.2, 15);
    moonLight.position.set(0, 0, 1.0);
    moonGroup.add(moonLight);

    this.group.add(moonGroup);
  }

  /**
   * Refined meandering moonlit stream:
   * Curved spline ribbon that stays strictly inside the island bounds.
   * Completely eliminates the giant obstructing rectangular polygon!
   */
  private buildMeanderingMoonlitStream() {
    const streamCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-3.2, 0.055, -1.2),
      new THREE.Vector3(-1.8, 0.055, -0.6),
      new THREE.Vector3(-0.4, 0.055, -0.3),
      new THREE.Vector3(1.2, 0.055, 0.1),
      new THREE.Vector3(2.6, 0.055, 0.9),
      new THREE.Vector3(3.4, 0.055, 1.6),
    ]);

    // Flat wide water ribbon along the curve
    const streamPoints = streamCurve.getPoints(40);
    const ribbonGeo = new THREE.BufferGeometry();
    const positions: number[] = [];
    const uvs: number[] = [];
    const indices: number[] = [];

    const streamWidth = 0.75;
    for (let i = 0; i < streamPoints.length; i++) {
      const pt = streamPoints[i];
      const tangent = streamCurve.getTangent(i / (streamPoints.length - 1));
      const normal = new THREE.Vector3(-tangent.z, 0, tangent.x).normalize();

      const pL = pt.clone().addScaledVector(normal, streamWidth / 2);
      const pR = pt.clone().addScaledVector(normal, -streamWidth / 2);

      positions.push(pL.x, pL.y, pL.z);
      positions.push(pR.x, pR.y, pR.z);

      const u = i / (streamPoints.length - 1);
      uvs.push(u, 0);
      uvs.push(u, 1);

      if (i < streamPoints.length - 1) {
        const base = i * 2;
        indices.push(base, base + 1, base + 2);
        indices.push(base + 1, base + 3, base + 2);
      }
    }

    ribbonGeo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    ribbonGeo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
    ribbonGeo.setIndex(indices);
    ribbonGeo.computeVertexNormals();

    const streamMat = new THREE.MeshStandardMaterial({
      map: createWaterTexture(),
      roughness: 0.1,
      metalness: 0.85,
      color: 0x60a5fa,
      emissive: 0x1e3a8a,
      emissiveIntensity: 0.45,
    });
    const streamMesh = new THREE.Mesh(ribbonGeo, streamMat);
    streamMesh.receiveShadow = true;
    this.group.add(streamMesh);

    // River pebbles along stream banks
    const pebbleMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.6 });
    for (let i = 0; i < 28; i++) {
      const t = i / 27;
      const pt = streamCurve.getPoint(t);
      const tangent = streamCurve.getTangent(t);
      const normal = new THREE.Vector3(-tangent.z, 0, tangent.x).normalize();
      const side = (i % 2 === 0 ? 1 : -1);
      const dist = streamWidth / 2 + 0.08 + Math.random() * 0.12;

      const pPos = pt.clone().addScaledVector(normal, side * dist);
      const pebble = new THREE.Mesh(new THREE.SphereGeometry(0.06 + Math.random() * 0.04, 8, 8), pebbleMat);
      pebble.position.set(pPos.x, 0.065, pPos.z);
      pebble.scale.set(1.3, 0.6, 1.0);
      this.group.add(pebble);
    }

    // Glowing Water Lilies on stream
    const lilyMat = new THREE.MeshStandardMaterial({ color: 0x059669, roughness: 0.5 });
    const lotusMat = new THREE.MeshStandardMaterial({ color: 0xfbcfe8, emissive: 0xf472b6, emissiveIntensity: 0.8 });

    const lilyFractions = [0.18, 0.38, 0.72, 0.88];
    lilyFractions.forEach((frac, idx) => {
      const pt = streamCurve.getPoint(frac);
      const pad = new THREE.Mesh(new THREE.CircleGeometry(0.12, 16), lilyMat);
      pad.rotation.x = -Math.PI / 2;
      pad.position.set(pt.x + (idx % 2 === 0 ? 0.1 : -0.1), 0.062, pt.z);
      this.group.add(pad);

      const lotus = new THREE.Mesh(new THREE.SphereGeometry(0.06, 10, 10), lotusMat);
      lotus.position.set(pt.x + (idx % 2 === 0 ? 0.1 : -0.1), 0.1, pt.z);
      this.group.add(lotus);
    });
  }

  /**
   * Delicate Japanese/fairy arched wooden bridge:
   * Proportionate, dainty (span 1.2, width 0.5), beautiful railings and hanging lantern.
   * Does NOT block the view of flowers or background!
   */
  private buildFairyArchedBridge() {
    const bridgeGroup = new THREE.Group();
    bridgeGroup.position.set(-0.4, 0.06, -0.3);
    bridgeGroup.rotation.y = Math.PI * 0.32; // crosses stream perpendicularly

    const woodMat = new THREE.MeshStandardMaterial({
      map: createDarkWoodTexture(),
      roughness: 0.5,
    });
    const postMat = new THREE.MeshStandardMaterial({ color: 0xf472b6, roughness: 0.4 }); // rose-colored balusters

    // Arched walkway planks
    const plankCount = 14;
    const span = 1.15;
    const bridgeW = 0.48;

    for (let p = 0; p < plankCount; p++) {
      const u = p / (plankCount - 1);
      const angle = (u - 0.5) * Math.PI * 0.55;
      const x = Math.sin(angle) * 0.65;
      const y = Math.cos(angle) * 0.16 - 0.08;

      const plank = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.03, bridgeW), woodMat);
      plank.position.set(x, y + 0.06, 0);
      plank.rotation.z = -angle * 0.8;
      plank.castShadow = true;
      bridgeGroup.add(plank);
    }

    // Side railings
    [-bridgeW / 2 + 0.02, bridgeW / 2 - 0.02].forEach(rz => {
      // Railing posts
      for (let i = 0; i < 5; i++) {
        const u = i / 4;
        const angle = (u - 0.5) * Math.PI * 0.55;
        const x = Math.sin(angle) * 0.65;
        const y = Math.cos(angle) * 0.16 - 0.08;

        const post = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.28, 8), postMat);
        post.position.set(x, y + 0.18, rz);
        bridgeGroup.add(post);
      }

      // Curved top handrail
      const railCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(-span / 2, 0.16, rz),
        new THREE.Vector3(0, 0.32, rz),
        new THREE.Vector3(span / 2, 0.16, rz),
      ]);
      const railGeo = new THREE.TubeGeometry(railCurve, 16, 0.02, 8, false);
      const handrail = new THREE.Mesh(railGeo, postMat);
      bridgeGroup.add(handrail);
    });

    // Cozy hanging lantern in center of bridge
    const lantern = new THREE.Mesh(
      new THREE.SphereGeometry(0.07, 12, 12),
      new THREE.MeshStandardMaterial({
        color: 0xfef08a,
        emissive: 0xf59e0b,
        emissiveIntensity: 1.2,
        roughness: 0.1,
      })
    );
    lantern.position.set(0, 0.42, 0);
    bridgeGroup.add(lantern);

    const bLight = new THREE.PointLight(0xfef08a, 0.9, 2.5);
    bLight.position.set(0, 0.42, 0);
    bridgeGroup.add(bLight);

    this.group.add(bridgeGroup);
  }

  private buildEnchantedBunny() {
    // Adorable white bunny sitting near the pathway
    const bunny = new THREE.Group();
    bunny.position.set(0.95, 0.08, 0.95);
    bunny.rotation.y = -Math.PI * 0.4;
    bunny.name = 'interactive_bunny';

    const bMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.95 });

    // Chubby body
    const bBody = new THREE.Mesh(new THREE.SphereGeometry(0.24, 16, 16), bMat);
    bBody.scale.set(1.0, 1.15, 0.9);
    bBody.position.y = 0.22;
    bunny.add(bBody);

    // Round head
    const bHead = new THREE.Mesh(new THREE.SphereGeometry(0.18, 16, 16), bMat);
    bHead.position.set(0, 0.48, 0.08);
    bunny.add(bHead);

    // Long ears with pink inner lining
    const earGeo = new THREE.CylinderGeometry(0.03, 0.05, 0.28, 12);
    const inEarMat = new THREE.MeshStandardMaterial({ color: 0xfda4af, roughness: 0.8 });

    const ear1 = new THREE.Mesh(earGeo, bMat);
    ear1.position.set(-0.07, 0.68, 0.05);
    ear1.rotation.z = -0.15;
    bunny.add(ear1);

    const ear2 = new THREE.Mesh(earGeo, bMat);
    ear2.position.set(0.07, 0.68, 0.05);
    ear2.rotation.z = 0.15;
    bunny.add(ear2);

    // Glistening black eyes & pink nose
    const eyeMat = new THREE.MeshBasicMaterial({ color: 0x0f172a });
    const e1 = new THREE.Mesh(new THREE.SphereGeometry(0.022, 8, 8), eyeMat);
    e1.position.set(-0.07, 0.5, 0.22);
    bunny.add(e1);

    const e2 = new THREE.Mesh(new THREE.SphereGeometry(0.022, 8, 8), eyeMat);
    e2.position.set(0.07, 0.5, 0.22);
    bunny.add(e2);

    const bNose = new THREE.Mesh(new THREE.SphereGeometry(0.018, 8, 8), inEarMat);
    bNose.position.set(0, 0.46, 0.25);
    bunny.add(bNose);

    // Fluffy puff tail
    const bTail = new THREE.Mesh(new THREE.SphereGeometry(0.07, 10, 10), bMat);
    bTail.position.set(0, 0.16, -0.22);
    bunny.add(bTail);

    this.group.add(bunny);
  }

  private buildPathwayAndRocks() {
    // Cobblestone stepping stones winding through the garden
    const stonePositions = [
      { x: 0.0, z: 2.2, r: 0.38 },
      { x: 0.3, z: 1.5, r: 0.42 },
      { x: -0.1, z: 0.8, r: 0.4 },
      { x: -0.4, z: -0.3, r: 0.38 }, // leads onto the bridge!
      { x: -0.7, z: -1.2, r: 0.42 },
      { x: -0.4, z: -2.0, r: 0.38 },
    ];

    const stoneMat = new THREE.MeshStandardMaterial({
      color: 0x334155,
      roughness: 0.7,
    });

    stonePositions.forEach(st => {
      const stone = new THREE.Mesh(new THREE.CylinderGeometry(st.r, st.r * 1.08, 0.07, 16), stoneMat);
      stone.position.set(st.x, 0.07, st.z);
      stone.rotation.y = Math.random() * Math.PI;
      stone.receiveShadow = true;
      this.group.add(stone);

      // Glowing blue moss border on stones
      const mossRing = new THREE.Mesh(
        new THREE.TorusGeometry(st.r * 1.03, 0.02, 8, 16),
        new THREE.MeshStandardMaterial({
          color: 0x38bdf8,
          emissive: 0x0284c7,
          emissiveIntensity: 0.4,
          roughness: 0.4,
        })
      );
      mossRing.rotation.x = Math.PI / 2;
      mossRing.position.set(st.x, 0.075, st.z);
      this.group.add(mossRing);
    });
  }

  private buildEnchantedBlueRoses() {
    // 4 richly detailed blue rose bushes positioned with clear sightlines
    const roseCoords = [
      { x: -1.75, z: 0.85, scale: 1.15 },
      { x: 1.65, z: 0.75, scale: 1.08 },
      { x: -1.5, z: -1.1, scale: 1.0 },
      { x: 1.8, z: -0.85, scale: 1.2 },
    ];

    roseCoords.forEach((coord, rIdx) => {
      const roseGroup = new THREE.Group();
      roseGroup.position.set(coord.x, 0, coord.z);
      roseGroup.scale.set(coord.scale, coord.scale, coord.scale);
      roseGroup.name = `interactive_rose_${rIdx}`;

      // Organic winding thorny vine stem
      const stemCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(0.06, 0.38, -0.03),
        new THREE.Vector3(-0.04, 0.75, 0.04),
        new THREE.Vector3(0.02, 1.05, 0),
      ]);
      const stemGeo = new THREE.TubeGeometry(stemCurve, 20, 0.04, 10, false);
      const stemMat = new THREE.MeshStandardMaterial({
        color: 0x064e3b,
        roughness: 0.6,
      });
      const stem = new THREE.Mesh(stemGeo, stemMat);
      stem.castShadow = true;
      roseGroup.add(stem);

      // Thorns
      const thornMat = new THREE.MeshStandardMaterial({ color: 0x047857, roughness: 0.4 });
      for (let t = 0; t < 4; t++) {
        const thorn = new THREE.Mesh(new THREE.ConeGeometry(0.025, 0.08, 6), thornMat);
        const pt = stemCurve.getPoint(0.25 + t * 0.18);
        thorn.position.copy(pt);
        thorn.rotation.z = (t % 2 === 0 ? 1 : -1) * 1.2;
        roseGroup.add(thorn);
      }

      // Leaves with lime-green tint
      const leafMat = new THREE.MeshStandardMaterial({
        color: 0x10b981,
        emissive: 0x059669,
        emissiveIntensity: 0.15,
        roughness: 0.4,
      });
      const leafGeo = new THREE.ConeGeometry(0.14, 0.34, 4);

      const leaf1 = new THREE.Mesh(leafGeo, leafMat);
      leaf1.position.set(0.12, 0.52, 0.02);
      leaf1.rotation.z = -Math.PI / 3;
      leaf1.rotation.y = 0.6;
      roseGroup.add(leaf1);

      const leaf2 = new THREE.Mesh(leafGeo, leafMat);
      leaf2.position.set(-0.12, 0.68, -0.02);
      leaf2.rotation.z = Math.PI / 3;
      leaf2.rotation.y = -0.6;
      roseGroup.add(leaf2);

      // ROSE BLOSSOM PETALS
      const petals: THREE.Mesh[] = [];
      const petalMat = new THREE.MeshStandardMaterial({
        color: 0x38bdf8,
        emissive: 0x0284c7,
        emissiveIntensity: 0.35,
        roughness: 0.25,
        metalness: 0.1,
      });

      // Luminous flower receptacle
      const core = new THREE.Mesh(
        new THREE.SphereGeometry(0.12, 14, 14),
        new THREE.MeshStandardMaterial({
          color: 0x7dd3fc,
          emissive: 0x38bdf8,
          emissiveIntensity: 0.6,
        })
      );
      core.position.set(0.02, 1.08, 0);
      roseGroup.add(core);

      const ringConfigs = [
        { count: 4, rad: 0.09, height: 0.2, width: 0.15, tilt: 0.15 },
        { count: 5, rad: 0.16, height: 0.24, width: 0.2, tilt: 0.4 },
        { count: 6, rad: 0.24, height: 0.28, width: 0.24, tilt: 0.72 },
      ];

      ringConfigs.forEach(cfg => {
        for (let i = 0; i < cfg.count; i++) {
          const angle = (i / cfg.count) * Math.PI * 2;
          const petalShape = new THREE.Shape();
          petalShape.moveTo(0, 0);
          petalShape.quadraticCurveTo(cfg.width * 0.75, cfg.height * 0.5, 0, cfg.height);
          petalShape.quadraticCurveTo(-cfg.width * 0.75, cfg.height * 0.5, 0, 0);

          const pGeo = new THREE.ShapeGeometry(petalShape);
          const petalMesh = new THREE.Mesh(pGeo, petalMat.clone());
          petalMesh.position.set(0.02 + Math.cos(angle) * cfg.rad, 1.08, Math.sin(angle) * cfg.rad);
          petalMesh.rotation.y = -angle + Math.PI / 2;
          petalMesh.rotation.x = cfg.tilt;
          petalMesh.userData = {
            baseRotX: cfg.tilt,
            baseScale: 0.38,
            maxScale: 1.0,
            angle,
            rad: cfg.rad,
          };
          petalMesh.scale.set(0.38, 0.38, 0.38);
          roseGroup.add(petalMesh);
          petals.push(petalMesh);
        }
      });

      // Rose core radiant light
      const roseLight = new THREE.PointLight(0x38bdf8, 0.3, 2.4);
      roseLight.position.set(0.02, 1.2, 0);
      roseGroup.add(roseLight);

      this.group.add(roseGroup);
      this.roses.push({
        group: roseGroup,
        petals,
        light: roseLight,
        isBloomed: false,
        bloomProgress: 0,
        targetBloom: 0,
      });
    });
  }

  private buildBioluminescentFlora() {
    // Bioluminescent fairy mushrooms with soft pulsing caps
    const shroomConfigs = [
      { x: -0.85, z: 1.5, h: 0.34, col: 0x38bdf8, scale: 0.9 },
      { x: -1.1, z: 1.8, h: 0.24, col: 0xc084fc, scale: 0.7 },
      { x: 1.0, z: 1.35, h: 0.28, col: 0x34d399, scale: 0.8 },
      { x: 1.25, z: -1.8, h: 0.38, col: 0xf472b6, scale: 0.95 },
      { x: -0.3, z: -1.9, h: 0.26, col: 0x38bdf8, scale: 0.75 },
    ];

    shroomConfigs.forEach(s => {
      const stemMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.4 });
      const stem = new THREE.Mesh(
        new THREE.CylinderGeometry(0.04 * s.scale, 0.07 * s.scale, s.h, 12),
        stemMat
      );
      stem.position.set(s.x, s.h / 2 + 0.05, s.z);
      this.group.add(stem);

      const capMat = new THREE.MeshStandardMaterial({
        color: s.col,
        emissive: s.col,
        emissiveIntensity: 0.75,
        roughness: 0.2,
      });
      const cap = new THREE.Mesh(
        new THREE.SphereGeometry(0.18 * s.scale, 16, 16, 0, Math.PI * 2, 0, Math.PI * 0.55),
        capMat
      );
      cap.position.set(s.x, s.h + 0.05, s.z);
      this.group.add(cap);
      this.glowingMushrooms.push(cap);

      // Spots on mushroom cap
      const spotMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
      for (let sp = 0; sp < 4; sp++) {
        const spot = new THREE.Mesh(new THREE.CircleGeometry(0.02 * s.scale, 8), spotMat);
        const ang = (sp * Math.PI) / 2;
        spot.position.set(s.x + Math.cos(ang) * 0.1 * s.scale, s.h + 0.12 * s.scale, s.z + Math.sin(ang) * 0.1 * s.scale);
        spot.rotation.x = -Math.PI / 3;
        this.group.add(spot);
      }
    });
  }

  private buildFireflySwarm() {
    const count = 55;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const speeds = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 7.5;
      positions[i * 3 + 1] = 0.35 + Math.random() * 3.2;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 7.5;

      speeds[i * 3] = (Math.random() - 0.5) * 0.015;
      speeds[i * 3 + 1] = (Math.random() - 0.5) * 0.01;
      speeds[i * 3 + 2] = (Math.random() - 0.5) * 0.015;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
      color: 0xfde047,
      size: 0.14,
      transparent: true,
      opacity: 0.95,
      blending: THREE.AdditiveBlending,
    });

    this.fireflies = new THREE.Points(geometry, material);
    this.fireflyPositions = positions;
    this.fireflySpeeds = speeds;
    this.group.add(this.fireflies);
  }

  private buildFloatingPetals() {
    const count = 42;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 6.8;
      positions[i * 3 + 1] = 0.6 + Math.random() * 3.6;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 6.8;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
      color: 0x93c5fd,
      size: 0.1,
      transparent: true,
      opacity: 0.75,
    });

    this.floatingPetals = new THREE.Points(geometry, material);
    this.petalPositions = positions;
    this.group.add(this.floatingPetals);
  }

  private buildDistantCanopySilhouettes() {
    // Tapered storybook trees. Earlier large spheres obscured moon and roses.
    const grove=[[-3.35,-2.9,1.0],[3.38,-3.1,1.05],[-4.15,-4.5,.82],[4.35,-4.9,.8],[-2.0,-5.4,.6],[2.0,-5.2,.6]];
    for(const [x,z,scale] of grove){
      const root =new THREE.Group();root.position.set(x,0,z);root.scale.setScalar(scale);
      const trunk=new THREE.Mesh(new THREE.CylinderGeometry(.10,.18,1.55,10),
        new THREE.MeshStandardMaterial({color:0x303657,roughness:1}));
      trunk.position.y=.76;root.add(trunk);
      for(let i=0;i<3;i++){
        const cone=new THREE.Mesh(new THREE.ConeGeometry(1.05-i*.20,1.55,10),
          new THREE.MeshStandardMaterial({color:[0x252a58,0x333e83,0x5260a1][i],roughness:.98}));
        cone.position.y=1.40+i*.56;
        root.add(cone);
      }
      const orb=new THREE.Mesh(new THREE.SphereGeometry(.08,8,8),
        new THREE.MeshBasicMaterial({color:0xe3c7ff}));
      orb.position.set(.31,2.4,.68);root.add(orb);
      this.group.add(root);
    }
  }

  /** Flowered pergola and glowing hanging lanterns, pushed behind the bridge sight-line. */
  private buildRoseArcade(){
    const ivy=new THREE.MeshStandardMaterial({color:0x4a766c,roughness:.92});
    const wood=new THREE.MeshStandardMaterial({color:0x776a8c,roughness:.75});
    const bloomColors=[0x588deb,0x829ef3,0xc39ce8,0x6ecbd4];
    const glow=new THREE.MeshStandardMaterial({color:0xffdfab,emissive:0xffbf72,emissiveIntensity:1.8});
    // Behind, not over, the bridge; blooming foreground remains unobstructed.
    for(const x of [-1.45,1.45]){
      const upright=new THREE.Mesh(new THREE.CylinderGeometry(.065,.09,2.03,12),wood);
      upright.position.set(x,1.05,-2.65);this.group.add(upright);
    }
    const curve=new THREE.CatmullRomCurve3([
      new THREE.Vector3(-1.48,2,-2.65),new THREE.Vector3(-1.10,2.65,-2.65),
      new THREE.Vector3(0,2.98,-2.65),new THREE.Vector3(1.10,2.65,-2.65),
      new THREE.Vector3(1.48,2,-2.65),
    ]);
    const arch=new THREE.Mesh(new THREE.TubeGeometry(curve,42,.075,9,false),wood);
    arch.castShadow=true;this.group.add(arch);
    for(let i=0;i<26;i++){
      const t=i/25;const pt=curve.getPoint(t);
      for(let l=0;l<2;l++){
        const leaf=new THREE.Mesh(new THREE.SphereGeometry(.10,10,8),ivy);
        leaf.scale.set(.65,1.8,.42);
        leaf.position.set(pt.x+Math.sin(i*2.35+l)*.14,pt.y+Math.cos(i*1.5+l)*.1,pt.z+.09);
        leaf.rotation.z=Math.sin(i*1.4+l)*.8;this.group.add(leaf);
      }
      if(i%3===0){
        const flower=new THREE.Group();flower.position.copy(pt);flower.position.z+=.22;
        for(let j=0;j<5;j++){
          const a=j*Math.PI*2/5;
          const petal=new THREE.Mesh(new THREE.SphereGeometry(.09,10,8),
            new THREE.MeshStandardMaterial({color:bloomColors[(i+j)%4],roughness:.68,emissive:0x183b89,emissiveIntensity:.25}));
          petal.scale.set(.75,1.5,.5);petal.position.set(Math.cos(a)*.11,Math.sin(a)*.11,.035);
          petal.rotation.z=a-Math.PI/2;flower.add(petal);
        }
        flower.add(new THREE.Mesh(new THREE.SphereGeometry(.047,10,8),glow));this.group.add(flower);
      }
    }
    // Suspend little warm fairy lanterns along either side of the arch.
    for(const x of [-1.3,0,1.3]){
      const y=x===0?3.04:2.27;
      const cord=new THREE.Mesh(new THREE.CylinderGeometry(.009,.009,.34,7),wood);
      cord.position.set(x,y-.17,-2.65);this.group.add(cord);
      const lantern=new THREE.Mesh(new THREE.SphereGeometry(.12,12,10),glow);
      lantern.position.set(x,y-.35,-2.65);this.group.add(lantern);
      const light=new THREE.PointLight(0xffd3a1,.9,1.85);
      light.position.copy(lantern.position);this.group.add(light);
    }
  }

  public toggleRose(index?: number) {
    soundEngine.playSparkle();

    if (index !== undefined && this.roses[index]) {
      const rose = this.roses[index];
      rose.isBloomed = !rose.isBloomed;
      rose.targetBloom = rose.isBloomed ? 1.0 : 0.0;
    } else {
      const anyClosed = this.roses.some(r => !r.isBloomed);
      this.roses.forEach(rose => {
        rose.isBloomed = anyClosed;
        rose.targetBloom = anyClosed ? 1.0 : 0.0;
      });
    }
  }

  public update(delta: number, time: number) {
    // Rose bloom animations
    this.roses.forEach(rose => {
      rose.bloomProgress += (rose.targetBloom - rose.bloomProgress) * 0.08;
      const bp = rose.bloomProgress;

      rose.petals.forEach(petal => {
        const u = petal.userData;
        petal.rotation.x = u.baseRotX + bp * 0.85;
        const s = u.baseScale + bp * (u.maxScale - u.baseScale);
        petal.scale.set(s, s, s);

        const mat = petal.material as THREE.MeshStandardMaterial;
        mat.emissiveIntensity = 0.35 + bp * 0.65;
      });

      rose.light.intensity = 0.3 + bp * 1.8;
    });

    // Fireflies hovering
    if (this.fireflies && this.fireflyPositions && this.fireflySpeeds) {
      const pos = this.fireflyPositions;
      const spd = this.fireflySpeeds;
      const count = pos.length / 3;

      for (let i = 0; i < count; i++) {
        pos[i * 3] += spd[i * 3] + Math.sin(time * 2.2 + i) * 0.005;
        pos[i * 3 + 1] += spd[i * 3 + 1] + Math.cos(time * 1.8 + i) * 0.004;
        pos[i * 3 + 2] += spd[i * 3 + 2] + Math.sin(time * 2.0 + i) * 0.005;

        if (pos[i * 3] > 4.0) pos[i * 3] = -4.0;
        if (pos[i * 3] < -4.0) pos[i * 3] = 4.0;
        if (pos[i * 3 + 1] > 3.6) pos[i * 3 + 1] = 0.4;
        if (pos[i * 3 + 1] < 0.3) pos[i * 3 + 1] = 3.3;
        if (pos[i * 3 + 2] > 4.0) pos[i * 3 + 2] = -4.0;
        if (pos[i * 3 + 2] < -4.0) pos[i * 3 + 2] = 4.0;
      }
      this.fireflies.geometry.attributes.position.needsUpdate = true;
    }

    // Drifting petals
    if (this.floatingPetals && this.petalPositions) {
      const pos = this.petalPositions;
      const count = pos.length / 3;
      for (let i = 0; i < count; i++) {
        pos[i * 3 + 1] -= 0.009;
        pos[i * 3] += Math.sin(time * 1.2 + i) * 0.004;

        if (pos[i * 3 + 1] < 0.1) {
          pos[i * 3 + 1] = 3.6;
          pos[i * 3] = (Math.random() - 0.5) * 5.5;
        }
      }
      this.floatingPetals.geometry.attributes.position.needsUpdate = true;
    }

    // Moon rotation & halo breathing
    if (this.moonMesh) {
      this.moonMesh.rotation.y = time * 0.04;
    }
    if (this.moonHalo) {
      const haloScale = 1.0 + Math.sin(time * 2.0) * 0.04;
      this.moonHalo.scale.set(haloScale, haloScale, haloScale);
    }

    // Mushroom bioluminescent pulse
    this.glowingMushrooms.forEach((m, idx) => {
      const mat = m.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = 0.55 + Math.sin(time * 3.2 + idx * 1.4) * 0.35;
    });
  }
}
