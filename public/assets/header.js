/**
 * Injects the site header into the current page.
 *
 * @param {Array<{label: string, href: string, external?: boolean}>} navLinks
 * @param {Object} [options]
 * @param {boolean} [options.startDark] - Apply header-on-dark immediately (for always-dark pages)
 */
function initHeader(navLinks = [], { startDark = false } = {}) {
  const desktopNav = navLinks
    .map(({ label, href, external }) =>
      `<a href="${href}"${external ? ' target="_blank" rel="noopener noreferrer"' : ""}>${label}</a>`
    )
    .join("\n          ");

  const mobileNav = navLinks
    .map(({ label, href, external }) =>
      `<a href="${href}"${external ? ' target="_blank" rel="noopener noreferrer"' : ""}>${label}</a>`
    )
    .join("\n        ");

  const header = document.createElement("header");
  if (startDark) header.classList.add("header-on-dark");

  header.innerHTML = `
    <div class="header-container">
      <a class="logo-section" href="/about/">
        <img src="../assets/img/wsh-white-2.svg" alt="WSH" />
        <span>WSH</span>
      </a>
      <nav id="desktop-nav">
        ${desktopNav}
      </nav>
      <button class="mobile-menu-btn" id="mobile-menu-btn" aria-label="Toggle menu">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="3" y1="12" x2="21" y2="12"></line>
          <line x1="3" y1="6" x2="21" y2="6"></line>
          <line x1="3" y1="18" x2="21" y2="18"></line>
        </svg>
      </button>
    </div>
    <div class="mobile-menu" id="mobile-menu">
      ${mobileNav}
    </div>
  `;

  document.body.prepend(header);

  // Mobile menu toggle
  const btn = header.querySelector("#mobile-menu-btn");
  const menu = header.querySelector("#mobile-menu");
  btn.addEventListener("click", () => menu.classList.toggle("active"));
  menu.querySelectorAll("a").forEach((a) =>
    a.addEventListener("click", () => menu.classList.remove("active"))
  );
}
