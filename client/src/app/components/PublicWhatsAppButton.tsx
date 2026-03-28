type PublicWhatsAppButtonProps = {
  enabled: boolean;
  phoneNumber: string;
  message: string;
  buttonLabel: string;
};

function normalizePhoneNumber(phoneNumber: string) {
  return phoneNumber.replace(/\D/g, "");
}

function buildWhatsAppLink(phoneNumber: string, message: string) {
  const normalizedPhone = normalizePhoneNumber(phoneNumber);

  if (!normalizedPhone) {
    return "";
  }

  const encodedMessage = encodeURIComponent(message || "");
  return `https://wa.me/${normalizedPhone}${encodedMessage ? `?text=${encodedMessage}` : ""}`;
}

export default function PublicWhatsAppButton({
  enabled,
  phoneNumber,
  message,
  buttonLabel,
}: PublicWhatsAppButtonProps) {
  const href = buildWhatsAppLink(phoneNumber, message);

  if (!enabled || !href) {
    return null;
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={buttonLabel || "Chat on WhatsApp"}
      className="fixed bottom-6 right-6 z-50 flex min-h-[64px] items-center gap-3 rounded-full bg-[#25D366] px-4 py-3 text-sm font-semibold text-white shadow-2xl shadow-black/30 transition hover:scale-105 hover:bg-[#1fbd59]"
    >
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-[#25D366] shadow-md">
        <svg viewBox="0 0 24 24" className="h-6 w-6 fill-current" aria-hidden="true">
          <path d="M19.05 4.94A9.86 9.86 0 0 0 12.03 2C6.56 2 2.11 6.45 2.11 11.92c0 1.75.46 3.47 1.33 4.98L2 22l5.27-1.38a9.9 9.9 0 0 0 4.76 1.22h.01c5.47 0 9.92-4.45 9.92-9.92a9.85 9.85 0 0 0-2.91-6.98ZM12.04 20.16h-.01a8.22 8.22 0 0 1-4.19-1.14l-.3-.18-3.12.82.83-3.04-.2-.31a8.25 8.25 0 0 1-1.27-4.39c0-4.56 3.71-8.27 8.28-8.27 2.21 0 4.28.86 5.84 2.42a8.2 8.2 0 0 1 2.42 5.85c0 4.56-3.72 8.27-8.28 8.27Zm4.54-6.19c-.25-.12-1.47-.73-1.7-.82-.23-.08-.39-.12-.56.12-.17.25-.64.82-.79.99-.15.17-.29.19-.54.06-.25-.12-1.04-.38-1.98-1.22-.73-.65-1.22-1.45-1.36-1.7-.14-.25-.02-.39.11-.52.11-.11.25-.29.37-.43.12-.15.17-.25.25-.42.08-.17.04-.31-.02-.43-.06-.12-.56-1.34-.77-1.84-.2-.48-.4-.42-.56-.43h-.48c-.17 0-.43.06-.66.31-.23.25-.87.85-.87 2.07 0 1.22.89 2.4 1.01 2.57.12.17 1.75 2.67 4.25 3.74.59.26 1.05.41 1.41.52.59.19 1.12.16 1.54.1.47-.07 1.47-.6 1.68-1.18.21-.58.21-1.08.15-1.18-.05-.09-.22-.15-.46-.27Z" />
        </svg>
      </span>
      <span className="hidden md:inline">{buttonLabel || "Chat on WhatsApp"}</span>
    </a>
  );
}
