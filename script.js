const root = document.documentElement;
const menu = document.getElementById("menu");
const burger = document.getElementById("burger");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Mobile navigation
function setMenuOpen(isOpen) {
  menu.classList.toggle("open", isOpen);
  burger.setAttribute("aria-expanded", String(isOpen));
}

burger.addEventListener("click", () => setMenuOpen(!menu.classList.contains("open")));
menu.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => setMenuOpen(false));
});


const themeToggle = document.getElementById("themeToggle");
themeToggle.setAttribute("aria-pressed", String(root.dataset.theme === "light"));

themeToggle.addEventListener("click", () => {
  const nextTheme = root.dataset.theme === "light" ? "dark" : "light";
  root.dataset.theme = nextTheme;
  themeToggle.setAttribute("aria-pressed", String(nextTheme === "light"));
});


// Reveal sections as they enter the viewport.
if (!prefersReducedMotion && "IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("in");
        revealObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.12 }
  );

  document.querySelectorAll(".reveal").forEach((element, index) => {
    element.style.transitionDelay = (index % 6) * 60 + "ms";
    revealObserver.observe(element);
  });
} else if (!prefersReducedMotion) {
  document.querySelectorAll(".reveal").forEach((element) => element.classList.add("in"));
}


// Animate statistic values unless reduced motion is enabled.
function countUp(element) {
  const target = Number(element.dataset.count);
  const decimals = Number(element.dataset.dec || 0);
  const suffix = element.dataset.suffix || "";
  const duration = 1400; // milliseconds
  const startTime = performance.now();

  function step(now) {
    const progress = Math.min((now - startTime) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3); // starts fast, slows down at the end
    element.textContent = (target * eased).toFixed(decimals) + suffix;
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}


if (!prefersReducedMotion && "IntersectionObserver" in window) {
  const countObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        countUp(entry.target);
        countObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.6 }
  );
  document.querySelectorAll("[data-count]").forEach((element) => countObserver.observe(element));
}


// Highlight the navigation link for the current section.
const navLinks = menu.querySelectorAll("a");

if ("IntersectionObserver" in window) {
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navLinks.forEach((link) => {
          const isCurrentSection = link.getAttribute("href") === "#" + entry.target.id;
          link.classList.toggle("active", isCurrentSection);
          if (isCurrentSection) {
            link.setAttribute("aria-current", "location");
          } else {
            link.removeAttribute("aria-current");
          }
        });
      });
    },
    { rootMargin: "-40% 0px -55% 0px" }
  );

  navLinks.forEach((link) => {
    const target = document.querySelector(link.getAttribute("href"));
    if (target) sectionObserver.observe(target);
  });
}


document.getElementById("year").textContent = new Date().getFullYear();
