'use client';

/**
 * Modern Hero Carousel with Scrolling Storytelling
 * Inspired by Amazon/Alibaba design patterns
 */

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ShoppingBag, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';

interface HeroSlide {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  cta: {
    text: string;
    href: string;
  };
  theme: 'light' | 'dark';
}

const slides: HeroSlide[] = [
  {
    id: 1,
    title: 'Premium Used Electronics',
    subtitle: 'Grade A-D Certified',
    description: 'Every item professionally graded and tested. Save up to 70% on quality electronics.',
    image: '/images/hero/electronics.jpg',
    cta: {
      text: 'Shop Electronics',
      href: '/category/electronics',
    },
    theme: 'dark',
  },
  {
    id: 2,
    title: 'Mac Computers & iMacs',
    subtitle: 'Starting at $69',
    description: 'Professionally refurbished Apple computers with warranty. Perfect for students and professionals.',
    image: '/images/hero/imacs.jpg',
    cta: {
      text: 'Browse Computers',
      href: '/category/computers',
    },
    theme: 'light',
  },
  {
    id: 3,
    title: 'Home Appliances',
    subtitle: 'Refrigerators, Washers & More',
    description: 'Quality home appliances at unbeatable prices. Local delivery available.',
    image: '/images/hero/appliances.jpg',
    cta: {
      text: 'Shop Appliances',
      href: '/category/appliances',
    },
    theme: 'dark',
  },
];

export function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Auto-advance slides
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    setIsAutoPlaying(false);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    setIsAutoPlaying(false);
  };

  const slide = slides[currentSlide];

  return (
    <section className="relative h-[500px] md:h-[600px] overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Background Image with Parallax Effect */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out"
          style={{
            backgroundImage: 'url(/images/products/placeholder.svg)',
            transform: `scale(${1 + currentSlide * 0.05})`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative h-full container mx-auto px-4 flex items-center">
        <div className="max-w-2xl space-y-6 animate-fade-in">
          {/* Subtitle Badge */}
          <div className="inline-block">
            <span className="px-4 py-2 bg-primary/20 backdrop-blur-sm border border-primary/30 rounded-full text-primary text-sm font-semibold">
              {slide.subtitle}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight">
            {slide.title}
          </h1>

          {/* Description */}
          <p className="text-xl md:text-2xl text-slate-200 leading-relaxed max-w-xl">
            {slide.description}
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap gap-4 pt-4">
            <Button asChild size="lg" className="text-lg px-8">
              <Link href={slide.cta.href}>
                <ShoppingBag className="mr-2 h-5 w-5" />
                {slide.cta.text}
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="text-lg px-8 bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20">
              <Link href="/products">
                Browse All
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all"
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all"
        aria-label="Next slide"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-2 rounded-full transition-all ${
              index === currentSlide
                ? 'w-8 bg-primary'
                : 'w-2 bg-white/30 hover:bg-white/50'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
      `}</style>
    </section>
  );
}
