
import React from 'react';
import Select from 'react-select';

interface SortDropdownProps {
  currentSort: string;
  onSortChange: (newSort: string) => void;
}

const sortOptions = [
  { value: 'newest', label: 'Newest' },
  { value: 'price_low', label: 'Price: Low to High' },
  { value: 'price_high', label: 'Price: High to Low' },
  { value: 'best_sellers', label: 'Best Selling' },
];

const SortDropdown: React.FC<SortDropdownProps> = ({ currentSort, onSortChange }) => {
  const selectedOption = sortOptions.find(option => option.value === currentSort);

  return (
    <div className="w-48">
      <Select
        options={sortOptions}
        value={selectedOption}
        onChange={(option) => onSortChange(option?.value || '')}
        placeholder="Sort by..."
        isClearable={false}
        aria-label="Sort products by"
        styles={{
          control: (base) => ({
            ...base,
            borderColor: '#f1c0d6',
            borderRadius: 12,
            '&:hover': {
              borderColor: '#f472b6',
            },
            boxShadow: 'none',
            outline: 'none',
            '&:focus-within': {
              borderColor: '#fb7185',
              boxShadow: '0 0 0 2px rgba(251, 113, 133, 0.35)',
            },
          }),
          option: (base, state) => ({
            ...base,
            backgroundColor: state.isSelected ? '#fb7185' : state.isFocused ? '#ffe4e6' : undefined,
            color: state.isSelected ? 'white' : '#1f2937',
            '&:active': {
              backgroundColor: '#fb7185',
            },
          }),
        }}
      />
    </div>
  );
};

export default SortDropdown;
