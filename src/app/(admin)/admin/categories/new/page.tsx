"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { createCategory, resetCreateStatus } from "@/store/categorySlice";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import CategoryForm, { CategoryFormValues } from "@/components/admin/CategoryForm";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function CreateCategoryPage() {
    const router = useRouter();
    const dispatch = useDispatch<AppDispatch>();
    const { toast } = useToast();
    const { createStatus, error } = useSelector((state: RootState) => state.categories);

    // Reset status on mount
    useEffect(() => {
        dispatch(resetCreateStatus());
    }, [dispatch]);

    // Handle success/error side effects
    useEffect(() => {
        if (createStatus === 'succeeded') {
            toast({
                title: "Success",
                description: "Category created successfully!",
            });
            router.push('/admin/products'); // Redirect to products list as there isn't a dedicated categories list yet
        } else if (createStatus === 'failed') {
            toast({
                title: "Error",
                description: error || "Failed to create category",
                variant: "destructive",
            });
        }
    }, [createStatus, error, router, toast]);

    const onSubmit = async (values: CategoryFormValues) => {
        await dispatch(createCategory(values));
    };

    return (
        <div className="space-y-6 max-w-4xl mx-auto pb-10">
            <div className="flex items-center gap-4">
                <Link href="/admin/products">
                    <Button variant="ghost" size="icon" className="rounded-lg">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">New Category</h1>
                    <p className="text-slate-600 mt-1">Add a new product category to your catalog</p>
                </div>
            </div>

            <CategoryForm
                onSubmit={onSubmit}
                isSubmitting={createStatus === 'loading'}
            />
        </div>
    );
}
