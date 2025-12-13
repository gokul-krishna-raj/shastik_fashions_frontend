"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { fetchAdminStats } from "@/store/adminSlice";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Package, Users, TrendingUp, TrendingDown } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function AdminDashboardPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { stats, status, error } = useSelector((state: RootState) => state.admin);

  useEffect(() => {
    dispatch(fetchAdminStats());
  }, [dispatch]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatChange = (change: number) => {
    const sign = change >= 0 ? '+' : '';
    const color = change >= 0 ? 'text-emerald-600' : 'text-red-600';
    const Icon = change >= 0 ? TrendingUp : TrendingDown;
    return (
      <span className={`text-xs flex items-center gap-1 ${color}`}>
        <Icon className="h-3 w-3" />
        {sign}{change.toFixed(1)}%
      </span>
    );
  };

  if (status === 'loading') {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-slate-900">Admin Dashboard</h1>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="rounded-xl border border-slate-200 shadow-sm">
              <CardContent className="p-6">
                <div className="h-20 bg-slate-100 animate-pulse rounded-lg" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (status === 'failed') {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-slate-900">Admin Dashboard</h1>
        <Card className="rounded-xl border border-red-200 bg-red-50">
          <CardContent className="p-6">
            <p className="text-red-700">Error: {error || 'Failed to load dashboard stats'}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const salesData = stats?.salesData || [
    { name: 'Jan', sales: 0 },
    { name: 'Feb', sales: 0 },
    { name: 'Mar', sales: 0 },
    { name: 'Apr', sales: 0 },
    { name: 'May', sales: 0 },
    { name: 'Jun', sales: 0 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Admin Dashboard</h1>
        <p className="text-slate-600 mt-1">Overview of your store performance</p>
      </div>

      {/* Stat Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow bg-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Total Revenue</CardTitle>
            <div className="h-10 w-10 rounded-lg bg-rose-100 flex items-center justify-center">
              <DollarSign className="h-5 w-5 text-rose-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">
              {stats ? formatCurrency(stats.totalRevenue) : '₹0'}
            </div>
            {stats && (
              <p className="text-xs text-slate-500 mt-2">
                {formatChange(stats.revenueChange)} from last month
              </p>
            )}
          </CardContent>
        </Card>

        <Card className="rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow bg-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Total Orders</CardTitle>
            <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <Package className="h-5 w-5 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">
              {stats ? stats.totalOrders.toLocaleString() : '0'}
            </div>
            {stats && (
              <p className="text-xs text-slate-500 mt-2">
                {formatChange(stats.ordersChange)} from last month
              </p>
            )}
          </CardContent>
        </Card>

        <Card className="rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow bg-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Active Users</CardTitle>
            <div className="h-10 w-10 rounded-lg bg-emerald-100 flex items-center justify-center">
              <Users className="h-5 w-5 text-emerald-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">
              {stats ? stats.totalUsers.toLocaleString() : '0'}
            </div>
            {stats && (
              <p className="text-xs text-slate-500 mt-2">
                {formatChange(stats.usersChange)} from last month
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Sales Chart */}
      <Card className="rounded-xl border border-slate-200 shadow-sm bg-white">
        <CardHeader>
          <CardTitle className="text-slate-900">Sales Over Time</CardTitle>
        </CardHeader>
        <CardContent>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={salesData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="sales"
                  stroke="#e11d48"
                  strokeWidth={2}
                  activeDot={{ r: 6 }}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}