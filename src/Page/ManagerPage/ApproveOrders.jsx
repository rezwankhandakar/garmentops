import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import useAxiosSecure from "../../Hooks/useAxiosSecure";

const ApprovedOrders = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Fetch approved orders
  const { data: orders = [], isLoading, isError } = useQuery({
    queryKey: ["approved-orders"],
    queryFn: async () => {
      const res = await axiosSecure.get("/orders/approved");
      return res.data;
    },
  });

  // Add tracking mutation
  const trackingMutation = useMutation({
    mutationFn: async ({ orderId, tracking }) => {
      const res = await axiosSecure.patch(`/orders/tracking/${orderId}`, tracking);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Tracking info added");
      queryClient.invalidateQueries(["approved-orders"]);
      setSelectedOrder(null);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to add tracking");
    },
  });

  if (isLoading) return <p className="text-center py-10">Loading approved orders...</p>;
  if (isError) return <p className="text-center py-10 text-red-500">Failed to load orders</p>;

  return (
    <section className="max-w-7xl mx-auto px-4 py-12">
      <h2 className="text-2xl font-bold mb-6">Approved Orders</h2>

      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>User</th>
              <th>Product</th>
              <th>Quantity</th>
              <th>Approved Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td>{order._id}</td>
                <td>{order.user?.firstName} {order.user?.lastName}</td>
                <td>{order.product?.title}</td>
                <td>{order.quantity}</td>
                <td>{new Date(order.approvedAt).toLocaleString()}</td>
                <td className="flex gap-2">
                  <button className="btn btn-sm btn-info" onClick={() => setSelectedOrder(order)}>
                    Add Tracking
                  </button>
                  <button className="btn btn-sm btn-secondary" onClick={() => setSelectedOrder(order)}>
                    View Tracking
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 🔹 Tracking Modal */}
      {selectedOrder && (
        <dialog open className="modal modal-bottom sm:modal-middle">
          <div className="modal-box w-full max-w-lg">
            <h3 className="font-bold text-lg mb-4">Add Tracking Info</h3>
            <form
              className="space-y-3"
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.target;
                const tracking = {
                  status: form.status.value,
                  location: form.location.value,
                  note: form.note.value,
                  dateTime: form.dateTime.value,
                };
                trackingMutation.mutate({ orderId: selectedOrder._id, tracking });
              }}
            >
              <select name="status" className="select select-bordered w-full" required>
                <option value="">Select Status</option>
                <option value="Cutting Completed">Cutting Completed</option>
                <option value="Sewing Started">Sewing Started</option>
                <option value="Finishing">Finishing</option>
                <option value="QC Checked">QC Checked</option>
                <option value="Packed">Packed</option>
                <option value="Shipped">Shipped</option>
                <option value="Out for Delivery">Out for Delivery</option>
              </select>
              <input type="text" name="location" placeholder="Location" className="input input-bordered w-full" />
              <input type="text" name="note" placeholder="Note" className="input input-bordered w-full" />
              <input type="datetime-local" name="dateTime" className="input input-bordered w-full" required />

              <div className="modal-action justify-between">
                <button type="button" className="btn" onClick={() => setSelectedOrder(null)}>Close</button>
                <button type="submit" className="btn btn-primary">Add Tracking</button>
              </div>
            </form>

            {/* Tracking Timeline */}
            {selectedOrder.tracking?.length > 0 && (
              <div className="mt-6">
                <h4 className="font-bold mb-2">Tracking Timeline:</h4>
                <ul className="steps steps-vertical">
                  {selectedOrder.tracking.map((t, idx) => (
                    <li key={idx} className="step step-primary">
                      <div>
                        <span>{t.status}</span> - <small>{t.location}</small> - <small>{new Date(t.dateTime).toLocaleString()}</small>
                        {t.note && <p className="text-sm">{t.note}</p>}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </dialog>
      )}
    </section>
  );
};

export default ApprovedOrders;
