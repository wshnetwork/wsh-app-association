/**
 * Shared wrapper for the legal document pages (Community Guidelines,
 * Privacy Policy, Terms of Service). These pages use a lightweight
 * standalone header (not the shared site Header component) and a
 * simple black "card" container, exactly as in the original static
 * comm_gl.html / privpol.html / tos.html markup.
 */
export default function DocsLayout({ title, subtitle, children }) {
  return (
    <div className="docs-legal-page">
      <header className="site-header">
        <a className="header-brand" href="/">
          <img src="/assets/img/wsh-white.png" alt="WSH Logo" />
          <span>WSH Network</span>
        </a>
        <nav className="header-actions">
          <a className="header-button" href="/download/">
            Download
          </a>
          <a className="header-button primary" href="/docs/">
            Docs
          </a>
        </nav>
      </header>
      <div className="container">
        <a href="/docs/" className="back-link">
          ← Back to Documentation
        </a>

        <div className="logo">
          <img
            src="/assets/img/wsh-white.png"
            alt="WSH Logo"
            style={{ width: "100px", marginBottom: "20px" }}
          />
        </div>

        <h1>{title}</h1>
        {subtitle && <p className="subtitle">{subtitle}</p>}

        {children}
      </div>
    </div>
  );
}
