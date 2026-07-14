import Link from "next/link";
import Image from "next/image";

export default function MarketingLogo({
  className = "",
  compact = false,
  variant = "header",
  locale = "es",
}: {
  className?: string;
  compact?: boolean;
  variant?: "header" | "footer";
  locale?: string;
}) {
  const logoSrc = variant === "header" ? "/images/TIB_B.png" : "/images/TIB.png";
  // Evitar url con doble barra si el locale no está definido
  const href = locale ? `/${locale}` : "/";
  return (
    <Link href={href} className={`inline-flex items-center gap-3 ${className}`} aria-label="Transfers in Barcelona inicio">
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
