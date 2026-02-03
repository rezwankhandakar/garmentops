import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import useAuth from "../../Hooks/useAuth";

const Register = () => {
  const { createUser } = useAuth(); // ✅ () must
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    const { name, email, password, photoURL, role } = data;

    try {
      await createUser(email, password, name, photoURL);

      toast.success("Registration successful!");

      // 🔹 Role based redirect
      if (role === "manager") {
        navigate("/dashboard/manage-products");
      } else {
        navigate("/dashboard/my-orders");
      }
    } catch (error) {
      toast.error(error.message);
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <div className="card w-full max-w-md shadow-xl bg-base-100">
        <div className="card-body">
          <h2 className="text-2xl font-bold text-center">Register</h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
            <input
              className="input input-bordered w-full"
              placeholder="Full Name"
              {...register("name", { required: "Name is required" })}
            />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name.message}</p>
            )}

            <input
              className="input input-bordered w-full"
              placeholder="Email"
              {...register("email", { required: "Email is required" })}
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}

            <input
              className="input input-bordered w-full"
              placeholder="Photo URL"
              {...register("photoURL", { required: true })}
            />

            <select
              className="select select-bordered w-full"
              {...register("role", { required: "Role is required" })}
            >
              <option value="">Select Role</option>
              <option value="buyer">Buyer</option>
              <option value="manager">Manager</option>
            </select>

            <input
              type="password"
              className="input input-bordered w-full"
              placeholder="Password"
              {...register("password", {
                required: "Password required",
                minLength: { value: 6, message: "Minimum 6 characters" },
                pattern: {
                  value: /^(?=.*[a-z])(?=.*[A-Z]).+$/,
                  message: "At least 1 uppercase & 1 lowercase required",
                },
              })}
            />
            {errors.password && (
              <p className="text-red-500 text-sm">
                {errors.password.message}
              </p>
            )}

            <button className="btn btn-primary w-full">Register</button>
          </form>

          <p className="text-center text-sm mt-2">
            Already have an account?{" "}
            <span
              onClick={() => navigate("/login")}
              className="text-primary cursor-pointer"
            >
              Login
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
