import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import { toast } from "react-hot-toast";

const ManageUsers = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const { data: users = [], isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const res = await axiosSecure.get("/user");
      return res.data;
    },
  });

  const roleMutation = useMutation({
    mutationFn: ({ id, role }) =>
      axiosSecure.patch(`/user/role/${id}`, { role }),
    onSuccess: () => {
      toast.success("Role Updated");
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }) =>
      axiosSecure.patch(`/user/status/${id}`, { status }),
    onSuccess: () => {
      toast.success("Status Updated");
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  if (isLoading) return <p className="text-center">Loading...</p>;

  return (
    <div className="p-4 md:p-6">
      <h2 className="text-xl md:text-2xl font-bold mb-4 text-center md:text-left">
        Manage Users
      </h2>

      {/* ================= DESKTOP / TABLET TABLE ================= */}
      <div className="hidden md:block overflow-x-auto">
        <table className="table table-zebra min-w-[900px]">
          <thead>
            <tr>
              <th>User</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td className="flex items-center gap-2">
                  <img
                    src={user.photoURL}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <span className="font-medium">{user.name}</span>
                </td>

                <td>{user.email}</td>
                <td className="capitalize">{user.role}</td>

                <td>
                  <span
                    className={`badge ${
                      user.status === "approved"
                        ? "badge-success"
                        : user.status === "suspended"
                        ? "badge-error"
                        : "badge-warning"
                    }`}
                  >
                    {user.status}
                  </span>
                </td>

                <td className="space-x-1 text-center">
                  <button
                    onClick={() =>
                      roleMutation.mutate({ id: user._id, role: "manager" })
                    }
                    className="btn btn-xs btn-primary"
                  >
                    Manager
                  </button>

                  <button
                    onClick={() =>
                      roleMutation.mutate({ id: user._id, role: "buyer" })
                    }
                    className="btn btn-xs btn-secondary"
                  >
                    Buyer
                  </button>

                  <button
                    onClick={() =>
                      statusMutation.mutate({
                        id: user._id,
                        status: "approved",
                      })
                    }
                    className="btn btn-xs btn-success"
                  >
                    Approve
                  </button>

                  <button
                    onClick={() =>
                      statusMutation.mutate({
                        id: user._id,
                        status: "suspended",
                      })
                    }
                    className="btn btn-xs btn-error"
                  >
                    Suspend
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ================= MOBILE CARD VIEW ================= */}
      <div className="md:hidden space-y-4">
        {users.map((user) => (
          <div
            key={user._id}
            className="card bg-base-100 shadow-md border"
          >
            <div className="card-body p-4 space-y-3">
              <div className="flex items-center gap-3">
                <img
                  src={user.photoURL}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <h3 className="font-semibold">{user.name}</h3>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
              </div>

              <div className="flex justify-between text-sm">
                <span>
                  <strong>Role:</strong> {user.role}
                </span>
                <span
                  className={`badge ${
                    user.status === "approved"
                      ? "badge-success"
                      : user.status === "suspended"
                      ? "badge-error"
                      : "badge-warning"
                  }`}
                >
                  {user.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2">
                <button
                  onClick={() =>
                    roleMutation.mutate({ id: user._id, role: "manager" })
                  }
                  className="btn btn-xs btn-primary"
                >
                  Manager
                </button>

                <button
                  onClick={() =>
                    roleMutation.mutate({ id: user._id, role: "buyer" })
                  }
                  className="btn btn-xs btn-secondary"
                >
                  Buyer
                </button>

                <button
                  onClick={() =>
                    statusMutation.mutate({
                      id: user._id,
                      status: "approved",
                    })
                  }
                  className="btn btn-xs btn-success"
                >
                  Approve
                </button>

                <button
                  onClick={() =>
                    statusMutation.mutate({
                      id: user._id,
                      status: "suspended",
                    })
                  }
                  className="btn btn-xs btn-error"
                >
                  Suspend
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageUsers;
