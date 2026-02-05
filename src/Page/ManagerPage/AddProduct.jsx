// import React, { useState } from "react";
// import { useForm } from "react-hook-form";
// import { toast } from "react-hot-toast";
// import useAxiosSecure from "../../Hooks/useAxiosSecure";

// const AddProduct = () => {
//   const axiosSecure = useAxiosSecure();
//   const { register, handleSubmit, reset, formState: { errors } } = useForm();

//   const [images, setImages] = useState([]);
//   const [previewImages, setPreviewImages] = useState([]);
//   const [loading, setLoading] = useState(false);

//   // 📸 Image handle + preview
//   const handleImages = (e) => {
//     const files = Array.from(e.target.files);
//     setImages(files);

//     const previews = files.map(file => URL.createObjectURL(file));
//     setPreviewImages(previews);
//   };

//   // 🚀 Submit handler
//   const onSubmit = async (data) => {
//     if (images.length === 0) {
//       return toast.error("At least one image is required");
//     }

//     try {
//       setLoading(true);

//       // 🔹 Upload images (imgbb example)
//       const imageUrls = [];
//       for (let img of images) {
//         const imgData = new FormData();
//         imgData.append("image", img);

//         const res = await fetch(
//           `https://api.imgbb.com/1/upload?key=VITE_image_host_key`,
//           {
//             method: "POST",
//             body: imgData
//           }
//         );

//         const imgRes = await res.json();
//         imageUrls.push(imgRes.data.url);
//       }

//       const product = {
//         title: data.title,
//         description: data.description,
//         category: data.category,
//         price: Number(data.price),
//         quantity: Number(data.quantity),
//         moq: Number(data.moq),
//         images: imageUrls,
//         demoVideo: data.demoVideo || "",
//         paymentOption: data.paymentOption,
//         showHome: data.showHome || false,
//         createdAt: new Date()
//       };

//       // 🔐 Secure POST
//       await axiosSecure.post("/products", product);

//       toast.success("Product added successfully 🎉");
//       reset();
//       setImages([]);
//       setPreviewImages([]);

//     } catch (error) {
//       toast.error("Failed to add product");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="max-w-3xl mx-auto p-6 bg-base-100 shadow rounded-lg">
//       <h2 className="text-2xl font-bold mb-6">Add Product</h2>

//       <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

//         {/* Product Name */}
//         <input
//           {...register("title", { required: true })}
//           placeholder="Product Name"
//           className="input input-bordered w-full"
//         />
//         {errors.title && <p className="text-red-500">Product name required</p>}

//         {/* Description */}
//         <textarea
//           {...register("description", { required: true })}
//           placeholder="Product Description"
//           className="textarea textarea-bordered w-full"
//         />
//         {errors.description && <p className="text-red-500">Description required</p>}

//         {/* Category */}
//         <select
//           {...register("category", { required: true })}
//           className="select select-bordered w-full"
//         >
//           <option value="">Select Category</option>
//           <option>Shirt</option>
//           <option>Pant</option>
//           <option>Jacket</option>
//           <option>Accessories</option>
//         </select>

//         {/* Price & Quantity */}
//         <div className="grid grid-cols-2 gap-4">
//           <input
//             type="number"
//             {...register("price", { required: true })}
//             placeholder="Price"
//             className="input input-bordered"
//           />
//           <input
//             type="number"
//             {...register("quantity", { required: true })}
//             placeholder="Available Quantity"
//             className="input input-bordered"
//           />
//         </div>

//         {/* MOQ */}
//         <input
//           type="number"
//           {...register("moq", { required: true })}
//           placeholder="Minimum Order Quantity"
//           className="input input-bordered w-full"
//         />

//         {/* Image Upload */}
//         <input
//           type="file"
//           multiple
//           accept="image/*"
//           className="file-input file-input-bordered w-full"
//           onChange={handleImages}
//         />

//         {/* Preview */}
//         <div className="flex gap-2 flex-wrap">
//           {previewImages.map((img, index) => (
//             <img
//               key={index}
//               src={img}
//               alt="preview"
//               className="w-20 h-20 rounded object-cover"
//             />
//           ))}
//         </div>

//         {/* Demo Video */}
//         <input
//           {...register("demoVideo")}
//           placeholder="Demo Video Link (optional)"
//           className="input input-bordered w-full"
//         />

