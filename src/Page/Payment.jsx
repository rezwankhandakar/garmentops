import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../Hooks/useAxiosSecure";
import { toast } from "react-hot-toast";

const Payment = () => {
  const { id } = useParams();
  const axiosSecure = useAxiosSecure();
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();

  // 🔹 Get booking info
  const {
    data: booking,
    isLoading: bookingLoading,
    isError: bookingError,
  } = useQuery({
    queryKey: ["booking", id],
    queryFn: async () => {
      const res = await axiosSecure.get(`/bookings/${id}`);
      return res.data;
    },
  });

  // 🔹 Create payment intent
  const {
    data: clientSecret,
    isLoading: intentLoading,
  } = useQuery({
    enabled: !!booking?.orderPrice,
    queryKey: ["payment-intent", id],
    queryFn: async () => {
      const res = await axiosSecure.post("/create-payment-intent", {
        amount: booking.orderPrice,
      });
      return res.data.clientSecret;
    },
  });

  // 🔹 Submit payment
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      toast.error("Stripe not ready");
      return;
    }

    if (!clientSecret) {
      toast.error("Payment not initialized");
      return;
    }

    const card = elements.getElement(CardElement);
    if (!card) {
      toast.error("Card info missing");
      return;
    }

    const { error, paymentIntent } = await stripe.confirmCardPayment(
      clientSecret,
      {
        payment_method: { card },
      }
    );

    if (error) {
      toast.error(error.message);
      return;
    }

    if (paymentIntent.status === "succeeded") {
      await axiosSecure.patch(`/bookings/payment-success/${id}`);
      toast.success("Payment successful!");
      navigate("/dashboard/my-orders");
    }
  };

  // 🔹 Loading & error states
  if (bookingLoading || intentLoading) {
    return <p className="text-center mt-20">Loading payment...</p>;
  }

  if (bookingError || !booking) {
    return <p className="text-center mt-20 text-red-500">Invalid booking</p>;
  }
console.log("booking", booking);
console.log("clientSecret", clientSecret);

  return (
    <div className="max-w-md mx-auto mt-20">
      <h2 className="text-xl font-bold mb-4">
        Pay ${booking.orderPrice}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <CardElement options={{
    style: {
      base: {
        fontSize: '16px',
        color: '#fff',          
        fontWeight: '500',      
        fontFamily: 'Arial, sans-serif',
        '::placeholder': {
          color: '#ccc',        
        },
      },
      invalid: {
        color: '#ff4d4f',       
      },
    },
  }} className="p-3 border rounded" />
        <button
          className="btn btn-primary w-full"
          type="submit"
          disabled={!stripe || !clientSecret}
        >
          Pay Now
        </button>
      </form>
    </div>
  );
};

export default Payment;
