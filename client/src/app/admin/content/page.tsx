"use client";

import { useEffect, useState } from "react";
import api from "../../../utils/api";

type NavLink = { label: string; href: string };
type ServiceItem = { title: string; desc: string };

type ThemeColors = {
  background: string;
  foreground: string;
  primary: string;
  cardBg: string;
  borderColor: string;
};

type ContentForm = {
  colors: {
    light: ThemeColors;
    dark: ThemeColors;
  };
  assets: {
    seoOgImage: { fileId: string; fileName: string; url: string };
    headerLogoImage: { fileId: string; fileName: string; url: string };
    heroBackgroundImage: { fileId: string; fileName: string; url: string };
    heroSideImage: { fileId: string; fileName: string; url: string };
  };
  typography: {
    fontStyle: "professional" | "modern" | "classic";
  };
  seo: {
    title: string;
    description: string;
    keywords: string;
    ogTitle: string;
    ogDescription: string;
    ogImage: string;
  };
  header: {
    companyName: string;
    tagline: string;
    taglineColor: string;
    logoText: string;
    logoImage: string;
    navLinks: NavLink[];
    loginButtonText: string;
  };
  hero: {
    eyebrow: string;
    title: string;
    highlight: string;
    description: string;
    primaryButtonText: string;
    primaryButtonHref: string;
    secondaryButtonText: string;
    secondaryButtonHref: string;
    trustLabel: string;
    trustItems: string[];
    backgroundImage: string;
    sideImage: string;
    sideImageAlt: string;
    contentSpacing: "tight" | "normal" | "relaxed";
  };
  services: {
    title: string;
    subtitle: string;
    detailTitle: string;
    requestButtonText: string;
    items: ServiceItem[];
  };
  about: {
    title: string;
    description: string;
    bullets: string[];
    approachTitle: string;
    approachText: string;
  };
  contact: {
    title: string;
    subtitle: string;
    formAction: string;
    formFields: {
      nameLabel: string;
      namePlaceholder: string;
      mobileLabel: string;
      mobilePlaceholder: string;
      emailLabel: string;
      emailPlaceholder: string;
      serviceLabel: string;
      messageLabel: string;
      messagePlaceholder: string;
      buttonText: string;
    };
    serviceOptions: string[];
    officeTitle: string;
    email: string;
    phone: string;
    address: string;
    whyChooseTitle: string;
    whyChooseItems: string[];
  };
  whatsapp: {
    enabled: boolean;
    phoneNumber: string;
    message: string;
    buttonLabel: string;
  };
  call: {
    enabled: boolean;
    phoneNumber: string;
    buttonLabel: string;
  };
  footer: {
    copyright: string;
    note: string;
  };
};

