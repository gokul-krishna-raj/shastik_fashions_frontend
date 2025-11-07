import React, { useState, useEffect } from 'react';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import { X, ChevronDown } from 'lucide-react';
import { SareeFilters } from '@/types/filters'; // Import the new interface

interface FilterSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  filters: SareeFilters;
  onApply: (filters: SareeFilters) => void;
  onClearAll: () => void;
}

const categories = ['Silk Sarees', 'Cotton Sarees', 'Organza Sarees', 'Banarasi Sarees', 'Kanchipuram Sarees', 'Linen Sarees', 'Designer Sarees'];
const fabrics = ['Silk', 'Cotton', 'Georgette', 'Chiffon', 'Crepe', 'Satin', 'Organza'];
const colors = [
  { name: 'Red', hex: '#EF4444' },
  { name: 'Blue', hex: '#3B82F6' },
  { name: 'Green', hex: '#22C55E' },
  { name: 'Pink', hex: '#EC4899' },
  { name: 'Yellow', hex: '#EAB308' },
  { name: 'Black', hex: '#000000' },
  { name: 'White', hex: '#FFFFFF' },
  { name: 'Gold', hex: '#D4AF37' },
  { name: 'Maroon', hex: '#8A1538' },
  { name: 'Purple', hex: '#A855F7' },
];

