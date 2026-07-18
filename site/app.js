document.documentElement.classList.add("motion-ready");

const revealItems = document.querySelectorAll(".reveal");
const navLinks = [...document.querySelectorAll(".site-nav a")];
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

if (reducedMotion.matches) {
  revealItems.forEach((item) => item.classList.add("is-visible"));
  document.querySelector(".hero-video")?.pause();
} else {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { rootMargin: "0px 0px -8%", threshold: 0.08 },
  );

  revealItems.forEach((item) => revealObserver.observe(item));
}

const trackedSections = navLinks
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

const navObserver = new IntersectionObserver(
  (entries) => {
    const active = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

    if (!active) return;

    navLinks.forEach((link) => {
      const isCurrent = link.getAttribute("href") === `#${active.target.id}`;
      if (isCurrent) link.setAttribute("aria-current", "true");
      else link.removeAttribute("aria-current");
    });
  },
  { rootMargin: "-20% 0px -60%", threshold: [0.05, 0.25, 0.5] },
);

trackedSections.forEach((section) => navObserver.observe(section));
