import { useEffect } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

import "../../styles/main.css";
import "../../styles/docs.css";

const NAV_LINKS = [
  { label: "About", href: "/about/" },
  { label: "Download", href: "/download/" },
];

export default function DocsIndex() {
  // Original page rendered <body class="has-header"> to offset content
  // below the fixed header.
  useEffect(() => {
    document.body.classList.add("has-header");
    return () => document.body.classList.remove("has-header");
  }, []);

  return (
    <>
      <Header navLinks={NAV_LINKS} startDark />

      <section id="docs" className="section section-black">
        <div className="container">
          <div className="logo">
            <img
              src="/assets/img/wsh-white.png"
              alt="WSH Logo"
              style={{ width: "120px", marginBottom: "20px" }}
            />
          </div>
          <div className="doc-intro">
            <h1>Documentation</h1>
            <p>Important information about using WSH</p>
          </div>
          <div className="doc-grid">
            <a href="/docs/comm_gl.html" className="doc-card">
              <h2>Community Guidelines</h2>
              <p>
                Learn about our community standards, what&apos;s allowed, and
                how we keep WSH safe for everyone.
              </p>
            </a>
            <a href="/docs/privpol.html" className="doc-card">
              <h2>Privacy Policy</h2>
              <p>
                Understand how we collect, use, and protect your personal
                data in compliance with GDPR.
              </p>
            </a>
            <a href="/docs/tos.html" className="doc-card">
              <h2>Terms of Service</h2>
              <p>
                Read the legal terms and conditions for using the WSH
                Network platform.
              </p>
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
