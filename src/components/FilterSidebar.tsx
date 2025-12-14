import React, { useState, useEffect } from 'react';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import { X, ChevronDown, Sparkles } from 'lucide-react';
import { SareeFilters } from '@/types/filters';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';

interface FilterSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  filters: SareeFilters;
  onApply: (filters: SareeFilters) => void;
  onClearAll: () => void;
}

// const categories = ['Silk Sarees', 'Cotton Sarees', 'Organza Sarees', 'Banarasi Sarees', 'Kanchipuram Sarees', 'Linen Sarees', 'Designer Sarees'];
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
  const { categories } = useSelector((state: RootState) => state.categories);
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

  const handleCategoryChange = (categoryId: string) => {
    const newCategories = localFilters.category.includes(categoryId)
      ? localFilters.category.filter((c) => c !== categoryId)
      : [...localFilters.category, categoryId];
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
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        ></div>
      )}

      <div
        className={`fixed inset-y-0 right-0 w-72 bg-white/95 backdrop-blur-xl shadow-2xl z-50 transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}
          lg:relative lg:translate-x-0 lg:w-72 lg:shadow-none lg:bg-transparent lg:pr-4`}
        role="complementary"
        aria-label="Product filters"
      >
        <div className="p-4 lg:p-0 h-full flex flex-col">
          <div className="flex justify-between items-center mb-6 lg:hidden">
            <div className="flex items-center gap-2 text-rose-700 font-semibold">
              <Sparkles size={18} />
              <span>Filters</span>
            </div>
            <button
              onClick={onClose}
              className="text-rose-500 hover:text-rose-700 focus:outline-none focus:ring-2 focus:ring-rose-200 focus:ring-offset-2"
              aria-label="Close filters sidebar"
            >
              <X size={24} />
            </button>
          </div>

          <div className="flex-grow overflow-y-auto custom-scrollbar rounded-2xl lg:rounded-none bg-white lg:bg-transparent border border-rose-100 lg:border-none p-4 lg:p-0">
            <div className="mb-6 border-b border-rose-100 pb-4" role="group" aria-labelledby="category-filter-heading">
              <button
                className="flex justify-between items-center w-full text-left font-semibold text-lg mb-3 text-slate-900 hover:text-rose-700 transition-colors"
                onClick={() => handleToggleSection('category')}
                aria-expanded={openSections.category}
                aria-controls="category-filter-panel"
              >
                <h3 id="category-filter-heading">Category</h3>
                <ChevronDown size={20} className={`transition-transform ${openSections.category ? 'rotate-180' : 'rotate-0'}`} />
              </button>
              {openSections.category && (
                <div id="category-filter-panel" className="pl-2 space-y-2">
                  {categories.map((category) => (
                    <label key={category._id} className="flex items-center gap-2 text-slate-700">
                      <input
                        type="checkbox"
                        name="category"
                        value={category._id}
                        checked={localFilters.category.includes(category._id)}
                        onChange={() => handleCategoryChange(category._id)}
                        className="mr-1 accent-rose-600 focus:ring-2 focus:ring-rose-200 focus:ring-offset-2"
                        aria-label={category.name}
                      />
                      <span>{category.name}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            <div className="mb-6 border-b border-rose-100 pb-4" role="group" aria-labelledby="color-filter-heading">
              <button
                className="flex justify-between items-center w-full text-left font-semibold text-lg mb-3 text-slate-900 hover:text-rose-700 transition-colors"
                onClick={() => handleToggleSection('color')}
                aria-expanded={openSections.color}
                aria-controls="color-filter-panel"
              >
                <h3 id="color-filter-heading">Color</h3>
                <ChevronDown size={20} className={`transition-transform ${openSections.color ? 'rotate-180' : 'rotate-0'}`} />
              </button>
              {openSections.color && (
                <div id="color-filter-panel" className="flex flex-wrap gap-2 pl-1">
                  {colors.map((color) => (
                    <button
                      key={color.name}
                      className={`w-9 h-9 rounded-full border-2 border-white shadow-sm flex items-center justify-center transition-all duration-200
                        ${localFilters.color.includes(color.name) ? 'ring-2 ring-offset-1 ring-rose-300 scale-105' : ''}`}
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

            <div className="mb-6 border-b border-rose-100 pb-4" role="group" aria-labelledby="price-range-filter-heading">
              <button
                className="flex justify-between items-center w-full text-left font-semibold text-lg mb-3 text-slate-900 hover:text-rose-700 transition-colors"
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
                    trackStyle={[{ backgroundColor: '#f43f5e' }]}
                    handleStyle={[
                      { backgroundColor: '#f59e0b', borderColor: '#f59e0b', opacity: 1 },
                      { backgroundColor: '#f59e0b', borderColor: '#f59e0b', opacity: 1 },
                    ]}
                    railStyle={{ backgroundColor: '#fce7f3' }}
                    aria-label="Price range slider"
                  />
                  <div className="flex justify-between mt-2 text-sm text-slate-700">
                    <span>₹{localFilters.priceRange[0].toLocaleString()}</span>
                    <span>₹{localFilters.priceRange[1].toLocaleString()}</span>
                  </div>
                </div>
              )}
            </div>

            <div className="mb-6 pb-2" role="group" aria-labelledby="fabric-filter-heading">
              <button
                className="flex justify-between items-center w-full text-left font-semibold text-lg mb-3 text-slate-900 hover:text-rose-700 transition-colors"
                onClick={() => handleToggleSection('fabric')}
                aria-expanded={openSections.fabric}
                aria-controls="fabric-filter-panel"
              >
                <h3 id="fabric-filter-heading">Fabric</h3>
                <ChevronDown size={20} className={`transition-transform ${openSections.fabric ? 'rotate-180' : 'rotate-0'}`} />
              </button>
              {openSections.fabric && (
                <div id="fabric-filter-panel" className="pl-2 space-y-2">
                  {fabrics.map((fabric) => (
                    <label key={fabric} className="flex items-center gap-2 text-slate-700">
                      <input
                        type="checkbox"
                        name="fabric"
                        value={fabric}
                        checked={localFilters.fabric.includes(fabric)}
                        onChange={() => handleFabricChange(fabric)}
                        className="mr-1 accent-rose-600 focus:ring-2 focus:ring-rose-200 focus:ring-offset-2"
                        aria-label={fabric}
                      />
                      <span>{fabric}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="sticky bottom-0 p-4 flex flex-col space-y-3 bg-white lg:bg-transparent lg:p-0 lg:pt-4">
            <button
              onClick={handleApplyFilters}
              className="w-full bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500 text-white px-4 py-2.5 rounded-xl font-semibold hover:shadow-2xl transition-all focus:outline-none focus:ring-2 focus:ring-rose-200 focus:ring-offset-2"
              aria-label="Apply filters"
            >
              Apply Filters
            </button>
            <button
              onClick={handleClearAllFilters}
              className="w-full border border-rose-200 text-rose-700 px-4 py-2.5 rounded-xl font-semibold hover:bg-rose-50 transition-colors focus:outline-none focus:ring-2 focus:ring-rose-200 focus:ring-offset-2"
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