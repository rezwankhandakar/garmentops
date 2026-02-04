import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import { toast } from "react-hot-toast";

const ManageUsers = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  // ✅ Get all users
  const { data: users = [], isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const res = await axiosSecure.get("/user");
      return res.data;
    },
  });

  // ✅ Role Update Mutation
  const roleMutation = useMutation({
    mutationFn: async ({ id, role }) => {
      const res = await axiosSecure.patch(`/user/role/${id}`, { role });
      return res.data;
    },
    onSuccess: () => {
      toast.success("Role Updated");
     queryClient.invalidateQueries({ queryKey: ["users"] });

    },
  });

  // ✅ Status Update Mutation
  const statusMutation = useMutation({
    mutationFn: async ({ id, status }) => {
      const res = await axiosSecure.patch(`/user/status/${id}`, { status });
      return res.data;
    },
    onSuccess: () => {
      toast.success("Status Updated");
      queryClient.invalidateQueries({ queryKey: ["users"] });

    },
  });

  if (isLoading) return <p>Loading...</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Manage Users</h2>

      <div className="overflow-x-auto">
        <table className="table table-zebra">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td className="flex items-center gap-2">
                  <img
                    src={user.photoURL}
                    className="w-10 h-10 rounded-full"
                  />
                  {user.name}
                </td>

                <td>{user.email}</td>

                <td>{user.role}</td>

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

                <td className="space-x-2">

                  {/* Role Update */}
                  <button
                    onClick={() =>
                      roleMutation.mutate({
                        id: user._id,
                        role: "manager",
                      })
                    }
                    className="btn btn-xs btn-primary"
                  >
                    Make Manager
                  </button>

                  <button
                    onClick={() =>
                      roleMutation.mutate({
                        id: user._id,
                        role: "buyer",
                      })
                    }
                    className="btn btn-xs btn-secondary"
                  >
                    Make Buyer
                  </button>

                  {/* Status Update */}
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
    </div>
  );
};

export default ManageUsers;
