import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import { toast } from "react-hot-toast";

const AllOrders = () => {
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  const [searchStatus, setSearchStatus] = useState("");

  // 🔹 Fetch all orders
  const { data: orders = [], isLoading, isError } = useQuery({
    queryKey: ["all-orders", searchStatus],
    queryFn: async () => {
      let url = "/orders";
      if (searchStatus) url += `?status=${searchStatus}`;
      const res = await axiosSecure.get(url);
      return res.data;
    },
  });

  if (isLoading) return <p className="text-center py-10">Loading orders...</p>;
  if (isError) return <p className="text-center py-10 text-red-500">Failed to load orders</p>;

  return (
    <section className="max-w-7xl mx-auto px-4 py-12">
      <h2 className="text-2xl font-bold mb-6">All Orders</h2>

      {/* 🔹 Filter by Status */}
      <div className="flex gap-4 mb-4">
        <select
          className="select select-bordered w-52"
          value={searchStatus}
          onChange={(e) => setSearchStatus(e.target.value)}
        >
          <option value="">All Status</option>
          <option value="Pending">Pending</option>
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>
        </select>
        <button
          className="btn btn-primary"
          onClick={() => toast.success("Filter applied")}
        >
          Apply
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>User</th>
              <th>Product</th>
              <th>Quantity</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-4">No orders found</td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order._id}>
                  <td>{order._id}</td>
                  <td>{order.user?.name || order.user?.email}</td>
                  <td>{order.product?.title}</td>
                  <td>{order.quantity}</td>
                  <td>
                    <span className={`badge ${
  order.status === "pending" ? "badge-warning" :
  order.status === "approved" ? "badge-success" :
  "badge-error"
}`}>
  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
</span>

                  </td>
                  <td>
                    <button
                      className="btn btn-sm btn-info"
                      onClick={() => navigate(`/dashboard/order/${order._id}`)}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default AllOrders;
