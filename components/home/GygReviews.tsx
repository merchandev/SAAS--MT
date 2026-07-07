import React from 'react';
import { Star, ExternalLink } from 'lucide-react';
import Link from 'next/link';

interface Review {
  id: string;
  author: string;
  initial: string;
  date: string;
  rating: number;
  description: string;
  color: string;
}

const reviews: Review[] = [
  {
    id: '1',
    author: 'Elena M.',
    initial: 'E',
    color: 'bg-slate-800',
    date: 'Mayo 2026',
    rating: 5,
    description: 'Servicio impecable desde el aeropuerto hasta el hotel. El conductor nos estaba esperando con un cartel y nos ayudó con todo el equipaje. Coche premium y muy limpio.'
  },
  {
    id: '2',
    author: 'Carlos T.',
    initial: 'C',
    color: 'bg-slate-800',
    date: 'Abril 2026',
    rating: 5,
    description: 'Contratamos el transfer para ir desde nuestro hotel en Barcelona al puerto de cruceros. Puntualidad británica y un trato exquisito. Repetiremos sin duda.'
  },
  {
    id: '3',
    author: 'María y José',
    initial: 'M',
    color: 'bg-slate-800',
    date: 'Marzo 2026',
    rating: 5,
    description: 'Reservamos un coche con chófer para ir a Montserrat. La experiencia fue de 10. Conducción muy suave y un conductor muy amable. Totalmente recomendable.'
  }
];

export default function GygReviews() {
  return (
    <section className="bg-white py-20 sm:py-24 border-y border-gray-100">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <p className="mb-3 text-sm font-semibold uppercase text-[#D4AF37]">Reseñas verificadas</p>
          <h2 className="text-3xl font-semibold tracking-tight text-gray-950 sm:text-4xl">
            La experiencia de nuestros clientes
          </h2>
          <p className="mt-4 text-lg leading-8 text-gray-600">
            Valoraciones reales de viajeros que ya han confiado en nuestro servicio de traslado privado.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {reviews.map((review) => (
            <div 
              key={review.id}
              className="flex flex-col rounded-2xl border border-gray-100 bg-white p-8 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="mb-6 flex items-center gap-4">
                <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-base font-bold text-white ${review.color}`}>
                  {review.initial}
                </div>
                <div>
                  <h3 className="text-base font-semibold text-gray-900">{review.author}</h3>
                  <p className="text-sm text-gray-500">{review.date} - Reserva Verificada</p>
                </div>
              </div>
              
              <div className="mb-4 flex text-[#D4AF37]">
                {[...Array(5)].map((_, index) => (
                  <Star 
                    key={index} 
                    className={`h-5 w-5 ${index < review.rating ? 'fill-current' : 'text-gray-300'}`} 
                  />
                ))}
              </div>
              
              <div className="flex-1">
                <p className="text-base leading-relaxed text-gray-600">
                  "{review.description}"
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Link 
            href="https://www.getyourguide.com" 
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border-2 border-gray-200 bg-white px-6 py-3 text-sm font-semibold text-gray-900 transition hover:border-[#D4AF37] hover:text-[#D4AF37]"
          >
            Ver más reseñas verificadas en GetYourGuide
            <ExternalLink className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
