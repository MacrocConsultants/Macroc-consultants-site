import Image from "next/image";

export default function Loading() {
  return (
    <main className="loading-screen">
      <div className="loading-screen__glow loading-screen__glow--primary" />
      <div className="loading-screen__glow loading-screen__glow--secondary" />

      <section className="loading-screen__stage" aria-label="Website loading animation">
        <div className="loading-screen__logo-reveal">
          <div className="loading-screen__logo-mask">
            <Image
              src="/macro-logo.png"
              alt="Macroc Consultants"
              width={120}
              height={120}
              className="loading-screen__logo"
              priority
            />
          </div>
        </div>

        <div className="loading-screen__rupee-track">
          <span className="loading-screen__rupee-symbol">₹</span>
        </div>

        <div className="loading-screen__graph-shell" aria-hidden="true">
          <svg viewBox="0 0 420 180" className="loading-screen__graph" preserveAspectRatio="none">
            <path
              d="M16 150 L95 148 L160 128 L220 120 L286 86 L344 54 L404 22"
              className="loading-screen__graph-line"
            />
          </svg>
        </div>

        <p className="loading-screen__loading-copy">Loading Macroc Consultants...</p>
      </section>
    </main>
  );
}
