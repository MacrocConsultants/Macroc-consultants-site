"use client";

import { useEffect, useState } from "react";

const LOADER_DURATION_MS = 2600;

export default function Loading() {
  const [progress, setProgress] = useState(1);

  useEffect(() => {
    const startTime = Date.now();

    const interval = window.setInterval(() => {
      const elapsed = Date.now() - startTime;
      const ratio = Math.min(elapsed / LOADER_DURATION_MS, 1);
      const easedRatio = 1 - Math.pow(1 - ratio, 2.6);
      const nextProgress = Math.min(100, Math.max(1, Math.round(easedRatio * 100)));

      setProgress(nextProgress);

      if (nextProgress >= 100) {
        window.clearInterval(interval);
      }
    }, 24);

    return () => window.clearInterval(interval);
  }, []);

  return (
    <div className="macroc-loader-shell" role="status" aria-live="polite" aria-label="Loading Macroc Financial Consultants">
      <div className="macroc-loader-grid" />
      <div className="macroc-loader-panel">
        <div className="macroc-loader-kicker">Preparing your dashboard experience</div>
        <h1 className="macroc-loader-title">Macroc Financial Consultants</h1>
        <p className="macroc-loader-copy">Loading trusted advisory, compliance, and financial insights.</p>

        <div className="macroc-loader-meter" aria-hidden="true">
          <div className="macroc-loader-fill" style={{ width: `${progress}%` }} />
          <div className="macroc-loader-sheen" />
        </div>

        <div className="macroc-loader-meta">
          <span>Loading</span>
          <span>{progress}%</span>
        </div>
      </div>
    </div>
  );
}
