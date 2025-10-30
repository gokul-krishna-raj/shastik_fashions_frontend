
import React from 'react';
import Select from 'react-select';

interface SortDropdownProps {
  currentSort: string;
  onSortChange: (newSort: string) => void;
}

const sortOptions = [
  { value: 'newest', label: 'Newest' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'best_selling', label: 'Best Selling' },
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
            borderColor: '#d1d5db',
            '&:hover': {
              borderColor: '#9ca3af',
            },
            boxShadow: 'none',
            outline: 'none',
            '&:focus-within': {
              borderColor: '#a0522d',
              boxShadow: '0 0 0 2px rgba(160, 82, 45, 0.5)',
            },
          }),
          option: (base, state) => ({
            ...base,
            backgroundColor: state.isSelected ? '#a0522d' : state.isFocused ? '#f5f5dc' : undefined,
            color: state.isSelected ? 'white' : '#333333',
            '&:active': {
              backgroundColor: '#a0522d',
            },
          }),
        }}
      />
    </div>
  );
};

export default SortDropdown;
