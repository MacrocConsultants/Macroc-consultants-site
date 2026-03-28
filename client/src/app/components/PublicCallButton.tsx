type PublicCallButtonProps = {
  enabled: boolean;
  phoneNumber: string;
  buttonLabel: string;
};

function normalizePhoneNumber(phoneNumber: string) {
  return phoneNumber.replace(/[^\d+]/g, "");
}

export default function PublicCallButton({
  enabled,
  phoneNumber,
  buttonLabel,
}: PublicCallButtonProps) {
  const normalizedPhone = normalizePhoneNumber(phoneNumber);

  if (!enabled || !normalizedPhone) {
    return null;
  }

  return (
    <a
      href={`tel:${normalizedPhone}`}
      aria-label={buttonLabel || "Call Now"}
      className="fixed bottom-24 right-6 z-50 flex min-h-[64px] items-center gap-3 rounded-full border border-[#fcd34d]/40 bg-[#0f172a] px-4 py-3 text-sm font-semibold text-[#fcd34d] shadow-2xl shadow-black/30 transition hover:scale-105 hover:bg-[#1e293b]"
    >
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#fcd34d] text-[#0f172a] shadow-md">
        <svg viewBox="0 0 24 24" className="h-6 w-6 fill-current" aria-hidden="true">
          <path d="M6.62 10.79a15.54 15.54 0 0 0 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.56 0 1 .45 1 1V20c0 .55-.44 1-1 1C10.07 21 3 13.93 3 5c0-.55.45-1 1-1h3.5c.55 0 1 .44 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2Z" />
        </svg>
      </span>
      <span className="hidden md:inline">{buttonLabel || "Call Now"}</span>
    </a>
  );
}
