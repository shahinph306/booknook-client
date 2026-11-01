/* eslint-disable @next/next/no-img-element */
/* eslint-disable react-hooks/set-state-in-effect */

'use client';

import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';

const slides = [
  {
    id: 1,
    image: '/images/banner-1.jpg',
    label: 'BOOKNOOK',
    title: 'Share the books on your shelf',
    description: 'Add the books you have finished. Let other readers enjoy them too.',
    buttonText: 'Browse Books',
    buttonLink: '/all-books',
  },
  {
    id: 2,
    image: '/images/banner-3.jpg',
    label: 'BOOKNOOK',
    title: 'Borrow, read, return. Repeat.',
    description: 'Seven days for every book. Return it with one click when you are done.',
    buttonText: 'Browse Books',
    buttonLink: '/all-books',
  },
  {
    id: 3,
    image: '/images/banner-2.jpg',
    label: 'BOOKNOOK',
    title: 'Your neighbourhood library, online',
    description: 'Find a book that someone nearby already loved, and borrow it for a week.',
    buttonText: 'Browse Books',
    buttonLink: '/all-books',
  },
];

const BannerSlider = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    duration: 25,
  });

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);
  const scrollTo = useCallback((index: number) => emblaApi?.scrollTo(index), [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    setScrollSnaps(emblaApi.scrollSnapList());
    emblaApi.on('select', () => setSelectedIndex(emblaApi.selectedScrollSnap()));
  }, [emblaApi]);

  // অটো স্লাইড — প্রতি ৫ সেকেন্ডে পরিবর্তন
  useEffect(() => {
    if (!emblaApi) return;
    const interval = setInterval(() => emblaApi.scrollNext(), 5000);
    return () => clearInterval(interval);
  }, [emblaApi]);

  return (
    <section className="relative overflow-hidden">
      {/* Carousel Viewport */}
      <div ref={emblaRef} className="overflow-hidden">
        <div className="flex">
          {slides.map((slide) => (
            <div key={slide.id} className="relative flex-[0_0_100%]">
              {/* Background Image */}
              <div className="relative h-[clamp(450px,75vh,600px)] w-full">
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                {/* Dark Overlay — লেখা স্পষ্ট দেখানোর জন্য */}
                <div className="absolute inset-0 bg-black/50" />

                {/* Content */}
                <div className="absolute inset-0 flex items-center px-6 md:px-12 lg:px-20">
                  <div className="max-w-2xl text-white">
                    <p className="text-amber-400 text-sm font-medium tracking-widest mb-4">
                      {slide.label}
                    </p>
                    <h2 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">
                      {slide.title}
                    </h2>
                    <p className="text-gray-200 text-lg mb-8 max-w-lg">
                      {slide.description}
                    </p>
                    <Link
                      href={slide.buttonLink}
                      className="inline-block px-5 py-2.5 bg-[#2f6b52] hover:bg-[#275c46] rounded-md font-medium transition-colors duration-200"
                    >
                      {slide.buttonText}
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Left Arrow */}
      <button
        onClick={scrollPrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 hover:bg-white/40 flex items-center justify-center text-white transition-colors"
        aria-label="Previous slide"
      >
        <ChevronLeft size={20} />
      </button>

      {/* Right Arrow */}
      <button
        onClick={scrollNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 hover:bg-white/40 flex items-center justify-center text-white transition-colors"
        aria-label="Next slide"
      >
        <ChevronRight size={20} />
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
        {scrollSnaps.map((_, index) => (
          <button
            key={index}
            onClick={() => scrollTo(index)}
            className={`w-2.5 h-2.5 rounded-full transition-all duration-200 ${
              index === selectedIndex ? 'bg-white w-8' : 'bg-white/40 hover:bg-white/60'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
};

export default BannerSlider;