const defaultForm: ContentForm = {
  colors: {
    light: {
      background: "#eff6ff",
      foreground: "#1e3a8a",
      primary: "#10b981",
      cardBg: "#ffffff",
      borderColor: "#bfdbfe",
    },
    dark: {
      background: "#000000",
      foreground: "#ffffff",
      primary: "#FFD700",
      cardBg: "#1a1a1a",
      borderColor: "#333333",
    },
  },
  assets: {
    seoOgImage: { fileId: "", fileName: "", url: "" },
    headerLogoImage: { fileId: "", fileName: "", url: "" },
    heroBackgroundImage: { fileId: "", fileName: "", url: "" },
    heroSideImage: { fileId: "", fileName: "", url: "" },
  },
  typography: {
    fontStyle: "professional",
  },
  seo: {
    title: "Macroc Consultants | Financial & Tax Advisory Experts",
    description:
      "Macroc Consultants offers expert financial advisory, accounting, taxation, GST, and compliance services for businesses and individuals across India.",
    keywords:
      " CA Near me,best consultant,best CA,TDS Consultant,tds,tcs,gst registration,gst services,Macroc Consultants, Macroc Advisory, Macroc Financial Services, Macroc Finances, Macroc Taxation, Chartered Accountant, Accounting, GST, TDS, Audit, CFO, Compliance",
    ogTitle: "Macroc Consultants | Financial Experts",
    ogDescription:
      "Trusted Financial & Tax Advisory - GST, Accounting, TDS, Virtual CFO, and Audit services by Macroc Consultants.",
    ogImage: "/images/team-accounting-bg.png",
  },
  header: {
    companyName: "Macroc Consultants",
    tagline: "Expert financial advisory & Compliance",
    taglineColor: "#fcd34d",
    logoText: "M",
    logoImage: "/macro-logo.png",
    navLinks: [
      { label: "Services", href: "#services" },
      { label: "About", href: "#about" },
      { label: "Contact", href: "#contact" },
    ],
    loginButtonText: "Login",
  },
  hero: {
    eyebrow: "Financial Consultancy",
    title: "Expertise forged with fierce Precision",
    highlight: "fierce",
    description:
      "At Macroc Consultants, we blend our Expertise with our Confidence, Intent to help individuals and businesses grow, protect, and optimize their wealth through virtual Presence.",
    primaryButtonText: "Get a Consultation",
    primaryButtonHref: "#contact",
    secondaryButtonText: "Our Services",
    secondaryButtonHref: "#services",
    trustLabel: "Trusted for:",
    trustItems: ["GST", "Income Tax", "Virtual CFO", "Payroll", "Compliances", "ROC Services"],
    backgroundImage: "/images/team-accounting-bg.png",
    sideImage: "/images/team-accounting-bg.png",
    sideImageAlt: "Virtual Experts",
    contentSpacing: "tight",
  },
  services: {
    title: "Our Services",
    subtitle: "Comprehensive services designed for clarity and growth.",
    detailTitle: "Service Overview",
    requestButtonText: "Request to Contact",
    items: [
      {
        title: "Registrations & Certifications",
        desc: `We provide end-to-end assistance in obtaining statutory registrations and certifications essential for business operations in India.

Our services include GST Registration, Import Export Code (IEC), MSME/Udyam Registration, Shop & Establishment License, PAN/TAN, and Digital Signature Certificates (DSC).

We ensure accurate documentation, regulatory alignment, and seamless approvals, enabling businesses to commence operations with full legal compliance.`,
      },
      {
        title: "GST & Statutory Return Filings",
        desc: `Comprehensive compliance management covering GST return filings (GSTR-1, GSTR-3B, GSTR-9/9C), LUT filings, input tax credit reconciliation, and statutory reporting.

Our approach focuses on accuracy, timeliness, and optimization of ITC, ensuring strict adherence to GST laws while minimizing exposure to notices, penalties, and litigation.`,
      },
      {
        title: "Income Tax Filings & Advisory",
        desc: `End-to-end income tax services for individuals and entities, including return filing (ITR-1 to ITR-7), tax planning, capital gains computation, and compliance advisory.

We adopt a strategic tax optimization approach, ensuring compliance with the Income Tax Act, 1961, while maximizing eligible deductions and minimizing tax liabilities.`,
      },
      {
        title: "Virtual CFO Services",
        desc: `Strategic financial leadership services designed to support growing businesses without the cost of a full-time CFO.

Our offerings include financial planning and analysis (FP&A), budgeting, cash flow management, MIS reporting, and investor readiness support, enabling informed decision-making and sustainable growth.`,
      },
      {
        title: "Accounting & Bookkeeping",
        desc: `Robust accounting solutions aligned with Indian Accounting Standards (AS/Ind AS) and regulatory requirements.

We manage transaction recording, ledger maintenance, reconciliations, and financial statement preparation, ensuring accurate, audit-ready financial data for effective business management.`,
      },
      {
        title: "Payroll & Labour Law Compliance",
        desc: `End-to-end payroll processing and statutory compliance including salary structuring, TDS deductions, EPF (PF), ESI, Professional Tax, and labour law filings.

We ensure accurate payroll execution, timely statutory deposits, and full compliance with applicable labour regulations, reducing compliance risks.`,
      },
      {
        title: "TDS/TCS Compliance & Filings",
        desc: `Comprehensive management of tax deduction and collection at source (TDS/TCS), including calculation, deduction, return filings (24Q, 26Q, 27Q), and issuance of Form 16/16A.

We ensure compliance with Income Tax provisions, along with reconciliation with Form 26AS, preventing defaults, interest, and penalties.`,
      },
      {
        title: "Internal Audit & Risk Advisory",
        desc: `Independent internal audit services focused on evaluating internal controls, operational efficiency, and regulatory compliance.

We provide risk assessments, control recommendations, and process improvements, enabling businesses to strengthen governance and mitigate operational risks.`,
      },
      {
        title: "Costing & Profitability Analysis",
        desc: `Specialized costing services to support pricing decisions, cost control, and margin optimization.

We conduct detailed cost analysis, break-even studies, and profitability assessments, helping businesses enhance efficiency and maximize returns.`,
      },
      {
        title: "GST Advisory, Litigation & Compliance",
        desc: `Advanced GST services including tax structuring, classification (HSN/SAC), ITC advisory, departmental representation, and litigation support.

We assist in handling notices, assessments, and audits, ensuring compliance with evolving GST regulations while safeguarding business interests.`,
      },
      {
        title: "Import Export & IEC Advisory",
        desc: `Comprehensive support for businesses engaged in international trade, including IEC registration, DGFT compliance, export documentation, and FEMA advisory.

We help structure transactions efficiently to ensure regulatory compliance, smooth cross-border operations, and duty optimization.`,
      },
      {
        title: "SEZ & Zero-Rated Supply Compliance",
        desc: `Specialized advisory and compliance services for SEZ units and exporters, covering:

LUT (Letter of Undertaking) filing
Zero-rated supply compliance under GST
Refund claims (unutilized ITC and export refunds)
SEZ documentation and reporting

We ensure maximum refund realization, proper documentation, and strict compliance, minimizing delays and rejections.`,
      },
    ],
  },
  about: {
    title: "About Macroc Consultants",
    description:
      "We combine industry expertise, robust analytics, and a client-first approach to deliver financial strategies that are practical, compliant, and growth-focused virtually through internet .",
    bullets: [
      "Virtual Presence but invincible",
      "Personalized financial planning",
      "Accurate Accounting & Book keeping",
      "Proven results across sectors",
      "Dynamic Team",
      "Transparent fee structures",
    ],
    approachTitle: "Our Approach",
    approachText: "Research -> Strategy -> Execution -> Review",
  },
  contact: {
    title: "Contact Us",
    subtitle:
      "Ready to upscale your business ? Send us a personalized message and we'll respond within 1 business day.",
    formAction: "https://formspree.io/f/xldowwje",
    formFields: {
      nameLabel: "Your name",
      namePlaceholder: "Full name",
      mobileLabel: "Mobile Number",
      mobilePlaceholder: "Enter mobile number",
      emailLabel: "Email",
      emailPlaceholder: "you@example.com",
      serviceLabel: "Service Required",
      messageLabel: "Message",
      messagePlaceholder: "Write your message here...",
      buttonText: "Send message",
    },
    serviceOptions: [
      "GST & Statutory Return Filings",
      "Accounting & Bookkeeping",
      "Payroll & Labour Law Compliance",
      "TDS/TCS Compliance & Filings",
      "Income Tax Filings & Advisory",
      "Registrations & Certifications",
      "Virtual CFO Services",
      "Internal Audit & Risk Advisory",
      "Costing & Profitability Analysis",
      "GST Advisory, Litigation & Compliance",
      "Import Export & IEC Advisory",
      "SEZ & Zero-Rated Supply Compliance",
    ],
    officeTitle: "Office",
    email: "info@macroc.in",
    phone: "9035437253/7996629961",
    address: "5-50 Oldpet,Palamaner,517408, AP, In",
    whyChooseTitle: "Why choose us",
    whyChooseItems: [
      "Invincible Virtual Presence",
      "Tailored strategies",
      "Data-backed decisions",
      "Transparent fees",
      "Young & Dynamic Team",
    ],
  },
  whatsapp: {
    enabled: true,
    phoneNumber: "919035437253",
    message: "Hello Macroc Team, I would like to know more about your services.",
    buttonLabel: "Chat on WhatsApp",
  },
  call: {
    enabled: true,
    phoneNumber: "9035437253",
    buttonLabel: "Call Now",
  },
  footer: {
    copyright: "Macroc Consultants. All rights reserved.",
    note: "Built for clarity · Powered by Vercel",
  },
};

