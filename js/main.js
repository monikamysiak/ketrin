const navToggle = document.querySelector(".nav-toggle");
const mainNav = document.querySelector(".main-nav");
const siteHeader = document.querySelector(".site-header");

const updateHeaderHeight = () => {
  if (!siteHeader) return;
  document.documentElement.style.setProperty(
    "--header-height",
    `${Math.ceil(siteHeader.getBoundingClientRect().height)}px`
  );
};

const updateHeaderState = () => {
  if (!siteHeader) return;
  siteHeader.classList.toggle("is-scrolled", window.scrollY > 8);
  updateHeaderHeight();
};

updateHeaderHeight();
updateHeaderState();
window.addEventListener("scroll", updateHeaderState, { passive: true });
window.addEventListener("resize", updateHeaderHeight);

if (navToggle && mainNav) {
  navToggle.addEventListener("click", () => {
    const isOpen = mainNav.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
    requestAnimationFrame(updateHeaderHeight);
  });

  mainNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      mainNav.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
      requestAnimationFrame(updateHeaderHeight);
    });
  });
}

document.querySelectorAll("[data-carousel]").forEach((carousel) => {
  const viewport = carousel.querySelector(".carousel-viewport");
  const track = carousel.querySelector(".carousel-track");
  const items = Array.from(track.children);
  const prev = carousel.querySelector(".prev");
  const next = carousel.querySelector(".next");
  let index = 0;

  const visibleCount = () => {
    if (window.matchMedia("(max-width: 760px)").matches) return 1;
    return Number(carousel.dataset.visible || 3);
  };

  const maxIndex = () => Math.max(0, items.length - visibleCount());

  const update = () => {
    const first = items[0];
    const gap = parseFloat(getComputedStyle(track).gap) || 0;
    const itemWidth = first.getBoundingClientRect().width;
    index = Math.min(index, maxIndex());
    track.style.transform = `translateX(${-index * (itemWidth + gap)}px)`;
    prev.disabled = false;
    next.disabled = false;
  };

  prev.addEventListener("click", () => {
    index = index === 0 ? maxIndex() : index - 1;
    update();
  });

  next.addEventListener("click", () => {
    index = index === maxIndex() ? 0 : index + 1;
    update();
  });

  window.addEventListener("resize", update);
  update();

  let startX = 0;
  viewport.addEventListener("pointerdown", (event) => {
    startX = event.clientX;
  });
  viewport.addEventListener("pointerup", (event) => {
    const delta = event.clientX - startX;
    if (Math.abs(delta) < 45) return;
    if (delta < 0) {
      index = index === maxIndex() ? 0 : index + 1;
    } else {
      index = index === 0 ? maxIndex() : index - 1;
    }
    update();
  });
});
