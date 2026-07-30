import { forwardRef, useState } from "react";

/**
 * Site header. Faithful React port of assets/header.js's initHeader().
 *
 * @param {{label: string, href: string, external?: boolean}[]} navLinks
 * @param {boolean} [startDark] - Apply header-on-dark immediately (for always-dark pages)
 * @param {boolean} [dark] - Controlled override (e.g. About page's scroll-driven theme).
 *   When provided, takes precedence over startDark every render.
 */
const Header = forwardRef(function Header({ navLinks = [], startDark = false, dark }, ref) {
  const [menuOpen, setMenuOpen] = useState(false);

  const isDark = dark !== undefined ? dark : startDark;

  return (
    <header ref={ref} className={isDark ? "header-on-dark" : undefined}>
      <div className="header-container">
        <a className="logo-section" href="/about/">
          <img src="/assets/img/wsh-white-2.svg" alt="WSH" />
          <span>WSH</span>
        </a>
        <nav id="desktop-nav">
          {navLinks.map(({ label, href, external }) => (
            <a
              key={href}
              href={href}
              target={external ? "_blank" : undefined}
              rel={external ? "noopener noreferrer" : undefined}
            >
              {label}
            </a>
          ))}
        </nav>
        <button
          className="mobile-menu-btn"
          aria-label="Toggle menu"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>
      </div>
      <div className={`mobile-menu${menuOpen ? " active" : ""}`}>
        {navLinks.map(({ label, href, external }) => (
          <a
            key={href}
            href={href}
            target={external ? "_blank" : undefined}
            rel={external ? "noopener noreferrer" : undefined}
            onClick={() => setMenuOpen(false)}
          >
            {label}
          </a>
        ))}
      </div>
    </header>
  );
});

export default Header;
