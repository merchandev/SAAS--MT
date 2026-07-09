import Link from "next/link";
import Image from "next/image";
import { localizedPath } from "@/lib/i18n-utils";

export default function MarketingLogo({
  className = "",
  compact = false,
  variant = "header",
}: {
  className?: string;
  compact?: boolean;
  variant?: "header" | "footer";
}) {
  const logoSrc = variant === "header" ? "/images/MT-MeTransfers.png" : "/images/MeTransfers-exp.png";
  return (
    <Link href={localizedPath("/")} className={`inline-flex items-center gap-3 ${className}`} aria-label="Transfers in Barcelona inicio">
      <Image 
        src={logoSrc}
        alt="Transfers in Barcelona" 
        width={176}
        height={41}
        className="object-contain object-left" 
        priority={variant === "header"}
      />
    </Link>
  );
}
