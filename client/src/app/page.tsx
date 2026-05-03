import type { Metadata } from "next";
import Link from "next/link";
import PublicCallButton from "./components/PublicCallButton";
import PublicContactForm from "./components/PublicContactForm";
import PublicWhatsAppButton from "./components/PublicWhatsAppButton";
import ThemeToggle from "./components/ThemeToggle";
import { getHomepageContent } from "./utils/getHomepageContent";
import { slugifyServiceTitle } from "./utils/homepageContent";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

function renderHeroTitle(title: string, highlight: string) {
  if (!highlight || !title.toLowerCase().includes(highlight.toLowerCase())) {
    return title;
  }

  const index = title.toLowerCase().indexOf(highlight.toLowerCase());
  const before = title.slice(0, index);
  const match = title.slice(index, index + highlight.length);
  const after = title.slice(index + highlight.length);

  return (
    <>
      {before}
      <span className="text-theme-primary">{match}</span>
      {after}
    </>
  );
}

function buildContactServiceOptions(serviceOptions: string[], serviceTitles: string[]) {
  const options: string[] = [];
  const seen = new Set<string>();

  [...serviceOptions, ...serviceTitles].forEach((option) => {
    const normalized = option.trim().toLowerCase();
    if (!normalized || seen.has(normalized)) {
      return;
    }

    seen.add(normalized);
    options.push(option);
  });

  return options;
}

export async function generateMetadata(): Promise<Metadata> {
  const content = await getHomepageContent();

  return {
    title: content.seo.title,
    description: content.seo.description,
    keywords: content.seo.keywords,
    openGraph: {
      title: content.seo.ogTitle,
      description: content.seo.ogDescription,
      images: content.seo.ogImage ? [content.seo.ogImage] : [],
      type: "website",
    },
  };
}

type HomePageProps = {
  searchParams?: {
    service?: string;
  };
};

