"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { fetchCategoryDetails, updateCategory, resetUpdateStatus, clearCurrentCategory } from "@/store/categorySlice";
import { useToast } from "@/hooks/use-toast";
import { useRouter, useParams } from "next/navigation";
import CategoryForm, { CategoryFormValues } from "@/components/admin/CategoryForm";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function EditCategoryPage() {
    const router = useRouter();
    const params = useParams();
    const dispatch = useDispatch<AppDispatch>();
    const { toast } = useToast();
    const { currentCategory, status, updateStatus, error } = useSelector((state: RootState) => state.categories);

    const id = params?.id as string;

    // Fetch category details on mount
    useEffect(() => {
        if (id) {
            dispatch(fetchCategoryDetails(id));
        }
        return () => {
            dispatch(clearCurrentCategory());
            dispatch(resetUpdateStatus());
        };
    }, [dispatch, id]);

    // Handle update side effects
    useEffect(() => {
        if (updateStatus === 'succeeded') {
            toast({
                title: "Success",
                description: "Category updated successfully!",
            });
            router.push('/admin/categories');
        } else if (updateStatus === 'failed') {
            toast({
                title: "Error",
                description: error || "Failed to update category",
                variant: "destructive",
            });
        }
    }, [updateStatus, error, router, toast]);

    const onSubmit = async (values: CategoryFormValues) => {
        await dispatch(updateCategory({ id, payload: values }));
    };

    if (status === 'loading' || !currentCategory) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-rose-600" />
            </div>
        );
    }

    return (
        <div className="space-y-6 max-w-4xl mx-auto pb-10">
            <div className="flex items-center gap-4">
                <Link href="/admin/categories">
                    <Button variant="ghost" size="icon" className="rounded-lg">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Edit Category</h1>
                    <p className="text-slate-600 mt-1">Update category details</p>
                </div>
            </div>

            <CategoryForm
                initialValues={{
                    name: currentCategory.name,
                    description: currentCategory.description,
                    image: currentCategory.image
                }}
                onSubmit={onSubmit}
                isSubmitting={updateStatus === 'loading'}
            />
        </div>
    );
}
