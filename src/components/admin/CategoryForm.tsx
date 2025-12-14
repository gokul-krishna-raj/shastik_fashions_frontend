"use client";

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Image as ImageIcon } from "lucide-react";
import Image from 'next/image';

const formSchema = z.object({
    name: z.string().min(1, "Name is required").trim(),
    description: z.string().min(1, "Description is required").trim(),
    image: z.string().url("Please enter a valid image URL").min(1, "Image URL is required"),
});

export type CategoryFormValues = z.infer<typeof formSchema>;

interface CategoryFormProps {
    initialValues?: Partial<CategoryFormValues>;
    onSubmit: (values: CategoryFormValues) => Promise<void>;
    isSubmitting?: boolean;
}

export default function CategoryForm({ initialValues, onSubmit, isSubmitting = false }: CategoryFormProps) {
    const [imagePreview, setImagePreview] = useState<string | null>(initialValues?.image || null);

    const form = useForm<CategoryFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: initialValues?.name || "",
            description: initialValues?.description || "",
            image: initialValues?.image || "",
        },
    });

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const url = e.target.value;
        form.setValue("image", url, { shouldValidate: true });
        if (url && z.string().url().safeParse(url).success) {
            setImagePreview(url);
        } else {
            setImagePreview(null);
        }
    };

    const handleFormSubmit = async (values: CategoryFormValues) => {
        await onSubmit(values);
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-6">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-slate-900 font-semibold">Category Name</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="e.g. Silk Sarees"
                                                className="rounded-lg border-slate-200 focus:border-rose-500 focus:ring-rose-500"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-slate-900 font-semibold">Description</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Describe the category..."
                                                className="rounded-lg border-slate-200 focus:border-rose-500 focus:ring-rose-500 min-h-[120px]"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="image"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-slate-900 font-semibold">Category Image URL</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="https://example.com/image.jpg"
                                                className="rounded-lg border-slate-200 focus:border-rose-500 focus:ring-rose-500"
                                                {...field}
                                                onChange={(e) => {
                                                    field.onChange(e);
                                                    handleImageChange(e);
                                                }}
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            Enter a direct link to the category banner image.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="space-y-4">
                            <FormLabel className="text-slate-900 font-semibold block">Image Preview</FormLabel>
                            <div className="aspect-video relative rounded-lg border-2 border-dashed border-slate-200 bg-slate-50 flex items-center justify-center overflow-hidden">
                                {imagePreview ? (
                                    <Image
                                        src={imagePreview}
                                        alt="Category Preview"
                                        fill
                                        className="object-cover"
                                        onError={() => setImagePreview(null)}
                                    />
                                ) : (
                                    <div className="text-center text-slate-400">
                                        <ImageIcon className="mx-auto h-12 w-12 mb-2 opacity-50" />
                                        <p className="text-sm">Enter a valid URL to see preview</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                        <Button type="button" variant="outline" className="rounded-xl" onClick={() => form.reset()}>
                            Reset
                        </Button>
                        <Button
                            type="submit"
                            className="rounded-xl bg-rose-600 hover:bg-rose-700 text-white min-w-[120px]"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Creating...
                                </>
                            ) : (
                                "Create Category"
                            )}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
}
