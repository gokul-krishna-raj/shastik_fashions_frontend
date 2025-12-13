import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { useRef } from 'react';

import { Category } from '@/types';

interface CategorySectionProps {
  categories: Category[];
  loading: boolean;
}

const CategorySection: React.FC<CategorySectionProps> = ({ categories, loading }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  if (loading) {
    return (
      <section className="py-12 bg-gradient-to-b from-rose-50 via-white to-amber-50">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-rose-100 text-rose-700 font-semibold text-sm mb-3">
            <ChevronRight className="w-4 h-4" />
            Shop by Category
          </div>
          <h2 className="text-3xl font-bold text-slate-900">Loading categories...</h2>
        </div>
      </section>
    );
  }

  return (
    <section className="py-14 bg-gradient-to-b from-rose-50 via-white to-amber-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-rose-100 text-rose-700 font-semibold text-sm">
            <ChevronRight className="w-4 h-4" />
            Discover by weave
          </div>
          <h2 className="mt-3 text-3xl md:text-4xl font-bold text-slate-900">
            Shop by Category
          </h2>
          <p className="text-slate-600 mt-2 max-w-2xl mx-auto">
            Explore curated edits across Kanjivaram, organza, linen, silk blends, and festive zari favourites.
          </p>
        </div>
        
        <div className="relative">
          <button
            onClick={() => scroll('left')}
            className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-white shadow-lg rounded-full p-3 hover:bg-rose-50 transition-all border border-rose-100"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-6 h-6 text-gray-700" />
          </button>
          
          <button
            onClick={() => scroll('right')}
            className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-white shadow-lg rounded-full p-3 hover:bg-rose-50 transition-all border border-rose-100"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-6 h-6 text-gray-700" />
          </button>

          <div
            ref={scrollContainerRef}
            className="flex overflow-x-auto md:overflow-x-hidden gap-6 pb-4 scrollbar-hide scroll-smooth"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {categories.slice(0, 10).map((category) => (
              <Link
                key={category._id}
                href={`/categories/${category.slug}`}
                className="flex-shrink-0 w-32 sm:w-36 text-center group"
              >
                <div className="relative w-32 h-32 sm:w-36 sm:h-36 mx-auto mb-3 rounded-3xl overflow-hidden transition-transform duration-300 transform group-hover:scale-105 shadow-lg group-hover:shadow-2xl bg-white">
                  <Image
                    src={category.image === 'no-photo.jpg' ? '/Images/shastik_fahsion_logo.png' : category.image}
                    alt={category.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 128px, 144px"
                  />
                </div>
                <h3 className="text-sm sm:text-base font-semibold text-slate-800 group-hover:text-rose-700 transition-colors">
                  {category.name}
                </h3>
              </Link>
            ))}

            <Link
              href="/categories"
              className="flex-shrink-0 w-32 sm:w-36 text-center group"
            >
              <div className="relative w-32 h-32 sm:w-36 sm:h-36 mx-auto mb-3 bg-gradient-to-br from-rose-500 via-pink-500 to-amber-500 shadow-lg rounded-3xl overflow-hidden transition-transform duration-300 transform group-hover:scale-105 group-hover:shadow-2xl flex items-center justify-center text-white">
                <Plus className="w-12 h-12" />
              </div>
              <h3 className="text-sm sm:text-base font-semibold text-rose-700 group-hover:text-amber-600 transition-colors">
                View More
              </h3>
            </Link>
          </div>
        </div>
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
};

export default CategorySection;
