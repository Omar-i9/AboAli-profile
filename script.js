const toast = document.getElementById("toast");
const cursorGlow = document.querySelector(".cursor-glow");
const floatingLayer = document.querySelector(".floating-layer");
const revealBlocks = document.querySelectorAll(".reveal");
const profileShot = document.getElementById("profileShot");

function showToast(message, ms = 1800) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(showToast._timer);
  showToast._timer = setTimeout(() => toast.classList.remove("show"), ms);
}

async function copyText(text, label = "تم النسخ") {
  try {
    await navigator.clipboard.writeText(text);
    showToast(label);
  } catch {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.focus();
    ta.select();
    document.execCommand("copy");
    ta.remove();
    showToast(label);
  }
}

function spawnConfetti(x, y, count = 18) {
  const colors = ["#a78bfa", "#60bbff", "#ffb36b", "#ff8fb8", "#c7d2fe"];
  for (let i = 0; i < count; i++) {
    const piece = document.createElement("span");
    piece.className = "confetti";

    const size = 5 + Math.random() * 7;
    const dx = (Math.random() * 220 - 110).toFixed(1) + "px";
    const dy = (120 + Math.random() * 220).toFixed(1) + "px";
    const rot = (Math.random() * 760 - 380).toFixed(1) + "deg";

    piece.style.left = `${x}px`;
    piece.style.top = `${y}px`;
    piece.style.width = `${size}px`;
    piece.style.height = `${size + Math.random() * 10}px`;
    piece.style.background = colors[Math.floor(Math.random() * colors.length)];
    piece.style.setProperty("--dx", dx);
    piece.style.setProperty("--dy", dy);
    piece.style.setProperty("--rot", rot);

    document.body.appendChild(piece);
    piece.addEventListener("animationend", () => piece.remove());
  }
}

function createFloatingParticles() {
  const count = 22;
  const kinds = ["a", "b", "c"];

  for (let i = 0; i < count; i++) {
    const s = document.createElement("span");
    s.className = kinds[i % kinds.length];

    const left = Math.random() * 100;
    const size = 8 + Math.random() * 20;
    const duration = 16 + Math.random() * 18;
    const delay = -(Math.random() * 26);
    const shift = (Math.random() * 180 - 90).toFixed(0) + "px";

    s.style.left = `${left}vw`;
    s.style.width = `${size}px`;
    s.style.height = `${size}px`;
    s.style.animationDuration = `${duration}s`;
    s.style.animationDelay = `${delay}s`;
    s.style.setProperty("--shift", shift);
    s.style.opacity = (0.12 + Math.random() * 0.22).toFixed(2);

    floatingLayer.appendChild(s);
  }
}

createFloatingParticles();

setTimeout(() => {
  revealBlocks.forEach((block, index) => {
    setTimeout(() => block.classList.add("is-visible"), index * 170);
  });
}, 140);

document.addEventListener("mousemove", (e) => {
  cursorGlow.style.left = `${e.clientX}px`;
  cursorGlow.style.top = `${e.clientY}px`;
  cursorGlow.style.opacity = "1";
});

document.addEventListener("mouseleave", () => {
  cursorGlow.style.opacity = "0";
});

document.querySelectorAll(".social-card").forEach((card) => {
  let pressTimer = null;
  let longPress = false;

  card.addEventListener("mousemove", (e) => {
    const rect = card.getBoundingClientRect();
    const mx = ((e.clientX - rect.left) / rect.width) * 100;
    const my = ((e.clientY - rect.top) / rect.height) * 100;
    card.style.setProperty("--mx", `${mx}%`);
    card.style.setProperty("--my", `${my}%`);
  });

  const startPress = (e) => {
    longPress = false;
    clearTimeout(pressTimer);

    pressTimer = setTimeout(async () => {
      longPress = true;
      const link = card.dataset.link || card.href;
      await copyText(link, "تم نسخ الرابط");
      spawnConfetti(e.clientX || window.innerWidth / 2, e.clientY || window.innerHeight / 2, 22);
      card.classList.add("selected");
    }, 550);
  };

  const endPress = () => {
    clearTimeout(pressTimer);
  };

  card.addEventListener("pointerdown", startPress);
  card.addEventListener("pointerup", endPress);
  card.addEventListener("pointercancel", endPress);
  card.addEventListener("pointerleave", endPress);

  card.addEventListener("click", (e) => {
    if (longPress) {
      e.preventDefault();
      return;
    }

    e.preventDefault();

    document.querySelectorAll(".social-card.selected").forEach((x) => {
      x.classList.remove("selected");
    });

    card.classList.add("selected");

    const link = card.dataset.link || card.href;
    spawnConfetti(e.clientX || window.innerWidth / 2, e.clientY || window.innerHeight / 2, 12);

    setTimeout(() => {
      window.open(link, "_blank", "noopener,noreferrer");
    }, 280);
  });
});

document.querySelectorAll(".copy-btn").forEach((btn) => {
  btn.addEventListener("click", async (e) => {
    const value = btn.dataset.copy || "";
    const name = btn.dataset.name || "تم النسخ";
    await copyText(value, `تم نسخ ${name}`);
    spawnConfetti(e.clientX || window.innerWidth / 2, e.clientY || window.innerHeight / 2, 18);
  });
});

profileShot.addEventListener("click", (e) => {
  profileShot.classList.remove("clicked");
  void profileShot.offsetWidth;
  profileShot.classList.add("clicked");
  spawnConfetti(e.clientX || window.innerWidth / 2, e.clientY || window.innerHeight / 2, 16);
  showToast("الصورة تفاعلية");
});

const sigAvatar = document.getElementById("sigAvatar");

sigAvatar?.addEventListener("click", (e) => {
  sigAvatar.classList.remove("pressed");
  void sigAvatar.offsetWidth;
  sigAvatar.classList.add("pressed");
});