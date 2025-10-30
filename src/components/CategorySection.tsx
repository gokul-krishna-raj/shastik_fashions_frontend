import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { useRef } from 'react';

interface Category {
  _id: string;
  name: string;
  description: string;
  image: string;
}

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
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-center mb-8">Shop by Category</h2>
          <p>Loading categories...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8">Shop by Category</h2>
        
        <div className="relative">
          {/* Navigation Buttons - Hidden on mobile, visible on md+ */}
          <button
            onClick={() => scroll('left')}
            className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-white shadow-lg rounded-full p-3 hover:bg-gray-100 transition-all"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-6 h-6 text-gray-700" />
          </button>
          
          <button
            onClick={() => scroll('right')}
            className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-white shadow-lg rounded-full p-3 hover:bg-gray-100 transition-all"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-6 h-6 text-gray-700" />
          </button>

          {/* Categories Container */}
          <div
            ref={scrollContainerRef}
            className="flex overflow-x-auto md:overflow-x-hidden gap-6 pb-4 scrollbar-hide scroll-smooth"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {categories.slice(0, 10).map((category) => (
              <Link
                key={category._id}
                href={`/categories/${category._id}`}
                className="flex-shrink-0 w-32 sm:w-36 text-center group"
              >
                <div className="relative w-32 h-32 sm:w-36 sm:h-36 mx-auto mb-4 shadow-md rounded-full overflow-hidden transition-transform duration-300 transform group-hover:scale-105 group-hover:shadow-xl">
                  <Image
                    src={category.image === 'no-photo.jpg' ? '/Images/shastik_fahsion_logo.png' : category.image}
                    alt={category.name}
                    fill
                    className="object-cover rounded-full"
                    sizes="(max-width: 640px) 128px, 144px"
                  />
                </div>
                <h3 className="text-sm sm:text-base font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
                  {category.name}
                </h3>
              </Link>
            ))}

            {/* View More Card */}
            <Link
              href="/categories"
              className="flex-shrink-0 w-32 sm:w-36 text-center group"
            >
              <div className="relative w-32 h-32 sm:w-36 sm:h-36 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-purple-600 shadow-md rounded-full overflow-hidden transition-transform duration-300 transform group-hover:scale-105 group-hover:shadow-xl flex items-center justify-center">
                <Plus className="w-12 h-12 text-white" />
              </div>
              <h3 className="text-sm sm:text-base font-semibold text-blue-600 group-hover:text-purple-600 transition-colors">
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
