import type { Metadata } from "next";
import Link from "next/link";
import PublicCallButton from "./components/PublicCallButton";
import PublicContactForm from "./components/PublicContactForm";
import PublicWhatsAppButton from "./components/PublicWhatsAppButton";
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
      <span className="text-emerald-400">{match}</span>
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

  return (
    <div className={`public-site public-font-${selectedFontStyle} min-h-screen w-full bg-slate-950 text-white`}>
      <div className="page-enter">
      <header className="relative z-20 flex w-full items-center justify-between px-4 py-8 md:px-8">
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
            <h1 className="text-xl font-semibold">{content.header.companyName}</h1>
            <p className="text-sm" style={{ color: content.header.taglineColor || "#fcd34d" }}>
              {content.header.tagline}
            </p>
          </div>
        </div>

        <details className="group relative md:hidden">
          <summary className="flex h-11 w-11 cursor-pointer list-none items-center justify-center rounded-lg border border-slate-700 bg-slate-900/80 text-2xl text-white transition hover:border-emerald-400">
            <span aria-hidden>⋮</span>
            <span className="sr-only">Open menu</span>
          </summary>

          <div className="absolute right-0 top-14 z-30 w-52 origin-top rounded-xl border border-slate-700 bg-slate-900/95 p-3 shadow-xl transition duration-200 ease-out [transform:scaleY(0.96)] [opacity:0] group-open:[transform:scaleY(1)] group-open:[opacity:1]">
            <nav className="flex flex-col gap-1 text-sm text-slate-100">
              {content.header.navLinks.map((link, index) => (
                <a
                  key={`mobile-${link.label}-${index}`}
                  href={link.href}
                  className="rounded-lg px-3 py-2 transition hover:bg-white/10"
                >
                  {link.label}
                </a>
              ))}
              <Link
                href="/login"
                className="mt-2 rounded-lg border border-emerald-400 px-3 py-2 text-center font-medium text-white transition hover:bg-emerald-500/20"
              >
                {content.header.loginButtonText}
              </Link>
            </nav>
          </div>
        </details>

        <div className="hidden items-center gap-8 md:flex">
          <nav className="flex gap-8 text-sm text-gray-200">
            {content.header.navLinks.map((link, index) => (
              <a key={`${link.label}-${index}`} href={link.href} className="transition hover:text-amber-300">
                {link.label}
              </a>
            ))}
          </nav>
          <Link
            href="/login"
            className="rounded-lg border border-slate-400 px-5 py-2 text-sm font-medium text-white transition hover:border-emerald-400 hover:bg-white/10"
          >
            {content.header.loginButtonText}
          </Link>
        </div>
      </header>

      <main>
        <section
          className="relative flex flex-col items-center gap-12 bg-cover bg-center px-6 py-24 md:flex-row"
          style={{
            backgroundImage: `url('${content.hero.backgroundImage}')`,
            backgroundColor: "rgba(2, 6, 23, 0.88)",
            backgroundBlendMode: "multiply",
          }}
        >
          <div className="absolute inset-0 bg-black/94 backdrop-blur-[3px]" />

          <div className="relative z-10 grid w-full items-center gap-12 px-4 md:grid-cols-2 md:px-8">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-amber-300">{content.hero.eyebrow}</p>
              <h2 className="mt-4 text-4xl font-extrabold leading-tight text-white md:text-5xl">
                {renderHeroTitle(content.hero.title, content.hero.highlight)}
              </h2>
              <p className="mt-6 max-w-lg text-lg text-gray-300">{content.hero.description}</p>

              <div className="mt-8 flex gap-4">
                <a
                  href={content.hero.primaryButtonHref}
                  className="pro-interactive rounded-lg bg-emerald-500 px-6 py-3 text-white shadow-md transition hover:scale-105 hover:shadow-xl"
                >
                  {content.hero.primaryButtonText}
                </a>
                <a
                  href={content.hero.secondaryButtonHref}
                  className="pro-interactive rounded-lg border border-gray-400 px-6 py-3 text-gray-200 transition hover:border-amber-300 hover:bg-white/10"
                >
                  {content.hero.secondaryButtonText}
                </a>
              </div>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
                <Link
                  href="/login"
                  className="pro-interactive rounded-lg border border-amber-300 bg-white/10 px-6 py-3 text-center text-sm font-semibold text-white transition hover:bg-white/15"
                >
                  Are you an existing client? Please login
                </Link>
                <Link
                  href="/register"
                  className="pro-interactive rounded-lg border border-slate-400 px-6 py-3 text-center text-sm font-semibold text-slate-100 transition hover:border-emerald-400 hover:bg-white/10"
                >
                  New client ? Register
                </Link>
              </div>

              <div className="mt-10 text-sm text-gray-400">
                <div className="font-medium text-white">{content.hero.trustLabel}</div>
                <div className="mt-1 text-gray-300">{content.hero.trustItems.join(" · ")}</div>
              </div>
            </div>

            <div className="relative z-10">
    <div className="overflow-hidden rounded-2xl shadow-lg">
      <img
        src={content.hero.sideImage}
        alt={content.hero.sideImageAlt}
        className="h-full w-full object-cover"
      />
    </div>
  </div>
          </div>
        </section>

        <section id="services" className="w-full px-4 py-16 md:px-8">
          <h3 className="text-3xl font-semibold text-amber-300">{content.services.title}</h3>
          <p className="mt-3 text-gray-300">{content.services.subtitle}</p>

          <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-3">
            {content.services.items.map((item, index) => (
              <Link
                key={`${item.title}-${index}`}
                href={`/services/${slugifyServiceTitle(item.title)}`}
                className="pro-interactive block rounded-xl border border-slate-700 bg-slate-900/70 p-6 shadow-md transition hover:border-emerald-400 hover:shadow-emerald-400/20"
              >
                <h4 className="font-semibold text-amber-300">{item.title}</h4>
              </Link>
            ))}
          </div>
        </section>

        <section id="about" className="w-full border-t border-slate-800 px-4 py-16 md:px-8">
          <div className="grid items-center gap-10 md:grid-cols-2">
            <div>
              <h3 className="text-3xl font-semibold text-amber-300">{content.about.title}</h3>
              <p className="mt-4 leading-relaxed text-gray-300">{content.about.description}</p>
              <ul className="mt-6 space-y-2 text-gray-300">
                {content.about.bullets.map((bullet, index) => (
                  <li key={`${bullet}-${index}`}>* {bullet}</li>
                ))}
              </ul>
            </div>

            <div className="rounded-xl border border-slate-700 bg-gradient-to-tr from-slate-800 to-slate-900 p-6 text-center shadow-lg">
              <h4 className="font-semibold text-amber-300">{content.about.approachTitle}</h4>
              <p className="mt-3 text-sm text-gray-400">{content.about.approachText}</p>
            </div>
          </div>
        </section>

        <section id="contact" className="w-full px-4 py-16 md:px-8">
          <h3 className="text-3xl font-semibold text-amber-300">{content.contact.title}</h3>
          <p className="mt-2 text-gray-300">{content.contact.subtitle}</p>

          <div className="mt-10 grid gap-8 md:grid-cols-2">
            <PublicContactForm
              formAction={content.contact.formAction}
              email={content.contact.email}
              formFields={content.contact.formFields}
              serviceOptions={contactServiceOptions}
              defaultService={selectedContactService}
            />

            <div className="rounded-xl border border-slate-700 bg-slate-900/60 p-6 shadow-lg">
              <h4 className="font-semibold text-amber-300">{content.contact.officeTitle}</h4>
              <p className="mt-3 text-gray-300">
                Email:{" "}
                <a href={`mailto:${content.contact.email}`} className="text-emerald-400">
                  {content.contact.email}
                </a>
              </p>
              <p className="mt-2 text-gray-300">Phone: {content.contact.phone}</p>
              <p className="mt-2 text-gray-300">Address: {content.contact.address}</p>

              <div className="mt-6 rounded-lg border border-slate-700 bg-slate-950/70 p-4">
                <h5 className="font-medium text-white">{content.contact.whyChooseTitle}</h5>
                <ul className="mt-3 space-y-2 text-sm text-gray-300">
                  {content.contact.whyChooseItems.map((item, index) => (
                    <li key={`${item}-${index}`}>• {item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="w-full border-t border-slate-800 px-4 py-8 text-center text-sm text-gray-400 md:px-8">
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
