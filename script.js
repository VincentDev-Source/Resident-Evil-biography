document.addEventListener("DOMContentLoaded", () => {
  document.body.classList.add("page-ready");

  const groups = [
    { selector: ".archive-board > *", className: "reveal-pop" },
    { selector: ".content-panel", className: "reveal" },
    { selector: ".chapter-card", className: "reveal-pop" },
    { selector: ".card", className: "reveal-pop" },
    { selector: ".character-card", className: "reveal-pop" },
    { selector: ".character-badge", className: "reveal-left" },
    { selector: ".story-paper", className: "reveal-right" },
    { selector: ".relationship-item", className: "reveal" },
    { selector: ".file-chip", className: "reveal-pop" },
    { selector: ".case-item", className: "reveal-pop" },
    { selector: ".signal-item", className: "reveal" },
    { selector: ".stat-card", className: "reveal-pop" }
  ];

  const seen = new Set();

  for (const group of groups) {
    document.querySelectorAll(group.selector).forEach((element, index) => {
      if (seen.has(element)) {
        return;
      }

      seen.add(element);
      element.classList.add("reveal", group.className);
      element.style.transitionDelay = `${Math.min(index * 70, 360)}ms`;
    });
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.16,
      rootMargin: "0px 0px -8% 0px"
    }
  );

  document.querySelectorAll(".reveal").forEach((element) => {
    observer.observe(element);
  });
});
