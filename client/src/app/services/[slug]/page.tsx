import type { Metadata } from "next";
import Link from "next/link";
import PublicCallButton from "../../components/PublicCallButton";
import PublicWhatsAppButton from "../../components/PublicWhatsAppButton";
import { getHomepageContent } from "../../utils/getHomepageContent";
import { findServiceBySlug } from "../../utils/homepageContent";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

type ServicePageProps = {
  params: {
    slug: string;
  };
};

async function getService(slug: string) {
  const content = await getHomepageContent();
  const service = findServiceBySlug(content.services.items, slug);

  return { content, service };
}

export async function generateMetadata({ params }: ServicePageProps): Promise<Metadata> {
  const { content, service } = await getService(params.slug);

  if (!service) {
    return {
      title: `Service not found | ${content.header.companyName}`,
      description: "The selected service could not be found.",
    };
  }

  return {
    title: `${service.title} | ${content.header.companyName}`,
    description: service.desc.split(/\r?\n/)[0],
  };
}

export default async function ServiceDetailsPage({ params }: ServicePageProps) {
  const { content, service } = await getService(params.slug);
  const selectedFontStyle = content.typography?.fontStyle || "professional";

  if (!service) {
    return (
      <div className={`public-site public-font-${selectedFontStyle} min-h-screen w-full bg-slate-950 px-4 py-20 text-white md:px-8`}>
        <div className="page-enter w-full rounded-3xl border border-slate-800 bg-slate-900/80 p-10 text-center">
          <p className="text-sm uppercase tracking-[0.25em] text-amber-300">Service</p>
          <h1 className="mt-4 text-3xl font-semibold">Service not found</h1>
          <p className="mt-4 text-slate-300">
            The selected service could not be loaded. Please return to the services page.
          </p>
          <Link
            href="/#services"
            className="mt-8 inline-flex rounded-xl border border-emerald-400 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
          >
            Back to Services
          </Link>
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

  return (
    <div className={`public-site public-font-${selectedFontStyle} min-h-screen w-full bg-slate-950 px-4 py-16 text-white md:px-8`}>
      <div className="page-enter w-full">
        <Link
          href="/#services"
          className="inline-flex rounded-full border border-slate-700 px-4 py-2 text-sm text-slate-300 transition hover:border-amber-300 hover:text-white"
        >
          Back to all services
        </Link>

        <div className="mt-8 rounded-[2rem] border border-emerald-500/25 bg-gradient-to-br from-slate-900 to-slate-950 p-6 shadow-2xl shadow-emerald-950/30 md:p-10">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr),320px]">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-emerald-300">
                {content.services.detailTitle}
              </p>
              <h1 className="mt-4 text-3xl font-semibold text-amber-300 md:text-5xl">
                {service.title}
              </h1>

              <div className="mt-8 space-y-4">
                {service.desc.split(/\r?\n\r?\n/).map((paragraph, index) => (
                  <article
                    key={`${service.title}-paragraph-${index}`}
                    className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 transition duration-300 hover:border-emerald-400/40 hover:shadow-lg hover:shadow-emerald-900/20"
                  >
                    <div className="mb-3 inline-flex rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-300">
                      Advisory Note {String(index + 1).padStart(2, "0")}
                    </div>
                    <p className="whitespace-pre-line text-[0.98rem] leading-8 text-slate-200">
                      {paragraph}
                    </p>
                  </article>
                ))}
              </div>
            </div>

            <aside className="h-fit rounded-2xl border border-amber-300/20 bg-slate-900/90 p-5 shadow-lg shadow-black/30">
              <h2 className="text-lg font-semibold text-amber-300">Need This Service?</h2>
              <p className="mt-3 text-sm leading-7 text-slate-300">
                Share your requirement and our team will review your case, align compliance needs, and guide next steps with clarity.
              </p>

              <div className="mt-5 space-y-2 text-sm text-slate-300">
                <p>• Confidential consultation</p>
                <p>• Compliance-focused approach</p>
                <p>• Practical, business-ready guidance</p>
              </div>

              <Link
                href={`/?service=${encodeURIComponent(service.title)}#contact`}
                className="pro-interactive mt-6 inline-flex w-full items-center justify-center rounded-xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-white transition hover:scale-[1.01] hover:bg-emerald-400"
              >
                {content.services.requestButtonText}
              </Link>
            </aside>
          </div>
        </div>
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
