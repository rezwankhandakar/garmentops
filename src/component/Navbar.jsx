// import { Link, NavLink } from "react-router-dom";

// const Navbar = () => {
//   const navLinkStyle = ({ isActive }) =>
//     isActive
//       ? "text-primary font-semibold"
//       : "hover:text-primary transition";

//   return (
//     <div className="navbar bg-base-100 shadow-md px-4 md:px-10">
//       {/* Left: Logo */}
//       <div className="navbar-start">
//         <Link to="/" className="text-2xl font-bold text-primary">
//           GarmentOps
//         </Link>
//       </div>

//       {/* Center: Menu (Desktop) */}
//       <div className="navbar-center hidden lg:flex">
//         <ul className="menu menu-horizontal gap-6">
//           <li><NavLink to="/" className={navLinkStyle}>Home</NavLink></li>
//           <li><NavLink to="/products" className={navLinkStyle}>All Products</NavLink></li>
//           <li><NavLink to="/about" className={navLinkStyle}>About Us</NavLink></li>
//           <li><NavLink to="/contact" className={navLinkStyle}>Contact</NavLink></li>
//         </ul>
//       </div>

//       {/* Right: Auth Buttons */}
//       <div className="navbar-end hidden lg:flex gap-3">
//         <Link to="/login" className="btn btn-outline btn-sm">
//           Login
//         </Link>
//         <Link to="/register" className="btn btn-primary btn-sm">
//           Register
//         </Link>
//       </div>

//       {/* Mobile Menu */}
//       <div className="navbar-end lg:hidden">
//         <div className="dropdown dropdown-end">
//           <label tabIndex={0} className="btn btn-ghost">
//             ☰
//           </label>
//           <ul
//             tabIndex={0}
//             className="menu menu-sm dropdown-content mt-3 p-3 shadow bg-base-100 rounded-box w-52"
//           >
//             <li><NavLink to="/">Home</NavLink></li>
//             <li><NavLink to="/products">All Products</NavLink></li>
//             <li><NavLink to="/about">About Us</NavLink></li>
//             <li><NavLink to="/contact">Contact</NavLink></li>
//             <hr />
//             <li><NavLink to="/login">Login</NavLink></li>
//             <li><NavLink to="/register">Register</NavLink></li>
//           </ul>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Navbar;



import { Link, NavLink, useNavigate } from "react-router-dom";
import useAuth from "../Hooks/useAuth";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const navLinkStyle = ({ isActive }) =>
    isActive
      ? "text-primary font-semibold"
      : "hover:text-primary transition";

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="navbar bg-base-100 shadow-md px-4 md:px-10">
      {/* Left: Logo */}
      <div className="navbar-start">
        <Link to="/" className="text-2xl font-bold text-primary">
          GarmentOps
        </Link>
      </div>

      {/* Center Menu (Desktop) */}
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal gap-6">
          <li><NavLink to="/" className={navLinkStyle}>Home</NavLink></li>
          <li><NavLink to="/products" className={navLinkStyle}>All Products</NavLink></li>
          <li><NavLink to="/about" className={navLinkStyle}>About Us</NavLink></li>
          <li><NavLink to="/contact" className={navLinkStyle}>Contact</NavLink></li>

          {/* ✅ Login এর পরে Dashboard */}
          {user && (
            <li>
              <NavLink to="/dashboard" className={navLinkStyle}>
                Dashboard
              </NavLink>
            </li>
          )}
        </ul>
      </div>

      {/* Right Side */}
      <div className="navbar-end hidden lg:flex items-center gap-3">
        {!user ? (
          <>
            {/* 🔓 Before Login */}
            <Link to="/login" className="btn btn-outline btn-sm">
              Login
            </Link>
            <Link to="/register" className="btn btn-primary btn-sm">
              Register
            </Link>
          </>
        ) : (
          <>
            {/* 🔐 After Login */}
            <div className="dropdown dropdown-end">
              <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
                <div className="w-10 rounded-full">
                  <img
                    src={user.photoURL || "https://i.ibb.co/2kR8kB3/user.png"}
                    alt="user"
                  />
                </div>
              </label>
              <ul
                tabIndex={0}
                className="menu dropdown-content mt-3 p-3 shadow bg-base-100 rounded-box w-44"
              >
                <li className="text-sm font-semibold text-center">
                  {user.displayName || "User"}
                </li>
                <li>
                  <Link to="/dashboard">Dashboard</Link>
                </li>
                <li>
                  <button onClick={handleLogout} className="text-error">
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          </>
        )}
      </div>

      {/* Mobile Menu */}
      <div className="navbar-end lg:hidden">
        <div className="dropdown dropdown-end">
          <label tabIndex={0} className="btn btn-ghost">☰</label>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content mt-3 p-3 shadow bg-base-100 rounded-box w-52"
          >
            <li><NavLink to="/">Home</NavLink></li>
            <li><NavLink to="/products">All Products</NavLink></li>
            <li><NavLink to="/about">About Us</NavLink></li>
            <li><NavLink to="/contact">Contact</NavLink></li>

            {user && <li><NavLink to="/dashboard">Dashboard</NavLink></li>}

            <hr />
            {!user ? (
              <>
                <li><NavLink to="/login">Login</NavLink></li>
                <li><NavLink to="/register">Register</NavLink></li>
              </>
            ) : (
              <li>
                <button onClick={handleLogout} className="text-error">
                  Logout
                </button>
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
