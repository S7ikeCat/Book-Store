import React, { useMemo, useState } from "react";
import Swal from "sweetalert2";
import {
  FiSearch,
  FiTrash2,
  FiMail,
  FiUser,
  FiShoppingBag,
  FiDollarSign,
  FiClock,
  FiRefreshCw,
} from "react-icons/fi";

import {
  useGetOrdersQuery,
  useGetAllOrdersQuery,
  useCancelOrderMutation,
} from "../../../src/redux/features/orders/ordersSlice";
import { skipToken } from "@reduxjs/toolkit/query";
import type { OrderData } from "../../types/ordersTypes";

const OrdersDashboard: React.FC = () => {
  const role = localStorage.getItem("role"); // "ADMIN" | "USER"

  const userQuery = useGetOrdersQuery(role === "ADMIN" ? skipToken : undefined);
  const adminQuery = useGetAllOrdersQuery(role === "ADMIN" ? undefined : skipToken);

  const query = role === "ADMIN" ? adminQuery : userQuery;
  const { data: orders = [], isLoading, isError, refetch } = query;

  const [cancelOrder, { isLoading: isCanceling }] = useCancelOrderMutation();
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return orders;

    return orders.filter((o) => {
      const email = o.shipping_info?.email?.toLowerCase() ?? "";
      const name = o.shipping_info?.name?.toLowerCase() ?? "";
      const total = String(o.total_price ?? "").toLowerCase();

      return email.includes(s) || name.includes(s) || total.includes(s);
    });
  }, [orders, q]);

  const handleCancel = async (id: number, email: string) => {
    const confirm = await Swal.fire({
      title: "Cancel this order?",
      html: `<div style="text-align:left;line-height:1.4">
              <div><b>Email:</b> ${email}</div>
             </div>`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, cancel",
      cancelButtonText: "No",
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#64748b",
      reverseButtons: true,
      focusCancel: true,
    });

    if (!confirm.isConfirmed) return;

    try {
      await cancelOrder(id).unwrap();
      await Swal.fire({
        icon: "success",
        title: "Done",
        text: "The order has been canceled.",
        timer: 1200,
        showConfirmButton: false,
      });
    } catch (e) {
      console.error(e);
      await Swal.fire("Error", "Failed to cancel the order", "error");
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="animate-pulse bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <div className="h-7 w-48 bg-slate-200 rounded mb-6" />
          <div className="h-10 w-full bg-slate-200 rounded mb-4" />
          <div className="h-64 w-full bg-slate-200 rounded" />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <div className="bg-white rounded-2xl shadow-sm border border-rose-200 p-6">
          <div className="text-lg font-semibold text-rose-600 mb-2">
            Failed to load orders
          </div>
          <div className="text-slate-600 mb-4">
            Please check the server and your authorization token.
          </div>
          <button
            onClick={() => refetch()}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 text-white hover:bg-slate-800"
          >
            <FiRefreshCw /> Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <FiShoppingBag className="text-slate-700" />
              <h1 className="text-2xl font-bold text-slate-900">
                Orders {role === "ADMIN" ? "(All)" : "(My)"}
              </h1>
            </div>
            <p className="text-slate-500 mt-1">
              Total:{" "}
              <span className="font-semibold text-slate-700">
                {filtered.length}
              </span>
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search: email, name, amount…"
                className="w-full sm:w-80 pl-10 pr-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10"
              />
            </div>

            <button
              onClick={() => refetch()}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700"
            >
              <FiRefreshCw />
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="mt-5 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="px-5 py-4 text-left font-semibold">Customer</th>
                <th className="px-5 py-4 text-left font-semibold">Items</th>
                <th className="px-5 py-4 text-left font-semibold">Total</th>
                <th className="px-5 py-4 text-left font-semibold">Date</th>
                <th className="px-5 py-4 text-right font-semibold">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-10 text-center text-slate-500">
                    No orders found
                  </td>
                </tr>
              ) : (
                filtered.map((order: OrderData) => {
                  const email = order.shipping_info?.email ?? "—";
                  const name = order.shipping_info?.name ?? "—";
                
                  const itemsCount =
                    order.items?.reduce((sum, item) => sum + (item.quantity ?? 0), 0) ?? 0;
                
                  const created = order.created_at
                    ? new Date(order.created_at).toLocaleString()
                    : "—";
                
                  return (
                    <tr key={order.id} className="hover:bg-slate-50/60">
                      <td className="px-5 py-4">
                        <div className="flex flex-col gap-1">
                          <div className="inline-flex items-center gap-2 font-medium text-slate-900">
                            <FiUser className="text-slate-500" />
                            {name}
                          </div>
                          <div className="inline-flex items-center gap-2 text-slate-500">
                            <FiMail className="text-slate-400" />
                            {email}
                          </div>
                        </div>
                      </td>
                
                      <td className="px-5 py-4">
                        <span className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-1.5 text-slate-700">
                          <FiShoppingBag className="text-slate-500" />
                          {itemsCount} pcs
                        </span>
                      </td>
                
                      <td className="px-5 py-4">
                        <span className="inline-flex items-center gap-2 rounded-xl bg-emerald-50 text-emerald-700 px-3 py-1.5 font-semibold">
                          <FiDollarSign />
                          {order.total_price}
                        </span>
                      </td>
                
                      <td className="px-5 py-4 text-slate-600">
                        <span className="inline-flex items-center gap-2">
                          <FiClock className="text-slate-400" />
                          {created}
                        </span>
                      </td>
                
                      <td className="px-5 py-4">
                        <div className="flex justify-end">
                          <button
                            onClick={() => handleCancel(order.id, email)}
                            disabled={isCanceling}
                            className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-rose-600 text-white hover:bg-rose-700 disabled:opacity-60"
                          >
                            <FiTrash2 />
                            Cancel
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="px-5 py-4 bg-slate-50 text-slate-500 text-xs">
          Tip: search by <b>email</b>, <b>name</b> or <b>total amount</b>.
        </div>
      </div>
    </div>
  );
};

export default OrdersDashboard;