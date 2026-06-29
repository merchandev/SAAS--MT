import Link from "next/link";

export default function MarketingLogo({
  className = "",
  compact = false,
}: {
  className?: string;
  compact?: boolean;
}) {
  return (
    <Link href="/" className={`inline-flex items-center gap-3 ${className}`} aria-label="MeTransfers inicio">
      <span className="relative flex h-11 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full border border-white/20 bg-white">
        <span className="absolute bottom-2 left-2 h-7 w-12 rounded-[100%] border-t-[10px] border-[#082141]" />
        <span className="absolute bottom-4 left-4 h-5 w-10 rounded-[100%] border-t-[6px] border-[#082141]/70" />
      </span>
      {!compact && (
        <span className="leading-none text-white">
          <span className="block text-lg font-black tracking-tight">MeTransfers</span>
          <span className="block text-[10px] font-semibold uppercase tracking-[0.18em] text-white/70">
            Barcelona
          </span>
        </span>
      )}
    </Link>
  );
}
