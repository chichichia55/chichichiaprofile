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

// ===== Certificates filter =====
const certFilters = document.getElementById('certFilters');
const certCards = document.querySelectorAll('#certificates .certcard');

if (certFilters) {
  certFilters.addEventListener('click', (e) => {
    const btn = e.target.closest('.filter');
    if (!btn) return;

    certFilters.querySelectorAll('.filter').forEach(b => b.classList.remove('is-active'));
    btn.classList.add('is-active');

    const f = btn.dataset.filter;
    certCards.forEach(card => {
      const cat = card.dataset.cat || 'all';
      const show = (f === 'all') || (cat === f);
      card.classList.toggle('is-hidden', !show);
    });
  });
}
const heroBg = document.querySelector('.hero__bg');

document.addEventListener('mousemove', (e) => {
  const { innerWidth, innerHeight } = window;

  const x = (e.clientX / innerWidth - 0.5) * 30;
  const y = (e.clientY / innerHeight - 0.5) * 30;

  heroBg.style.transform = `translate3d(${x}px, ${y}px, 0)`;
});
window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  heroBg.style.transform += ` translateY(${scrollY * 0.05}px)`;
});

window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  heroBg.style.transform += ` translateY(${scrollY * 0.05}px)`;
});

// Skill bars animate when in view (repeatable)
(() => {
  const skills = document.querySelectorAll('#skills .skill');
  if (!skills.length) return;

  // 先把每個 bar 的 level 存成 CSS 變數
  skills.forEach(skill => {
    const span = skill.querySelector('.skill__bar span');
    if (!span) return;
    const level = span.dataset.level || '0';
    span.style.setProperty('--level', `${level}%`);
  });

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const el = entry.target;

      if (entry.isIntersecting) {
        // 進入視窗：觸發動畫
        el.classList.add('is-animate');
      } else {
        // 離開視窗：縮回去，回來才能再跑
        el.classList.remove('is-animate');

        // 保險：重置到 0，避免某些瀏覽器不重播 transition
        const span = el.querySelector('.skill__bar span');
        if (span) span.style.width = '0%';
        // 讓瀏覽器吃到一次 reflow，再把 inline width 清掉交回 CSS 控制
        el.offsetHeight;
        if (span) span.style.width = '';
      }
    });
  }, { threshold: 0.35 });

  skills.forEach(s => io.observe(s));
})();

