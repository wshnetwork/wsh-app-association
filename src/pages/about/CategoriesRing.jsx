import { useEffect, useRef, useState } from "react";
import { CATEGORIES } from "../../data/categories";
import { usePhoneOverride } from "./PhoneOverrideContext";

// #%:3 — React port of public/about/categories.js. The ring's orbit radius
// still has to be measured from rendered DOM (grid width/height vs item
// width), so this keeps a ResizeObserver + imperative CSS custom property
// write instead of trying to compute it purely from layout/state — there's
// no CSS-only way to know the rendered item size in advance. See NOTES.md
// #%:3.
function isSemicircleViewport() {
  return window.matchMedia("(min-width: 1024px)").matches;
}

function angleForIndex(index, total, semicircle) {
  if (semicircle) return 180 + (index / (total - 1)) * 180;
  return (index / total) * 360 - 90;
}

export default function CategoriesRing() {
  const gridRef = useRef(null);
  const { setOverrideImage } = usePhoneOverride();
  const [semicircle, setSemicircle] = useState(() =>
    typeof window !== "undefined" ? isSemicircleViewport() : false
  );
  const [active, setActive] = useState(null); // { name, color, image } | null

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;

    const updateOrbit = () => {
      const sampleItem = grid.querySelector(".category-item");
      if (!sampleItem) return;

      const gridRect = grid.getBoundingClientRect();
      const itemRect = sampleItem.getBoundingClientRect();
      const ringPadding = Math.max(8, Math.min(16, gridRect.width * 0.02));
      const diameter = isSemicircleViewport()
        ? gridRect.width
        : Math.min(gridRect.width, gridRect.height);
      const radius = Math.max(110, diameter / 2 - itemRect.width / 2 - ringPadding);
      grid.style.setProperty("--orbit-radius", `${radius}px`);
    };

    updateOrbit();

    const handleResize = () => {
      setSemicircle(isSemicircleViewport());
      updateOrbit();
    };
    window.addEventListener("resize", handleResize);

    let resizeObserver;
    if ("ResizeObserver" in window) {
      resizeObserver = new ResizeObserver(updateOrbit);
      resizeObserver.observe(grid);
    }

    return () => {
      window.removeEventListener("resize", handleResize);
      if (resizeObserver) resizeObserver.disconnect();
    };
  }, [semicircle]);

  // Click outside to deactivate (for touch devices), matching the original.
  useEffect(() => {
    if (!active) return undefined;
    const handleDocClick = (e) => {
      const grid = gridRef.current;
      if (grid && !grid.contains(e.target)) {
        deactivate();
      }
    };
    document.addEventListener("click", handleDocClick);
    return () => document.removeEventListener("click", handleDocClick);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  const activate = (category) => {
    setActive(category);
    setOverrideImage(category.image || null);
  };

  const deactivate = () => {
    setActive(null);
    setOverrideImage(null);
  };

  const touchMovedRef = useRef(false);

  return (
    <div
      id="categories-grid"
      className={`categories-grid${semicircle ? " semicircle" : ""}`}
      ref={gridRef}
    >
      <div className={`categories-center${active ? " active" : ""}`} style={active ? { background: active.color } : undefined}>
        <strong style={active ? { color: "#fff" } : undefined}>{active ? active.name : "Categories"}</strong>
        <span style={active ? { color: "rgba(255,255,255,.85)" } : undefined}>{active ? "Category" : "Browse by topic"}</span>
      </div>
      {CATEGORIES.map((category, index) => {
        const isActive = active?.name === category.name;
        return (
          <div
            key={category.name}
            className={`category-item${isActive ? " touch-active" : ""}`}
            style={{
              "--angle": `${angleForIndex(index, CATEGORIES.length, semicircle)}deg`,
              "--icon-color": category.color,
              "--icon-mask": `url('${category.icon}')`,
            }}
            data-name={category.name}
            data-index={index}
            tabIndex={0}
            onMouseEnter={() => activate(category)}
            onMouseLeave={() => deactivate()}
            onFocus={() => activate(category)}
            onBlur={() => deactivate()}
            onTouchStart={() => {
              touchMovedRef.current = false;
            }}
            onTouchMove={() => {
              touchMovedRef.current = true;
            }}
            onTouchEnd={(e) => {
              e.preventDefault();
              if (touchMovedRef.current) return;
              if (isActive) deactivate();
              else activate(category);
            }}
          >
            <div className="icon"></div>
          </div>
        );
      })}
    </div>
  );
}
