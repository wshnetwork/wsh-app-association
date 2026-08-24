import { useRef, useState } from "react";
import { usePhoneOverride } from "./PhoneOverrideContext";

const DEFAULT_IMAGE = "/assets/img/screenshots/id-select.PNG";

export const IDENTITY_ITEMS = [
  {
    image: "/assets/img/screenshots/id-handle.PNG",
    borderClass: "border-red",
    title: "Handle",
    description: "Your unique username. Build your reputation over time.",
  },
  {
    image: "/assets/img/screenshots/id-alias.PNG",
    borderClass: "border-purple",
    title: "Alias",
    description: "A reusable temporary name for contextual posting.",
  },
  {
    image: "/assets/img/screenshots/id-anon.PNG",
    borderClass: "border-gray",
    title: "Anonymous",
    description:
      "Post without your name. Pure freedom of expression, taking away social pressure.",
  },
];

/**
 * Identity section markup, split out of About.jsx so the header, screenshot,
 * and item list can each carry their own grid-area — mobile reorders them
 * (header -> screenshot -> items) and taps swap the screenshot the same way
 * hovering does on desktop, via a locally-tracked active item.
 */
export default function IdentitySection() {
  const { setOverrideImage } = usePhoneOverride();
  const [activeIndex, setActiveIndex] = useState(null);
  const touchMovedRef = useRef(false);

  const activeImage =
    activeIndex !== null ? IDENTITY_ITEMS[activeIndex].image : DEFAULT_IMAGE;

  const activate = (index) => {
    setActiveIndex(index);
    setOverrideImage(IDENTITY_ITEMS[index].image);
  };

  const deactivate = () => {
    setActiveIndex(null);
    setOverrideImage(null);
  };

  return (
    <div className="identity-layout">
      <h2 className="identity-header">You Choose How You Show Up</h2>

      <div className="identity-image-wrap">
        <img
          src={activeImage}
          alt="WSH Identity Options"
          className="identity-phone"
        />
      </div>

      <div className="identity-options">
        {IDENTITY_ITEMS.map((item, index) => {
          const isActive = activeIndex === index;
          return (
            <div
              key={item.image}
              className={`identity-item action-item ${item.borderClass}${
                isActive ? " touch-active" : ""
              }`}
              onMouseEnter={() => activate(index)}
              onMouseLeave={() => deactivate()}
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
                else activate(index);
              }}
            >
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
