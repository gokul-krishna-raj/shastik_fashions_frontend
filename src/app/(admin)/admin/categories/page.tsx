"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { fetchCategories } from "@/store/categorySlice";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Image as ImageIcon } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function CategoriesPage() {
    const dispatch = useDispatch<AppDispatch>();
    const { categories, status, error } = useSelector((state: RootState) => state.categories);

    useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchCategories());
        }
    }, [dispatch, status]);

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Categories</h1>
                    <p className="text-slate-600 mt-1">Manage product categories</p>
                </div>
                <Link href="/admin/categories/new">
                    <Button className="rounded-xl bg-rose-600 hover:bg-rose-700 text-white shadow-lg shadow-rose-200">
                        <Plus className="mr-2 h-4 w-4" />
                        Add Category
                    </Button>
                </Link>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl shadow-sm">
                {status === 'loading' && categories.length === 0 ? (
                    <div className="p-8 text-center text-slate-500">Loading categories...</div>
                ) : error ? (
                    <div className="p-8 text-center text-red-500">Error: {error}</div>
                ) : categories.length === 0 ? (
                    <div className="p-12 text-center">
                        <div className="bg-slate-50 rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4">
                            <ImageIcon className="h-8 w-8 text-slate-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-slate-900">No categories found</h3>
                        <p className="text-slate-500 mt-1 mb-6">Get started by creating your first category.</p>
                        <Link href="/admin/categories/new">
                            <Button variant="outline">Create Category</Button>
                        </Link>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-200">
                                    <th className="px-4 md:px-6 py-4 font-semibold text-slate-700">Image</th>
                                    <th className="px-4 md:px-6 py-4 font-semibold text-slate-700">Name</th>
                                    <th className="px-4 md:px-6 py-4 font-semibold text-slate-700 hidden sm:table-cell">Description</th>
                                    <th className="px-4 md:px-6 py-4 font-semibold text-slate-700 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {categories.map((category) => (
                                    <tr key={category._id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-4 md:px-6 py-4">
                                            <div className="relative h-12 w-16 rounded-lg overflow-hidden border border-slate-200 bg-slate-100">
                                                {category.image ? (
                                                    <Image
                                                        src={category.image}
                                                        alt={category.name}
                                                        fill
                                                        className="object-cover"
                                                        sizes="64px"
                                                    />
                                                ) : (
                                                    <div className="flex items-center justify-center h-full text-slate-400">
                                                        <ImageIcon className="h-4 w-4" />
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-4 md:px-6 py-4">
                                            <div className="font-medium text-slate-900">{category.name}</div>
                                            <div className="text-xs text-slate-500 mt-1 sm:hidden line-clamp-1">{category.description}</div>
                                        </td>
                                        <td className="px-4 md:px-6 py-4 text-slate-600 hidden sm:table-cell">
                                            <div className="max-w-md line-clamp-2" title={category.description}>
                                                {category.description}
                                            </div>
                                        </td>
                                        <td className="px-4 md:px-6 py-4 text-right">
                                            <Link href={`/admin/categories/${category._id}/edit`}>
                                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg">
                                                    <Edit className="h-4 w-4" />
                                                    <span className="sr-only">Edit</span>
                                                </Button>
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