const FilterSidebar: React.FC<FilterSidebarProps> = ({
  isOpen,
  onClose,
  filters,
  onApply,
  onClearAll,
}) => {
  const [localFilters, setLocalFilters] = useState<SareeFilters>(filters);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    category: true,
    color: true,
    priceRange: true,
    fabric: true,
  });

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleToggleSection = (section: string) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const handleCategoryChange = (category: string) => {
    const newCategories = localFilters.category.includes(category)
      ? localFilters.category.filter((c) => c !== category)
      : [...localFilters.category, category];
    setLocalFilters((prev) => ({ ...prev, category: newCategories }));
  };

  const handleColorChange = (color: string) => {
    const newColors = localFilters.color.includes(color)
      ? localFilters.color.filter((c) => c !== color)
      : [...localFilters.color, color];
    setLocalFilters((prev) => ({ ...prev, color: newColors }));
  };

  const handlePriceChange = (value: number | number[]) => {
    if (Array.isArray(value)) {
      setLocalFilters((prev) => ({ ...prev, priceRange: value as [number, number] }));
    }
  };

  const handleFabricChange = (fabric: string) => {
    const newFabrics = localFilters.fabric.includes(fabric)
      ? localFilters.fabric.filter((f) => f !== fabric)
      : [...localFilters.fabric, fabric];
    setLocalFilters((prev) => ({ ...prev, fabric: newFabrics }));
  };

  const handleApplyFilters = () => {
    onApply(localFilters);
    onClose(); // Close sidebar on mobile after applying filters
  };

  const handleClearAllFilters = () => {
    const clearedFilters: SareeFilters = {
      category: [],
      color: [],
      priceRange: [500, 20000], // Reset to default range
      fabric: [],
    };
    setLocalFilters(clearedFilters);
    onClearAll();
    onClose(); // Close sidebar on mobile after clearing filters
  };

  return (
    <>
      {/* Backdrop for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        ></div>
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 right-0 w-64 bg-[#FFF9F5] shadow-lg z-50 transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}
          lg:relative lg:translate-x-0 lg:w-72 lg:shadow-none lg:bg-transparent lg:pr-4`}
        role="complementary"
        aria-label="Product filters"
      >
        <div className="p-4 lg:p-0 h-full flex flex-col">
          {/* Header for mobile */}
          <div className="flex justify-between items-center mb-6 lg:hidden">
            <h2 className="text-xl font-bold text-[#8A1538]">Filters</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#C99A5E] focus:ring-offset-2"
              aria-label="Close filters sidebar"
            >
              <X size={24} />
            </button>
          </div>

          {/* Filter Sections */}
          <div className="flex-grow overflow-y-auto custom-scrollbar">
            {/* Category Filter */}
            <div className="mb-6 border-b border-gray-200 pb-4" role="group" aria-labelledby="category-filter-heading">
              <button
                className="flex justify-between items-center w-full text-left font-semibold text-lg mb-3 text-[#8A1538] hover:text-[#C99A5E] transition-colors"
                onClick={() => handleToggleSection('category')}
                aria-expanded={openSections.category}
                aria-controls="category-filter-panel"
              >
                <h3 id="category-filter-heading">Category</h3>
                <ChevronDown size={20} className={`transition-transform ${openSections.category ? 'rotate-180' : 'rotate-0'}`} />
              </button>
              {openSections.category && (
                <div id="category-filter-panel" className="pl-2">
                  {categories.map((category) => (
                    <div key={category} className="mb-2">
                      <input
                        type="checkbox"
                        id={`category-${category.replace(/\s+/g, '-')}`}
                        name="category"
                        value={category}
                        checked={localFilters.category.includes(category)}
                        onChange={() => handleCategoryChange(category)}
                        className="mr-2 accent-[#8A1538] focus:ring-2 focus:ring-[#C99A5E] focus:ring-offset-2"
                        aria-label={category}
                      />
                      <label htmlFor={`category-${category.replace(/\s+/g, '-')}`}>{category}</label>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Color Filter */}
            <div className="mb-6 border-b border-gray-200 pb-4" role="group" aria-labelledby="color-filter-heading">
              <button
                className="flex justify-between items-center w-full text-left font-semibold text-lg mb-3 text-[#8A1538] hover:text-[#C99A5E] transition-colors"
                onClick={() => handleToggleSection('color')}
                aria-expanded={openSections.color}
                aria-controls="color-filter-panel"
              >
                <h3 id="color-filter-heading">Color</h3>
                <ChevronDown size={20} className={`transition-transform ${openSections.color ? 'rotate-180' : 'rotate-0'}`} />
              </button>
              {openSections.color && (
                <div id="color-filter-panel" className="flex flex-wrap gap-2 pl-2">
                  {colors.map((color) => (
                    <button
                      key={color.name}
                      className={`w-8 h-8 rounded-full border-2 border-gray-300 flex items-center justify-center transition-all duration-200
                        ${localFilters.color.includes(color.name) ? 'ring-2 ring-offset-1 ring-[#C99A5E]' : ''}`}
                      style={{ backgroundColor: color.hex }}
                      onClick={() => handleColorChange(color.name)}
                      aria-label={`Select color ${color.name}`}
                      title={color.name}
                    >
                      {color.name === 'White' && <span className="sr-only">White</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Price Range Filter */}
            <div className="mb-6 border-b border-gray-200 pb-4" role="group" aria-labelledby="price-range-filter-heading">
              <button
                className="flex justify-between items-center w-full text-left font-semibold text-lg mb-3 text-[#8A1538] hover:text-[#C99A5E] transition-colors"
                onClick={() => handleToggleSection('priceRange')}
                aria-expanded={openSections.priceRange}
                aria-controls="price-range-filter-panel"
              >
                <h3 id="price-range-filter-heading">Price Range (INR)</h3>
                <ChevronDown size={20} className={`transition-transform ${openSections.priceRange ? 'rotate-180' : 'rotate-0'}`} />
              </button>
              {openSections.priceRange && (
                <div id="price-range-filter-panel" className="px-2">
                  <Slider
                    range
                    min={500}
                    max={20000}
                    step={100}
                    value={localFilters.priceRange}
                    onChange={handlePriceChange}
                    trackStyle={[{ backgroundColor: '#8A1538' }]}
                    handleStyle={[
                      { backgroundColor: '#C99A5E', borderColor: '#C99A5E', opacity: 1 },
                      { backgroundColor: '#C99A5E', borderColor: '#C99A5E', opacity: 1 },
                    ]}
                    railStyle={{ backgroundColor: '#e0e0d0' }}
                    aria-label="Price range slider"
                  />
                  <div className="flex justify-between mt-2 text-sm text-gray-700">
                    <span>₹{localFilters.priceRange[0].toLocaleString()}</span>
                    <span>₹{localFilters.priceRange[1].toLocaleString()}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Fabric Filter */}
            <div className="mb-6 pb-4" role="group" aria-labelledby="fabric-filter-heading">
              <button
                className="flex justify-between items-center w-full text-left font-semibold text-lg mb-3 text-[#8A1538] hover:text-[#C99A5E] transition-colors"
                onClick={() => handleToggleSection('fabric')}
                aria-expanded={openSections.fabric}
                aria-controls="fabric-filter-panel"
              >
                <h3 id="fabric-filter-heading">Fabric</h3>
                <ChevronDown size={20} className={`transition-transform ${openSections.fabric ? 'rotate-180' : 'rotate-0'}`} />
              </button>
              {openSections.fabric && (
                <div id="fabric-filter-panel" className="pl-2">
                  {fabrics.map((fabric) => (
                    <div key={fabric} className="mb-2">
                      <input
                        type="checkbox"
                        id={`fabric-${fabric.replace(/\s+/g, '-')}`}
                        name="fabric"
                        value={fabric}
                        checked={localFilters.fabric.includes(fabric)}
                        onChange={() => handleFabricChange(fabric)}
                        className="mr-2 accent-[#8A1538] focus:ring-2 focus:ring-[#C99A5E] focus:ring-offset-2"
                        aria-label={fabric}
                      />
                      <label htmlFor={`fabric-${fabric.replace(/\s+/g, '-')}`}>{fabric}</label>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="sticky bottom-0 p-4 border-t border-gray-200 flex flex-col space-y-3 lg:p-0 lg:pt-4 bg-[#FFF9F5]">
            <button
              onClick={handleApplyFilters}
              className="w-full bg-[#8A1538] text-white px-4 py-2 rounded-md font-semibold hover:bg-[#C99A5E] transition-colors focus:outline-none focus:ring-2 focus:ring-[#C99A5E] focus:ring-offset-2"
              aria-label="Apply filters"
            >
              Apply Filters
            </button>
            <button
              onClick={handleClearAllFilters}
              className="w-full border border-[#8A1538] text-[#8A1538] px-4 py-2 rounded-md font-semibold hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-[#C99A5E] focus:ring-offset-2"
              aria-label="Clear all filters"
            >
              Clear All
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default FilterSidebar;