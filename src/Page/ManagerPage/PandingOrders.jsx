import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import { toast } from "react-hot-toast";

const PendingOrders = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const [selectedOrder, setSelectedOrder] = useState(null);

  // 🔹 Fetch pending orders
  const { data: orders = [], isLoading, isError } = useQuery({
    queryKey: ["pending-orders"],
    queryFn: async () => {
      const res = await axiosSecure.get("/orders/pending");
      return res.data;
    },
  });

  // 🔹 Approve Order
  const approveMutation = useMutation({
    mutationFn: async (id) => {
      const res = await axiosSecure.patch(`/orders/approve/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["pending-orders"]);
      toast.success("Order approved successfully!");
    },
    onError: (err) => toast.error(err.response?.data?.message || "Failed to approve order"),
  });

  // 🔹 Reject Order
  const rejectMutation = useMutation({
    mutationFn: async (id) => {
      const res = await axiosSecure.patch(`/orders/reject/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["pending-orders"]);
      toast.success("Order rejected successfully!");
    },
    onError: (err) => toast.error(err.response?.data?.message || "Failed to reject order"),
  });

  if (isLoading) return <p className="text-center py-10">Loading pending orders...</p>;
  if (isError) return <p className="text-center py-10 text-red-500">Failed to load orders</p>;

  return (
    <section className="max-w-7xl mx-auto px-4 py-12">
      <h2 className="text-2xl font-bold mb-6">Pending Orders</h2>

      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>User</th>
              <th>Product</th>
              <th>Quantity</th>
              <th>Order Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td>{order._id}</td>
                <td>{order.user?.name || order.email}</td>
                <td>{order.product?.title}</td>
                <td>{order.quantity}</td>
                <td>{new Date(order.createdAt).toLocaleString()}</td>
                <td className="flex gap-2">
                  <button
                    className="btn btn-sm btn-success"
                    onClick={() => approveMutation.mutate(order._id)}
                  >
                    Approve
                  </button>
                  <button
                    className="btn btn-sm btn-error"
                    onClick={() => rejectMutation.mutate(order._id)}
                  >
                    Reject
                  </button>
                  <button
                    className="btn btn-sm btn-info"
                    onClick={() => setSelectedOrder(order)}
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 🔹 View Order Modal */}
      {selectedOrder && (
        <dialog open className="modal modal-bottom sm:modal-middle">
          <div className="modal-box w-full max-w-lg">
            <h3 className="font-bold text-lg mb-4">Order Details</h3>
            <div className="space-y-2">
              <p><strong>Order ID:</strong> {selectedOrder._id}</p>
              <p><strong>User:</strong> {selectedOrder.user?.name || selectedOrder.email}</p>
              <p><strong>Email:</strong> {selectedOrder.email}</p>
              <p><strong>Product:</strong> {selectedOrder.product?.title}</p>
              <p><strong>Quantity:</strong> {selectedOrder.quantity}</p>
              <p><strong>Price:</strong> ${selectedOrder.product?.price}</p>
              <p><strong>Payment Mode:</strong> {selectedOrder.product?.paymentOption || "COD"}</p>
              <p><strong>Order Date:</strong> {new Date(selectedOrder.createdAt).toLocaleString()}</p>
              <p><strong>Status:</strong> {selectedOrder.status}</p>
            </div>
            <div className="modal-action">
              <button className="btn" onClick={() => setSelectedOrder(null)}>
                Close
              </button>
            </div>
          </div>
        </dialog>
      )}
    </section>
  );
};

export default PendingOrders;
