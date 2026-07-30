import { createContext, useContext, useRef, useCallback } from "react";

// #%:1 — Replaces the original `window.setPhoneImageOverride` global from
// phone.js/categories.js/about/index.html's inline scripts. Hoverable items
// (solution cards, identity items, mod cards, value cards, category ring
// items) call `setOverrideImage(url | null)` from this context instead of
// reaching for a global function. PhoneStage's render loop polls
// `overrideRef.current` every animation frame (see NOTES.md #%:1), so no
// React state/re-render is involved on the hot path.
const PhoneOverrideContext = createContext(null);

export function PhoneOverrideProvider({ children }) {
  const overrideRef = useRef(null);
  // Written every animation frame by PhoneStage — mirrors the original
  // `_poseSettled` flag in phone.js, which suppressed hover-triggered image
  // overrides while the phone was still animating toward its scroll target.
  const poseSettledRef = useRef(false);

  const setOverrideImage = useCallback((url) => {
    if (!poseSettledRef.current && url) return;
    if (url === overrideRef.current) return;
    overrideRef.current = url;
  }, []);

  const value = { overrideRef, poseSettledRef, setOverrideImage };

  return (
    <PhoneOverrideContext.Provider value={value}>
      {children}
    </PhoneOverrideContext.Provider>
  );
}

export function usePhoneOverride() {
  const ctx = useContext(PhoneOverrideContext);
  if (!ctx) {
    throw new Error("usePhoneOverride must be used within a PhoneOverrideProvider");
  }
  return ctx;
}
