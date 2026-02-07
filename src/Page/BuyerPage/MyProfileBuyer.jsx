import React from "react";
import useAuth from "../../Hooks/useAuth";
import { useNavigate } from "react-router";

const MyProfileBuyer = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-base-200 p-6">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="relative bg-gradient-to-r from-primary to-secondary text-white rounded-2xl p-8 mb-20">
          <div className="absolute -bottom-16 left-8">
            <img
              src={user?.photoURL || "https://i.ibb.co/2kRkX8y/user.png"}
              alt="Profile"
              className="w-32 h-32 rounded-full border-4 border-base-100 shadow-lg"
            />
          </div>

          <div className="ml-44">
            <h2 className="text-3xl font-bold">
              {user?.displayName || "Unnamed User"}
            </h2>
            <p className="opacity-90">{user?.email}</p>

            <span className="badge badge-accent mt-3">
              Buyer Account
            </span>
          </div>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <div className="card bg-base-100 shadow-lg">
            <div className="card-body">
              <h3 className="font-semibold text-lg mb-2">Account Info</h3>

              <p><span className="font-medium">User ID:</span> {user?.uid}</p>
              <p>
                <span className="font-medium">Email Verified:</span>{" "}
                {user?.emailVerified ? "Yes" : "No"}
              </p>
            </div>
          </div>

          <div className="card bg-base-100 shadow-lg">
            <div className="card-body">
              <h3 className="font-semibold text-lg mb-2">Activity</h3>

              <p>
                <span className="font-medium">Account Created:</span><br />
                {new Date(user?.metadata?.creationTime).toLocaleString()}
              </p>

              <p>
                <span className="font-medium">Last Login:</span><br />
                {new Date(user?.metadata?.lastSignInTime).toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {/* Logout */}
        <div className="mt-10 flex justify-end">
          <button
            onClick={handleLogout}
            className="btn btn-error btn-wide shadow-lg"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default MyProfileBuyer;
