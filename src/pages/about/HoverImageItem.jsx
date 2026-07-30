import { useRef } from "react";
import { usePhoneOverride } from "./PhoneOverrideContext";

/**
 * Faithful React port of the original `bindImageOverride(selector)` helper
 * from about/index.html's inline scripts. Wraps any element that should
 * swap the phone's screenshot on hover/touch.
 */
export default function HoverImageItem({ as: Tag = "div", image, className, children, ...rest }) {
  const { setOverrideImage } = usePhoneOverride();
  const touchMoved = useRef(false);

  return (
    <Tag
      className={className}
      onMouseEnter={() => setOverrideImage(image)}
      onMouseLeave={() => setOverrideImage(null)}
      onTouchStart={() => {
        touchMoved.current = false;
      }}
      onTouchMove={() => {
        touchMoved.current = true;
      }}
      onTouchEnd={() => {
        if (!touchMoved.current) setOverrideImage(image);
      }}
      {...rest}
    >
      {children}
    </Tag>
  );
}
