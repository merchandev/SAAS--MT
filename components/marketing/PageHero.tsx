import MarketingHeader from "./MarketingHeader";

export default function PageHero({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <section className="relative overflow-hidden bg-gray-50 pt-36 pb-20 text-gray-900 sm:pt-44 sm:pb-24">
      <MarketingHeader />
      <div className="relative mx-auto max-w-5xl px-6 text-center">
        <p className="mx-auto mb-6 inline-flex rounded-full border border-gray-200 bg-white px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-gray-600">
          {eyebrow}
        </p>
        <h1 className="text-4xl font-black tracking-tight sm:text-6xl">{title}</h1>
        <p className="mx-auto mt-6 max-w-3xl text-lg font-medium leading-8 text-gray-600">{description}</p>
      </div>
    </section>
  );
}
