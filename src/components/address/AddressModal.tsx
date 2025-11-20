import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';

interface AddressModalProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (data: any) => void;
    address?: any;
}

export const AddressModal: React.FC<AddressModalProps> = ({ open, onClose, onSubmit, address }) => {
    const { control, handleSubmit, reset } = useForm({
        defaultValues: {
            fullName: '',
            phone: '',
            email: '',
            pincode: '',
            addressLine1: '',
            addressLine2: '',
            city: '',
            state: '',
            country: 'India',
            addressType: 'Home',
            isDefault: false,
        },
    });

    useEffect(() => {
        if (address) {
            reset(address);
        }
    }, [address, reset]);

    const handleFormSubmit = (data: any) => {
        onSubmit(data);
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md bg-white rounded-xl p-0 max-h-[90vh] sm:max-h-[85vh] flex flex-col">
                <DialogHeader className="px-6 pt-6 pb-4 border-b border-gray-200 flex-shrink-0">
                    <DialogTitle>{address ? 'Edit Address' : 'Add New Address'}</DialogTitle>
                </DialogHeader>

                <div className="overflow-y-auto flex-1 px-6 py-4">
                    <div className="space-y-3">
                        <Controller
                            name="fullName"
                            control={control}
                            render={({ field }) => (
                                <Input {...field} placeholder="Full Name" className="border-gray-300" />
                            )}
                        />

                        <Controller
                            name="phone"
                            control={control}
                            render={({ field }) => <Input {...field} placeholder="Phone Number" />}
                        />

                        <Controller
                            name="email"
                            control={control}
                            render={({ field }) => <Input {...field} placeholder="Email" />}
                        />

                        <Controller
                            name="pincode"
                            control={control}
                            render={({ field }) => <Input {...field} placeholder="Pincode" />}
                        />

                        <Controller
                            name="addressLine1"
                            control={control}
                            render={({ field }) => <Input {...field} placeholder="Address Line 1" />}
                        />

                        <Controller
                            name="addressLine2"
                            control={control}
                            render={({ field }) => <Input {...field} placeholder="Address Line 2" />}
                        />

                        <div className="flex gap-3">
                            <Controller
                                name="city"
                                control={control}
                                render={({ field }) => <Input {...field} placeholder="City" />}
                            />

                            <Controller
                                name="state"
                                control={control}
                                render={({ field }) => <Input {...field} placeholder="State" />}
                            />
                        </div>

                        <Controller
                            name="country"
                            control={control}
                            render={({ field }) => <Input {...field} placeholder="Country" />}
                        />

                        {/* <div className="mt-3">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Address Type
                            </label>
                            <Controller
                                name="addressType"
                                control={control}
                                render={({ field }) => (
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <SelectTrigger className="w-full border border-gray-300 rounded-md bg-white">
                                            <SelectValue placeholder="Select Type" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-white">
                                            <SelectItem value="Home">Home</SelectItem>
                                            <SelectItem value="Work">Work</SelectItem>
                                            <SelectItem value="Other">Other</SelectItem>
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                        </div> */}

                        <div className="mt-4 flex items-center justify-between rounded-md border border-gray-200 p-3 bg-gray-50">
                            <div className="flex-1">
                                <p className="text-sm font-medium text-gray-700">Set as Default</p>
                                <p className="text-xs text-gray-500">Mark this as your primary address</p>
                            </div>
                            <Controller
                                name="isDefault"
                                control={control}
                                render={({ field }) => (
                                    <button
                                        type="button"
                                        onClick={() => field.onChange(!field.value)}
                                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                                            field.value ? 'bg-indigo-600' : 'bg-gray-300'
                                        }`}
                                    >
                                        <span
                                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                                field.value ? 'translate-x-6' : 'translate-x-1'
                                            }`}
                                        />
                                    </button>
                                )}
                            />
                        </div>
                    </div>
                </div>

                <div className="px-6 py-4 border-t border-gray-200 flex-shrink-0">
                    <Button 
                        onClick={handleSubmit(handleFormSubmit)} 
                        className="w-full"
                    >
                        {address ? 'Update Address' : 'Save Address'}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};