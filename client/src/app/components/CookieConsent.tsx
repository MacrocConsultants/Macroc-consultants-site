"use client";

import { useEffect, useState } from "react";

const COOKIE_CONSENT_KEY = "macroc_cookie_consent";

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = window.localStorage.getItem(COOKIE_CONSENT_KEY);
    setIsVisible(!consent);
  }, []);

  const saveChoice = (value: "accepted" | "declined") => {
    window.localStorage.setItem(COOKIE_CONSENT_KEY, value);
    setIsVisible(false);
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className="cookie-consent" role="dialog" aria-live="polite" aria-label="Cookie consent">
      <p className="cookie-consent__text">Accept cookies for a smoother website experience?</p>
      <div className="cookie-consent__actions">
        <button type="button" onClick={() => saveChoice("declined")} className="cookie-consent__button cookie-consent__button--secondary">
          Decline
        </button>
        <button type="button" onClick={() => saveChoice("accepted")} className="cookie-consent__button">
          Accept
        </button>
      </div>
    </div>
  );
}
