import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Home() {
  const FORM_ENDPOINT = "/api/contact"; // ✅ Verified Formspree endpoint

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="max-w-6xl mx-auto px-6 py-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-macrocGreen flex items-center justify-center shadow-lg">
            <span className="text-white font-bold">MC</span>
          </div>
          <div>
            <h1 className="text-xl font-semibold">Macroc Consultants</h1>
            <p className="text-sm text-slate-600">
              Expert financial strategy & advisory
            </p>
          </div>
        </div>
        <nav className="hidden md:flex gap-6 text-sm text-slate-700">
          <a href="#services">Services</a>
          <a href="#about">About</a>
          <a href="#contact">Contact</a>
        </nav>
      </header>

      {/* Main */}
      <main>
        {/* Hero Section */}
        <section className="max-w-6xl mx-auto px-6 py-16 flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1">
            <p className="text-sm uppercase text-macrocGreen font-medium">
              Financial Consultancy
            </p>
            <h2 className="mt-4 text-4xl md:text-5xl font-extrabold leading-tight">
              Expertise forged with{" "}
              <span className="text-macrocGreen">fiercy</span> precision
            </h2>
            <p className="mt-6 text-lg text-slate-600">
              At Macroc Consultants we blend rigorous analysis with smart
              strategy to help individuals and businesses grow, protect, and
              optimise their wealth.
            </p>

            <div className="mt-8 flex gap-4">
              <a
                href="#contact"
                className="inline-block px-6 py-3 bg-macrocGreen text-white rounded-lg shadow hover:shadow-lg transition"
              >
                Get a Consultation
              </a>
              <a
                href="#services"
                className="inline-block px-6 py-3 border border-slate-200 rounded-lg text-slate-700"
              >
                Our Services
              </a>
            </div>
          </div>

          <div className="flex-1">
            <div className="w-full h-72 md:h-80 rounded-2xl bg-gradient-to-br from-macrocGreen to-indigo-600 shadow-xl flex items-center justify-center text-white">
              <div className="p-6 max-w-xs text-center animate-pulse">
                <h3 className="text-2xl font-bold">Premium Financial Insights</h3>
                <p className="mt-3 text-sm">
                  Data-driven decisions. Tailored strategies.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Services */}
        <section id="services" className="max-w-6xl mx-auto px-6 py-12">
          <h3 className="text-2xl font-semibold">Our Services</h3>
          <p className="mt-2 text-slate-600">
            Comprehensive services designed for clarity and growth.
          </p>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            <ServiceCard title="GST Registrations" desc="End-to-end GST registration services for businesses of all sizes." />
            <ServiceCard title="Return Filings" desc="Timely and accurate GST/Statutory return filings to keep you compliant." />
            <ServiceCard title="Income Tax Filings" desc="Individual and corporate income tax filing and optimisation services." />
            <ServiceCard title="Virtual CFO Services" desc="Strategic financial leadership, forecasting and performance reporting." />
            <ServiceCard title="Accounting & Bookkeeping" desc="Accurate bookkeeping and accounting to give you clean, reliable records." />
            <ServiceCard title="Payroll Compliances" desc="Payroll processing and compliance with statutory requirements." />
            <ServiceCard title="TDS/TCS Compliances" desc="Complete handling of TDS/TCS calculations, filings and reconciliations." />
            <ServiceCard title="Internal Audit Services" desc="Independent internal audits to strengthen controls and processes." />
            <ServiceCard title="Costing" desc="Product and service costing to support pricing and margin decisions." />
          </div>
        </section>

        {/* About */}
        <section id="about" className="max-w-6xl mx-auto px-6 py-12">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-semibold">About Macroc Consultants</h3>
              <p className="mt-4 text-slate-600">
                We combine industry expertise, robust analytics, and a
                client-first approach to deliver financial strategies that are
                practical, compliant, and growth-focused.
              </p>
              <ul className="mt-6 space-y-3 text-slate-700">
                <li>• Personalized financial planning</li>
                <li>• Transparent fee structures</li>
                <li>• Proven results across sectors</li>
              </ul>
            </div>
            <div>
              <div className="w-full h-64 rounded-xl border border-slate-100 bg-white shadow flex items-center justify-center">
                <div className="p-6 text-center">
                  <h4 className="font-semibold">Our Approach</h4>
                  <p className="mt-2 text-sm text-slate-600">
                    Research → Strategy → Execution → Review
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact */}
        <section id="contact" className="max-w-6xl mx-auto px-6 py-12">
          <h3 className="text-2xl font-semibold">Contact Us</h3>
          <p className="mt-2 text-slate-600">
            Ready to start? Send us a message and we’ll get back within 1
            business day.
          </p>

          <div className="mt-6 grid md:grid-cols-2 gap-8">
            <ContactForm endpoint={FORM_ENDPOINT} />
            <OfficeInfo />
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t mt-12 py-6">
        <div className="max-w-6xl mx-auto px-6 text-sm text-slate-600 flex items-center justify-between">
          <div>© {new Date().getFullYear()} Macroc Consultants. All rights reserved.</div>
          <div>Built for clarity · Powered by Vercel</div>
        </div>
      </footer>
    </div>
  );
}

