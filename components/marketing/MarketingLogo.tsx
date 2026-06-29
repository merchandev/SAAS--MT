import Link from "next/link";
import Image from "next/image";

export default function MarketingLogo({
  className = "",
  compact = false,
}: {
  className?: string;
  compact?: boolean;
}) {
  return (
    <Link href="/" className={`inline-flex items-center gap-3 ${className}`} aria-label="MeTransfers inicio">
      <div className="relative h-11 w-44">
        <Image 
          src="/logo.png" 
          alt="MeTransfers Barcelona" 
          fill 
          className="object-contain object-left" 
          priority 
        />
      </div>
    </Link>
  );
}
