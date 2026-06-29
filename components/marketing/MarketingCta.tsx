import Link from "next/link";
import { ChevronRight } from "lucide-react";

export default function MarketingCta({
  eyebrow = "Reserva ahora",
  title = "Reserva online, rápido y con pago seguro",
  description = "Organiza tu traslado privado, tour o coche con chófer en Barcelona con una experiencia de reserva clara y confirmación del servicio.",
  href = "/booking",
  label = "Reservar ahora",
}: {
  eyebrow?: string;
  title?: string;
  description?: string;
  href?: string;
  label?: string;
}) {
  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-5xl rounded-3xl border border-gray-200 bg-white px-6 py-12 text-center shadow-md sm:px-12">
        <p className="mx-auto mb-5 inline-flex rounded-full bg-[#D4AF37]/10 px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-[#D4AF37]">
          {eyebrow}
        </p>
        <h2 className="text-3xl font-black tracking-tight text-gray-900 sm:text-4xl">{title}</h2>
        <p className="mx-auto mt-5 max-w-3xl text-base leading-8 text-gray-700">{description}</p>
        <Link
          href={href}
          className="mt-7 inline-flex h-14 items-center justify-center gap-2 rounded-full bg-[#D4AF37] px-9 text-base font-black text-gray-900 shadow-md transition hover:bg-[#C5A059]"
        >
          {label}
          <ChevronRight className="h-5 w-5" aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}
