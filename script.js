(function () {
  const app = document.getElementById("app");
  const btnToggle = document.getElementById("btnToggle");
  const btnTheme = document.getElementById("btnTheme");
  const backdrop = document.getElementById("backdrop");
  const body = document.body;

  const mqMobile = window.matchMedia("(max-width: 800px)");

  function isMobile() {
    return mqMobile.matches;
  }

  function setExpanded(expanded) {
    if (isMobile()) {
      app.classList.toggle("overlay-open", expanded);
      backdrop.hidden = !expanded;
      btnToggle.setAttribute("aria-expanded", String(expanded));
      btnToggle.setAttribute(
        "aria-label",
        expanded ? "Close sidebar" : "Open sidebar"
      );
      if (expanded) trapFocusStart();
      else releaseFocus();
    } else {
      app.classList.toggle("expanded", expanded);
      btnToggle.setAttribute("aria-expanded", String(expanded));
      btnToggle.setAttribute(
        "aria-label",
        expanded ? "Collapse sidebar" : "Expand sidebar"
      );
    }
  }

  // Initial state: collapsed on desktop, closed on mobile
  setExpanded(false);

  // Toggle behavior
  btnToggle.addEventListener("click", () => {
    const expanded = isMobile()
      ? !app.classList.contains("overlay-open")
      : !app.classList.contains("expanded");
    setExpanded(expanded);
  });

  // Backdrop closes overlay
  backdrop.addEventListener("click", () => setExpanded(false));
  document.addEventListener("keydown", (e) => {
    if (
      e.key === "Escape" &&
      (app.classList.contains("overlay-open") ||
        app.classList.contains("expanded"))
    ) {
      setExpanded(false);
    }
  });

  // Responsive: closing overlay on breakpoint change
  mqMobile.addEventListener("change", () => {
    if (!isMobile()) {
      app.classList.remove("overlay-open");
      backdrop.hidden = true;
      releaseFocus();
    }
    // Keep desktop collapsed by default
    app.classList.remove("expanded");
    btnToggle.setAttribute("aria-expanded", "false");
  });

  // Theme toggle with persistence
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "light" || savedTheme === "dark") {
    body.setAttribute("data-theme", savedTheme);
  }
  btnTheme.addEventListener("click", () => {
    const current =
      body.getAttribute("data-theme") === "light" ? "dark" : "light";
    body.setAttribute("data-theme", current);
    localStorage.setItem("theme", current);
  });

  // Focus trap for mobile overlay
  let previousActive = null;
  function trapFocusStart() {
    previousActive = document.activeElement;
    const focusables = getFocusables();
    if (focusables.length) focusables[0].focus();
    document.addEventListener("keydown", trapper);
  }
  function releaseFocus() {
    document.removeEventListener("keydown", trapper);
    if (previousActive && previousActive.focus) previousActive.focus();
  }
  function getFocusables() {
    const sidebar = document.querySelector(".sidebar");
    return Array.from(
      sidebar.querySelectorAll(
        'button, a, input, [tabindex]:not([tabindex="-1"])'
      )
    ).filter(
      (el) => !el.hasAttribute("disabled") && !el.getAttribute("aria-hidden")
    );
  }
  function trapper(e) {
    if (e.key !== "Tab") return;
    const focusables = getFocusables();
    if (!focusables.length) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }
})();

const tabIcons = document.querySelectorAll(".tab-icon");
const contentSections = document.querySelectorAll(".content-section");
const collapseToggleIcon = document.querySelector(".collapse-toggle .caret");

function switchTab(tabId) {
  tabIcons.forEach((icon) => icon.classList.remove("active"));
  contentSections.forEach((section) => section.classList.remove("active"));

  const activeIcon = document.querySelector(
    `.tab-icon[data-tab-id="${tabId}"]`
  );
  const activeContent = document.querySelector(
    `.content-section[data-content-id="${tabId}"]`
  );

  if (activeIcon && activeContent) {
    activeIcon.classList.add("active");
    activeContent.classList.add("active");

    contentTitle.textContent = tabId.charAt(0).toUpperCase() + tabId.slice(1);
  }
}

// Attach event listeners to all tab icons
tabIcons.forEach((icon) => {
  icon.addEventListener("click", () => {
    const tabId = icon.getAttribute("data-tab-id");
    switchTab(tabId);

    if (sidebarContainer.classList.contains("collapsed")) {
      toggleSidebarCollapse();
    }
  });
});
function toggleCollapsible(titleElement) {
  const group = titleElement.parentElement;
  const content = group.querySelector(".collapsible-content");
  const caret = titleElement.querySelector(".caret");

  if (content.classList.contains("open")) {
    // Close the content
    content.classList.remove("open");
    caret.classList.remove("rotated");
  } else {
    // Open the content
    content.classList.add("open");
    caret.classList.add("rotated");
  }
}
