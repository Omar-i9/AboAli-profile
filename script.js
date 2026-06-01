const $ = (selector, parent = document) => parent.querySelector(selector);
const $$ = (selector, parent = document) => [...parent.querySelectorAll(selector)];

const toast = $("#toast");
const cursorGlow = $("#cursorGlow");
const shareLayer = $("#shareLayer");
const shareFab = $("#shareFab");
const shareBackdrop = $("#shareBackdrop");
const closeShare = $("#closeShare");
const shareUrlInput = $("#shareUrlInput");
const copyShareUrl = $("#copyShareUrl");
const nativeShare = $("#nativeShare");
const profileShot = $("#profileShot");
const sigAvatar = $("#sigAvatar");
const designerCard = $("#designerCard");

const pageUrl = window.location.href;
if (shareUrlInput) shareUrlInput.value = pageUrl;

function showToast(message, ms = 1700) {
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove("show"), ms);
}

async function copyText(text, label = "تم النسخ") {
  try {
    await navigator.clipboard.writeText(text);
    showToast(label);
  } catch {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    textarea.style.top = "-20px";
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    document.execCommand("copy");
    textarea.remove();
    showToast(label);
  }
}

function burst(x = innerWidth / 2, y = innerHeight / 2, count = 14) {
  const colors = ["#6ae6ff", "#9b7cff", "#ffb86b", "#ff4fa3", "#27e087"];
  for (let i = 0; i < count; i++) {
    const spark = document.createElement("span");
    spark.className = "spark";
    const angle = Math.random() * Math.PI * 2;
    const distance = 38 + Math.random() * 86;
    spark.style.left = `${x}px`;
    spark.style.top = `${y}px`;
    spark.style.color = colors[Math.floor(Math.random() * colors.length)];
    spark.style.background = "currentColor";
    spark.style.setProperty("--dx", `${Math.cos(angle) * distance}px`);
    spark.style.setProperty("--dy", `${Math.sin(angle) * distance}px`);
    document.body.appendChild(spark);
    spark.addEventListener("animationend", () => spark.remove(), { once: true });
  }
}

function openShareSheet() {
  if (!shareLayer) return;
  shareLayer.classList.add("show");
  shareLayer.setAttribute("aria-hidden", "false");
  document.body.classList.add("lock");
  if (shareUrlInput) {
    shareUrlInput.value = window.location.href;
    setTimeout(() => shareUrlInput.select(), 180);
  }
}

function closeShareSheet() {
  if (!shareLayer) return;
  shareLayer.classList.remove("show");
  shareLayer.setAttribute("aria-hidden", "true");
  document.body.classList.remove("lock");
}

shareFab?.addEventListener("click", (event) => {
  openShareSheet();
  burst(event.clientX || innerWidth / 2, event.clientY || innerHeight - 80, 10);
});
shareBackdrop?.addEventListener("click", closeShareSheet);
closeShare?.addEventListener("click", closeShareSheet);

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeShareSheet();
});

copyShareUrl?.addEventListener("click", async (event) => {
  await copyText(shareUrlInput?.value || window.location.href, "تم نسخ رابط الصفحة");
  burst(event.clientX || innerWidth / 2, event.clientY || innerHeight - 120, 16);
});

nativeShare?.addEventListener("click", async () => {
  const data = {
    title: document.title,
    text: "روابط أبو علي",
    url: window.location.href
  };

  if (navigator.share) {
    try {
      await navigator.share(data);
    } catch {
      // المستخدم أغلق نافذة المشاركة. طبيعي، البشر يفتحوا أشياء ويقفلوا أشياء.
    }
  } else {
    await copyText(window.location.href, "المشاركة غير مدعومة، تم نسخ الرابط");
  }
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.16 });

$$(".reveal").forEach((block, index) => {
  block.style.animationDelay = `${index * 80}ms`;
  observer.observe(block);
});

document.addEventListener("pointermove", (event) => {
  if (event.pointerType !== "mouse" || !cursorGlow) return;
  cursorGlow.style.left = `${event.clientX}px`;
  cursorGlow.style.top = `${event.clientY}px`;
  cursorGlow.style.opacity = "1";
});

document.addEventListener("pointerleave", () => {
  if (cursorGlow) cursorGlow.style.opacity = "0";
});

$$(".tilt-card").forEach((card) => {
  card.addEventListener("pointermove", (event) => {
    const rect = card.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    card.style.setProperty("--mx", `${x}%`);
    card.style.setProperty("--my", `${y}%`);

    if (event.pointerType === "mouse") {
      const rotateX = ((event.clientY - rect.top) / rect.height - 0.5) * -5;
      const rotateY = ((event.clientX - rect.left) / rect.width - 0.5) * 5;
      card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-2px)`;
    }
  });

  card.addEventListener("pointerleave", () => {
    card.style.transform = "";
  });
});

$$(".social-card").forEach((card) => {
  let pressTimer = null;
  let longPress = false;
  let startX = 0;
  let startY = 0;

  const clearPress = () => {
    clearTimeout(pressTimer);
    card.classList.remove("long-pressing");
  };

  card.addEventListener("pointerdown", (event) => {
    longPress = false;
    startX = event.clientX;
    startY = event.clientY;
    clearTimeout(pressTimer);

    pressTimer = setTimeout(async () => {
      longPress = true;
      card.classList.add("selected");
      card.classList.remove("long-pressing");
      await copyText(card.dataset.link || card.href, "تم نسخ الرابط");
      burst(event.clientX || innerWidth / 2, event.clientY || innerHeight / 2, 18);
    }, 520);

    card.classList.add("long-pressing");
  });

  card.addEventListener("pointermove", (event) => {
    if (Math.abs(event.clientX - startX) > 12 || Math.abs(event.clientY - startY) > 12) clearPress();
  });

  card.addEventListener("pointerup", clearPress);
  card.addEventListener("pointercancel", clearPress);
  card.addEventListener("pointerleave", clearPress);

  card.addEventListener("click", (event) => {
    if (longPress) {
      event.preventDefault();
      return;
    }

    event.preventDefault();
    $$(".social-card.selected").forEach((item) => item.classList.remove("selected"));
    card.classList.add("selected");
    burst(event.clientX || innerWidth / 2, event.clientY || innerHeight / 2, 10);

    setTimeout(() => {
      window.open(card.dataset.link || card.href, "_blank", "noopener,noreferrer");
    }, 220);
  });
});

$$(".copy-btn").forEach((button) => {
  button.addEventListener("click", async (event) => {
    event.preventDefault();
    event.stopPropagation();
    const value = button.dataset.copy || "";
    const name = button.dataset.name || "القيمة";
    await copyText(value, `تم نسخ ${name}`);
    burst(event.clientX || innerWidth / 2, event.clientY || innerHeight / 2, 14);
  });
});

profileShot?.addEventListener("click", (event) => {
  profileShot.classList.remove("clicked");
  void profileShot.offsetWidth;
  profileShot.classList.add("clicked");
  burst(event.clientX || innerWidth / 2, event.clientY || 120, 12);
});

sigAvatar?.addEventListener("click", (event) => {
  sigAvatar.classList.remove("pressed");
  void sigAvatar.offsetWidth;
  sigAvatar.classList.add("pressed");
  designerCard?.classList.add("active");
  burst(event.clientX || innerWidth / 2, event.clientY || innerHeight - 180, 18);
  setTimeout(() => designerCard?.classList.remove("active"), 900);
});
