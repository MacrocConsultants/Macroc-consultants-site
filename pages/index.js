import React from "react";
import Head from "next/head";
import { motion } from "framer-motion";

export default function Home() {
  const FORM_ENDPOINT = "https://formspree.io/f/xldowwje";
  const EMAIL = "info@macroc.in";

  return (
    <>
      {/* ✅ STEP 1: SEO META TAGS */}
      <Head>
        <title>Macroc Consultants | Financial & Tax Advisory Experts</title>
        <meta
          name="description"
          content="Macroc Consultants offers expert financial advisory, accounting, taxation, GST, and compliance services for businesses and individuals across India."
        />
        <meta
          name="keywords"
          content="Macroc Consultants, Macroc Advisory, Macroc Financial Services, Macroc Finances, Macroc Taxation, Chartered Accountant, Accounting, GST, TDS, Audit, CFO, Compliance"
        />
        <meta name="author" content="Macroc Consultants" />
        <meta name="robots" content="index, follow" />

        {/* ✅ Open Graph Tags (for Google & Social Media) */}
        <meta property="og:title" content="Macroc Consultants | Financial Experts" />
        <meta
          property="og:description"
          content="Trusted Financial & Tax Advisory – GST, Accounting, TDS, Virtual CFO, and Audit services by Macroc Consultants."
        />
        <meta property="og:image" content="https://www.macroc.in/images/team-accounting-bg.png" />
        <meta property="og:url" content="https://www.macroc.in" />
        <meta property="og:type" content="website" />

        {/* ✅ Sitemap Reference */}
        <link rel="sitemap" type="application/xml" href="https://www.macroc.in/sitemap.xml" />

        {/* ✅ STEP 2: Structured Data for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Macroc Consultants",
              url: "https://www.macroc.in",
              logo: "https://www.macroc.in/images/team-accounting-bg.png",
              contactPoint: [
                {
                  "@type": "ContactPoint",
                  telephone: "+91-6300447014",
                  contactType: "customer service",
                  areaServed: "IN",
                  availableLanguage: "en",
                },
              ],
              sameAs: [
                "https://www.linkedin.com/company/macrocconsultants",
                "https://www.instagram.com/macrocconsultants",
              ],
            }),
          }}
        />
      </Head>

      {/* 🌐 Actual Website Body Starts Here */}
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-black text-white">
        {/* Header */}
        <header className="max-w-6xl mx-auto px-6 py-8 flex items-center justify-between relative z-20">
          <div className="flex items-center gap-4">
            <motion.div
              whileHover={{ scale: 1.1 }}
              className="w-12 h-12 rounded-xl bg-macrocGreen flex items-center justify-center shadow-lg shadow-macrocGreen/30"
            >
              <img
  src="public/macroc-logo.png"
  alt="MACROC Financial Consultants"
  className="w-12 h-12 object-contain"
/>

            </motion.div>
            <div>
              <h1 className="text-xl font-semibold">Macroc Consultants</h1>
              <p className="text-sm text-gray-300">
                Expert financial advisory & Compliance
              </p>
            </div>
          </div>
          <nav className="hidden md:flex gap-8 text-sm text-gray-200">
            <a href="#services" className="hover:text-macrocGold transition">
              Services
            </a>
            <a href="#about" className="hover:text-macrocGold transition">
              About
            </a>
            <a href="#contact" className="hover:text-macrocGold transition">
              Contact
            </a>
          </nav>
        </header>

        {/* Hero Section */}
        <main>
          <section
            className="relative flex flex-col md:flex-row items-center gap-12 px-6 py-24 bg-cover bg-center bg-fixed"
            style={{
              backgroundImage: "url('/images/team-accounting-bg.png')",
            }}
          >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="relative z-10 flex-1"
            >
              <p className="text-sm uppercase text-macrocGold font-semibold tracking-wide">
                Financial Consultancy
              </p>
              <h2 className="mt-4 text-4xl md:text-5xl font-extrabold leading-tight text-white">
                Expertise forged with{" "}
                <span className="text-macrocGreen">fierce</span> Precision
              </h2>
              <p className="mt-6 text-lg text-gray-300 max-w-lg">
                At Macroc Consultants, we blend our Expertise with our
                Confidence, Intent to help individuals and businesses grow,
                protect, and optimize their wealth through virtual Presence.
              </p>

              <div className="mt-8 flex gap-4">
                <a
                  href="#contact"
                  className="px-6 py-3 bg-macrocGreen text-white rounded-lg shadow-md hover:shadow-xl hover:scale-105 transition"
                >
                  Get a Consultation
                </a>
                <a
                  href="#services"
                  className="px-6 py-3 border border-gray-400 rounded-lg text-gray-200 hover:bg-white/10 hover:border-macrocGold transition"
                >
                  Our Services
                </a>
              </div>

              <div className="mt-10 text-sm text-gray-400">
                <div className="font-medium">Trusted for:</div>
                <div className="mt-1 text-gray-300">
                  GST · Income Tax · Virtual CFO · Payroll · Compliances · ROC Services
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7 }}
              className="relative z-10 flex-1"
            >
              <div className="rounded-2xl overflow-hidden shadow-lg">
                <img
                  src="/images/team-accounting-bg.jpg"
                  alt="Virtual Experts"
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>
          </section>

          {/* Services Section */}
          <section id="services" className="max-w-6xl mx-auto px-6 py-16">
            <h3 className="text-3xl font-semibold text-macrocGold">
              Our Services
            </h3>
            <p className="mt-3 text-gray-300">
              Comprehensive services designed for clarity and growth.
            </p>

            <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { title: "GST Registrations", desc: "End-to-end GST registration services for businesses of all sizes." },
                { title: "Return Filings", desc: "Timely and accurate GST/Statutory return filings to keep you compliant." },
                { title: "Income Tax Filings", desc: "Individual and corporate income tax filing and optimisation services." },
                { title: "Virtual CFO Services", desc: "Strategic financial accounting, forecasting, and performance reporting." },
                { title: "Accounting & Bookkeeping", desc: "Accurate bookkeeping and accounting to give you clean, reliable records." },
                { title: "Payroll Compliances", desc: "Payroll processing and compliance with statutory requirements." },
                { title: "TDS/TCS Compliances", desc: "Complete handling of TDS/TCS calculations, filings, and reconciliations." },
                { title: "Internal Audit Services", desc: "Independent internal audits to strengthen controls and processes." },
                { title: "Costing", desc: "Product and service costing to support pricing and margin decisions." },
              ].map((s, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                >
                  <ServiceCard title={s.title} desc={s.desc} />
                </motion.div>
              ))}
            </div>
          </section>

          {/* About Section */}
          <section id="about" className="max-w-6xl mx-auto px-6 py-16 border-t border-slate-800">
            <div className="grid md:grid-cols-2 gap-10 items-center">
              <div>
                <h3 className="text-3xl font-semibold text-macrocGold">
                  About Macroc Consultants
                </h3>
                <p className="mt-4 text-gray-300 leading-relaxed">
                  We combine industry expertise, robust analytics, and a
                  client-first approach to deliver financial strategies that are
                  practical, compliant, and growth-focused virtually through internet .
                </p>
                <ul className="mt-6 space-y-2 text-gray-300">
                  <li>• Virtual Presence but invincible </li>
                    <li>• Personalized financial planning</li>
                  <li>• Accurate Accounting & Book keeping</li>
                  <li>• Proven results across sectors</li>
                  <li>• Dynamic Team</li>
                  <li>• Transparent fee structures</li>
                </ul>
              </div>
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                className="rounded-xl border border-slate-700 bg-gradient-to-tr from-slate-800 to-slate-900 shadow-lg p-6 text-center"
              >
                <h4 className="font-semibold text-macrocGold">Our Approach</h4>
                <p className="mt-3 text-sm text-gray-400">
                  Research → Strategy → Execution → Review
                </p>
              </motion.div>
            </div>
          </section>

          {/* Contact Section */}
          <section id="contact" className="max-w-6xl mx-auto px-6 py-16">
            <h3 className="text-3xl font-semibold text-macrocGold">Contact Us</h3>
            <p className="mt-2 text-gray-300">
              Ready to upscale your business ? Send us a personalized message and we’ll respond within 1 business day.
            </p>

            <div className="mt-10 grid md:grid-cols-2 gap-8">
              <form
                className="bg-slate-900/60 p-6 rounded-xl shadow-lg border border-slate-700 backdrop-blur-md"
                method="POST"
                action={FORM_ENDPOINT}
              >
                <label className="block text-sm font-medium text-gray-300">
                  Your name
                </label>
                <input
                  name="name"
                  required
                  className="mt-2 w-full border border-slate-700 bg-slate-800 rounded px-3 py-2 text-gray-100 placeholder-gray-500 focus:border-macrocGreen focus:ring-1 focus:ring-macrocGreen outline-none"
                  placeholder="Full name"
                />

                <label className="block text-sm font-medium text-gray-300 mt-4">
                  Email
                </label>
                <input
                  name="email"
                  required
                  type="email"
                  className="mt-2 w-full border border-slate-700 bg-slate-800 rounded px-3 py-2 text-gray-100 placeholder-gray-500 focus:border-macrocGreen focus:ring-1 focus:ring-macrocGreen outline-none"
                  placeholder="you@example.com"
                />

                <label className="block text-sm font-medium text-gray-300 mt-4">
                  Message
                </label>
                <textarea
                  name="message"
                  required
                  rows={4}
                  className="mt-2 w-full border border-slate-700 bg-slate-800 rounded px-3 py-2 text-gray-100 placeholder-gray-500 focus:border-macrocGreen focus:ring-1 focus:ring-macrocGreen outline-none"
                  placeholder="Write your message here..."
                />

                <button
                  type="submit"
                  className="mt-5 w-full px-5 py-2 bg-macrocGold text-white font-medium rounded-lg hover:opacity-90 hover:scale-[1.02] transition"
                >
                  Send message
                </button>

                <p className="mt-3 text-xs text-gray-500">
                  Messages will be sent securely to{" "}
                  <a href={`mailto:${EMAIL}`} className="text-macrocGreen">
                    {EMAIL}
                  </a>
                  .
                </p>
              </form>

              <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-700 shadow-lg">
                <h4 className="font-semibold text-macrocGold">Office</h4>
                <p className="mt-3 text-gray-300">
                  Email:{" "}
                  <a href={`mailto:${EMAIL}`} className="text-macrocGreen">
                    {EMAIL}
                  </a>
                </p>
                <p className="mt-2 text-gray-300">Phone: 6300447014, 9035437253</p>
                <p className="mt-2 text-gray-300">
                  Address: Global Wide ( Vitual ) Sri Pathi Rao Street, Oldpet, Palamaner, 517408 (Locally)
                </p>

                <div className="mt-6">
                  <h5 className="font-medium text-macrocGold">Why choose us</h5>
                  <ul className="mt-3 text-gray-300 text-sm space-y-1">
                    <li>• Invincible Virtual Presence</li>
                    <li>• Tailored strategies</li>
                    <li>• Data-backed decisions</li>
                    <li>• Transparent fees</li>
                    <li>• Young & Dynamic Team</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer className="border-t border-slate-800 mt-16 py-6">
          <div className="max-w-6xl mx-auto px-6 text-sm text-gray-400 flex flex-col md:flex-row items-center justify-between gap-3">
            <div>© {new Date().getFullYear()} Macroc Consultants. All rights reserved.</div>
            <div>Built for clarity · Powered by Vercel</div>
          </div>
        </footer>
      </div>
    </>
  );
}

// Reusable Service Card Component
function ServiceCard({ title, desc }) {
  return (
    <div className="p-6 bg-slate-900/70 rounded-xl border border-slate-700 shadow-md hover:border-macrocGreen hover:shadow-macrocGreen/20 transition">
      <h4 className="font-semibold text-macrocGold">{title}</h4>
      <p className="mt-2 text-gray-300 text-sm leading-relaxed">{desc}</p>
    </div>
  );
}
