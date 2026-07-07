import React from 'react';
import { Star } from 'lucide-react';

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
    author: 'John D.',
    initial: 'J',
    color: 'bg-blue-500',
    date: 'March 15, 2026',
    rating: 5,
    description: 'Excellent airport transfer. The driver was waiting for us at BCN arrivals with a sign and helped with our heavy luggage.'
  },
  {
    id: '2',
    author: 'Sarah M.',
    initial: 'S',
    color: 'bg-red-500',
    date: 'February 28, 2026',
    rating: 5,
    description: 'We booked a transfer from our hotel to the Barcelona Cruise Port. Very punctual and the Mercedes V-Class was perfect for our family of 5.'
  },
  {
    id: '3',
    author: 'David & Emma',
    initial: 'D',
    color: 'bg-emerald-500',
    date: 'February 10, 2026',
    rating: 5,
    description: 'Hired their chauffeur service for a day trip to Montserrat. The driver was knowledgeable, polite, and the car was immaculate.'
  },
  {
    id: '4',
    author: 'Michael T.',
    initial: 'M',
    color: 'bg-purple-500',
    date: 'January 22, 2026',
    rating: 5,
    description: 'Great corporate transfer service. We used them for Mobile World Congress and the executive car was exactly what we needed for our CEO.'
  },
  {
    id: '5',
    author: 'Lucia R.',
    initial: 'L',
    color: 'bg-amber-500',
    date: 'January 5, 2026',
    rating: 5,
    description: 'Private transfer from Barcelona airport to Sitges. Much better and faster than waiting for a taxi. Highly recommended!'
  },
  {
    id: '6',
    author: 'Robert K.',
    initial: 'R',
    color: 'bg-indigo-500',
    date: 'December 12, 2025',
    rating: 5,
    description: 'We needed a transfer with a child seat from the airport to the city centre. Everything was perfectly arranged.'
  }
];

// For a smooth marquee, we only duplicate once
const marqueeReviews = [...reviews, ...reviews];

export default function GygReviews() {
  return (
    <section className="overflow-hidden bg-white py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 mb-12 text-center">
        <p className="mb-3 text-sm font-semibold uppercase text-[#D4AF37]">Verified Reviews</p>
        <h2 className="text-3xl font-semibold tracking-tight text-gray-950 sm:text-4xl">
          What our clients say
        </h2>
        <p className="mt-4 text-lg leading-8 text-gray-600">
          Hundreds of travelers trust us for their transfers in Barcelona.
        </p>
      </div>
      
      <div className="relative flex w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_5%,black_95%,transparent)] py-4">
        <div className="flex w-max animate-[marquee_40s_linear_infinite] hover:[animation-play-state:paused]">
          {marqueeReviews.map((review, i) => (
            <div 
              key={`${review.id}-${i}`}
              className="mx-3 flex w-80 shrink-0 flex-col rounded-2xl border border-gray-100 bg-white p-6 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] transition-shadow hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.1)]"
            >
              <div className="mb-4 flex items-center gap-4">
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white ${review.color}`}>
                  {review.initial}
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-900">{review.author}</h3>
                  <p className="text-xs text-gray-500">{review.date} - Verified Booking</p>
                </div>
              </div>
              
              <div className="mb-3 flex text-[#D4AF37]">
                {[...Array(5)].map((_, index) => (
                  <Star 
                    key={index} 
                    className={`h-4 w-4 ${index < review.rating ? 'fill-current' : 'text-gray-300'}`} 
                  />
                ))}
              </div>
              
              <div className="relative flex-1">
                <p className="text-sm leading-relaxed text-gray-600 line-clamp-4">
                  "{review.description}"
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