function mergeServiceItems(savedItems: ServiceItem[] | undefined, defaultItems: ServiceItem[]) {
  if (!Array.isArray(savedItems) || savedItems.length === 0) {
    return defaultItems;
  }

  const mergedItems: ServiceItem[] = [];
  const existingTitles = new Set<string>();

  savedItems.forEach((item) => {
    const normalizedTitle = item.title?.trim().toLowerCase();
    if (!normalizedTitle || existingTitles.has(normalizedTitle)) {
      return;
    }

    existingTitles.add(normalizedTitle);
    mergedItems.push(item);
  });

  defaultItems.forEach((item) => {
    const normalizedTitle = item.title?.trim().toLowerCase();
    if (normalizedTitle && !existingTitles.has(normalizedTitle)) {
      existingTitles.add(normalizedTitle);
      mergedItems.push(item);
    }
  });

  return mergedItems;
}

function mergeStringOptions(savedOptions: string[] | undefined, defaultOptions: string[]) {
  if (!Array.isArray(savedOptions) || savedOptions.length === 0) {
    return defaultOptions;
  }

  const mergedOptions: string[] = [];
  const existingOptions = new Set<string>();

  savedOptions.forEach((item) => {
    const normalized = item.trim().toLowerCase();
    if (!normalized || existingOptions.has(normalized)) {
      return;
    }

    existingOptions.add(normalized);
    mergedOptions.push(item);
  });

  defaultOptions.forEach((item) => {
    const normalized = item.trim().toLowerCase();
    if (normalized && !existingOptions.has(normalized)) {
      existingOptions.add(normalized);
      mergedOptions.push(item);
    }
  });

  return mergedOptions;
}

function mergeContent(data: Partial<ContentForm> | null | undefined): ContentForm {
  return {
    ...defaultForm,
    ...data,
    colors: {
      light: { ...defaultForm.colors.light, ...(data?.colors?.light || {}) },
      dark: { ...defaultForm.colors.dark, ...(data?.colors?.dark || {}) },
    },
    assets: { ...defaultForm.assets, ...(data?.assets || {}) },
    typography: { ...defaultForm.typography, ...(data?.typography || {}) },
    seo: { ...defaultForm.seo, ...(data?.seo || {}) },
    header: { ...defaultForm.header, ...(data?.header || {}) },
    hero: { ...defaultForm.hero, ...(data?.hero || {}) },
    services: {
      ...defaultForm.services,
      ...(data?.services || {}),
      detailTitle: data?.services?.detailTitle || defaultForm.services.detailTitle,
      requestButtonText:
        data?.services?.requestButtonText || defaultForm.services.requestButtonText,
      items: mergeServiceItems(data?.services?.items as ServiceItem[] | undefined, defaultForm.services.items),
    },
    about: { ...defaultForm.about, ...(data?.about || {}) },
    contact: {
      ...defaultForm.contact,
      ...(data?.contact || {}),
      formFields: {
        ...defaultForm.contact.formFields,
        ...(data?.contact?.formFields || {}),
      },
      serviceOptions: mergeStringOptions(
        data?.contact?.serviceOptions as string[] | undefined,
        defaultForm.contact.serviceOptions
      ),
      whyChooseItems: Array.isArray(data?.contact?.whyChooseItems)
        ? (data?.contact?.whyChooseItems as string[])
        : defaultForm.contact.whyChooseItems,
    },
    whatsapp: { ...defaultForm.whatsapp, ...(data?.whatsapp || {}) },
    call: { ...defaultForm.call, ...(data?.call || {}) },
    footer: { ...defaultForm.footer, ...(data?.footer || {}) },
  };
}

