import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";
import useAxiosSecure from "../Hooks/useAxiosSecure";
import useAuth from "../Hooks/useAuth";
import useRole from "../Hooks/useRole";

const ProductDetails = () => {
  const { id } = useParams();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  const { user, loading } = useAuth(); // 🔹 logged-in user + loading state
  const { role,status } = useRole();

  const { data: product, isLoading, isError } = useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      const res = await axiosSecure.get(`/products/${id}`);
      return res.data;
    },
  });

  if (isLoading || loading) return <p className="text-center py-10">Loading...</p>;
  if (isError) return <p className="text-center py-10 text-red-500">Failed to load product</p>;
  if (!user) return <p className="text-center py-10 text-red-500">Please login to order.</p>;

  return (
    <section className="max-w-5xl mx-auto px-4 py-12">
      <div className="grid md:grid-cols-2 gap-8">
        {/* Images / Demo */}
        <div className="space-y-4">
          {product.images?.map((img, index) => (
            <img
              key={index}
              src={img}
              alt={product.title}
              className="w-full h-64 object-contain rounded shadow"
            />
          ))}

          {product.demoVideo && (
  product.demoVideo.includes("youtube.com/embed") ? (
    <iframe
      width="100%"
      height="315"
      src={product.demoVideo}
      title={product.title}
      frameBorder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      allowFullScreen
    ></iframe>
  ) : (
    <video
      controls
      className="w-full rounded shadow"
      preload="metadata"
      poster={product.images?.[0]}
    >
      <source src={product.demoVideo} type="video/mp4" />
      Your browser does not support the video tag.
    </video>
  )
)}



        </div>

        {/* Product Info */}
        <div className="flex flex-col">
          <h1 className="text-3xl font-bold mb-2">{product.title}</h1>
          <p className="text-gray-700 mb-2">{product.description}</p>
          <p className="text-sm text-gray-500 mb-1">Category: {product.category}</p>
          <p className="text-lg font-semibold mb-1">Price: ${product.price}</p>
          <p className="text-sm text-gray-500 mb-1">Available Quantity: {product.quantity}</p>
          <p className="text-sm text-gray-500 mb-1">Minimum Order: {product.moq}</p>
          <p className="text-sm text-gray-500 mb-4">Payment Options: {product.paymentOption}</p>

          {/* Order Now Button */}
        {
  role === 'buyer' && status === 'approved' ? (
    <button
      onClick={() => navigate(`/booking/${product._id}`)}
      className="btn btn-primary mt-4 w-full"
    >
      Order Now
    </button>
  ) : (
    <p className="text-red-500 font-semibold mt-4">
      Only approved buyers can place orders.
    </p>
  )
}


        </div>
      </div>
    </section>
  );
};

export default ProductDetails;


