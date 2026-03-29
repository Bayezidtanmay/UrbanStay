import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { apiFetch } from "../api/client";
import Loading from "../components/Loading";

export default function Checkout() {
    const { bookingId } = useParams();
    const navigate = useNavigate();

    const [booking, setBooking] = useState(null);
    const [loading, setLoading] = useState(true);
    const [paying, setPaying] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [form, setForm] = useState({
        card_name: "",
        card_number: "",
        expiry: "",
        cvv: "",
        payment_method: "demo_card",
    });

    useEffect(() => {
        async function fetchCheckout() {
            try {
                setLoading(true);
                setError("");

                const data = await apiFetch(`/checkout/${bookingId}`);
                setBooking(data);
            } catch (err) {
                setError(err.message || "Failed to load checkout.");
            } finally {
                setLoading(false);
            }
        }

        fetchCheckout();
    }, [bookingId]);

    function handleChange(e) {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    }

    const breakdown = useMemo(() => {
        if (!booking) return null;

        const start = new Date(booking.start_date);
        const end = new Date(booking.end_date);

        if (booking.booking_type === "nightly") {
            const nights = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
            return {
                label: `${nights} night${nights !== 1 ? "s" : ""}`,
                unitPrice: booking.apartment?.price_per_night,
                total: booking.total_price,
            };
        }

        let months =
            (end.getFullYear() - start.getFullYear()) * 12 +
            (end.getMonth() - start.getMonth());

        if (months < 1) months = 1;

        return {
            label: `${months} month${months !== 1 ? "s" : ""}`,
            unitPrice: booking.apartment?.price_per_month,
            total: booking.total_price,
        };
    }, [booking]);

    async function handlePay(e) {
        e.preventDefault();
        setError("");
        setSuccess("");

        try {
            setPaying(true);

            const data = await apiFetch(`/checkout/${bookingId}/pay`, {
                method: "POST",
                body: JSON.stringify(form),
            });

            setSuccess(data.message || "Payment completed successfully.");
            setBooking(data.booking);

            setTimeout(() => {
                navigate("/dashboard");
            }, 1200);
        } catch (err) {
            setError(err.message || "Payment failed.");
        } finally {
            setPaying(false);
        }
    }

    if (loading) return <Loading />;

    if (error && !booking) {
        return (
            <div className="container page">
                <h1>Checkout</h1>
                <p className="error-text">{error}</p>
            </div>
        );
    }

    return (
        <div className="container page">
            <h1>Checkout</h1>

            <div className="checkout-layout">
                <div className="checkout-summary-card">
                    <h2>Booking Summary</h2>

                    <img
                        src={
                            booking?.apartment?.featured_image ||
                            "https://via.placeholder.com/800x400?text=UrbanStay"
                        }
                        alt={booking?.apartment?.title}
                        className="checkout-image"
                    />

                    <h3>{booking?.apartment?.title}</h3>
                    <p><strong>Location:</strong> {booking?.apartment?.location}</p>
                    <p><strong>Address:</strong> {booking?.apartment?.address}</p>
                    <p><strong>Booking Type:</strong> {booking?.booking_type}</p>
                    <p><strong>Start Date:</strong> {booking?.start_date}</p>
                    <p><strong>End Date:</strong> {booking?.end_date}</p>

                    {breakdown && (
                        <div className="checkout-breakdown">
                            <p><strong>Duration:</strong> {breakdown.label}</p>
                            <p><strong>Unit Price:</strong> €{breakdown.unitPrice}</p>
                            <p><strong>Total Amount:</strong> €{breakdown.total}</p>
                        </div>
                    )}

                    <div className="checkout-status-box">
                        <p><strong>Booking Status:</strong> {booking?.status}</p>
                        <p><strong>Payment Status:</strong> {booking?.payment_status}</p>
                    </div>
                </div>

                <div className="checkout-form-card">
                    <h2>Demo Payment</h2>
                    <p className="muted-text">
                        This is a demo checkout flow for portfolio and practice purposes.
                    </p>

                    {booking?.payment_status === "paid" ? (
                        <div className="checkout-paid-box">
                            <p className="success-text">This booking has already been paid.</p>
                            <Link to="/dashboard" className="btn">
                                Go to Dashboard
                            </Link>
                        </div>
                    ) : (
                        <form className="auth-form" onSubmit={handlePay}>
                            <label>Cardholder Name</label>
                            <input
                                type="text"
                                name="card_name"
                                value={form.card_name}
                                onChange={handleChange}
                                placeholder="John Doe"
                            />

                            <label>Card Number</label>
                            <input
                                type="text"
                                name="card_number"
                                value={form.card_number}
                                onChange={handleChange}
                                placeholder="4242 4242 4242 4242"
                            />

                            <label>Expiry Date</label>
                            <input
                                type="text"
                                name="expiry"
                                value={form.expiry}
                                onChange={handleChange}
                                placeholder="12/30"
                            />

                            <label>CVV</label>
                            <input
                                type="text"
                                name="cvv"
                                value={form.cvv}
                                onChange={handleChange}
                                placeholder="123"
                            />

                            <input
                                type="hidden"
                                name="payment_method"
                                value={form.payment_method}
                                onChange={handleChange}
                            />

                            {success && <p className="success-text">{success}</p>}
                            {error && <p className="error-text">{error}</p>}

                            <button type="submit" className="btn" disabled={paying}>
                                {paying ? "Processing..." : `Pay €${booking?.total_price}`}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}