/* ✅ Contact Form Component (Formspree JSON API + Modal) */
function ContactForm({ endpoint }) {
  const [status, setStatus] = useState("idle");
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("success");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");

    const form = e.target;
    const data = {
      name: form.name.value,
      email: form.email.value,
      message: form.message.value,
    };

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        form.reset();
        setModalType("success");
        setShowModal(true);
        setStatus("success");
      } else {
        throw new Error("Submission failed");
      }
    } catch {
      setModalType("error");
      setShowModal(true);
      setStatus("error");
    }
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow"
      >
        <label className="block text-sm font-medium text-slate-700">Your Name</label>
        <input
          name="name"
          required
          className="mt-1 w-full border border-slate-200 rounded px-3 py-2"
          placeholder="Full name"
        />

        <label className="block text-sm font-medium text-slate-700 mt-4">Email</label>
        <input
          name="email"
          type="email"
          required
          className="mt-1 w-full border border-slate-200 rounded px-3 py-2"
          placeholder="you@example.com"
        />

        <label className="block text-sm font-medium text-slate-700 mt-4">Message</label>
        <textarea
          name="message"
          required
          className="mt-1 w-full border border-slate-200 rounded px-3 py-2"
          rows={4}
          placeholder="How can we help?"
        />

        <div className="mt-4">
          <button
            type="submit"
            disabled={status === "loading"}
            className="px-5 py-2 bg-macrocGold text-white rounded hover:bg-yellow-600 transition"
          >
            {status === "loading" ? "Sending..." : "Send message"}
          </button>
        </div>
      </form>

      <AnimatePresence>
        {showModal && (
          <motion.div
            className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-lg shadow-lg p-8 max-w-sm text-center"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              {modalType === "success" ? (
                <>
                  <h3 className="text-xl font-semibold text-green-600">✅ Message Sent!</h3>
                  <p className="mt-2 text-slate-600">
                    Thanks for contacting us — we’ll reach out soon.
                  </p>
                </>
              ) : (
                <>
                  <h3 className="text-xl font-semibold text-red-600">❌ Submission Failed</h3>
                  <p className="mt-2 text-slate-600">
                    Something went wrong. Please try again later.
                  </p>
                </>
              )}

              <button
                onClick={() => setShowModal(false)}
                className="mt-5 px-4 py-2 bg-macrocGreen text-white rounded hover:bg-green-700 transition"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/* ✅ Office Info Component */
function OfficeInfo() {
  return (
    <div className="p-6 rounded-lg bg-gradient-to-br from-gray-50 to-white border border-slate-100">
      <h4 className="font-semibold">Office</h4>
      <p className="mt-2 text-slate-600">
        Email:{" "}
        <a className="text-macrocGreen" href="mailto:info@macroc.in">
          info@macroc.in
        </a>
      </p>
      <p className="mt-2 text-slate-600">Phone: 6300447014, 9035437253</p>
      <p className="mt-2 text-slate-600">
        Address: Sri Pathi Rao Street, Oldpet, Palamaner, 517408
      </p>

      <div className="mt-6">
        <h5 className="font-medium">Why choose us</h5>
        <ul className="mt-2 text-slate-600">
          <li>• Tailored strategies</li>
          <li>• Data-backed decisions</li>
          <li>• Transparent fees</li>
        </ul>
      </div>
    </div>
  );
}

/* ✅ Service Card Component */
function ServiceCard({ title, desc }) {
  return (
    <div className="p-5 bg-white rounded-lg shadow-sm border">
      <h4 className="font-semibold">{title}</h4>
      <p className="mt-2 text-slate-600 text-sm">{desc}</p>
    </div>
  );
}
