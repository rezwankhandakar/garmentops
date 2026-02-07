import React from "react";
import { useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../Hooks/useAxiosSecure";

const TrackOrders = () => {
  const { orderId } = useParams();
  const axiosSecure = useAxiosSecure();

  // 🔹 Fetch tracking info by orderId
  const { data, isLoading, isError } = useQuery({
    queryKey: ["track-order", orderId],
    queryFn: async () => {
      // 🔥 future backend endpoint
      // const res = await axiosSecure.get(`/orders/track/${orderId}`);
      // return res.data;

      // 🔹 TEMP dummy data
      return {
        orderId,
        steps: [
          {
            title: "Cutting Completed",
            date: "2026-02-01 10:30 AM",
            location: "Factory Unit A",
            note: "Fabric cutting finished successfully",
          },
          {
            title: "Sewing Started",
            date: "2026-02-02 09:00 AM",
            location: "Production Line 3",
          },
          {
            title: "Finishing",
            date: "2026-02-03 02:15 PM",
            location: "Finishing Section",
          },
          {
            title: "QC Checked",
            date: "2026-02-04 11:45 AM",
            location: "Quality Control",
          },
          {
            title: "Packed",
            date: "2026-02-05 04:20 PM",
            location: "Packaging Unit",
          },
          {
            title: "Shipped / Out for Delivery",
            date: "2026-02-06 08:00 AM",
            location: "Dhaka Logistics Hub",
            note: "Product is on the way",
          },
        ],
      };
    },
    enabled: !!orderId,
  });

  if (isLoading)
    return <p className="text-center py-20">Loading tracking info...</p>;

  if (isError)
    return (
      <p className="text-center py-20 text-red-500">
        Failed to load tracking data
      </p>
    );

  const steps = data.steps;
  const lastIndex = steps.length - 1;

  return (
    <div className="min-h-screen bg-base-200 p-6">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold">Track Order</h2>
          <p className="text-gray-500">
            Order ID: <span className="font-medium">{orderId}</span>
          </p>
        </div>

        {/* Timeline */}
        <ul className="timeline timeline-vertical">
          {steps.map((step, index) => {
            const isLatest = index === lastIndex;

            return (
              <li key={index}>
                <div
                  className={`timeline-middle ${
                    isLatest ? "text-primary" : "text-gray-400"
                  }`}
                >
                  ●
                </div>

                <div
                  className={`timeline-box shadow-md ${
                    isLatest
                      ? "border border-primary bg-primary/10"
                      : "bg-base-100"
                  }`}
                >
                  <h3 className="font-semibold text-lg">
                    {step.title}
                    {isLatest && (
                      <span className="badge badge-primary ml-2">
                        Latest
                      </span>
                    )}
                  </h3>

                  <p className="text-sm text-gray-500">{step.date}</p>

                  <p className="mt-2">
                    <span className="font-medium">Location:</span>{" "}
                    {step.location}
                  </p>

                  {step.note && (
                    <p className="text-sm mt-1 text-gray-600">
                      {step.note}
                    </p>
                  )}
                </div>

                <hr />
              </li>
            );
          })}
        </ul>

        {/* Optional Map */}
        {/* 
        <div className="mt-10">
          <h3 className="text-xl font-semibold mb-3">Current Location</h3>
          <div className="h-64 bg-base-100 rounded-lg flex items-center justify-center text-gray-400">
            Live map will be shown here
          </div>
        </div>
        */}
      </div>
    </div>
  );
};

export default TrackOrders;
