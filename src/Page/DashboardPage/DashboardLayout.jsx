import React from 'react';
import { Link, Outlet } from 'react-router';
import useRole from '../../Hooks/useRole';
import {
  HomeIcon,
  UserGroupIcon,
  CubeIcon,
  ShoppingCartIcon,
  ClockIcon,
  CheckIcon,
  PlusIcon,
  WrenchIcon,
  UserIcon,
} from '@heroicons/react/24/outline';

const DashboardLayout = () => {
  const { role, status, isLoading } = useRole();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="loading loading-bars loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="drawer lg:drawer-open">
      <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />

      {/* Drawer Content */}
      <div className="drawer-content">
        {/* Navbar */}
        <nav className="navbar w-full bg-base-300">
          <label htmlFor="my-drawer-4" className="btn btn-square btn-ghost" aria-label="open sidebar">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              strokeLinejoin="round"
              strokeLinecap="round"
              strokeWidth="2"
              fill="none"
              stroke="currentColor"
              className="my-1.5 inline-block size-4"
            >
              <path d="M4 4m0 2a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2z"></path>
              <path d="M9 4v16"></path>
              <path d="M14 10l2 2l-2 2"></path>
            </svg>
          </label>
          <div className="px-4 font-bold">Dashboard</div>
        </nav>

        <Outlet />
      </div>

      {/* Drawer Sidebar */}
      <div className="drawer-side is-drawer-close:overflow-visible">
        <label htmlFor="my-drawer-4" className="drawer-overlay"></label>
        <div className="flex min-h-full flex-col items-start bg-base-200 is-drawer-close:w-14 is-drawer-open:w-64">
          <ul className="menu w-full grow">

            {/* Home */}
            <li>
              <Link
                to="/"
                className="is-drawer-close:tooltip is-drawer-close:tooltip-right"
                data-tip="Homepage"
              >
                <HomeIcon className="h-5 w-5 inline-block mr-2" />
                <span className="is-drawer-close:hidden">Homepage</span>
              </Link>
            </li>

            {/* Admin Routes */}
            {role === 'admin' && (
              <>
                <li>
                  <Link
                    to="manage-users"
                    className="is-drawer-close:tooltip is-drawer-close:tooltip-right"
                    data-tip="Manage Users"
                  >
                    <UserGroupIcon className="h-5 w-5 inline-block mr-2" />
                    <span className="is-drawer-close:hidden">Manage Users</span>
                  </Link>

                  <Link
                    to="admin-allproducts"
                    className="is-drawer-close:tooltip is-drawer-close:tooltip-right"
                    data-tip="All Products"
                  >
                    <CubeIcon className="h-5 w-5 inline-block mr-2" />
                    <span className="is-drawer-close:hidden">All Products</span>
                  </Link>

                  <Link
                    to="all-orders"
                    className="is-drawer-close:tooltip is-drawer-close:tooltip-right"
                    data-tip="All Orders"
                  >
                    <ShoppingCartIcon className="h-5 w-5 inline-block mr-2" />
                    <span className="is-drawer-close:hidden">All Orders</span>
                  </Link>
                </li>
              </>
            )}

            {/* Manager Routes */}
            {role === 'manager' && status === 'approved' && (
              <li>
                <Link
                  to="add-product"
                  className="is-drawer-close:tooltip is-drawer-close:tooltip-right"
                  data-tip="Add Product"
                >
                  <PlusIcon className="h-5 w-5 inline-block mr-2" />
                  <span className="is-drawer-close:hidden">Add Product</span>
                </Link>

                <Link
                  to="manage-products"
                  className="is-drawer-close:tooltip is-drawer-close:tooltip-right"
                  data-tip="Manage Products"
                >
                  <WrenchIcon className="h-5 w-5 inline-block mr-2" />
                  <span className="is-drawer-close:hidden">Manage Products</span>
                </Link>

                <Link
                  to="pending-orders"
                  className="is-drawer-close:tooltip is-drawer-close:tooltip-right"
                  data-tip="Pending Orders"
                >
                  <ClockIcon className="h-5 w-5 inline-block mr-2" />
                  <span className="is-drawer-close:hidden">Pending Orders</span>
                </Link>

                <Link
                  to="approve-orders"
                  className="is-drawer-close:tooltip is-drawer-close:tooltip-right"
                  data-tip="Approve Orders"
                >
                  <CheckIcon className="h-5 w-5 inline-block mr-2" />
                  <span className="is-drawer-close:hidden">Approve Orders</span>
                </Link>

                <Link
                  to="my-profile"
                  className="is-drawer-close:tooltip is-drawer-close:tooltip-right"
                  data-tip="My Profile"
                >
                  <UserIcon className="h-5 w-5 inline-block mr-2" />
                  <span className="is-drawer-close:hidden">My Profile</span>
                </Link>
              </li>
            )}

            {/* Buyer Routes */}
            {role === 'buyer' && status === 'approved' && (
              <li>
                <Link
                  to="my-orders"
                  className="is-drawer-close:tooltip is-drawer-close:tooltip-right"
                  data-tip="My Orders"
                >
                  <ShoppingCartIcon className="h-5 w-5 inline-block mr-2" />
                  <span className="is-drawer-close:hidden">My Orders</span>
                </Link>

                <Link
                  to="my-profile-buyer"
                  className="is-drawer-close:tooltip is-drawer-close:tooltip-right"
                  data-tip="My Profile"
                >
                  <UserIcon className="h-5 w-5 inline-block mr-2" />
                  <span className="is-drawer-close:hidden">My Profile</span>
                </Link>
              </li>
            )}

          </ul>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
