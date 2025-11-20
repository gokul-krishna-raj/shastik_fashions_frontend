'use client';

import React from 'react';
import { Address } from '@/types';
import { Button } from '@/components/ui/button'; // Assuming shadcn button
import { useRouter } from 'next/navigation';

interface AddressCardProps {
  address: Address;
  onDelete: (id: string) => void;
  onEdit?: (address: Address) => void;
  onSelect?: (id: string) => void;
  isSelected?: boolean;
}
 export default function AddressCard({ address,
  onDelete,
  onEdit,
  onSelect,
  isSelected }: AddressCardProps) {
  const handleEdit = () => {
    if (onEdit) onEdit(address); // ✅ Pass full address data to parent
  };

  return (
    <div className={`border p-4 rounded-lg bg-white shadow-sm flex flex-col justify-between h-full ${isSelected ? 'border-blue-500 ring-2 ring-blue-500' : ''}`}>
      <div>
        <p className="font-semibold">{address.fullName}</p>
        <p>{address.addressLine1}</p>
        {address.addressLine2 && <p>{address.addressLine2}</p>}
        <p>{address.city}, {address.state} - {address.pincode}</p>
        <p>{address.country}</p>
        <p>Mobile: {address.phone}</p>
        <p className="text-sm text-gray-500 mt-1">({address.addressType})</p>
      </div>
      <div className="flex space-x-2 mt-4">
        {onSelect && (
          <Button variant={isSelected ? "default" : "outline"} onClick={() => onSelect(address._id!)} className="flex-grow">
            {isSelected ? "Selected" : "Select"}
          </Button>
        )}
        <Button variant="outline" onClick={handleEdit} className="flex-grow">
          Edit
        </Button>
        <Button variant="destructive" onClick={() => onDelete(address._id!)} className="flex-grow">
          Delete
        </Button>
      </div>
    </div>
  );
};
