// ===== Helpers =====
const $ = (q, el = document) => el.querySelector(q);
const $$ = (q, el = document) => Array.from(el.querySelectorAll(q));

function setTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem("theme", theme);
  const icon = $("#themeToggle i");
  if (icon) icon.className = theme === "light" ? "fa-solid fa-sun" : "fa-solid fa-moon";
}

// ===== Theme =====
document.documentElement.setAttribute("data-theme", "light");

// ===== Mobile Drawer =====
document.addEventListener("DOMContentLoaded", () => {
  const drawer = $("#drawer");
  const openBtn = $("#menuToggle");
  const closeBtn = $("#menuClose");
  const backdrop = $("#drawerBackdrop");

  function open() {
    drawer.classList.add("is-open");
    drawer.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }
  function close() {
    drawer.classList.remove("is-open");
    drawer.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  openBtn?.addEventListener("click", open);
  closeBtn?.addEventListener("click", close);
  backdrop?.addEventListener("click", close);

  $$(".drawer-link").forEach(a => a.addEventListener("click", close));
});

// ===== Skills bar animate on view =====
document.addEventListener("DOMContentLoaded", () => {
  const bars = $$(".skill__bar span");
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        // already has inline width in HTML
        // trigger transition by setting current width again
        const w = e.target.getAttribute("style")?.match(/width:\s*([^;]+)/)?.[1];
        if (w) requestAnimationFrame(() => e.target.style.width = w);
      }
    });
  }, { threshold: 0.25 });

  bars.forEach(b => io.observe(b));
});

// ===== Lightbox (for work cards + certificates preview) =====
document.addEventListener("DOMContentLoaded", () => {
  const lightbox = $("#lightbox");
  const imgEl = $("#lightboxImg");
  const capEl = $("#lightboxCaption");
  const closeBtn = $("#lightboxClose");
  const backdrop = $("#lightboxBackdrop");

  function openLightbox(src, caption) {
    // handle spaces in filename safely
    imgEl.src = encodeURI(src);
    capEl.textContent = caption || "";
    lightbox.classList.add("is-open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function closeLightbox() {
    lightbox.classList.remove("is-open");
    lightbox.setAttribute("aria-hidden", "true");
    imgEl.src = "";
    capEl.textContent = "";
    document.body.style.overflow = "";
  }

  // Work / Activity cards that contain an <img>
  $$("[data-lightbox]").forEach(card => {
    const img = $("img", card);
    if (!img) return;
    card.addEventListener("click", () => {
      const caption = img.alt || $(".workcard__title", card)?.textContent || "";
      openLightbox(img.getAttribute("src"), caption);
    });
  });

  // Certificate buttons: <div data-open="#id">
  $$("[data-open]").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const selector = btn.getAttribute("data-open");
      const target = selector ? $(selector) : null;
      if (!target) return;
      const caption = target.alt || "Certificate";
      openLightbox(target.getAttribute("src"), caption);
    });
  });

  closeBtn?.addEventListener("click", closeLightbox);
  backdrop?.addEventListener("click", closeLightbox);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && lightbox.classList.contains("is-open")) closeLightbox();
  });
});

// ===== Footer year =====
document.addEventListener("DOMContentLoaded", () => {
  const y = new Date().getFullYear();
  const el = $("#year");
  if (el) el.textContent = String(y);
});