function toMultiline(items: string[]) {
  return items.join("\n");
}

function fromMultiline(value: string) {
  return value
    .split(/\r?\n/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function navToMultiline(items: NavLink[]) {
  return items.map((item) => `${item.label} | ${item.href}`).join("\n");
}

function navFromMultiline(value: string) {
  return value
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [label, ...rest] = line.split("|");
      return {
        label: label?.trim() || "",
        href: rest.join("|").trim() || "#",
      };
    })
    .filter((item) => item.label);
}

function Section({ title, children, id }: { title: string; children: React.ReactNode; id?: string }) {
  return (
    <section id={id} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="mb-5 text-lg font-bold text-slate-800">{title}</h2>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-slate-700">{label}</span>
      {children}
    </label>
  );
}

const inputClassName = "w-full rounded-lg border border-slate-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500";
const textareaClassName = `${inputClassName} min-h-[110px]`;

function ImageUrlField({
  label,
  value,
  onUrlChange,
}: {
  label: string;
  value: string;
  onUrlChange: (value: string) => void;
}) {
  return (
    <div className="space-y-2">
      <Field label={label}>
        <input className={inputClassName} value={value} onChange={(e) => onUrlChange(e.target.value)} />
      </Field>

      <div className="flex flex-col gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4">
        <p className="text-sm text-slate-600">
          Paste the Spacebyte image URL here. After saving, the public website will use that image automatically.
        </p>
        {value && (
          <img
            src={value}
            alt={label}
            className="max-h-40 w-full rounded-lg border border-slate-200 object-contain bg-white p-2"
          />
        )}
      </div>
    </div>
  );
}

