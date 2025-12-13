"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { fetchAdminOrders, updateOrderStatus } from "@/store/adminOrderSlice";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { Eye, ChevronDown } from "lucide-react";

type OrderStatus = 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';

const statusOptions: OrderStatus[] = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

const getStatusBadgeColor = (status: string) => {
  switch (status) {
    case "Pending":
      return "bg-amber-100 text-amber-700 border-amber-200";
    case "Processing":
      return "bg-blue-100 text-blue-700 border-blue-200";
    case "Shipped":
      return "bg-purple-100 text-purple-700 border-purple-200";
    case "Delivered":
      return "bg-emerald-100 text-emerald-700 border-emerald-200";
    case "Cancelled":
      return "bg-red-100 text-red-700 border-red-200";
    default:
      return "bg-slate-100 text-slate-700 border-slate-200";
  }
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export default function AdminOrdersPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { orders, status, error } = useSelector((state: RootState) => state.adminOrder);
  const { toast } = useToast();
  const [statusUpdateDialog, setStatusUpdateDialog] = useState<{
    open: boolean;
    orderId: string | null;
    newStatus: OrderStatus | null;
  }>({
    open: false,
    orderId: null,
    newStatus: null,
  });

  useEffect(() => {
    dispatch(fetchAdminOrders());
  }, [dispatch]);

  const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
    setStatusUpdateDialog({
      open: true,
      orderId,
      newStatus,
    });
  };

  const confirmStatusUpdate = async () => {
    if (!statusUpdateDialog.orderId || !statusUpdateDialog.newStatus) return;

    try {
      await dispatch(
        updateOrderStatus({
          orderId: statusUpdateDialog.orderId,
          status: statusUpdateDialog.newStatus,
        })
      ).unwrap();

      toast({
        title: "Success",
        description: "Order status updated successfully",
      });

      setStatusUpdateDialog({
        open: false,
        orderId: null,
        newStatus: null,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error || "Failed to update order status",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Orders</h1>
        <p className="text-slate-600 mt-1">Manage and track all customer orders</p>
      </div>

      <Card className="rounded-xl border border-slate-200 shadow-sm bg-white">
        <CardHeader>
          <CardTitle className="text-slate-900">Order List</CardTitle>
        </CardHeader>
        <CardContent>
          {status === 'loading' && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-600 mx-auto mb-4"></div>
              <p className="text-slate-600">Loading orders...</p>
            </div>
          )}

          {status === 'failed' && (
            <div className="text-center py-8">
              <p className="text-red-600">Error: {error || 'Failed to load orders'}</p>
            </div>
          )}

          {status === 'succeeded' && orders.length === 0 && (
            <div className="text-center py-8">
              <p className="text-slate-600">No orders found.</p>
            </div>
          )}

          {status === 'succeeded' && orders.length > 0 && (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-slate-200">
                    <TableHead className="text-slate-600">Order ID</TableHead>
                    <TableHead className="text-slate-600">Customer</TableHead>
                    <TableHead className="text-slate-600">Date</TableHead>
                    <TableHead className="text-slate-600">Items</TableHead>
                    <TableHead className="text-slate-600">Total</TableHead>
                    <TableHead className="text-slate-600">Payment</TableHead>
                    <TableHead className="text-slate-600">Status</TableHead>
                    <TableHead className="text-right text-slate-600">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order) => (
                    <TableRow key={order._id} className="border-slate-100">
                      <TableCell className="font-medium text-slate-900">
                        #{order._id.slice(-8).toUpperCase()}
                      </TableCell>
                      <TableCell className="text-slate-600">
                        {order.userId ? `User ${order.userId.slice(-6)}` : 'N/A'}
                      </TableCell>
                      <TableCell className="text-slate-600">
                        {formatDate(order.createdAt)}
                      </TableCell>
                      <TableCell className="text-slate-600">
                        {order.products?.length || 0} item(s)
                      </TableCell>
                      <TableCell className="font-semibold text-slate-900">
                        ₹{order.totalAmount.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={`${
                            order.paymentStatus === 'paid'
                              ? 'bg-emerald-100 text-emerald-700 border-emerald-200'
                              : order.paymentStatus === 'pending'
                              ? 'bg-amber-100 text-amber-700 border-amber-200'
                              : 'bg-red-100 text-red-700 border-red-200'
                          } border rounded-full px-2 py-0.5 text-xs font-medium`}
                        >
                          {order.paymentStatus}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Select
                          value={order.status}
                          onValueChange={(value) =>
                            handleStatusChange(order._id, value as OrderStatus)
                          }
                        >
                          <SelectTrigger className={`w-32 h-8 rounded-lg border ${getStatusBadgeColor(order.status)}`}>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {statusOptions.map((status) => (
                              <SelectItem key={status} value={status}>
                                {status}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" className="h-8 rounded-lg">
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <AlertDialog
        open={statusUpdateDialog.open}
        onOpenChange={(open) =>
          setStatusUpdateDialog({ open, orderId: null, newStatus: null })
        }
      >
        <AlertDialogContent className="rounded-xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Update Order Status</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to change the order status to{" "}
              <strong>{statusUpdateDialog.newStatus}</strong>? This action will notify the customer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-lg">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmStatusUpdate}
              className="bg-rose-600 hover:bg-rose-700 rounded-lg"
            >
              Update Status
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
