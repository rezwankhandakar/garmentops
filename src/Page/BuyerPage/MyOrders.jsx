import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import useAuth from "../../Hooks/useAuth";
import { useNavigate } from "react-router-dom";

const MyOrders = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [cancelOrderId, setCancelOrderId] = useState(null);

  // 🔹 Fetch user orders
  const { data: orders = [], isLoading, isError } = useQuery({
    queryKey: ["my-orders", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/bookings?email=${user.email}`);
      return res.data;
    },
    enabled: !!user?.email,
  });

  // 🔹 Cancel mutation
  const cancelMutation = useMutation({
    mutationFn: async (orderId) => {
      const res = await axiosSecure.patch(`/bookings/cancel/${orderId}`);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Order canceled successfully!");
      queryClient.invalidateQueries(["my-orders"]);
      setCancelOrderId(null);
    },
    onError: () => toast.error("Failed to cancel order"),
  });

  if (isLoading) return <p className="text-center py-10">Loading...</p>;
  if (isError)
    return (
      <p className="text-center py-10 text-red-500">
        Failed to load orders
      </p>
    );

  return (
    <section className="max-w-6xl mx-auto px-4 py-12">
      <h2 className="text-2xl font-bold mb-6">My Orders</h2>

      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Product</th>
                <th>Quantity</th>
                <th>Status</th>
                <th>Payment</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  <td>{order._id}</td>
                  <td>{order.productTitle}</td>
                  <td>{order.quantity}</td>
                  <td
                    className={`font-semibold ${
                      order.status === "pending"
                        ? "text-yellow-500"
                        : order.status === "completed"
                        ? "text-green-500"
                        : "text-red-500"
                    }`}
                  >
                    {order.status}
                  </td>
                  <td>{order.paymentMethod}</td>

                  <td className="flex gap-2">
                    {/* View */}
                    <button
                      className="btn btn-sm btn-info"
                      onClick={() => setSelectedOrder(order)}
                    >
                      View
                    </button>

                    {/* Cancel → pending or awaiting-payment */}
                    {(order.status === "pending" || order.status === "awaiting-payment") && (
                      <button
                        className="btn btn-sm btn-error"
                        onClick={() => setCancelOrderId(order._id)}
                      >
                        Cancel
                      </button>
                    )}

                    {/* Pay → only awaiting-payment */}
                    {order.status === "awaiting-payment" && (
                      <button
                        className="btn btn-sm btn-primary"
                        onClick={() => navigate(`/payment/${order._id}`)}
                      >
                        Pay Now
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 🔹 Order Details Modal */}
      {selectedOrder && (
        <dialog open className="modal modal-bottom sm:modal-middle">
          <div className="modal-box">
            <h3 className="font-bold text-lg mb-3">Order Details</h3>

            <p><b>Order ID:</b> {selectedOrder._id}</p>
            <p><b>Product:</b> {selectedOrder.productTitle}</p>
            <p><b>Quantity:</b> {selectedOrder.quantity}</p>
            <p><b>Status:</b> {selectedOrder.status}</p>

            {/* Tracking Timeline */}
            <div className="mt-4">
              <h4 className="font-semibold mb-2">Tracking Timeline</h4>
              <ul className="steps steps-vertical">
                <li className="step step-primary">Order Placed</li>
                <li
                  className={`step ${
                    selectedOrder.status !== "pending" && "step-primary"
                  }`}
                >
                  Processing
                </li>
                <li
                  className={`step ${
                    selectedOrder.status === "completed" && "step-primary"
                  }`}
                >
                  Delivered
                </li>
              </ul>
            </div>

            <div className="modal-action">
              <button
                className="btn"
                onClick={() => setSelectedOrder(null)}
              >
                Close
              </button>
            </div>
          </div>
        </dialog>
      )}

      {/* 🔹 Cancel Confirmation Modal */}
      {cancelOrderId && (
        <dialog open className="modal modal-bottom sm:modal-middle">
          <div className="modal-box">
            <h3 className="font-bold text-lg">
              Cancel Order?
            </h3>
            <p className="py-4">
              Are you sure you want to cancel this order?
            </p>
            <div className="modal-action">
              <button
                className="btn"
                onClick={() => setCancelOrderId(null)}
              >
                No
              </button>
              <button
                className="btn btn-error"
                onClick={() =>
                  cancelMutation.mutate(cancelOrderId)
                }
              >
                Yes, Cancel
              </button>
            </div>
          </div>
        </dialog>
      )}
    </section>
  );
};

export default MyOrders;
