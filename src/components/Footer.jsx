export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <img src="/assets/img/wsh-white-2.svg" alt="WSH Logo" className="footer-logo" />
        <p className="footer-tagline">WSH - Where Stuff Happens</p>

        <div className="footer-links">
          <div>
            <p className="footer-label">Explore</p>
            <a href="/about/">About</a>
            <a href="/download/">Download</a>
            <a href="/docs/">Docs</a>
          </div>
          <div>
            <p className="footer-label">Legal</p>
            <a href="/docs/privpol.html">Privacy Policy</a>
            <a href="/docs/tos.html">Terms of Service</a>
            <a href="/docs/comm_gl.html">Community Guidelines</a>
          </div>
          <div>
            <p className="footer-label">Contact</p>
            <a href="mailto:contact@wshnetwork.com">contact@wshnetwork.com</a>
          </div>
        </div>

        <div className="footer-social">
          <p className="footer-label">Follow Us</p>
          <div className="social-icons">
            <a
              href="https://www.instagram.com/wshnetwork?igsh=MWttYnJhNmhmYmJs"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
              </svg>
            </a>
            <a
              href="https://www.linkedin.com/company/wshnetwork/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                <rect x="2" y="9" width="4" height="12" />
                <circle cx="4" cy="4" r="2" />
              </svg>
            </a>
          </div>
        </div>

        <p className="footer-copy">© 2026 WSH Network. All rights reserved.</p>
      </div>
    </footer>
  );
}
