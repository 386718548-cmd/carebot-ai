'use client';

export function ClinicalBackdrop() {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none overflow-hidden z-0"
    >
      {/* Soft glows (warm + sage) */}
      <div className="absolute -top-48 -left-48 h-[520px] w-[520px] rounded-full bg-warm-100/60 blur-[120px]" />
      <div className="absolute -bottom-56 -right-56 h-[620px] w-[620px] rounded-full bg-sage-50/70 blur-[140px]" />
      <div className="absolute top-1/3 right-[-12rem] h-[420px] w-[420px] rounded-full bg-lilac-50/70 blur-[130px]" />

      {/* Subtle clinical grid + “ECG-ish” lines */}
      <div className="absolute inset-0 opacity-[0.055] [background-image:linear-gradient(to_right,rgba(58,43,49,0.12)_1px,transparent_1px),linear-gradient(to_bottom,rgba(58,43,49,0.12)_1px,transparent_1px)] [background-size:44px_44px]" />
      <div className="absolute inset-0 opacity-[0.06] [background-image:repeating-linear-gradient(115deg,rgba(255,183,197,0.55)_0px,rgba(255,183,197,0.55)_1px,transparent_1px,transparent_42px)]" />
      <div className="absolute inset-0 opacity-[0.045] [background-image:radial-gradient(circle_at_20%_25%,rgba(143,211,173,0.35)_0px,rgba(143,211,173,0.35)_1px,transparent_1px),radial-gradient(circle_at_70%_60%,rgba(255,183,197,0.35)_0px,rgba(255,183,197,0.35)_1px,transparent_1px)] [background-size:120px_120px]" />
    </div>
  );
}

