export type NavLink = { label: string; href: string };
export type ServiceItem = { title: string; desc: string };

export type ThemeColors = {
  background: string;
  foreground: string;
  primary: string;
  cardBg: string;
  borderColor: string;
};

export type HomepageContent = {
  colors: {
    light: ThemeColors;
    dark: ThemeColors;
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

export const defaultContent: HomepageContent = {
  colors: {
    light: {
      background: "#eff6ff", // blue-50
      foreground: "#1e3a8a", // blue-900
      primary: "#10b981",    // emerald-500
      cardBg: "#ffffff",     // white
      borderColor: "#bfdbfe",// blue-200
    },
    dark: {
      background: "#000000", // black
      foreground: "#ffffff", // white
      primary: "#FFD700",    // gold
      cardBg: "#1a1a1a",     // dark gray
      borderColor: "#333333",// dark border
    },
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
    note: "Built for clarity Â· Powered by Vercel",
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

export function mergeContent(data: Partial<HomepageContent> | null | undefined): HomepageContent {
  return {
    ...defaultContent,
    ...data,
    colors: {
      light: { ...defaultContent.colors.light, ...(data?.colors?.light || {}) },
      dark: { ...defaultContent.colors.dark, ...(data?.colors?.dark || {}) },
    },
    typography: { ...defaultContent.typography, ...(data?.typography || {}) },
    seo: { ...defaultContent.seo, ...(data?.seo || {}) },
    header: { ...defaultContent.header, ...(data?.header || {}) },
    hero: { ...defaultContent.hero, ...(data?.hero || {}) },
    services: {
      ...defaultContent.services,
      ...(data?.services || {}),
      detailTitle: data?.services?.detailTitle || defaultContent.services.detailTitle,
      requestButtonText:
        data?.services?.requestButtonText || defaultContent.services.requestButtonText,
      items: mergeServiceItems(data?.services?.items, defaultContent.services.items),
    },
    about: { ...defaultContent.about, ...(data?.about || {}) },
    contact: {
      ...defaultContent.contact,
      ...(data?.contact || {}),
      formFields: {
        ...defaultContent.contact.formFields,
        ...(data?.contact?.formFields || {}),
      },
      serviceOptions: mergeStringOptions(
        data?.contact?.serviceOptions,
        defaultContent.contact.serviceOptions
      ),
      whyChooseItems:
        Array.isArray(data?.contact?.whyChooseItems) && data?.contact?.whyChooseItems.length > 0
          ? data.contact.whyChooseItems
          : defaultContent.contact.whyChooseItems,
    },
    whatsapp: { ...defaultContent.whatsapp, ...(data?.whatsapp || {}) },
    call: { ...defaultContent.call, ...(data?.call || {}) },
    footer: { ...defaultContent.footer, ...(data?.footer || {}) },
  };
}

export function slugifyServiceTitle(title: string) {
  return title
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function findServiceBySlug(items: ServiceItem[], slug: string) {
  return items.find((item) => slugifyServiceTitle(item.title) === slug);
}
