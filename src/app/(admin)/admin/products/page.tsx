"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { fetchAdminProducts, deleteAdminProduct, setFilters, setPage } from "@/store/adminProductSlice";
import { fetchCategories } from "@/store/categorySlice";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { Trash2, Edit, Plus, Image as ImageIcon, Search, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";

export default function AdminProductsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { products, status, error, pagination, filters } = useSelector(
    (state: RootState) => state.adminProduct
  );
  const { categories } = useSelector((state: RootState) => state.categories);
  const { toast } = useToast();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchAdminProducts({
      page: pagination.page,
      limit: pagination.limit,
      search: filters.search,
      category: filters.category
    }));
  }, [dispatch, pagination.page, pagination.limit, filters.search, filters.category]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setFilters({ search: e.target.value }));
  };

  const handleCategoryChange = (value: string) => {
    dispatch(setFilters({ category: value }));
  };

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > Math.ceil(pagination.total / pagination.limit)) return;
    dispatch(setPage(newPage));
  };

  const handleDelete = async () => {
    if (!productToDelete) return;

    try {
      await dispatch(deleteAdminProduct(productToDelete)).unwrap();
      toast({
        title: "Success",
        description: "Product deleted successfully",
      });
      setDeleteDialogOpen(false);
      setProductToDelete(null);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error || "Failed to delete product",
        variant: "destructive",
      });
    }
  };

  const openDeleteDialog = (productId: string) => {
    setProductToDelete(productId);
    setDeleteDialogOpen(true);
  };

  const totalPages = Math.ceil(pagination.total / pagination.limit);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Products</h1>
          <p className="text-slate-600 mt-1">Manage your product catalog</p>
        </div>
        <Link href="/admin/products/new">
          <Button className="bg-rose-600 hover:bg-rose-700 text-white rounded-xl">
            <Plus className="h-4 w-4 mr-2" />
            Add New Product
          </Button>
        </Link>
      </div>

      <Card className="rounded-xl border border-slate-200 shadow-sm bg-white">
        <CardHeader>
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
            <CardTitle className="text-slate-900 hidden md:block">Product List</CardTitle>
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search products..."
                  className="pl-9 rounded-lg"
                  value={filters.search}
                  onChange={handleSearchChange}
                />
              </div>
              <Select value={filters.category} onValueChange={handleCategoryChange}>
                <SelectTrigger className="w-full sm:w-48 rounded-lg">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category._id} value={category._id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {status === 'loading' && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-600 mx-auto"></div>
              <p className="text-slate-600 mt-2">Loading products...</p>
            </div>
          )}

          {status === 'failed' && (
            <div className="text-center py-8">
              <p className="text-red-600">Error: {error || 'Failed to load products'}</p>
            </div>
          )}

          {status === 'succeeded' && products.length === 0 && (
            <div className="text-center py-8">
              <p className="text-slate-600">No products found.</p>
            </div>
          )}

          {status === 'succeeded' && products.length > 0 && (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-slate-200">
                      <TableHead className="text-slate-600">Image</TableHead>
                      <TableHead className="text-slate-600">Name</TableHead>
                      <TableHead className="text-slate-600">Category</TableHead>
                      <TableHead className="text-slate-600">Price</TableHead>
                      <TableHead className="text-slate-600">Stock</TableHead>
                      <TableHead className="text-slate-600">Status</TableHead>
                      <TableHead className="text-right text-slate-600">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products.map((product) => (
                      <TableRow key={product._id} className="border-slate-100">
                        <TableCell>
                          {product.images && product.images.length > 0 ? (
                            <div className="relative h-12 w-12 rounded-lg overflow-hidden border border-slate-200">
                              <Image
                                src={product.images[0]}
                                alt={product.name}
                                fill
                                className="object-cover"
                                sizes="48px"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = 'https://placehold.co/48x48?text=Img';
                                }}
                              />
                            </div>
                          ) : (
                            <div className="h-12 w-12 rounded-lg bg-slate-100 flex items-center justify-center border border-slate-200">
                              <ImageIcon className="h-5 w-5 text-slate-400" />
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="font-medium text-slate-900">{product.name}</TableCell>
                        <TableCell className="text-slate-600">
                          {typeof product.category === 'string'
                            ? (categories.find(c => c._id === product.category)?.name || 'N/A')
                            : product.category?.name || 'N/A'}
                        </TableCell>
                        <TableCell className="font-semibold text-slate-900">
                          ₹{product.price.toLocaleString('en-IN')}
                        </TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${product.stock > 0
                              ? 'bg-emerald-100 text-emerald-700'
                              : 'bg-red-100 text-red-700'
                            }`}>
                            {product.stock}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1 flex-wrap">
                            {product.isBestSeller && (
                              <span className="px-2 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700">
                                Best Seller
                              </span>
                            )}
                            {product.isNewArrival && (
                              <span className="px-2 py-1 rounded-full text-xs font-medium bg-rose-100 text-rose-700">
                                New
                              </span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Link href={`/admin/products/${product._id}/edit`}>
                              <Button variant="ghost" size="sm" className="h-8 rounded-lg">
                                <Edit className="h-4 w-4" />
                              </Button>
                            </Link>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 rounded-lg text-red-600 hover:text-red-700 hover:bg-red-50"
                              onClick={() => openDeleteDialog(product._id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination Controls */}
              <div className="flex items-center justify-between mt-4">
                <div className="text-sm text-slate-600">
                  Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} entries
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-lg h-8 px-2"
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page <= 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </Button>
                  <div className="text-sm font-medium">
                    Page {pagination.page} of {totalPages || 1}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-lg h-8 px-2"
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={pagination.page >= totalPages}
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="rounded-xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Product</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this product? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-lg">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700 rounded-lg"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