export default async function Home({ searchParams }: HomePageProps) {
  const content = await getHomepageContent();
  const selectedFontStyle = content.typography?.fontStyle || "professional";
  const currentYear = new Date().getFullYear();
  const contactServiceOptions = buildContactServiceOptions(
    content.contact.serviceOptions,
    content.services.items.map((item) => item.title)
  );
  const requestedService = searchParams?.service?.trim() || "";
  const selectedContactService = contactServiceOptions.includes(requestedService)
    ? requestedService
    : contactServiceOptions[0] || "";

  const heroSpacingClass =
    content.hero.contentSpacing === "tight" ? "gap-2" :
    content.hero.contentSpacing === "relaxed" ? "gap-8" :
    "gap-4";

  const heroMarginClass =
    content.hero.contentSpacing === "tight" ? "mt-2" :
    content.hero.contentSpacing === "relaxed" ? "mt-8" :
    "mt-4";

  return (
    <div className={`public-site public-font-${selectedFontStyle} min-h-screen w-full bg-theme-bg text-theme-fg transition-colors duration-200`}>
      <div className="page-enter">
      <header className="relative z-20 flex w-full items-center justify-between px-4 py-8 md:px-8 bg-theme-bg text-theme-fg">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-xl bg-black shadow-lg shadow-black/40">
            {content.header.logoImage ? (
              <img
                src={content.header.logoImage}
                alt="MACROC Financial Consultants"
                className="h-full w-full object-contain"
              />
            ) : (
              <span className="text-xl font-bold text-white">{content.header.logoText}</span>
            )}
          </div>
          <div>
            <h1 className="text-xl font-semibold text-theme-fg">{content.header.companyName}</h1>
            <p className="text-sm font-medium text-theme-primary">
              {content.header.tagline}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 md:hidden">
          <ThemeToggle />
          <details className="group relative">
            <summary className="flex h-11 w-11 cursor-pointer list-none items-center justify-center rounded-lg border border-theme-border bg-theme-card text-2xl text-theme-fg transition hover:border-theme-primary">
              <span aria-hidden>⋮</span>
              <span className="sr-only">Open menu</span>
            </summary>

            <div className="absolute right-0 top-14 z-30 w-52 origin-top rounded-xl border border-theme-border bg-theme-card p-3 shadow-xl transition duration-200 ease-out [transform:scaleY(0.96)] [opacity:0] group-open:[transform:scaleY(1)] group-open:[opacity:1]">
              <nav className="flex flex-col gap-1 text-sm text-theme-fg">
                {content.header.navLinks.map((link, index) => (
                  <a
                    key={`mobile-${link.label}-${index}`}
                    href={link.href}
                    className="rounded-lg px-3 py-2 transition hover:bg-theme-bg"
                  >
                    {link.label}
                  </a>
                ))}
                <Link
                  href="/login"
                  className="mt-2 rounded-lg border border-theme-primary px-3 py-2 text-center font-medium text-theme-primary transition hover:bg-theme-primary/10"
                >
                  {content.header.loginButtonText}
                </Link>
              </nav>
            </div>
          </details>
        </div>

        <div className="hidden items-center gap-6 md:flex">
          <nav className="flex gap-8 text-sm text-theme-fg">
            {content.header.navLinks.map((link, index) => (
              <a key={`${link.label}-${index}`} href={link.href} className="transition hover:text-theme-primary">
                {link.label}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Link
              href="/login"
              className="rounded-lg border border-theme-border px-5 py-2 text-sm font-medium text-theme-fg transition hover:border-theme-primary hover:bg-theme-primary/10"
            >
              {content.header.loginButtonText}
            </Link>
          </div>
        </div>
      </header>

      <main>
        <section
          className={`relative flex flex-col items-center bg-cover bg-center px-6 py-24 md:flex-row`}
          style={{
            backgroundImage: `url('${content.hero.backgroundImage}')`,
            backgroundBlendMode: "multiply",
          }}
        >
          {/* Use a dark overlay always for the hero so text remains readable, or adapt it. Keeping it dark for consistency with background image. */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] dark:bg-black/80" />

          <div className={`relative z-10 flex w-full flex-col items-center text-center ${heroSpacingClass} px-4 md:px-8`}>
            <p className="text-sm font-semibold uppercase tracking-wide text-theme-primary">{content.hero.eyebrow}</p>
            <h2 className={`${content.hero.contentSpacing === "tight" ? "mt-0" : heroMarginClass} text-4xl font-extrabold leading-tight text-white md:text-5xl max-w-4xl`}>
              {renderHeroTitle(content.hero.title, content.hero.highlight)}
            </h2>
            <p className={`${content.hero.contentSpacing === "tight" ? "mt-0" : heroMarginClass} max-w-2xl text-lg text-gray-200`}>{content.hero.description}</p>

            <div className={`${heroMarginClass} flex gap-4 justify-center`}>
              <a
                href={content.hero.primaryButtonHref}
                className="pro-interactive rounded-lg bg-theme-primary px-6 py-3 text-white shadow-md transition hover:scale-105 hover:shadow-xl"
              >
                {content.hero.primaryButtonText}
              </a>
              <a
                href={content.hero.secondaryButtonHref}
                className="pro-interactive rounded-lg border border-gray-400 px-6 py-3 text-white transition hover:border-theme-primary hover:bg-white/10"
              >
                {content.hero.secondaryButtonText}
              </a>
            </div>

            <div className={`${content.hero.contentSpacing === "tight" ? "mt-0" : heroMarginClass} flex flex-col gap-3 sm:flex-row sm:items-center justify-center`}>
              <Link
                href="/login"
                className="pro-interactive rounded-lg border border-theme-primary bg-white/10 px-6 py-3 text-center text-sm font-semibold text-white transition hover:bg-white/20"
              >
                Are you an existing client? Please login
              </Link>
              <Link
                href="/register"
                className="pro-interactive rounded-lg border border-gray-400 px-6 py-3 text-center text-sm font-semibold text-white transition hover:border-theme-primary hover:bg-white/10"
              >
                New client ? Register
              </Link>
            </div>

            <div className={`${heroMarginClass} text-sm text-gray-300`}>
              <div className="font-medium text-white">{content.hero.trustLabel}</div>
              <div className="mt-1 text-gray-200">{content.hero.trustItems.join(" · ")}</div>
            </div>
          </div>
        </section>

        <section id="services" className="w-full px-4 py-16 md:px-8 bg-theme-bg">
          <h3 className="text-3xl font-semibold text-theme-primary">{content.services.title}</h3>
          <p className="mt-3 text-theme-fg opacity-80">{content.services.subtitle}</p>

          <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-3">
            {content.services.items.map((item, index) => (
              <Link
                key={`${item.title}-${index}`}
                href={`/services/${slugifyServiceTitle(item.title)}`}
                className="pro-interactive block rounded-xl border border-theme-border bg-theme-card p-6 shadow-sm transition hover:border-theme-primary hover:shadow-theme-primary/10"
              >
                <h4 className="font-semibold text-theme-primary">{item.title}</h4>
              </Link>
            ))}
          </div>
        </section>

        <section id="about" className="w-full border-t border-theme-border px-4 py-16 md:px-8 bg-theme-card">
          <div className="grid items-center gap-10 md:grid-cols-2">
            <div>
              <h3 className="text-3xl font-semibold text-theme-primary">{content.about.title}</h3>
              <p className="mt-4 leading-relaxed text-theme-fg opacity-90">{content.about.description}</p>
              <ul className="mt-6 space-y-2 text-theme-fg opacity-90">
                {content.about.bullets.map((bullet, index) => (
                  <li key={`${bullet}-${index}`}>* {bullet}</li>
                ))}
              </ul>
            </div>

            <div className="rounded-xl border border-theme-border bg-theme-bg p-6 text-center shadow-md">
              <h4 className="font-semibold text-theme-primary">{content.about.approachTitle}</h4>
              <p className="mt-3 text-sm text-theme-fg opacity-80">{content.about.approachText}</p>
            </div>
          </div>
        </section>

        <section id="contact" className="w-full border-t border-theme-border px-4 py-16 md:px-8 bg-theme-bg">
          <h3 className="text-3xl font-semibold text-theme-primary">{content.contact.title}</h3>
          <p className="mt-2 text-theme-fg opacity-80">{content.contact.subtitle}</p>

          <div className="mt-10 grid gap-8 md:grid-cols-2">
            <PublicContactForm
              formAction={content.contact.formAction}
              email={content.contact.email}
              formFields={content.contact.formFields}
              serviceOptions={contactServiceOptions}
              defaultService={selectedContactService}
            />

            <div className="rounded-xl border border-theme-border bg-theme-card p-6 shadow-md">
              <h4 className="font-semibold text-theme-primary">{content.contact.officeTitle}</h4>
              <p className="mt-3 text-theme-fg opacity-90">
                Email:{" "}
                <a href={`mailto:${content.contact.email}`} className="text-theme-primary font-medium hover:underline">
                  {content.contact.email}
                </a>
              </p>
              <p className="mt-2 text-theme-fg opacity-90">Phone: {content.contact.phone}</p>
              <p className="mt-2 text-theme-fg opacity-90">Address: {content.contact.address}</p>

              <div className="mt-6 rounded-lg border border-theme-border bg-theme-bg p-4">
                <h5 className="font-medium text-theme-fg">{content.contact.whyChooseTitle}</h5>
                <ul className="mt-3 space-y-2 text-sm text-theme-fg opacity-80">
                  {content.contact.whyChooseItems.map((item, index) => (
                    <li key={`${item}-${index}`}>• {item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="w-full border-t border-theme-border bg-theme-card px-4 py-8 text-center text-sm text-theme-fg opacity-80 md:px-8">
        <div>{content.footer.copyright.replace("2024", String(currentYear))}</div>
        <div className="mt-1">{content.footer.note}</div>
      </footer>
      </div>

      <PublicWhatsAppButton
        enabled={content.whatsapp.enabled}
        phoneNumber={content.whatsapp.phoneNumber}
        message={content.whatsapp.message}
        buttonLabel={content.whatsapp.buttonLabel}
      />
      <PublicCallButton
        enabled={content.call.enabled}
        phoneNumber={content.call.phoneNumber}
        buttonLabel={content.call.buttonLabel}
      />
    </div>
  );
}
