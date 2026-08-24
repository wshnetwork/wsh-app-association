import Header from "../components/Header";

import "../styles/main.css";
import "../styles/error.css";

const NAV_LINKS = [
  { label: "About", href: "/about/" },
  { label: "Download", href: "/download/" },
  { label: "Docs", href: "/docs/" },
];

export default function NotFound() {
  return (
    <>
      <Header navLinks={NAV_LINKS} startDark />
      <div className="error-page">
        <div className="container">
          <p className="error-code">404</p>
          <h1>Page not found</h1>
          <p>
            The page you're looking for doesn't exist or may have been moved.
          </p>
          <div className="error-actions">
            <a className="button" href="/about/">
              Go Home
            </a>
            <a className="button-outline" href="/download/">
              Download WSH
            </a>
            <button className="button-outline" onClick={() => window.history.back()}>
              Go Back
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