export default function AdminContent() {
  const [formData, setFormData] = useState<ContentForm>(defaultForm);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [saveToast, setSaveToast] = useState<{
    visible: boolean;
    tone: "success" | "error";
    text: string;
  }>({
    visible: false,
    tone: "success",
    text: "",
  });

  useEffect(() => {
    api
      .get("/content/hero_section")
      .then((res) => setFormData(mergeContent(res.data)))
      .catch(() => setFormData(defaultForm))
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage("Saving homepage content...");

    try {
      const normalizedServiceOptions = formData.services.items
        .map((item) => item.title.trim())
        .filter(Boolean);

      const payload = {
        ...formData,
        header: {
          ...formData.header,
          navLinks: formData.header.navLinks.filter((item) => item.label && item.href),
        },
        hero: {
          ...formData.hero,
          trustItems: formData.hero.trustItems.filter(Boolean),
        },
        services: {
          ...formData.services,
          items: formData.services.items.filter((item) => item.title || item.desc),
        },
        about: {
          ...formData.about,
          bullets: formData.about.bullets.filter(Boolean),
        },
        contact: {
          ...formData.contact,
          serviceOptions: normalizedServiceOptions,
          whyChooseItems: formData.contact.whyChooseItems.filter(Boolean),
        },
      };

      const res = await api.post("/content/hero_section", payload);
      setFormData(mergeContent(res.data));
      setMessage("Homepage content saved successfully.");
      setSaveToast({
        visible: true,
        tone: "success",
        text: "Content updated successfully.",
      });
      window.scrollTo({ top: 0, behavior: "smooth" });
      setTimeout(() => {
        setSaveToast((current) => ({ ...current, visible: false }));
      }, 2600);
    } catch {
      setMessage("Could not save homepage content.");
      setSaveToast({
        visible: true,
        tone: "error",
        text: "Could not update content. Please try again.",
      });
      setTimeout(() => {
        setSaveToast((current) => ({ ...current, visible: false }));
      }, 3000);
    }
  };

  const handleReset = () => {
    setFormData(defaultForm);
    setMessage("Macroc website default content loaded into the editor. Save to publish it.");
  };

  const updateServiceItem = (index: number, field: keyof ServiceItem, value: string) => {
    const nextItems = [...formData.services.items];
    nextItems[index] = { ...nextItems[index], [field]: value };
    setFormData({ ...formData, services: { ...formData.services, items: nextItems } });
  };

  const addServiceItem = () => {
    setFormData({
      ...formData,
      services: {
        ...formData.services,
        items: [...formData.services.items, { title: "", desc: "" }],
      },
    });
  };

  const removeServiceItem = (index: number) => {
    const nextItems = formData.services.items.filter((_, itemIndex) => itemIndex !== index);

    setFormData({
      ...formData,
      services: {
        ...formData.services,
        items: nextItems.length > 0 ? nextItems : [{ title: "", desc: "" }],
      },
    });
  };

  return (
    <div className="max-w-6xl space-y-6">
      {saveToast.visible && (
        <div
          className={`fixed left-1/2 top-5 z-50 w-[92%] max-w-md -translate-x-1/2 rounded-xl border px-4 py-3 text-sm font-semibold shadow-xl ${
            saveToast.tone === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-700"
              : "border-red-200 bg-red-50 text-red-700"
          }`}
        >
          {saveToast.text}
        </div>
      )}

      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Content Management</h1>
          <p className="mt-1 text-sm text-slate-500">
            Edit the exact public Macroc website text and image URLs from this dashboard.
          </p>
        </div>

        <button
          type="button"
          onClick={handleReset}
          className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
        >
          Reset To Macroc Website Content
        </button>
      </div>

      {message && (
        <div className="rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm font-medium text-blue-700">
          {message}
        </div>
      )}

      {loading && (
        <div className="rounded-xl border border-amber-100 bg-amber-50 px-4 py-3 text-sm text-amber-700">
          Loading saved homepage content...
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <Section title="Theme Colors">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
              <h4 className="font-semibold text-slate-800">Light Mode</h4>
              <Field label="Background Color">
                <input type="color" className="h-10 w-full cursor-pointer rounded-lg border-slate-300" value={formData.colors.light.background} onChange={(e) => setFormData({ ...formData, colors: { ...formData.colors, light: { ...formData.colors.light, background: e.target.value } } })} />
              </Field>
              <Field label="Foreground Text Color">
                <input type="color" className="h-10 w-full cursor-pointer rounded-lg border-slate-300" value={formData.colors.light.foreground} onChange={(e) => setFormData({ ...formData, colors: { ...formData.colors, light: { ...formData.colors.light, foreground: e.target.value } } })} />
              </Field>
              <Field label="Primary Accent Color">
                <input type="color" className="h-10 w-full cursor-pointer rounded-lg border-slate-300" value={formData.colors.light.primary} onChange={(e) => setFormData({ ...formData, colors: { ...formData.colors, light: { ...formData.colors.light, primary: e.target.value } } })} />
              </Field>
              <Field label="Card Background Color">
                <input type="color" className="h-10 w-full cursor-pointer rounded-lg border-slate-300" value={formData.colors.light.cardBg} onChange={(e) => setFormData({ ...formData, colors: { ...formData.colors, light: { ...formData.colors.light, cardBg: e.target.value } } })} />
              </Field>
              <Field label="Border Color">
                <input type="color" className="h-10 w-full cursor-pointer rounded-lg border-slate-300" value={formData.colors.light.borderColor} onChange={(e) => setFormData({ ...formData, colors: { ...formData.colors, light: { ...formData.colors.light, borderColor: e.target.value } } })} />
              </Field>
            </div>

            <div className="space-y-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
              <h4 className="font-semibold text-slate-800">Dark Mode</h4>
              <Field label="Background Color">
                <input type="color" className="h-10 w-full cursor-pointer rounded-lg border-slate-300" value={formData.colors.dark.background} onChange={(e) => setFormData({ ...formData, colors: { ...formData.colors, dark: { ...formData.colors.dark, background: e.target.value } } })} />
              </Field>
              <Field label="Foreground Text Color">
                <input type="color" className="h-10 w-full cursor-pointer rounded-lg border-slate-300" value={formData.colors.dark.foreground} onChange={(e) => setFormData({ ...formData, colors: { ...formData.colors, dark: { ...formData.colors.dark, foreground: e.target.value } } })} />
              </Field>
              <Field label="Primary Accent Color">
                <input type="color" className="h-10 w-full cursor-pointer rounded-lg border-slate-300" value={formData.colors.dark.primary} onChange={(e) => setFormData({ ...formData, colors: { ...formData.colors, dark: { ...formData.colors.dark, primary: e.target.value } } })} />
              </Field>
              <Field label="Card Background Color">
                <input type="color" className="h-10 w-full cursor-pointer rounded-lg border-slate-300" value={formData.colors.dark.cardBg} onChange={(e) => setFormData({ ...formData, colors: { ...formData.colors, dark: { ...formData.colors.dark, cardBg: e.target.value } } })} />
              </Field>
              <Field label="Border Color">
                <input type="color" className="h-10 w-full cursor-pointer rounded-lg border-slate-300" value={formData.colors.dark.borderColor} onChange={(e) => setFormData({ ...formData, colors: { ...formData.colors, dark: { ...formData.colors.dark, borderColor: e.target.value } } })} />
              </Field>
            </div>
          </div>
        </Section>

        <Section title="SEO">
          <Field label="Website Font Style">
            <select
              className={inputClassName}
              value={formData.typography.fontStyle}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  typography: {
                    ...formData.typography,
                    fontStyle: e.target.value as "professional" | "modern" | "classic",
                  },
                })
              }
            >
              <option value="professional">Professional (Recommended)</option>
              <option value="modern">Modern</option>
              <option value="classic">Classic</option>
            </select>
          </Field>
          <Field label="Page Title">
            <input className={inputClassName} value={formData.seo.title} onChange={(e) => setFormData({ ...formData, seo: { ...formData.seo, title: e.target.value } })} />
          </Field>
          <Field label="Meta Description">
            <textarea className={textareaClassName} value={formData.seo.description} onChange={(e) => setFormData({ ...formData, seo: { ...formData.seo, description: e.target.value } })} />
          </Field>
          <Field label="Keywords">
            <textarea className={textareaClassName} value={formData.seo.keywords} onChange={(e) => setFormData({ ...formData, seo: { ...formData.seo, keywords: e.target.value } })} />
          </Field>
          <Field label="Open Graph Title">
            <input className={inputClassName} value={formData.seo.ogTitle} onChange={(e) => setFormData({ ...formData, seo: { ...formData.seo, ogTitle: e.target.value } })} />
          </Field>
          <Field label="Open Graph Description">
            <textarea className={textareaClassName} value={formData.seo.ogDescription} onChange={(e) => setFormData({ ...formData, seo: { ...formData.seo, ogDescription: e.target.value } })} />
          </Field>
          <ImageUrlField
            label="Open Graph Image URL"
            value={formData.seo.ogImage}
            onUrlChange={(value) => setFormData({ ...formData, seo: { ...formData.seo, ogImage: value } })}
          />
        </Section>

        <Section title="Header">
          <Field label="Company Name">
            <input className={inputClassName} value={formData.header.companyName} onChange={(e) => setFormData({ ...formData, header: { ...formData.header, companyName: e.target.value } })} />
          </Field>
          <Field label="Tagline">
            <input className={inputClassName} value={formData.header.tagline} onChange={(e) => setFormData({ ...formData, header: { ...formData.header, tagline: e.target.value } })} />
          </Field>
          <Field label="Tagline Color">
            <input
              type="color"
              className="h-11 w-24 rounded-lg border border-slate-300 bg-white px-2 py-1"
              value={formData.header.taglineColor || "#fcd34d"}
              onChange={(e) =>
                setFormData({ ...formData, header: { ...formData.header, taglineColor: e.target.value } })
              }
            />
          </Field>
          <Field label="Logo Text Fallback">
            <input className={inputClassName} value={formData.header.logoText} onChange={(e) => setFormData({ ...formData, header: { ...formData.header, logoText: e.target.value } })} />
          </Field>
          <ImageUrlField
            label="Logo Image URL"
            value={formData.header.logoImage}
            onUrlChange={(value) => setFormData({ ...formData, header: { ...formData.header, logoImage: value } })}
          />
          <Field label="Login Button Text">
            <input className={inputClassName} value={formData.header.loginButtonText} onChange={(e) => setFormData({ ...formData, header: { ...formData.header, loginButtonText: e.target.value } })} />
          </Field>
          <Field label="Navigation Links (one per line: Label | #anchor)">
            <textarea className={textareaClassName} value={navToMultiline(formData.header.navLinks)} onChange={(e) => setFormData({ ...formData, header: { ...formData.header, navLinks: navFromMultiline(e.target.value) } })} />
          </Field>
        </Section>

        <Section title="Hero Section">
          <Field label="Eyebrow">
            <input className={inputClassName} value={formData.hero.eyebrow} onChange={(e) => setFormData({ ...formData, hero: { ...formData.hero, eyebrow: e.target.value } })} />
          </Field>
          <Field label="Title">
            <input className={inputClassName} value={formData.hero.title} onChange={(e) => setFormData({ ...formData, hero: { ...formData.hero, title: e.target.value } })} />
          </Field>
          <Field label="Highlighted Word In Title">
            <input className={inputClassName} value={formData.hero.highlight} onChange={(e) => setFormData({ ...formData, hero: { ...formData.hero, highlight: e.target.value } })} />
          </Field>
          <Field label="Description">
            <textarea className={textareaClassName} value={formData.hero.description} onChange={(e) => setFormData({ ...formData, hero: { ...formData.hero, description: e.target.value } })} />
          </Field>
          <Field label="Primary Button Text">
            <input className={inputClassName} value={formData.hero.primaryButtonText} onChange={(e) => setFormData({ ...formData, hero: { ...formData.hero, primaryButtonText: e.target.value } })} />
          </Field>
          <Field label="Primary Button Link">
            <input className={inputClassName} value={formData.hero.primaryButtonHref} onChange={(e) => setFormData({ ...formData, hero: { ...formData.hero, primaryButtonHref: e.target.value } })} />
          </Field>
          <Field label="Secondary Button Text">
            <input className={inputClassName} value={formData.hero.secondaryButtonText} onChange={(e) => setFormData({ ...formData, hero: { ...formData.hero, secondaryButtonText: e.target.value } })} />
          </Field>
          <Field label="Secondary Button Link">
            <input className={inputClassName} value={formData.hero.secondaryButtonHref} onChange={(e) => setFormData({ ...formData, hero: { ...formData.hero, secondaryButtonHref: e.target.value } })} />
          </Field>
          <Field label="Trust Label">
            <input className={inputClassName} value={formData.hero.trustLabel} onChange={(e) => setFormData({ ...formData, hero: { ...formData.hero, trustLabel: e.target.value } })} />
          </Field>
          <Field label="Trusted Items (one per line)">
            <textarea className={textareaClassName} value={toMultiline(formData.hero.trustItems)} onChange={(e) => setFormData({ ...formData, hero: { ...formData.hero, trustItems: fromMultiline(e.target.value) } })} />
          </Field>
          <ImageUrlField
            label="Hero Background Image URL"
            value={formData.hero.backgroundImage}
            onUrlChange={(value) => setFormData({ ...formData, hero: { ...formData.hero, backgroundImage: value } })}
          />
          <Field label="Hero Content Spacing">
            <select
              className={inputClassName}
              value={formData.hero.contentSpacing || "tight"}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  hero: { ...formData.hero, contentSpacing: e.target.value as "tight" | "normal" | "relaxed" },
                })
              }
            >
              <option value="tight">Tight</option>
              <option value="normal">Normal</option>
              <option value="relaxed">Relaxed</option>
            </select>
          </Field>
        </Section>

        <Section title="Services Section" id="services-content">
          <p className="rounded-lg border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-blue-700">
            The description you edit for each service here is the exact text clients will see after clicking that service on the website. Adding or removing a service here will also update the client contact dropdown automatically after you save.
          </p>
          <Field label="Section Title">
            <input className={inputClassName} value={formData.services.title} onChange={(e) => setFormData({ ...formData, services: { ...formData.services, title: e.target.value } })} />
          </Field>
          <Field label="Section Subtitle">
            <textarea className={textareaClassName} value={formData.services.subtitle} onChange={(e) => setFormData({ ...formData, services: { ...formData.services, subtitle: e.target.value } })} />
          </Field>
          <Field label="Service Detail Page Label">
            <input className={inputClassName} value={formData.services.detailTitle} onChange={(e) => setFormData({ ...formData, services: { ...formData.services, detailTitle: e.target.value } })} />
          </Field>
          <Field label="Request Button Text">
            <input className={inputClassName} value={formData.services.requestButtonText} onChange={(e) => setFormData({ ...formData, services: { ...formData.services, requestButtonText: e.target.value } })} />
          </Field>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={addServiceItem}
              className="rounded-lg bg-slate-800 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-900"
            >
              Add Service
            </button>
          </div>
          <div className="space-y-4">
            {formData.services.items.map((item, index) => (
              <div key={`service-item-${index}`} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <h3 className="text-sm font-semibold text-slate-800">Service {index + 1}</h3>
                  <button
                    type="button"
                    onClick={() => removeServiceItem(index)}
                    className="rounded-lg border border-red-200 bg-white px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
                  >
                    Remove
                  </button>
                </div>
                <Field label={`Service ${index + 1} Title`}>
                  <input
                    className={inputClassName}
                    value={item.title}
                    onChange={(e) => updateServiceItem(index, "title", e.target.value)}
                  />
                </Field>
                <Field label={`Service ${index + 1} Description`}>
                  <textarea
                    className="min-h-[180px] w-full rounded-lg border border-slate-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={item.desc}
                    onChange={(e) => updateServiceItem(index, "desc", e.target.value)}
                  />
                </Field>
              </div>
            ))}
          </div>
        </Section>

        <Section title="About Section">
          <Field label="Section Title">
            <input className={inputClassName} value={formData.about.title} onChange={(e) => setFormData({ ...formData, about: { ...formData.about, title: e.target.value } })} />
          </Field>
          <Field label="Description">
            <textarea className={textareaClassName} value={formData.about.description} onChange={(e) => setFormData({ ...formData, about: { ...formData.about, description: e.target.value } })} />
          </Field>
          <Field label="Bullet Points (one per line)">
            <textarea className={textareaClassName} value={toMultiline(formData.about.bullets)} onChange={(e) => setFormData({ ...formData, about: { ...formData.about, bullets: fromMultiline(e.target.value) } })} />
          </Field>
          <Field label="Approach Card Title">
            <input className={inputClassName} value={formData.about.approachTitle} onChange={(e) => setFormData({ ...formData, about: { ...formData.about, approachTitle: e.target.value } })} />
          </Field>
          <Field label="Approach Card Text">
            <input className={inputClassName} value={formData.about.approachText} onChange={(e) => setFormData({ ...formData, about: { ...formData.about, approachText: e.target.value } })} />
          </Field>
        </Section>

        <Section title="Contact Section">
          <Field label="Section Title">
            <input className={inputClassName} value={formData.contact.title} onChange={(e) => setFormData({ ...formData, contact: { ...formData.contact, title: e.target.value } })} />
          </Field>
          <Field label="Section Subtitle">
            <textarea className={textareaClassName} value={formData.contact.subtitle} onChange={(e) => setFormData({ ...formData, contact: { ...formData.contact, subtitle: e.target.value } })} />
          </Field>
          <Field label="Form Action URL">
            <input className={inputClassName} value={formData.contact.formAction} onChange={(e) => setFormData({ ...formData, contact: { ...formData.contact, formAction: e.target.value } })} />
          </Field>
          <Field label="Name Field Label">
            <input className={inputClassName} value={formData.contact.formFields.nameLabel} onChange={(e) => setFormData({ ...formData, contact: { ...formData.contact, formFields: { ...formData.contact.formFields, nameLabel: e.target.value } } })} />
          </Field>
          <Field label="Name Placeholder">
            <input className={inputClassName} value={formData.contact.formFields.namePlaceholder} onChange={(e) => setFormData({ ...formData, contact: { ...formData.contact, formFields: { ...formData.contact.formFields, namePlaceholder: e.target.value } } })} />
          </Field>
          <Field label="Email Field Label">
            <input className={inputClassName} value={formData.contact.formFields.emailLabel} onChange={(e) => setFormData({ ...formData, contact: { ...formData.contact, formFields: { ...formData.contact.formFields, emailLabel: e.target.value } } })} />
          </Field>
          <Field label="Email Placeholder">
            <input className={inputClassName} value={formData.contact.formFields.emailPlaceholder} onChange={(e) => setFormData({ ...formData, contact: { ...formData.contact, formFields: { ...formData.contact.formFields, emailPlaceholder: e.target.value } } })} />
          </Field>
          <Field label="Mobile Field Label">
            <input className={inputClassName} value={formData.contact.formFields.mobileLabel} onChange={(e) => setFormData({ ...formData, contact: { ...formData.contact, formFields: { ...formData.contact.formFields, mobileLabel: e.target.value } } })} />
          </Field>
          <Field label="Mobile Placeholder">
            <input className={inputClassName} value={formData.contact.formFields.mobilePlaceholder} onChange={(e) => setFormData({ ...formData, contact: { ...formData.contact, formFields: { ...formData.contact.formFields, mobilePlaceholder: e.target.value } } })} />
          </Field>
          <Field label="Service Dropdown Label">
            <input className={inputClassName} value={formData.contact.formFields.serviceLabel} onChange={(e) => setFormData({ ...formData, contact: { ...formData.contact, formFields: { ...formData.contact.formFields, serviceLabel: e.target.value } } })} />
          </Field>
          <Field label="Message Field Label">
            <input className={inputClassName} value={formData.contact.formFields.messageLabel} onChange={(e) => setFormData({ ...formData, contact: { ...formData.contact, formFields: { ...formData.contact.formFields, messageLabel: e.target.value } } })} />
          </Field>
          <Field label="Message Placeholder">
            <textarea className={textareaClassName} value={formData.contact.formFields.messagePlaceholder} onChange={(e) => setFormData({ ...formData, contact: { ...formData.contact, formFields: { ...formData.contact.formFields, messagePlaceholder: e.target.value } } })} />
          </Field>
          <Field label="Submit Button Text">
            <input className={inputClassName} value={formData.contact.formFields.buttonText} onChange={(e) => setFormData({ ...formData, contact: { ...formData.contact, formFields: { ...formData.contact.formFields, buttonText: e.target.value } } })} />
          </Field>
          <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
            Service dropdown options are now managed automatically from the Services section above.
          </div>
          <Field label="Office Card Title">
            <input className={inputClassName} value={formData.contact.officeTitle} onChange={(e) => setFormData({ ...formData, contact: { ...formData.contact, officeTitle: e.target.value } })} />
          </Field>
          <Field label="Contact Email">
            <input className={inputClassName} value={formData.contact.email} onChange={(e) => setFormData({ ...formData, contact: { ...formData.contact, email: e.target.value } })} />
          </Field>
          <Field label="Phone">
            <input className={inputClassName} value={formData.contact.phone} onChange={(e) => setFormData({ ...formData, contact: { ...formData.contact, phone: e.target.value } })} />
          </Field>
          <Field label="Address">
            <textarea className={textareaClassName} value={formData.contact.address} onChange={(e) => setFormData({ ...formData, contact: { ...formData.contact, address: e.target.value } })} />
          </Field>
          <Field label="Why Choose Us Title">
            <input className={inputClassName} value={formData.contact.whyChooseTitle} onChange={(e) => setFormData({ ...formData, contact: { ...formData.contact, whyChooseTitle: e.target.value } })} />
          </Field>
          <Field label="Why Choose Us Items (one per line)">
            <textarea className={textareaClassName} value={toMultiline(formData.contact.whyChooseItems)} onChange={(e) => setFormData({ ...formData, contact: { ...formData.contact, whyChooseItems: fromMultiline(e.target.value) } })} />
          </Field>
        </Section>

        <Section title="WhatsApp">
          <Field label="Floating WhatsApp Enabled">
            <label className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
              <input
                type="checkbox"
                checked={formData.whatsapp.enabled}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    whatsapp: { ...formData.whatsapp, enabled: e.target.checked },
                  })
                }
              />
              <span className="text-sm text-slate-700">
                Show a floating WhatsApp button on the public website
              </span>
            </label>
          </Field>
          <Field label="WhatsApp Number">
            <input
              className={inputClassName}
              value={formData.whatsapp.phoneNumber}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  whatsapp: { ...formData.whatsapp, phoneNumber: e.target.value },
                })
              }
              placeholder="919876543210"
            />
          </Field>
          <Field label="WhatsApp Button Label">
            <input
              className={inputClassName}
              value={formData.whatsapp.buttonLabel}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  whatsapp: { ...formData.whatsapp, buttonLabel: e.target.value },
                })
              }
            />
          </Field>
          <Field label="WhatsApp Auto Message">
            <textarea
              className={textareaClassName}
              value={formData.whatsapp.message}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  whatsapp: { ...formData.whatsapp, message: e.target.value },
                })
              }
            />
          </Field>
        </Section>

        <Section title="Call Button">
          <Field label="Floating Call Button Enabled">
            <label className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
              <input
                type="checkbox"
                checked={formData.call.enabled}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    call: { ...formData.call, enabled: e.target.checked },
                  })
                }
              />
              <span className="text-sm text-slate-700">
                Show a floating call button on the public website
              </span>
            </label>
          </Field>
          <Field label="Call Number">
            <input
              className={inputClassName}
              value={formData.call.phoneNumber}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  call: { ...formData.call, phoneNumber: e.target.value },
                })
              }
              placeholder="9035437253"
            />
          </Field>
          <Field label="Call Button Label">
            <input
              className={inputClassName}
              value={formData.call.buttonLabel}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  call: { ...formData.call, buttonLabel: e.target.value },
                })
              }
            />
          </Field>
        </Section>

        <Section title="Footer">
          <Field label="Copyright Text">
            <input className={inputClassName} value={formData.footer.copyright} onChange={(e) => setFormData({ ...formData, footer: { ...formData.footer, copyright: e.target.value } })} />
          </Field>
          <Field label="Footer Note">
            <input className={inputClassName} value={formData.footer.note} onChange={(e) => setFormData({ ...formData, footer: { ...formData.footer, note: e.target.value } })} />
          </Field>
        </Section>

        <div className="flex justify-end">
          <button className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white shadow-md transition hover:bg-blue-700">
            Save Homepage Changes
          </button>
        </div>
      </form>
    </div>
  );
}
