import Image from "next/image";
import { ArrowUpRight, BadgeCheck, BarChart3, BriefcaseBusiness, FileCheck2 } from "lucide-react";

const loadingHighlights = [
  "Growth strategy dashboards coming online",
  "Compliance guidance for GST, tax, and ROC",
  "Sharper business ideas for the next decision",
];

const loadingMetrics = [
  { value: "GST", label: "Returns and reconciliations in progress", Icon: FileCheck2 },
  { value: "CFO", label: "Planning sharper cash-flow decisions", Icon: BarChart3 },
  { value: "ROC", label: "Keeping business compliance on track", Icon: BadgeCheck },
];

const growthPoints = [
  { label: "Startup Setup", value: "84%" },
  { label: "Tax Planning", value: "71%" },
  { label: "Compliance", value: "93%" },
  { label: "Business Growth", value: "88%" },
];

export default function Loading() {
  return (
    <main className="loading-screen">
      <div className="loading-screen__glow loading-screen__glow--primary" />
      <div className="loading-screen__glow loading-screen__glow--secondary" />

      <section className="loading-screen__panel">
        <div className="loading-screen__brand">
          <div className="loading-screen__logo-shell">
            <Image
              src="/macro-logo.png"
              alt="Macroc Consultants"
              width={56}
              height={56}
              className="loading-screen__logo"
              priority
            />
          </div>

          <div>
            <p className="loading-screen__eyebrow">Macroc Consultants</p>
            <h1 className="loading-screen__title">Preparing your business advisory experience</h1>
            <p className="loading-screen__description">
              Please wait while we load growth insights, graphics, and compliance-focused services.
            </p>

            <div className="loading-screen__mini-tags" aria-hidden="true">
              <span className="loading-screen__mini-tag">
                <BriefcaseBusiness size={16} />
                Advisory
              </span>
              <span className="loading-screen__mini-tag">
                <ArrowUpRight size={16} />
                Growth
              </span>
              <span className="loading-screen__mini-tag">
                <BadgeCheck size={16} />
                Compliance
              </span>
            </div>
          </div>
        </div>

        <div className="loading-screen__content">
          <div>
            <div className="loading-screen__progress" aria-label="Page is loading">
              <div className="loading-screen__progress-bar" />
            </div>

            <div className="loading-screen__highlights" aria-hidden="true">
              {loadingHighlights.map((item) => (
                <div key={item} className="loading-screen__highlight">
                  {item}
                </div>
              ))}
            </div>
          </div>

          <aside className="loading-screen__graphic" aria-hidden="true">
            <div className="loading-screen__graphic-header">
              <span className="loading-screen__graphic-dot" />
              <span className="loading-screen__graphic-dot" />
              <span className="loading-screen__graphic-dot" />
            </div>

            <div className="loading-screen__chart">
              <div className="loading-screen__chart-grid" />
              <div className="loading-screen__chart-line">
                {growthPoints.map((point, index) => (
                  <div
                    key={point.label}
                    className="loading-screen__chart-node"
                    style={{
                      left: `${12 + index * 24}%`,
                      bottom: `${28 + index * 12}%`,
                    }}
                  >
                    <span className="loading-screen__chart-value">{point.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="loading-screen__graphic-captions">
              {growthPoints.map((point) => (
                <div key={point.label} className="loading-screen__graphic-caption">
                  <span>{point.label}</span>
                  <strong>{point.value}</strong>
                </div>
              ))}
            </div>
          </aside>
        </div>

        <div className="loading-screen__metrics">
          {loadingMetrics.map((item) => (
            <article key={item.value} className="loading-screen__metric-card">
              <item.Icon className="loading-screen__metric-icon" size={18} />
              <span className="loading-screen__metric-value">{item.value}</span>
              <p className="loading-screen__metric-label">{item.label}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
