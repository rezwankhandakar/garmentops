import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import useAuth from "../../Hooks/useAuth";

const MyOrders = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const queryClient = useQueryClient();

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
      queryClient.invalidateQueries(["my-orders"]); // Refresh orders
    },
    onError: () => toast.error("Failed to cancel order"),
  });

  if (isLoading) return <p className="text-center py-10">Loading...</p>;
  if (isError) return <p className="text-center py-10 text-red-500">Failed to load orders</p>;

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
                  <td className={`${order.status === "pending" ? "text-yellow-500" : order.status === "completed" ? "text-green-500" : "text-red-500"}`}>
                    {order.status}
                  </td>
                  <td>{order.paymentMethod}</td>
                  <td className="flex gap-2">
                    {/* View Button */}
                    <button
                      className="btn btn-sm btn-info"
                      onClick={() => window.alert(`Order Details for ${order._id}\n\nTracking info: ...`)}
                    >
                      View
                    </button>

                    {/* Cancel Button (only if pending) */}
                    {order.status === "pending" && (
                      <button
                        className="btn btn-sm btn-error"
                        onClick={() => {
                          if (window.confirm("Are you sure you want to cancel this order?")) {
                            cancelMutation.mutate(order._id);
                          }
                        }}
                      >
                        Cancel
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
};

export default MyOrders;
