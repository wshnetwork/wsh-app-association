import { useEffect, useState } from "react";

// React port of the inline "header theme follows scroll" script at the
// bottom of the original about/index.html. Sections alternate light/dark
// starting from the hero (index 0 = light), and the header (plus the
// theme-color / status-bar meta tags) match whichever section currently
// sits at the header's bottom edge.
export default function useHeaderTheme(headerRef) {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const sections = Array.from(document.querySelectorAll("section"));
    sections.forEach((section, index) => {
      section.dataset.headerTheme = index % 2 === 0 ? "light" : "dark";
    });

    const themeColorMeta = document.querySelector('meta[name="theme-color"]');
    const statusBarMeta = document.querySelector(
      'meta[name="apple-mobile-web-app-status-bar-style"]'
    );

    const applyHeaderTheme = (theme) => {
      const isDark = theme === "dark";
      setDark(isDark);
      document.body.classList.toggle("body-on-dark", isDark);
      if (themeColorMeta) themeColorMeta.content = isDark ? "#0a0a0a" : "#ffffff";
      if (statusBarMeta) statusBarMeta.content = isDark ? "black" : "default";
    };

    const syncHeaderThemeToViewport = () => {
      const header = headerRef.current;
      if (!header) return;
      const probeY = header.offsetHeight + 1;
      const activeSection = sections.find((section) => {
        const rect = section.getBoundingClientRect();
        return rect.top <= probeY && rect.bottom > probeY;
      });
      if (activeSection) applyHeaderTheme(activeSection.dataset.headerTheme);
    };

    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(() => {
        syncHeaderThemeToViewport();
        ticking = false;
      });
    };

    syncHeaderThemeToViewport();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", syncHeaderThemeToViewport);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", syncHeaderThemeToViewport);
      document.body.classList.remove("body-on-dark");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return dark;
}
