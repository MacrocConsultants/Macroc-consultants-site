const Content = require("../models/Content");

const defaultHomepageContent = () => ({
  assets: {
    seoOgImage: { fileId: "", fileName: "", url: "" },
    headerLogoImage: { fileId: "", fileName: "", url: "" },
    heroBackgroundImage: { fileId: "", fileName: "", url: "" },
    heroSideImage: { fileId: "", fileName: "", url: "" },
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
    trustItems: [
      "GST",
      "Income Tax",
      "Virtual CFO",
      "Payroll",
      "Compliances",
      "ROC Services",
    ],
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
    note: "Built for clarity · Powered by Vercel",
  },
});

const mergeServiceItems = (savedItems = [], defaultItems = []) => {
  if (!Array.isArray(savedItems) || savedItems.length === 0) {
    return defaultItems;
  }

  const mergedItems = [];
  const existingTitles = new Set();

  savedItems.forEach((item) => {
    const normalizedTitle = item?.title?.trim().toLowerCase();
    if (!normalizedTitle || existingTitles.has(normalizedTitle)) {
      return;
    }

    existingTitles.add(normalizedTitle);
    mergedItems.push(item);
  });

  defaultItems.forEach((item) => {
    const normalizedTitle = item?.title?.trim().toLowerCase();
    if (normalizedTitle && !existingTitles.has(normalizedTitle)) {
      existingTitles.add(normalizedTitle);
      mergedItems.push(item);
    }
  });

  return mergedItems;
};

const mergeStringOptions = (savedOptions = [], defaultOptions = []) => {
  if (!Array.isArray(savedOptions) || savedOptions.length === 0) {
    return defaultOptions;
  }

  const mergedOptions = [];
  const existingOptions = new Set();

  savedOptions.forEach((item) => {
    const normalized = String(item || "").trim().toLowerCase();
    if (!normalized || existingOptions.has(normalized)) {
      return;
    }

    existingOptions.add(normalized);
    mergedOptions.push(item);
  });

  defaultOptions.forEach((item) => {
    const normalized = String(item || "").trim().toLowerCase();
    if (normalized && !existingOptions.has(normalized)) {
      existingOptions.add(normalized);
      mergedOptions.push(item);
    }
  });

  return mergedOptions;
};

const mergeWithDefaults = (savedData = {}) => {
  const defaults = defaultHomepageContent();

  return {
    ...defaults,
    ...savedData,
    assets: {
      ...defaults.assets,
      ...(savedData.assets || {}),
    },
    seo: { ...defaults.seo, ...(savedData.seo || {}) },
    header: { ...defaults.header, ...(savedData.header || {}) },
    hero: { ...defaults.hero, ...(savedData.hero || {}) },
    services: {
      ...defaults.services,
      ...(savedData.services || {}),
      detailTitle:
        savedData.services?.detailTitle || defaults.services.detailTitle,
      requestButtonText:
        savedData.services?.requestButtonText || defaults.services.requestButtonText,
      items: mergeServiceItems(savedData.services?.items, defaults.services.items),
    },
    about: { ...defaults.about, ...(savedData.about || {}) },
    contact: {
      ...defaults.contact,
      ...(savedData.contact || {}),
      formFields: {
        ...defaults.contact.formFields,
        ...(savedData.contact?.formFields || {}),
      },
      serviceOptions: mergeStringOptions(
        savedData.contact?.serviceOptions,
        defaults.contact.serviceOptions
      ),
      whyChooseItems: Array.isArray(savedData.contact?.whyChooseItems)
        ? savedData.contact.whyChooseItems
        : defaults.contact.whyChooseItems,
    },
    whatsapp: {
      ...defaults.whatsapp,
      ...(savedData.whatsapp || {}),
    },
    call: {
      ...defaults.call,
      ...(savedData.call || {}),
    },
    footer: { ...defaults.footer, ...(savedData.footer || {}) },
  };
};

const normalizeLegacyDocument = (content) => {
  if (content?.data) {
    return mergeWithDefaults(content.data);
  }

  if (!content) {
    return defaultHomepageContent();
  }

  return defaultHomepageContent();
};

exports.getContent = async (req, res) => {
  try {
    const content = await Content.findById(req.params.id).lean();
    res.json(normalizeLegacyDocument(content));
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

exports.updateContent = async (req, res) => {
  try {
    const normalized = mergeWithDefaults(req.body || {});
    const updatedContent = await Content.findByIdAndUpdate(
      req.params.id,
      { data: normalized },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    ).lean();

    res.json(normalizeLegacyDocument(updatedContent));
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};
