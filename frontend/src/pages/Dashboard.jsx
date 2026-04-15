import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiFetch } from "../api/client";
import Loading from "../components/Loading";
import BookingStatusBadge from "../components/BookingStatusBadge";
import SkeletonGrid from "../components/SkeletonGrid";
import SkeletonProfile from "../components/SkeletonProfile";

export default function Dashboard() {
    const [profile, setProfile] = useState(null);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    async function fetchDashboardData() {
        try {
            setLoading(true);
            setError("");

            const [profileData, bookingsData] = await Promise.all([
                apiFetch("/profile"),
                apiFetch("/bookings"),
            ]);

            setProfile(profileData);
            setBookings(bookingsData.data || []);
        } catch (err) {
            setError(err.message || "Failed to load dashboard.");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchDashboardData();
    }, []);

    async function handleCancelBooking(id) {
        try {
            setMessage("");
            setError("");

            const data = await apiFetch(`/bookings/${id}/cancel`, {
                method: "PATCH",
            });

            setMessage(data.message || "Booking cancelled successfully.");
            fetchDashboardData();
        } catch (err) {
            setError(err.message || "Failed to cancel booking.");
        }
    }

    if (loading) {
        return (
            <div className="container page">
                <h1>My Dashboard</h1>
                <SkeletonProfile />
                <SkeletonGrid count={3} />
            </div>
        );
    }

    return (
        <div className="container page">
            <h1>My Dashboard</h1>

            {error && <p className="error-text">{error}</p>}

            <div className="details-card section-card profile-card">
                <div className="profile-card-top">
                    <div className="profile-card-left">
                        <img
                            src={
                                profile?.profile_photo ||
                                "https://via.placeholder.com/160x160?text=Profile"
                            }
                            alt={profile?.name || "User"}
                            className="profile-avatar"
                        />

                        <div>
                            <h2>{profile?.name}</h2>
                            <p><strong>Email:</strong> {profile?.email}</p>
                            <p><strong>Phone:</strong> {profile?.phone || "Not added yet"}</p>
                            <p><strong>City:</strong> {profile?.city || "Not added yet"}</p>
                            <p><strong>Role:</strong> {profile?.role}</p>
                        </div>
                    </div>

                    <Link to="/profile/edit" className="btn">
                        Edit Profile
                    </Link>
                </div>

                <div className="profile-bio-box">
                    <h3>About Me</h3>
                    <p>{profile?.bio || "No bio added yet."}</p>
                </div>
            </div>

            <div className="details-card section-card">
                <div className="section-header">
                    <h2>My Bookings</h2>
                    <p>
                        {bookings.length} booking{bookings.length !== 1 ? "s" : ""}
                    </p>
                </div>

                {message && <p className="success-text">{message}</p>}

                {bookings.length === 0 ? (
                    <p>You have no bookings yet.</p>
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
                                    <p><strong>Booking Type:</strong> {booking.booking_type}</p>
                                    <p><strong>Start Date:</strong> {booking.start_date}</p>
                                    <p><strong>End Date:</strong> {booking.end_date}</p>
                                    <p><strong>Total Price:</strong> €{booking.total_price}</p>
                                    <p><strong>Payment Status:</strong> {booking.payment_status || "unpaid"}</p>
                                </div>

                                <div className="booking-actions">
                                    {booking.status !== "cancelled" && (
                                        <button
                                            className="btn btn-danger"
                                            onClick={() => handleCancelBooking(booking.id)}
                                        >
                                            Cancel Booking
                                        </button>
                                    )}

                                    {booking.payment_status !== "paid" &&
                                        booking.status !== "cancelled" && (
                                            <Link to={`/checkout/${booking.id}`} className="btn">
                                                Proceed to Checkout
                                            </Link>
                                        )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}