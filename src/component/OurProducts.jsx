import React from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../Hooks/useAxiosSecure";
import { Link } from "react-router-dom";

const OurProducts = () => {
  const axiosSecure = useAxiosSecure();

  // Fetch products (limit 6)
  const { data: products = [], isLoading, isError } = useQuery({
    queryKey: ["products-home"],
    queryFn: async () => {
      const res = await axiosSecure.get("/products/home?limit=6");
      return res.data;
    },
  });

  if (isLoading) return <p className="text-center py-10">Loading products...</p>;
  if (isError) return <p className="text-center py-10 text-red-500">Failed to load products</p>;

  return (
    <section className="max-w-7xl mx-auto px-4 py-12">
      <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center">Our Products</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {products.map((product) => (
          <div key={product._id} className="bg-base-100 shadow rounded overflow-hidden flex flex-col">

            {/* Compact Image */}
            <img
              src={product.images?.[0]}
              alt={product.title}
              className="w-full h-36 object-contain bg-gray-100"
            />

            {/* Content */}
            <div className="p-3 flex flex-col flex-grow">
              <h3 className="text-lg font-semibold mb-1">{product.title}</h3>
              <p className="text-gray-600 text-sm flex-grow">
                {product.description.length > 50
                  ? product.description.substring(0, 50) + "..."
                  : product.description}
              </p>
              <p className="mt-1 font-semibold text-md">${product.price}</p>

              {/* View Details */}
              <Link
                to={`/product/${product._id}`}
                className="mt-2 btn btn-sm btn-primary w-full text-center"
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

export default OurProducts;
