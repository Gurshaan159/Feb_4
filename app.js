(() => {
  const $ = (id) => document.getElementById(id);
  const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

  // Footer year (shared across pages)
  const year = $("year");
  if (year) year.textContent = String(new Date().getFullYear());

  const prefersReducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;
  const page = document.body?.dataset?.page || "";

  if (page === "valentine") initValentinePage();
  if (page === "yes") initYesPage();

  function initValentinePage() {
    const stage = $("choiceStage");
    const yesBtn = $("yesButton");
    const noBtn = $("noButton");
    const heart = $("proximityHeart");
    const hint = $("tinyHint");

    if (!stage || !yesBtn || !noBtn || !heart) return;

    const padding = 8;

    const moveNoButton = () => {
      const stageRect = stage.getBoundingClientRect();

      // Ensure layout is up-to-date before measuring.
      const noW = noBtn.offsetWidth || 140;
      const noH = noBtn.offsetHeight || 44;

      const maxX = Math.max(padding, stageRect.width - noW - padding);
      const maxY = Math.max(padding, stageRect.height - noH - padding);

      const x = padding + Math.random() * (maxX - padding);
      const y = padding + Math.random() * (maxY - padding);

      noBtn.style.left = `${x}px`;
      noBtn.style.top = `${y}px`;

      if (hint) hint.textContent = "Nice try.";
    };

    const placeNoInitially = () => {
      const stageRect = stage.getBoundingClientRect();
      const noW = noBtn.offsetWidth || 140;
      const noH = noBtn.offsetHeight || 44;
      const x = clamp(stageRect.width - noW - padding, padding, stageRect.width - noW - padding);
      const y = clamp((stageRect.height - noH) / 2, padding, stageRect.height - noH - padding);
      noBtn.style.left = `${x}px`;
      noBtn.style.top = `${y}px`;
    };

    requestAnimationFrame(placeNoInitially);

    // Make the "No" button run away.
    noBtn.addEventListener("pointerenter", moveNoButton);
    noBtn.addEventListener("mouseenter", moveNoButton);
    noBtn.addEventListener("click", (e) => {
      e.preventDefault();
      moveNoButton();
    });
    noBtn.addEventListener("pointerdown", (e) => {
      // On touch devices, move immediately on touch.
      if (e.pointerType === "touch") moveNoButton();
    });

    // Grow heart as cursor approaches "Yes".
    const updateHeartScale = (clientX, clientY) => {
      const r = yesBtn.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const dist = Math.hypot(clientX - cx, clientY - cy);

      const maxDist = Math.max(window.innerWidth, window.innerHeight) * 0.75;
      const t = 1 - clamp(dist / maxDist, 0, 1);
      const scale = 1 + t * 1.6; // 1.0 → 2.6

      heart.style.setProperty("--heartScale", String(scale.toFixed(3)));
    };

    // Baseline so it doesn't start huge on load.
    heart.style.setProperty("--heartScale", "1");

    window.addEventListener("pointermove", (e) => updateHeartScale(e.clientX, e.clientY), { passive: true });
    window.addEventListener("mousemove", (e) => updateHeartScale(e.clientX, e.clientY), { passive: true });

    window.addEventListener("resize", () => {
      placeNoInitially();
    });
  }

  function initYesPage() {
    if (prefersReducedMotion) return;

    const confettiLayer = $("confettiLayer");
    const heartsLayer = $("heartsLayer");
    if (!confettiLayer || !heartsLayer) return;

    spawnConfetti(confettiLayer, 90);
    startFloatingHearts(heartsLayer);
  }

  function spawnConfetti(layer, count) {
    const colors = ["#ff3b5c", "#ff4da6", "#7c5cff", "#42d6ff", "#ffffff"];

    for (let i = 0; i < count; i += 1) {
      const piece = document.createElement("div");
      piece.className = "confettiPiece";

      const x = Math.random() * 100;
      const dx = (Math.random() - 0.5) * 220;
      const dur = 950 + Math.random() * 1100;
      const w = 6 + Math.random() * 6;
      const h = 10 + Math.random() * 10;
      const c = colors[Math.floor(Math.random() * colors.length)];

      piece.style.setProperty("--x", x.toFixed(2));
      piece.style.setProperty("--dx", dx.toFixed(2));
      piece.style.setProperty("--dur", `${Math.round(dur)}ms`);
      piece.style.setProperty("--w", `${Math.round(w)}`);
      piece.style.setProperty("--h", `${Math.round(h)}`);
      piece.style.setProperty("--c", c);

      piece.addEventListener(
        "animationend",
        () => {
          piece.remove();
        },
        { once: true }
      );

      layer.appendChild(piece);
    }
  }

  function startFloatingHearts(layer) {
    const makeHeart = () => {
      const h = document.createElement("div");
      h.className = "floatHeart";
      h.textContent = "❤";

      const x = Math.random() * 100;
      const s = 14 + Math.random() * 22;
      const dur = 2600 + Math.random() * 2200;

      h.style.setProperty("--x", x.toFixed(2));
      h.style.setProperty("--s", String(Math.round(s)));
      h.style.setProperty("--dur", `${Math.round(dur)}ms`);

      h.addEventListener(
        "animationend",
        () => {
          h.remove();
        },
        { once: true }
      );

      layer.appendChild(h);
    };

    // Stagger start to feel more organic.
    let created = 0;
    const maxInitial = 22;
    const interval = window.setInterval(() => {
      makeHeart();
      created += 1;
      if (created >= maxInitial) window.clearInterval(interval);
    }, 220);

    // Keep a gentle background stream.
    window.setInterval(makeHeart, 520);
  }
})();
