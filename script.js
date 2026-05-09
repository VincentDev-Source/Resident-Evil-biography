document.addEventListener("DOMContentLoaded", () => {
  document.body.classList.add("page-ready");

  // ── Scroll reveal ──────────────────────────────────────────────────────────
  const groups = [
    { selector: ".archive-board > *", className: "reveal-pop" },
    { selector: ".content-panel", className: "reveal" },
    { selector: ".chapter-card", className: "reveal-pop" },
    { selector: ".card", className: "reveal-pop" },
    { selector: ".character-card", className: "reveal-pop" },
    { selector: ".character-badge", className: "reveal-left" },
    { selector: ".story-paper", className: "reveal-right" },
    { selector: ".relationship-item", className: "reveal" },
    { selector: ".gallery-card", className: "reveal-pop" },
    { selector: ".file-chip", className: "reveal-pop" },
    { selector: ".case-item", className: "reveal-pop" },
    { selector: ".signal-item", className: "reveal" },
    { selector: ".stat-card", className: "reveal-pop" }
  ];
  const seen = new Set();
  for (const group of groups) {
    document.querySelectorAll(group.selector).forEach((el, i) => {
      if (seen.has(el)) return;
      seen.add(el);
      el.classList.add("reveal", group.className);
      el.style.transitionDelay = `${Math.min(i * 70, 360)}ms`;
    });
  }
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
        } else {
          entry.target.classList.remove("is-visible");
        }
      });
    },
    { threshold: 0.16, rootMargin: "0px 0px -8% 0px" }
  );
  document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));

  // ── Typewriter on .eyebrow ─────────────────────────────────────────────────
  const eyebrow = document.querySelector(".eyebrow");
  if (eyebrow) {
    const originalText = eyebrow.textContent.trim();
    eyebrow.textContent = "";
    eyebrow.style.borderRight = "2px solid var(--blood-bright)";
    let i = 0;
    const typeInterval = setInterval(() => {
      eyebrow.textContent += originalText[i];
      i++;
      if (i >= originalText.length) {
        clearInterval(typeInterval);
        setTimeout(() => (eyebrow.style.borderRight = "none"), 800);
      }
    }, 60);
  }

  // ── Glitch effect on h1 ────────────────────────────────────────────────────
  const h1 = document.querySelector("h1");
  if (h1) {
    h1.setAttribute("data-text", h1.textContent);
    h1.classList.add("glitch-text");
    // Random glitch trigger
    setInterval(() => {
      if (Math.random() < 0.3) {
        h1.classList.add("glitch-active");
        setTimeout(() => h1.classList.remove("glitch-active"), 300 + Math.random() * 400);
      }
    }, 2500);
  }

  // ── Stamp flicker ──────────────────────────────────────────────────────────
  const stamp = document.querySelector(".stamp");
  if (stamp) {
    setInterval(() => {
      if (Math.random() < 0.15) {
        stamp.style.opacity = "0.3";
        setTimeout(() => (stamp.style.opacity = "1"), 80);
      }
    }, 1800);
  }

  // ── Blood cursor trail ─────────────────────────────────────────────────────
  const trail = [];
  const TRAIL_LEN = 8;
  for (let t = 0; t < TRAIL_LEN; t++) {
    const dot = document.createElement("div");
    dot.className = "cursor-trail";
    dot.style.cssText = `position:fixed;pointer-events:none;z-index:9999;border-radius:50%;background:rgba(180,30,30,${0.5 - t * 0.06});transition:opacity 0.4s;`;
    const size = 6 - t * 0.5;
    dot.style.width = size + "px";
    dot.style.height = size + "px";
    document.body.appendChild(dot);
    trail.push({ el: dot, x: -100, y: -100 });
  }
  let mouseX = -100, mouseY = -100;
  document.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });
  function animateTrail() {
    trail[0].x += (mouseX - trail[0].x) * 0.35;
    trail[0].y += (mouseY - trail[0].y) * 0.35;
    for (let t = 1; t < TRAIL_LEN; t++) {
      trail[t].x += (trail[t - 1].x - trail[t].x) * 0.45;
      trail[t].y += (trail[t - 1].y - trail[t].y) * 0.45;
    }
    trail.forEach((d) => {
      d.el.style.left = d.x - parseFloat(d.el.style.width) / 2 + "px";
      d.el.style.top = d.y - parseFloat(d.el.style.height) / 2 + "px";
    });
    requestAnimationFrame(animateTrail);
  }
  animateTrail();

  // ── Biohazard floating particles (canvas) ─────────────────────────────────
  const canvas = document.createElement("canvas");
  canvas.id = "particles-canvas";
  canvas.style.cssText =
    "position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:0;opacity:0.18;";
  document.body.prepend(canvas);

  const ctx = canvas.getContext("2d");
  let W = (canvas.width = window.innerWidth);
  let H = (canvas.height = window.innerHeight);
  window.addEventListener("resize", () => {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  });

  // Biohazard symbol path helper
  function drawBiohazard(ctx, cx, cy, r) {
    ctx.save();
    ctx.translate(cx, cy);
    const inner = r * 0.22;
    const mid = r * 0.55;
    // 3 arcs + inner circle
    for (let i = 0; i < 3; i++) {
      ctx.save();
      ctx.rotate((i * Math.PI * 2) / 3);
      ctx.beginPath();
      ctx.arc(0, -mid, r * 0.42, Math.PI * 1.1, Math.PI * 1.9, false);
      ctx.arc(0, 0, inner, Math.PI * 1.9 - Math.PI / 3, Math.PI * 1.1, true);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }
    ctx.beginPath();
    ctx.arc(0, 0, inner * 1.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(0, 0, inner * 0.5, 0, Math.PI * 2);
    ctx.save();
    ctx.globalCompositeOperation = "destination-out";
    ctx.fill();
    ctx.restore();
    ctx.restore();
  }

  const particles = Array.from({ length: 18 }, () => ({
    x: Math.random() * W,
    y: Math.random() * H,
    r: 8 + Math.random() * 18,
    vx: (Math.random() - 0.5) * 0.3,
    vy: -0.15 - Math.random() * 0.25,
    rot: Math.random() * Math.PI * 2,
    rotSpeed: (Math.random() - 0.5) * 0.008,
    opacity: 0.3 + Math.random() * 0.5
  }));

  function tickParticles() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;
      p.rot += p.rotSpeed;
      if (p.y < -40) { p.y = H + 20; p.x = Math.random() * W; }
      if (p.x < -40) p.x = W + 20;
      if (p.x > W + 40) p.x = -20;
      ctx.save();
      ctx.globalAlpha = p.opacity;
      ctx.fillStyle = "#7d3cff";
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      drawBiohazard(ctx, 0, 0, p.r);
      ctx.restore();
    });
    requestAnimationFrame(tickParticles);
  }
  tickParticles();

  // ── Three.js Umbrella 3D Logo in hero ──────────────────────────────────────
  const heroSide = document.querySelector(".hero-side");
  if (heroSide && typeof THREE === "undefined") {
    const threeScript = document.createElement("script");
    threeScript.src = "https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js";
    threeScript.onload = initUmbrellaLogo;
    document.head.appendChild(threeScript);
  } else if (heroSide) {
    initUmbrellaLogo();
  }

  function initUmbrellaLogo() {
    const container = document.createElement("div");
    container.id = "umbrella-3d";
    container.style.cssText =
      "width:100%;height:220px;display:flex;align-items:center;justify-content:center;margin-bottom:12px;";
    heroSide.insertBefore(container, heroSide.firstChild);

    const W3 = container.clientWidth || 260;
    const H3 = 220;
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(W3, H3);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, W3 / H3, 0.1, 100);
    camera.position.z = 3.8;

    // Umbrella Corp logo: circle ring + 3 wedge segments
    const group = new THREE.Group();

    // Outer ring
    const ringGeo = new THREE.TorusGeometry(1.0, 0.08, 16, 80);
    const mat = new THREE.MeshStandardMaterial({
      color: 0x7d3cff,
      emissive: 0x3a1a88,
      metalness: 0.7,
      roughness: 0.25
    });
    const ring = new THREE.Mesh(ringGeo, mat);
    group.add(ring);

    // Inner small ring
    const innerRingGeo = new THREE.TorusGeometry(0.28, 0.06, 16, 60);
    const innerRing = new THREE.Mesh(innerRingGeo, mat);
    group.add(innerRing);

    // 3 wedge "spokes" (Umbrella logo arms)
    for (let i = 0; i < 3; i++) {
      const angle = (i * Math.PI * 2) / 3 - Math.PI / 2;
      const shape = new THREE.Shape();
      // spoke = rounded rectangle from center outward
      shape.moveTo(-0.06, 0.28);
      shape.lineTo(-0.06, 0.92);
      shape.arc(0.06, 0, 0.06, Math.PI, 0, false);
      shape.lineTo(0.06, 0.28);
      shape.arc(-0.06, 0, 0.06, 0, Math.PI, false);
      const extrudeSettings = { depth: 0.12, bevelEnabled: false };
      const geo = new THREE.ExtrudeGeometry(shape, extrudeSettings);
      const spoke = new THREE.Mesh(geo, mat);
      spoke.position.z = -0.06;
      spoke.rotation.z = angle;
      group.add(spoke);
    }

    // Flat disc backing
    const discGeo = new THREE.CylinderGeometry(1.05, 1.05, 0.06, 64);
    const discMat = new THREE.MeshStandardMaterial({
      color: 0x0d0820,
      metalness: 0.5,
      roughness: 0.5
    });
    const disc = new THREE.Mesh(discGeo, discMat);
    disc.rotation.x = Math.PI / 2;
    disc.position.z = -0.1;
    group.add(disc);

    scene.add(group);

    // Lights
    const ambientLight = new THREE.AmbientLight(0x4a2090, 0.8);
    scene.add(ambientLight);
    const pointLight1 = new THREE.PointLight(0x9060ff, 2.5, 12);
    pointLight1.position.set(3, 3, 3);
    scene.add(pointLight1);
    const pointLight2 = new THREE.PointLight(0xff2255, 1.2, 10);
    pointLight2.position.set(-3, -2, 2);
    scene.add(pointLight2);

    // Mouse interaction
    let targetRotX = 0, targetRotY = 0;
    container.addEventListener("mousemove", (e) => {
      const rect = container.getBoundingClientRect();
      targetRotY = ((e.clientX - rect.left) / rect.width - 0.5) * 1.2;
      targetRotX = ((e.clientY - rect.top) / rect.height - 0.5) * 0.8;
    });

    let autoRot = 0;
    function animate3D() {
      requestAnimationFrame(animate3D);
      autoRot += 0.008;
      group.rotation.y += (targetRotY + autoRot - group.rotation.y) * 0.05;
      group.rotation.x += (targetRotX - group.rotation.x) * 0.05;
      // Pulsing emissive glow
      const pulse = 0.3 + 0.2 * Math.sin(Date.now() * 0.002);
      mat.emissiveIntensity = pulse;
      renderer.render(scene, camera);
    }
    animate3D();

    // Resize
    window.addEventListener("resize", () => {
      const nW = container.clientWidth || 260;
      renderer.setSize(nW, H3);
      camera.aspect = nW / H3;
      camera.updateProjectionMatrix();
    });
  }

  // ── Scanline overlay ────────────────────────────────────────────────────────
  const scanlines = document.createElement("div");
  scanlines.id = "scanlines";
  scanlines.style.cssText =
    "position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:998;" +
    "background:repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(0,0,0,0.07) 3px,rgba(0,0,0,0.07) 4px);";
  document.body.appendChild(scanlines);

  // ── Random red vignette flicker ─────────────────────────────────────────────
  const vignette = document.createElement("div");
  vignette.id = "vignette-flash";
  vignette.style.cssText =
    "position:fixed;inset:0;pointer-events:none;z-index:997;opacity:0;transition:opacity 0.1s;" +
    "background:radial-gradient(circle at center, transparent 55%, rgba(120,10,10,0.22) 100%);";
  document.body.appendChild(vignette);
  setInterval(() => {
    if (Math.random() < 0.06) {
      vignette.style.opacity = "1";
      setTimeout(() => (vignette.style.opacity = "0"), 120);
    }
  }, 3000);
});
