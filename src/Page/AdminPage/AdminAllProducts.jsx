import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import { toast } from "react-hot-toast";

const AdminAllProducts = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [deleteProductId, setDeleteProductId] = useState(null);
  const [updateForm, setUpdateForm] = useState({});

  // 🔹 Fetch all products
  const { data: products = [], isLoading, isError } = useQuery({
    queryKey: ["all-products"],
    queryFn: async () => {
      const res = await axiosSecure.get("/products");
      return res.data;
    },
  });

  // 🔹 Update show on home
  const showHomeMutation = useMutation({
    mutationFn: async ({ id, showHome }) => {
      const res = await axiosSecure.patch(`/products/show-home/${id}`, { showHome });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["all-products"]);
      toast.success("Product visibility updated!");
    },
    onError: () => toast.error("Failed to update product"),
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
    onError: () => toast.error("Failed to delete product"),
  });

  // 🔹 Update product
  const updateMutation = useMutation({
    mutationFn: async ({ id, data }) => {
      const res = await axiosSecure.patch(`/products/${id}`, data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["all-products"]);
      toast.success("Product updated successfully!");
      setSelectedProduct(null);
    },
    onError: () => toast.error("Failed to update product"),
  });

  const handleUpdateChange = (e) => {
    const { name, value } = e.target;
    setUpdateForm({ ...updateForm, [name]: value });
  };

  const handleUpdateSubmit = (e) => {
    e.preventDefault();
    updateMutation.mutate({ id: selectedProduct._id, data: updateForm });
  };

  const openUpdateModal = (product) => {
    setSelectedProduct(product);
    setUpdateForm({
      title: product.title,
      price: product.price,
      category: product.category,
      description: product.description || "",
      paymentOption: product.paymentOption || "",
      images: product.images?.join(",") || "",
      demoVideo: product.demoVideo || "",
    });
  };

  if (isLoading) return <p className="text-center py-10">Loading products...</p>;
  if (isError) return <p className="text-center py-10 text-red-500">Failed to load products</p>;

  return (
    <section className="max-w-7xl mx-auto px-4 py-12">
      <h2 className="text-2xl font-bold mb-6">All Products</h2>

      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th>Image</th>
              <th>Product Name</th>
              <th>Price</th>
              <th>Category</th>
              <th>Created By</th>
              <th>Show on Home</th>
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
                <td>{product.createdBy}</td>
                <td>
                  <input
                    type="checkbox"
                    className="checkbox"
                    checked={product.showHome || false}
                    onChange={(e) =>
                      showHomeMutation.mutate({
                        id: product._id,
                        showHome: e.target.checked,
                      })
                    }
                  />
                </td>
                <td className="flex gap-2">
                  <button
                    className="btn btn-sm btn-info"
                    onClick={() => openUpdateModal(product)}
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

      {/* 🔹 Update Product Modal */}
{selectedProduct && (
  <dialog open className="modal modal-bottom sm:modal-middle">
    <div className="modal-box w-full max-w-lg">
      <h3 className="font-bold text-lg mb-4">Update Product</h3>
      <form className="space-y-3" onSubmit={handleUpdateSubmit}>
        <input
          type="text"
          name="title"
          value={updateForm.title}
          onChange={handleUpdateChange}
          placeholder="Title"
          className="input input-bordered w-full"
          required
        />
        <input
          type="number"
          name="price"
          value={updateForm.price}
          onChange={handleUpdateChange}
          placeholder="Price"
          className="input input-bordered w-full"
          required
        />
        <input
          type="text"
          name="category"
          value={updateForm.category}
          onChange={handleUpdateChange}
          placeholder="Category"
          className="input input-bordered w-full"
          required
        />
        <textarea
          name="description"
          value={updateForm.description}
          onChange={handleUpdateChange}
          placeholder="Description"
          className="textarea textarea-bordered w-full"
        />
        {/* 🔹 Payment Option Dropdown */}
        <select
          name="paymentOption"
          value={updateForm.paymentOption || "COD"}
          onChange={handleUpdateChange}
          className="select select-bordered w-full"
        >
          <option value="COD">COD</option>
          <option value="PayFirst">PayFirst</option>
        </select>

        <input
          type="text"
          name="images"
          value={updateForm.images}
          onChange={handleUpdateChange}
          placeholder="Images URLs (comma separated)"
          className="input input-bordered w-full"
        />
        <input
          type="text"
          name="demoVideo"
          value={updateForm.demoVideo}
          onChange={handleUpdateChange}
          placeholder="Demo Video URL"
          className="input input-bordered w-full"
        />

        <div className="modal-action justify-between">
          <button
            type="button"
            className="btn"
            onClick={() => setSelectedProduct(null)}
          >
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


      {/* 🔹 Delete Confirmation Modal */}
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

export default AdminAllProducts;
