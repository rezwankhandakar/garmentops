import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import { toast } from "react-hot-toast";

const AllOrders = () => {
  const axiosSecure = useAxiosSecure();
  const [searchStatus, setSearchStatus] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);

  //  Fetch all orders
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

      {/*  Filter by Status */}
      <div className="flex gap-4 mb-4">
        <select
          className="select select-bordered w-52"
          value={searchStatus}
          onChange={(e) => setSearchStatus(e.target.value)}
        >
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
        <button
          className="btn btn-primary"
          onClick={() => toast.success("Filter applied")}
        >
          Apply
        </button>
      </div>

      {/*  Orders Table */}
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
                      onClick={() => setSelectedOrder(order)}
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

      {/*  Order View Modal */}
      {selectedOrder && (
        <dialog open className="modal modal-bottom sm:modal-middle">
          <div className="modal-box max-w-2xl">
            <h3 className="font-bold text-lg mb-4">Order Details</h3>

            <p><b>Order ID:</b> {selectedOrder._id}</p>
            <p><b>User:</b> {selectedOrder.user?.name || selectedOrder.user?.email}</p>
            <p><b>Product:</b> {selectedOrder.product?.title}</p>
            <p><b>Quantity:</b> {selectedOrder.quantity}</p>
            <p><b>Status:</b> {selectedOrder.status}</p>
            <p><b>Payment Method:</b> {selectedOrder.paymentMethod}</p>

            {/*  Tracking Timeline */}
            {selectedOrder.tracking?.length > 0 && (
              <div className="mt-4">
                <h4 className="font-semibold mb-2">Tracking Timeline</h4>
                <ul className="steps steps-vertical">
                  {selectedOrder.tracking.map((t, i) => (
                    <li key={i} className={`step ${i === selectedOrder.tracking.length - 1 ? "step-primary" : ""}`}>
                      <div>
                        <p className="font-semibold">{t.status}</p>
                        <p className="text-sm">{t.location}</p>
                        <p className="text-xs">{new Date(t.dateTime).toLocaleString()}</p>
                        {t.note && <p className="text-xs italic">{t.note}</p>}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="modal-action">
              <button className="btn" onClick={() => setSelectedOrder(null)}>Close</button>
            </div>
          </div>
        </dialog>
      )}
    </section>
  );
};

export default AllOrders;