//         {/* Payment Option */}
//         <select
//           {...register("paymentOption", { required: true })}
//           className="select select-bordered w-full"
//         >
//           <option value="">Payment Option</option>
//           <option value="COD">Cash on Delivery</option>
//           <option value="PayFirst">Pay First</option>
//         </select>

//         {/* Show Home */}
//         <label className="flex items-center gap-2">
//           <input type="checkbox" {...register("showHome")} className="checkbox" />
//           <span>Show on Home Page</span>
//         </label>

//         {/* Submit */}
//         <button className="btn btn-primary w-full" disabled={loading}>
//           {loading ? "Adding..." : "Add Product"}
//         </button>

//       </form>
//     </div>
//   );
// };

// export default AddProduct;


import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import useAxiosSecure from "../../Hooks/useAxiosSecure";

const AddProduct = () => {
  const axiosSecure = useAxiosSecure();
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const [images, setImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleImages = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
    setPreviewImages(files.map(file => URL.createObjectURL(file)));
  };

  const onSubmit = async (data) => {
    if (!images.length) return toast.error("At least one image required");

    try {
      setLoading(true);

      // Upload images to imgbb
      const imageUrls = [];
      const imageKey = import.meta.env.VITE_image_host_key;

      for (let img of images) {
        const formData = new FormData();
        formData.append("image", img);

        const res = await fetch(`https://api.imgbb.com/1/upload?key=${imageKey}`, { method: "POST", body: formData });
        const imgRes = await res.json();
        imageUrls.push(imgRes.data.url);
      }

      const product = {
        title: data.title,
        description: data.description,
        category: data.category,
        price: Number(data.price),
        quantity: Number(data.quantity),
        moq: Number(data.moq),
        images: imageUrls,
        demoVideo: data.demoVideo || "",
        paymentOption: data.paymentOption,
        showHome: data.showHome || false,
      };

      await axiosSecure.post("/products", product);
      toast.success("Product added successfully 🎉");
      reset();
      setImages([]);
      setPreviewImages([]);

    } catch (error) {
      console.error(error.response?.data || error.message);
      toast.error(error.response?.data?.message || "Failed to add product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-base-100 shadow rounded-lg">
      <h2 className="text-2xl font-bold mb-6">Add Product</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

        <input {...register("title", { required: true })} placeholder="Product Name" className="input input-bordered w-full" />
        {errors.title && <p className="text-red-500">Product name required</p>}

        <textarea {...register("description", { required: true })} placeholder="Product Description" className="textarea textarea-bordered w-full" />
        {errors.description && <p className="text-red-500">Description required</p>}

        <select {...register("category", { required: true })} className="select select-bordered w-full">
          <option value="">Select Category</option>
          <option>Shirt</option>
          <option>Pant</option>
          <option>Jacket</option>
          <option>Accessories</option>
        </select>

        <div className="grid grid-cols-2 gap-4">
          <input type="number" {...register("price", { required: true })} placeholder="Price" className="input input-bordered" />
          <input type="number" {...register("quantity", { required: true })} placeholder="Available Quantity" className="input input-bordered" />
        </div>

        <input type="number" {...register("moq", { required: true })} placeholder="Minimum Order Quantity" className="input input-bordered w-full" />

        <input type="file" multiple accept="image/*" className="file-input file-input-bordered w-full" onChange={handleImages} />

        <div className="flex gap-2 flex-wrap">
          {previewImages.map((img, idx) => <img key={idx} src={img} alt="preview" className="w-20 h-20 rounded object-cover" />)}
        </div>

        <input {...register("demoVideo")} placeholder="Demo Video Link (optional)" className="input input-bordered w-full" />

        <select {...register("paymentOption", { required: true })} className="select select-bordered w-full">
          <option value="">Payment Option</option>
          <option value="COD">Cash on Delivery</option>
          <option value="PayFirst">Pay First</option>
        </select>

        <label className="flex items-center gap-2">
          <input type="checkbox" {...register("showHome")} className="checkbox" />
          <span>Show on Home Page</span>
        </label>

        <button className="btn btn-primary w-full" disabled={loading}>
          {loading ? "Adding..." : "Add Product"}
        </button>
      </form>
    </div>
  );
};

export default AddProduct;

