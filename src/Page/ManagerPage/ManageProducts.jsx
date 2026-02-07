import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import useAxiosSecure from "../../Hooks/useAxiosSecure";

const ManageProducts = () => {
  const axiosSecure = useAxiosSecure(); // 🔹 Axios with token
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [deleteProductId, setDeleteProductId] = useState(null);

  // 🔹 Fetch all products
  const { data: products = [], isLoading, isError } = useQuery({
    queryKey: ["all-products", searchTerm],
    queryFn: async () => {
      const res = await axiosSecure.get("/products");
      if (searchTerm) {
        return res.data.filter(
          (p) =>
            p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.category.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      return res.data;
    },
  });

  // 🔹 Delete product
  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const res = await axiosSecure.delete(`/products/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["all-products"]);
      toast.success("Product deleted successfully!");
      setDeleteProductId(null);
    },
    onError: (err) => toast.error(err.response?.data?.message || "Failed to delete product"),
  });

  const handleSearchChange = (e) => setSearchTerm(e.target.value);

  if (isLoading) return <p className="text-center py-10">Loading products...</p>;
  if (isError) return <p className="text-center py-10 text-red-500">Failed to load products</p>;

  return (
    <section className="max-w-7xl mx-auto px-4 py-12">
      <h2 className="text-2xl font-bold mb-6">All Products</h2>

      {/* 🔹 Search */}
      <div className="mb-4">
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Search by name or category"
          className="input input-bordered w-full max-w-sm"
        />
      </div>

      {/* 🔹 Table */}
      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Price</th>
              <th>Category</th>
              <th>Payment Mode</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product._id}>
                <td>
                  <img
                    src={product.images?.[0]}
                    alt={product.title}
                    className="w-16 h-16 object-cover rounded"
                  />
                </td>
                <td>{product.title}</td>
                <td>${product.price}</td>
                <td>{product.category}</td>
                <td>{product.paymentOption || "COD"}</td>
                <td className="flex gap-2">
                  <button
                    className="btn btn-sm btn-info"
                    onClick={() => setSelectedProduct(product)}
                  >
                    Update
                  </button>
                  <button
                    className="btn btn-sm btn-error"
                    onClick={() => setDeleteProductId(product._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 🔹 Update Modal */}
      {selectedProduct && (
        <dialog open className="modal modal-bottom sm:modal-middle">
          <div className="modal-box w-full max-w-lg">
            <h3 className="font-bold text-lg mb-4">Update Product</h3>
            <form
              className="space-y-3"
              onSubmit={async (e) => {
                e.preventDefault();
                const form = e.target;

                const updatedProduct = {
                  title: form.title.value,
                  price: Number(form.price.value),
                  category: form.category.value,
                  paymentOption: form.paymentOption.value,
                  description: form.description.value || "",
                  demoVideo: form.demoVideo.value || "",
                  images: form.images.value
                    .split(",")
                    .map((img) => img.trim())
                    .filter((img) => img),
                };

                try {
                  const res = await axiosSecure.patch(
                    `/products/update/${selectedProduct._id}`,
                    updatedProduct
                  );

                  if (res.data.success) {
                    toast.success("Product updated successfully!");
                    queryClient.invalidateQueries(["all-products"]);
                    setSelectedProduct(null);
                  } else {
                    toast.error(res.data.message || "Failed to update product");
                  }
                } catch (err) {
                  toast.error(err.response?.data?.message || "Failed to update product");
                }
              }}
            >
              <input
                type="text"
                name="title"
                defaultValue={selectedProduct.title}
                className="input input-bordered w-full"
                placeholder="Product Title"
                required
              />
              <input
                type="number"
                name="price"
                defaultValue={selectedProduct.price}
                className="input input-bordered w-full"
                placeholder="Price"
                required
              />
              <input
                type="text"
                name="category"
                defaultValue={selectedProduct.category}
                className="input input-bordered w-full"
                placeholder="Category"
                required
              />
              <input
                type="text"
                name="images"
                defaultValue={selectedProduct.images?.join(", ")}
                className="input input-bordered w-full"
                placeholder="Image URLs (comma separated)"
                required
              />
              <input
                type="text"
                name="description"
                defaultValue={selectedProduct.description || ""}
                className="input input-bordered w-full"
                placeholder="Description"
              />
              <input
                type="text"
                name="demoVideo"
                defaultValue={selectedProduct.demoVideo || ""}
                className="input input-bordered w-full"
                placeholder="Demo Video URL"
              />
              <select
                name="paymentOption"
                defaultValue={selectedProduct.paymentOption || "COD"}
                className="select select-bordered w-full"
              >
                <option value="COD">COD</option>
                <option value="PayFirst">PayFirst</option>
              </select>

              <div className="modal-action justify-between">
                <button type="button" className="btn" onClick={() => setSelectedProduct(null)}>
                  Close
                </button>
                <button type="submit" className="btn btn-primary">
                  Update
                </button>
              </div>
            </form>
          </div>
        </dialog>
      )}

      {/* 🔹 Delete Modal */}
      {deleteProductId && (
        <dialog open className="modal modal-bottom sm:modal-middle">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Delete Product?</h3>
            <p className="py-4">Are you sure you want to delete this product?</p>
            <div className="modal-action">
              <button className="btn" onClick={() => setDeleteProductId(null)}>
                No
              </button>
              <button
                className="btn btn-error"
                onClick={() => deleteMutation.mutate(deleteProductId)}
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </dialog>
      )}
    </section>
  );
};

export default ManageProducts;
