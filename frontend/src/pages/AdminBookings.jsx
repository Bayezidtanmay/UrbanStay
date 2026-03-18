import { useEffect, useState } from "react";
import { apiFetch } from "../api/client";
import Loading from "../components/Loading";
import BookingStatusBadge from "../components/BookingStatusBadge";

export default function AdminBookings() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

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

    async function updateStatus(id, status) {
        try {
            setMessage("");
            setError("");

            const data = await apiFetch(`/bookings/${id}/status`, {
                method: "PATCH",
                body: JSON.stringify({ status }),
            });

            setMessage(data.message || "Booking status updated successfully.");
            fetchBookings();
        } catch (err) {
            setError(err.message || "Failed to update booking status.");
        }
    }

    if (loading) return <Loading />;

    return (
        <div className="container page">
            <div className="section-header">
                <h1>Manage Bookings</h1>
                <p>{bookings.length} booking{bookings.length !== 1 ? "s" : ""}</p>
            </div>

            {message && <p className="success-text">{message}</p>}
            {error && <p className="error-text">{error}</p>}

            {bookings.length === 0 ? (
                <p>No bookings found.</p>
            ) : (
                <div className="booking-list">
                    {bookings.map((booking) => (
                        <div key={booking.id} className="booking-item booking-card">
                            <div className="booking-top">
                                <div>
                                    <h3>{booking.apartment?.title}</h3>
                                    <p className="muted-text">{booking.apartment?.location}</p>
                                </div>

                                <BookingStatusBadge status={booking.status} />
                            </div>

                            <div className="booking-grid">
                                <p><strong>User:</strong> {booking.user?.name}</p>
                                <p><strong>Email:</strong> {booking.user?.email}</p>
                                <p><strong>Booking Type:</strong> {booking.booking_type}</p>
                                <p><strong>Start Date:</strong> {booking.start_date}</p>
                                <p><strong>End Date:</strong> {booking.end_date}</p>
                                <p><strong>Total Price:</strong> €{booking.total_price}</p>
                            </div>

                            <div className="admin-actions">
                                <button
                                    className="btn"
                                    onClick={() => updateStatus(booking.id, "confirmed")}
                                >
                                    Confirm
                                </button>

                                <button
                                    className="btn btn-warning"
                                    onClick={() => updateStatus(booking.id, "pending")}
                                >
                                    Pending
                                </button>

                                <button
                                    className="btn btn-danger"
                                    onClick={() => updateStatus(booking.id, "cancelled")}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}