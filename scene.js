/**
 * LESO — Light Theme 3D Scene
 * Floating film frames / lens elements in warm tones.
 * Subtle, doesn't overpower the light design.
 * Mouse-reactive, slow organic motion.
 */
(function () {
  'use strict';

  const canvas = document.getElementById('c');
  const R = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  R.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  R.setSize(window.innerWidth, window.innerHeight);
  R.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();
  const cam = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 100);
  cam.position.set(0, 0, 6);

  // Warm amber light from top-right
  const l1 = new THREE.PointLight(0xc9922a, 3, 18);
  l1.position.set(4, 4, 3);
  scene.add(l1);

  // Soft warm fill
  const l2 = new THREE.PointLight(0xf0d9a0, 1.5, 14);
  l2.position.set(-3, -2, 4);
  scene.add(l2);

  scene.add(new THREE.AmbientLight(0xffffff, 0.4));

  // ── FLOATING FILM FRAMES ─────────────────────────────────────────────────
  // Thin rectangular frames (like 16mm film aperture proportions)
  const group = new THREE.Group();
  scene.add(group);

  const frameDefs = [
    { x: -2.2, y:  0.6, z: -1.2, rx: 0.2,  ry: 0.3,  s: 0.9  },
    { x:  2.4, y:  0.8, z: -0.8, rx: -0.15, ry: -0.4, s: 0.75 },
    { x: -1.6, y: -1.2, z: -0.5, rx: 0.35,  ry: 0.2,  s: 0.6  },
    { x:  1.8, y: -0.8, z: -1.5, rx: -0.2,  ry: -0.25, s: 0.8 },
    { x:  0.2, y:  1.8, z: -2.0, rx: 0.1,   ry: 0.5,  s: 1.1  },
    { x: -2.8, y: -0.3, z: -2.2, rx: -0.3,  ry: 0.15, s: 0.65 },
    { x:  3.0, y: -1.5, z: -1.8, rx: 0.25,  ry: -0.35, s: 0.7 },
  ];

  const frameObjs = [];

  frameDefs.forEach((def, i) => {
    const fw = 1.4 * def.s;
    const fh = 0.88 * def.s;

    const fr = new THREE.Group();

    // Thin flat plane (frosted glass look)
    const planeMat = new THREE.MeshStandardMaterial({
      color: 0xf7f5f1,
      emissive: 0xf0e8d8,
      emissiveIntensity: 0.08,
      metalness: 0.05,
      roughness: 0.85,
      transparent: true,
      opacity: 0.55,
    });
    const plane = new THREE.Mesh(new THREE.PlaneGeometry(fw, fh), planeMat);
    fr.add(plane);

    // Amber edge border — thin lines
    const edgePts = [
      -fw/2, -fh/2, 0,   fw/2, -fh/2, 0,
       fw/2, -fh/2, 0,   fw/2,  fh/2, 0,
       fw/2,  fh/2, 0,  -fw/2,  fh/2, 0,
      -fw/2,  fh/2, 0,  -fw/2, -fh/2, 0,
    ];
    const edgeGeo = new THREE.BufferGeometry();
    edgeGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(edgePts), 3));
    const edgeMat = new THREE.LineBasicMaterial({
      color: i % 2 === 0 ? 0xc9922a : 0xe8b04a,
      transparent: true,
      opacity: 0.5 + Math.random() * 0.3,
    });
    const edge = new THREE.LineSegments(edgeGeo, edgeMat);
    edge.position.z = 0.001;
    fr.add(edge);

    fr.position.set(def.x, def.y, def.z);
    fr.rotation.set(def.rx, def.ry, 0);

    group.add(fr);
    frameObjs.push({ mesh: fr, ox: def.x, oy: def.y, base_rx: def.rx, base_ry: def.ry, phase: i * 1.1 });
  });

  // ── FLOATING DOTS (lens dust, very subtle) ───────────────────────────────
  const dp = new Float32Array(800 * 3);
  for (let i = 0; i < 800; i++) {
    dp[i*3]   = (Math.random() - .5) * 14;
    dp[i*3+1] = (Math.random() - .5) * 10;
    dp[i*3+2] = (Math.random() - .5) * 6;
  }
  const dg = new THREE.BufferGeometry();
  dg.setAttribute('position', new THREE.BufferAttribute(dp, 3));
  const dots = new THREE.Points(dg, new THREE.PointsMaterial({
    color: 0xc9922a, size: 0.012, transparent: true, opacity: 0.2, sizeAttenuation: true,
  }));
  scene.add(dots);

  // ── MOUSE ─────────────────────────────────────────────────────────────────
  const mouse = { x: 0, y: 0 };
  document.addEventListener('mousemove', e => {
    mouse.x = (e.clientX / window.innerWidth  - .5) * 2;
    mouse.y = (e.clientY / window.innerHeight - .5) * 2;
  });

  const clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);
    const t = clock.getElapsedTime();

    // Slow overall group drift following mouse
    group.rotation.y += (mouse.x * 0.15 - group.rotation.y) * 0.025;
    group.rotation.x += (-mouse.y * 0.1  - group.rotation.x) * 0.025;

    // Each frame floats independently
    frameObjs.forEach(f => {
      f.mesh.position.y = f.oy + Math.sin(t * 0.4 + f.phase) * 0.12;
      f.mesh.rotation.x = f.base_rx + Math.sin(t * 0.3 + f.phase * 0.7) * 0.04;
      f.mesh.rotation.y = f.base_ry + Math.cos(t * 0.25 + f.phase * 0.5) * 0.04;
    });

    // Lights slowly orbit
    l1.position.x = Math.sin(t * 0.3) * 5;
    l1.position.z = Math.cos(t * 0.3) * 4;

    dots.rotation.y = t * 0.006;

    R.render(scene, cam);
  }

  animate();

  window.addEventListener('resize', () => {
    cam.aspect = window.innerWidth / window.innerHeight;
    cam.updateProjectionMatrix();
    R.setSize(window.innerWidth, window.innerHeight);
    R.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  });
})();
