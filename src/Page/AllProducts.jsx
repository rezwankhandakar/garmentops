import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import useAxiosSecure from "../Hooks/useAxiosSecure";

const AllProducts = () => {
  const axiosSecure = useAxiosSecure();

  // 🔹 Fetch all products
  const { data: products = [], isLoading, isError } = useQuery({
    queryKey: ["all-products"],
    queryFn: async () => {
      const res = await axiosSecure.get("/products/public");
      return res.data;
    },
  });

  if (isLoading) {
    return <p className="text-center py-20">Loading products...</p>;
  }

  if (isError) {
    return (
      <p className="text-center py-20 text-red-500">
        Failed to load products
      </p>
    );
  }

  return (
    <section className="max-w-7xl mx-auto px-4 py-12">
      <h2 className="text-3xl font-bold text-center mb-10">
        All Products
      </h2>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {products.map((product) => (
          <div
            key={product._id}
            className="bg-base-100 shadow-md hover:shadow-xl transition duration-300 rounded-lg overflow-hidden flex flex-col"
          >
            {/* Product Image */}
            <div className="h-48 overflow-hidden bg-gray-100">
              <img
                src={product.images?.[0]}
                alt={product.title}
                className="w-full h-full object-contain"
              />
            </div>

            {/* Card Content */}
            <div className="p-4 flex flex-col flex-grow">
              <h3 className="text-lg font-semibold mb-1">{product.title}</h3>
              <p className="text-gray-600 text-sm flex-grow">
                {product.description.length > 60
                  ? product.description.substring(0, 60) + "..."
                  : product.description}
              </p>

              <div className="flex justify-between items-center mt-2">
                <p className="font-bold text-md">${product.price}</p>
                <p className="text-sm text-gray-500">Qty: {product.quantity}</p>
              </div>

              {/* View Details Button */}
              <Link
                to={`/product/${product._id}`}
                className="mt-3 btn btn-primary w-full text-center py-2"
              >
                View Details
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default AllProducts;
