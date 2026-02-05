import React, { useState, useEffect } from "react";
import { useParams, Navigate, useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import useAxiosSecure from "../Hooks/useAxiosSecure";
import useAuth from "../Hooks/useAuth";
import { toast } from "react-hot-toast";

const BookingPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const [quantity, setQuantity] = useState(1);
  const [orderPrice, setOrderPrice] = useState(0);

  // 🔹 Fetch product by id
  const { data: product, isLoading, isError } = useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      const res = await axiosSecure.get(`/products/${id}`);
      return res.data;
    },
  });

  // 🔹 Update order price when quantity changes
  useEffect(() => {
    if (product) setOrderPrice(product.price * quantity);
  }, [product, quantity]);

  // 🔹 Redirect if not logged in
  if (!user) return <Navigate to="/login" replace />;
  if (isLoading) return <p className="text-center py-10">Loading...</p>;
  if (isError) return <p className="text-center py-10 text-red-500">Failed to load product</p>;

  // 🔹 Only buyers can order
  const canOrder = user.role !== "admin" && user.role !== "manager";

  // 🔹 Booking mutation
  const bookingMutation = useMutation({
    mutationFn: async (bookingData) => {
      const res = await axiosSecure.post("/bookings", bookingData);
      return res.data;
    },
    onSuccess: (data) => {
      toast.success("Booking submitted successfully!");

      // 🔹 Redirect based on payment
      if (product.paymentOption !== "COD") {
        // Example: redirect to payment page with booking ID
        navigate(`/payment/${data._id}`);
      } else {
        navigate("/dashboard/my-orders"); // COD -> go to My Orders
      }
    },
    onError: () => toast.error("Failed to submit booking"),
  });

  const handleBookingSubmit = (e) => {
    e.preventDefault();

    // 🔹 Quantity validation
    if (quantity < product.moq) return toast.error(`Minimum order quantity is ${product.moq}`);
    if (quantity > product.quantity) return toast.error(`Cannot order more than available quantity (${product.quantity})`);

    const bookingData = {
      productId: product._id,
      productTitle: product.title,
      price: product.price,
      email: user.email,
      firstName: e.target.firstName.value,
      lastName: e.target.lastName.value,
      quantity,
      orderPrice,
      contactNumber: e.target.contactNumber.value,
      deliveryAddress: e.target.deliveryAddress.value,
      notes: e.target.notes.value || "",
      paymentMethod: product.paymentOption,
      status: product.paymentOption === "COD" ? "pending" : "awaiting-payment",
      createdAt: new Date(),
    };

    bookingMutation.mutate(bookingData);
  };

  return (
    <section className="max-w-3xl mx-auto px-4 py-12">
      <h2 className="text-2xl font-bold mb-6">{product.title} - Booking Form</h2>

      {canOrder ? (
        <form onSubmit={handleBookingSubmit} className="space-y-4">
          {/* Read-only fields */}
          <input type="email" value={user.email} readOnly className="input input-bordered w-full" />
          <input type="text" value={product.title} readOnly className="input input-bordered w-full" />
          <input type="text" value={`$${product.price}`} readOnly className="input input-bordered w-full" />

          {/* User Info */}
          <div className="grid grid-cols-2 gap-2">
            <input type="text" name="firstName" placeholder="First Name" required className="input input-bordered w-full" />
            <input type="text" name="lastName" placeholder="Last Name" required className="input input-bordered w-full" />
          </div>

          {/* Quantity */}
          <input
            type="number"
            min={product.moq}
            max={product.quantity}
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value))}
            className="input input-bordered w-full"
          />

          {/* Order Price */}
          <input type="text" value={`$${orderPrice}`} readOnly className="input input-bordered w-full" />

          <input type="text" name="contactNumber" placeholder="Contact Number" required className="input input-bordered w-full" />
          <textarea name="deliveryAddress" placeholder="Delivery Address" required className="textarea textarea-bordered w-full"></textarea>
          <textarea name="notes" placeholder="Additional Notes / Instructions" className="textarea textarea-bordered w-full"></textarea>

          <button type="submit" className="btn btn-primary w-full">
            {product.paymentOption === "COD" ? "Place Order (COD)" : "Proceed to Payment"}
          </button>
        </form>
      ) : (
        <p className="text-red-500 font-semibold">Admins & Managers cannot place orders.</p>
      )}
    </section>
  );
};

export default BookingPage;
