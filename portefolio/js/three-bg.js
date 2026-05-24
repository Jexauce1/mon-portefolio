/**
 * three-bg.js
 * ─────────────────────────────────────────────────────────
 * Champ de particules + grille de fond avec Three.js.
 * Réagit au mouvement de la souris et au scroll.
 *
 * PERSONNALISATION :
 *   PARTICLE_COUNT  → nombre de points (défaut 2000)
 *   PARTICLE_COLOR  → couleur hex (défaut orange-rouge)
 *   PARTICLE_SIZE   → taille des points
 * ─────────────────────────────────────────────────────────
 */

(function () {

  /* ── CONFIG ── */
  const PARTICLE_COUNT = 2000;
  const PARTICLE_COLOR = 0xff4500;
  const PARTICLE_SIZE  = 0.013;
  const GRID_COLOR     = 0x1a1a1a;

  /* ── SETUP RENDERER ── */
  const canvas   = document.getElementById('canvas-bg');
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);

  const scene  = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    75, window.innerWidth / window.innerHeight, 0.1, 100
  );
  camera.position.z = 3;

  /* ── PARTICULES ── */
  const positions = new Float32Array(PARTICLE_COUNT * 3);
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    positions[i * 3]     = (Math.random() - 0.5) * 12;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 12;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 8;
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  const mat = new THREE.PointsMaterial({
    color: PARTICLE_COLOR,
    size: PARTICLE_SIZE,
    sizeAttenuation: true,
    transparent: true,
    opacity: 0.7
  });

  const points = new THREE.Points(geo, mat);
  scene.add(points);

  /* ── GRILLE DE FOND ── */
  const lineMat = new THREE.LineBasicMaterial({
    color: GRID_COLOR,
    transparent: true,
    opacity: 0.5
  });

  for (let i = -6; i <= 6; i++) {
    const gH = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(-6, i, -3),
      new THREE.Vector3( 6, i, -3)
    ]);
    const gV = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(i, -6, -3),
      new THREE.Vector3(i,  6, -3)
    ]);
    scene.add(new THREE.Line(gH, lineMat));
    scene.add(new THREE.Line(gV, lineMat));
  }

  /* ── ÉTAT SOURIS & SCROLL ── */
  const mouse  = { x: 0, y: 0 };
  let scrollY  = 0;

  window.addEventListener('mousemove', (e) => {
    mouse.x = (e.clientX / window.innerWidth  - 0.5) * 0.4;
    mouse.y = -(e.clientY / window.innerHeight - 0.5) * 0.4;
  });

  window.addEventListener('scroll', () => {
    scrollY = window.scrollY;
  });

  /* ── RESIZE ── */
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  /* ── BOUCLE D'ANIMATION ── */
  function animate() {
    requestAnimationFrame(animate);

    // Rotation lente des particules
    points.rotation.y += 0.0006;
    points.rotation.x += 0.0002;

    // Suivi souris smooth (lerp)
    camera.position.x += (mouse.x - camera.position.x) * 0.04;
    camera.position.y += (mouse.y - camera.position.y) * 0.04;

    // Éloignement au scroll + fade out
    camera.position.z = 3 + scrollY * 0.0015;
    mat.opacity = Math.max(0.05, 0.7 - scrollY * 0.0004);

    renderer.render(scene, camera);
  }

  animate();

})();
