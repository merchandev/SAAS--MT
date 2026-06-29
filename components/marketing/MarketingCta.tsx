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
      <div className="mx-auto max-w-5xl rounded-3xl border border-blue-100 bg-white px-6 py-12 text-center shadow-xl shadow-blue-100/70 sm:px-12">
        <p className="mx-auto mb-5 inline-flex rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-[#075cbe]">
          {eyebrow}
        </p>
        <h2 className="text-3xl font-black tracking-tight text-[#07509f] sm:text-4xl">{title}</h2>
        <p className="mx-auto mt-5 max-w-3xl text-base leading-8 text-[#082141]/80">{description}</p>
        <Link
          href={href}
          className="mt-7 inline-flex h-14 items-center justify-center gap-2 rounded-full bg-[#0868d8] px-9 text-base font-black text-white shadow-xl shadow-blue-200 transition hover:bg-[#075cbe]"
        >
          {label}
          <ChevronRight className="h-5 w-5" aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}
