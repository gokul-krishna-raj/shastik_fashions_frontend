
import React, { useState, useEffect } from 'react';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

interface FilterSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  filters: {
    category: string;
    priceRange: [number, number];
    fabric: string;
    color: string;
  };
  onFilterChange: (newFilters: {
    category?: string;
    priceRange?: [number, number];
    fabric?: string;
    color?: string;
  }) => void;
}

const categories = ['Electronics', 'Apparel', 'Home Goods', 'Books'];
const fabrics = ['Cotton', 'Polyester', 'Wool', 'Silk'];
const colors = ['Red', 'Blue', 'Green', 'Black', 'White'];

const FilterSidebar: React.FC<FilterSidebarProps> = ({
  isOpen,
  onClose,
  filters,
  onFilterChange,
}) => {
  const [priceRange, setPriceRange] = useState<[number, number]>(filters.priceRange);

  useEffect(() => {
    setPriceRange(filters.priceRange);
  }, [filters.priceRange]);

  const handlePriceChange = (value: number | number[]) => {
    if (Array.isArray(value)) {
      setPriceRange(value as [number, number]);
    }
  };

  const handlePriceChangeComplete = (value: number | number[]) => {
    if (Array.isArray(value)) {
      onFilterChange({ priceRange: value as [number, number] });
    }
  };

  return (
    <div
      className={`fixed inset-y-0 left-0 w-64 bg-white shadow-lg z-40 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-transform duration-300 ease-in-out md:relative md:translate-x-0 md:shadow-none`}
      role="complementary"
      aria-label="Product filters"
    >
      <div className="p-4">
        <div className="flex justify-between items-center mb-6 md:hidden">
          <h2 className="text-xl font-bold">Filters</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            aria-label="Close filters sidebar">
            &times;
          </button>
        </div>

        {/* Category Filter */}
        <div className="mb-6" role="group" aria-labelledby="category-filter-heading">
          <h3 id="category-filter-heading" className="font-semibold text-lg mb-3">Category</h3>
          {categories.map((category) => (
            <div key={category} className="mb-2">
              <input
                type="radio"
                id={`category-${category}`}
                name="category"
                value={category}
                checked={filters.category === category}
                onChange={() => onFilterChange({ category })}
                className="mr-2 focus:ring-2 focus:ring-primary focus:ring-offset-2"
                aria-label={category}
              />
              <label htmlFor={`category-${category}`}>{category}</label>
            </div>
          ))}
          <div className="mb-2">
            <input
              type="radio"
              id="allCategories"
              name="category"
              value=""
              checked={filters.category === ''}
              onChange={() => onFilterChange({ category: '' })}
              className="mr-2 focus:ring-2 focus:ring-primary focus:ring-offset-2"
              aria-label="All categories"
            />
            <label htmlFor="allCategories">All</label>
          </div>
        </div>

        {/* Price Range Filter */}
        <div className="mb-6" role="group" aria-labelledby="price-range-filter-heading">
          <h3 id="price-range-filter-heading" className="font-semibold text-lg mb-3">Price Range</h3>
          <div className="px-2">
            <Slider
              range
              min={0}
              max={1000}
              defaultValue={[0, 1000]}
              value={priceRange}
              onChange={handlePriceChange}
              onAfterChange={handlePriceChangeComplete}
              trackStyle={[{ backgroundColor: '#a0522d' }]}
              handleStyle={[
                { backgroundColor: '#a0522d', borderColor: '#a0522d' },
                { backgroundColor: '#a0522d', borderColor: '#a0522d' },
              ]}
              railStyle={{ backgroundColor: '#e0e0d0' }}
              aria-label="Price range slider"
            />
            <div className="flex justify-between mt-2 text-sm">
              <span>${priceRange[0]}</span>
              <span>${priceRange[1]}</span>
            </div>
          </div>
        </div>

        {/* Fabric Filter */}
        <div className="mb-6" role="group" aria-labelledby="fabric-filter-heading">
          <h3 id="fabric-filter-heading" className="font-semibold text-lg mb-3">Fabric</h3>
          {fabrics.map((fabric) => (
            <div key={fabric} className="mb-2">
              <input
                type="radio"
                id={`fabric-${fabric}`}
                name="fabric"
                value={fabric}
                checked={filters.fabric === fabric}
                onChange={() => onFilterChange({ fabric })}
                className="mr-2 focus:ring-2 focus:ring-primary focus:ring-offset-2"
                aria-label={fabric}
              />
              <label htmlFor={`fabric-${fabric}`}>{fabric}</label>
            </div>
          ))}
          <div className="mb-2">
            <input
              type="radio"
              id="allFabrics"
              name="fabric"
              value=""
              checked={filters.fabric === ''}
              onChange={() => onFilterChange({ fabric: '' })}
              className="mr-2 focus:ring-2 focus:ring-primary focus:ring-offset-2"
              aria-label="All fabrics"
            />
            <label htmlFor="allFabrics">All</label>
          </div>
        </div>

        {/* Color Filter */}
        <div className="mb-6" role="group" aria-labelledby="color-filter-heading">
          <h3 id="color-filter-heading" className="font-semibold text-lg mb-3">Color</h3>
          {colors.map((color) => (
            <div key={color} className="mb-2">
              <input
                type="radio"
                id={`color-${color}`}
                name="color"
                value={color}
                checked={filters.color === color}
                onChange={() => onFilterChange({ color })}
                className="mr-2 focus:ring-2 focus:ring-primary focus:ring-offset-2"
                aria-label={color}
              />
              <label htmlFor={`color-${color}`}>{color}</label>
            </div>
          ))}
          <div className="mb-2">
            <input
              type="radio"
              id="allColors"
              name="color"
              value=""
              checked={filters.color === ''}
              onChange={() => onFilterChange({ color: '' })}
              className="mr-2 focus:ring-2 focus:ring-primary focus:ring-offset-2"
              aria-label="All colors"
            />
            <label htmlFor="allColors">All</label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterSidebar;
