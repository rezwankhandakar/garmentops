import React from "react";
import Slider from "react-slick";
import { FaStar } from "react-icons/fa";

const feedbacks = [
  {
    id: 1,
    name: "John Doe",
    avatar: "https://i.pravatar.cc/100?img=1",
    rating: 5,
    feedback: "Amazing service! The products arrived quickly and in perfect condition."
  },
  {
    id: 2,
    name: "Jane Smith",
    avatar: "https://i.pravatar.cc/100?img=2",
    rating: 4,
    feedback: "Great experience! Very satisfied with the quality and delivery."
  },
  {
    id: 3,
    name: "Alice Johnson",
    avatar: "https://i.pravatar.cc/100?img=3",
    rating: 5,
    feedback: "Highly recommend! Excellent customer service and product quality."
  },
  {
    id: 4,
    name: "Michael Brown",
    avatar: "https://i.pravatar.cc/100?img=4",
    rating: 4,
    feedback: "Smooth ordering process and fast delivery. Happy customer!"
  }
];

const CustomerFeedback = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 2,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    responsive: [
      {
        breakpoint: 768, // small devices
        settings: {
          slidesToShow: 1
        }
      }
    ]
  };

  return (
    <section className="max-w-7xl mx-auto px-4 py-16 bg-base-100">
      <h2 className="text-3xl font-bold text-center mb-12">Customer Feedback</h2>

      <Slider {...settings}>
        {feedbacks.map((item) => (
          <div key={item.id} className="p-4">
            <div className="bg-base-200 p-6 rounded-lg shadow text-center h-full flex flex-col">
              <img
                src={item.avatar}
                alt={item.name}
                className="w-16 h-16 rounded-full mx-auto mb-4"
              />
              <h3 className="font-semibold text-lg mb-2">{item.name}</h3>
              <div className="flex justify-center mb-3">
                {Array.from({ length: item.rating }).map((_, i) => (
                  <FaStar key={i} className="text-yellow-400 mx-0.5" />
                ))}
              </div>
              <p className="text-gray-600 text-sm flex-grow">{item.feedback}</p>
            </div>
          </div>
        ))}
      </Slider>
    </section>
  );
};

export default CustomerFeedback;
