


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

  // Fetch My Orders
  const { data: orders = [], isLoading, isError } = useQuery({
    queryKey: ["my-orders", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/bookings?email=${user.email}`);
      return res.data;
    },
    enabled: !!user?.email,
  });

  // Cancel Order
  const cancelMutation = useMutation({
    mutationFn: async (orderId) => {
      const res = await axiosSecure.patch(`/bookings/cancel/${orderId}`);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Order canceled");
      queryClient.invalidateQueries(["my-orders"]);
      setCancelOrderId(null);
    },
    onError: () => toast.error("Cancel failed"),
  });

  if (isLoading) return <p className="text-center py-10">Loading...</p>;
  if (isError) return <p className="text-center py-10 text-red-500">Failed to load</p>;

  return (
    <section className="max-w-6xl mx-auto px-4 py-12">
      <h2 className="text-2xl font-bold mb-6">My Orders</h2>

      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Product</th>
              <th>Qty</th>
              <th>Status</th>
              <th>Payment</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td>{order._id}</td>
                <td>{order.productTitle}</td>
                <td>{order.quantity}</td>
                <td>{order.status}</td>
                <td>{order.paymentMethod}</td>

                <td className="flex gap-2">
                  <button
                    className="btn btn-sm btn-info"
                    onClick={() => setSelectedOrder(order)}
                  >
                    View / Track
                  </button>

                  {(order.status === "pending" ||
                    order.status === "awaiting-payment") && (
                    <button
                      className="btn btn-sm btn-error"
                      onClick={() => setCancelOrderId(order._id)}
                    >
                      Cancel
                    </button>
                  )}

                  {order.status === "awaiting-payment" && (
                    <button
                      className="btn btn-sm btn-primary"
                      onClick={() => navigate(`/payment/${order._id}`)}
                    >
                      Pay
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ORDER + TRACKING MODAL */}
      {selectedOrder && (
        <dialog open className="modal modal-bottom sm:modal-middle">
          <div className="modal-box max-w-2xl">
            <h3 className="font-bold text-lg mb-2">Order Details</h3>

            <p><b>Product:</b> {selectedOrder.productTitle}</p>
            <p><b>Quantity:</b> {selectedOrder.quantity}</p>
            <p><b>Status:</b> {selectedOrder.status}</p>

            {/* Tracking Timeline */}
            <div className="mt-5">
              <h4 className="font-semibold mb-3">Tracking Timeline</h4>

              {selectedOrder.tracking?.length > 0 ? (
                <ul className="steps steps-vertical">
                  {selectedOrder.tracking.map((t, i) => (
                    <li
                      key={i}
                      className={`step ${
                        i === selectedOrder.tracking.length - 1
                          ? "step-primary"
                          : ""
                      }`}
                    >
                      <div>
                        <p className="font-semibold">{t.status}</p>
                        <p className="text-sm">{t.location}</p>
                        <p className="text-xs">
                          {new Date(t.dateTime).toLocaleString()}
                        </p>
                        {t.note && (
                          <p className="text-xs italic">{t.note}</p>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-500">
                  No tracking updates yet
                </p>
              )}
            </div>

            <div className="modal-action">
              <button className="btn" onClick={() => setSelectedOrder(null)}>
                Close
              </button>
            </div>
          </div>
        </dialog>
      )}

      {/* Cancel Modal */}
      {cancelOrderId && (
        <dialog open className="modal modal-bottom sm:modal-middle">
          <div className="modal-box">
            <h3 className="font-bold">Cancel this order?</h3>
            <div className="modal-action">
              <button className="btn" onClick={() => setCancelOrderId(null)}>
                No
              </button>
              <button
                className="btn btn-error"
                onClick={() => cancelMutation.mutate(cancelOrderId)}
              >
                Yes Cancel
              </button>
            </div>
          </div>
        </dialog>
      )}
    </section>
  );
};

export default MyOrders;


