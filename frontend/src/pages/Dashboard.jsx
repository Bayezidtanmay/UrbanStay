import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { apiFetch } from "../api/client";
import Loading from "../components/Loading";

export default function Dashboard() {
    const { user } = useAuth();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    async function fetchBookings() {
        try {
            setLoading(true);
            setError("");

            const data = await apiFetch("/bookings");
            setBookings(data.data || []);
        } catch (err) {
            setError(err.message || "Failed to load bookings.");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchBookings();
    }, []);

    async function handleCancelBooking(id) {
        try {
            setMessage("");
            setError("");

            const data = await apiFetch(`/bookings/${id}/cancel`, {
                method: "PATCH",
            });

            setMessage(data.message || "Booking cancelled successfully.");
            fetchBookings();
        } catch (err) {
            setError(err.message || "Failed to cancel booking.");
        }
    }

    if (loading) {
        return <Loading />;
    }

    return (
        <div className="container page">
            <h1>My Dashboard</h1>

            <div className="details-card section-card">
                <h2>Account Info</h2>
                <p><strong>Name:</strong> {user?.name}</p>
                <p><strong>Email:</strong> {user?.email}</p>
                <p><strong>Role:</strong> {user?.role}</p>
            </div>

            <div className="details-card section-card">
                <h2>My Bookings</h2>

                {message && <p className="success-text">{message}</p>}
                {error && <p className="error-text">{error}</p>}

                {bookings.length === 0 ? (
                    <p>You have no bookings yet.</p>
                ) : (
                    <div className="booking-list">
                        {bookings.map((booking) => (
                            <div key={booking.id} className="booking-item">
                                <h3>{booking.apartment?.title}</h3>
                                <p><strong>Location:</strong> {booking.apartment?.location}</p>
                                <p><strong>Booking Type:</strong> {booking.booking_type}</p>
                                <p><strong>Start Date:</strong> {booking.start_date}</p>
                                <p><strong>End Date:</strong> {booking.end_date}</p>
                                <p><strong>Total Price:</strong> €{booking.total_price}</p>
                                <p><strong>Status:</strong> {booking.status}</p>

                                {booking.status !== "cancelled" && (
                                    <button
                                        className="btn btn-danger"
                                        onClick={() => handleCancelBooking(booking.id)}
                                    >
                                        Cancel Booking
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}