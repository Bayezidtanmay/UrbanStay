import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    PieChart,
    Pie,
    Cell,
    LineChart,
    Line,
    CartesianGrid,
    Legend,
} from "recharts";
import { apiFetch } from "../api/client";
import Loading from "../components/Loading";

export default function AdminDashboard() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    async function fetchAnalytics() {
        try {
            setLoading(true);
            setError("");

            const result = await apiFetch("/admin/analytics");
            setData(result);
        } catch (err) {
            setError(err.message || "Failed to load analytics.");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchAnalytics();
    }, []);

    if (loading) return <Loading />;

    if (error) {
        return (
            <div className="container page">
                <h1>Admin Dashboard</h1>
                <p className="error-text">{error}</p>
            </div>
        );
    }

    const summary = data?.summary || {};
    const bookingStatus = data?.booking_status || [];
    const bookingsByLocation = data?.bookings_by_location || [];
    const monthlyRevenue = data?.monthly_revenue || [];
    const monthlyBookings = data?.monthly_bookings || [];
    const recentBookings = data?.recent_bookings || [];

    const pieColors = ["#2563eb", "#f59e0b", "#ef4444", "#10b981", "#8b5cf6"];

    const statCards = [
        { label: "Apartments", value: summary.total_apartments || 0 },
        { label: "Bookings", value: summary.total_bookings || 0 },
        { label: "Users", value: summary.total_users || 0 },
        { label: "Admins", value: summary.total_admins || 0 },
        { label: "Brokers", value: summary.total_brokers || 0 },
        { label: "Favorites", value: summary.total_favorites || 0 },
        { label: "Contact Messages", value: summary.total_contact_messages || 0 },
        { label: "Broker Messages", value: summary.total_broker_messages || 0 },
        { label: "Confirmed Revenue (€)", value: summary.total_revenue || 0 },
    ];

    return (
        <div className="container page">
            <h1>Admin Dashboard</h1>

            <div className="stats-grid">
                {statCards.map((item) => (
                    <div key={item.label} className="stat-card">
                        <p className="stat-label">{item.label}</p>
                        <h2 className="stat-value">{item.value}</h2>
                    </div>
                ))}
            </div>

            <div className="analytics-grid">
                <div className="analytics-card">
                    <h2>Booking Status</h2>
                    {bookingStatus.length === 0 ? (
                        <p>No booking data yet.</p>
                    ) : (
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={bookingStatus}
                                    dataKey="total"
                                    nameKey="name"
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={100}
                                    label
                                >
                                    {bookingStatus.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    )}
                </div>

                <div className="analytics-card">
                    <h2>Bookings by Location</h2>
                    {bookingsByLocation.length === 0 ? (
                        <p>No location data yet.</p>
                    ) : (
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={bookingsByLocation}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis allowDecimals={false} />
                                <Tooltip />
                                <Bar dataKey="total" />
                            </BarChart>
                        </ResponsiveContainer>
                    )}
                </div>
            </div>

            <div className="analytics-grid">
                <div className="analytics-card">
                    <h2>Monthly Revenue Trend</h2>
                    {monthlyRevenue.length === 0 ? (
                        <p>No confirmed revenue data yet.</p>
                    ) : (
                        <ResponsiveContainer width="100%" height={320}>
                            <LineChart data={monthlyRevenue}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Line type="monotone" dataKey="total" name="Revenue (€)" strokeWidth={3} />
                            </LineChart>
                        </ResponsiveContainer>
                    )}
                </div>

                <div className="analytics-card">
                    <h2>Monthly Booking Trend</h2>
                    {monthlyBookings.length === 0 ? (
                        <p>No booking trend data yet.</p>
                    ) : (
                        <ResponsiveContainer width="100%" height={320}>
                            <LineChart data={monthlyBookings}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" />
                                <YAxis allowDecimals={false} />
                                <Tooltip />
                                <Legend />
                                <Line type="monotone" dataKey="total" name="Bookings" strokeWidth={3} />
                            </LineChart>
                        </ResponsiveContainer>
                    )}
                </div>
            </div>

            <div className="analytics-card admin-links-card">
                <h2>Quick Admin Links</h2>
                <div className="admin-grid">
                    <Link to="/admin/apartments" className="admin-card">
                        <h3>Manage Apartments</h3>
                        <p>Create, edit, and delete apartments</p>
                    </Link>

                    <Link to="/admin/bookings" className="admin-card">
                        <h3>Manage Bookings</h3>
                        <p>Approve or reject bookings</p>
                    </Link>

                    <Link to="/admin/messages" className="admin-card">
                        <h3>Contact Messages</h3>
                        <p>View apartment inquiry messages</p>
                    </Link>

                    <Link to="/admin/brokers" className="admin-card">
                        <h3>Manage Brokers</h3>
                        <p>Create, edit, and delete brokers</p>
                    </Link>

                    <Link to="/admin/broker-messages" className="admin-card">
                        <h3>Broker Messages</h3>
                        <p>View and manage broker messages</p>
                    </Link>
                </div>
            </div>

            <div className="analytics-card">
                <h2>Recent Bookings</h2>

                {recentBookings.length === 0 ? (
                    <p>No recent bookings found.</p>
                ) : (
                    <div className="recent-bookings-list">
                        {recentBookings.map((booking) => (
                            <div key={booking.id} className="recent-booking-item">
                                <div>
                                    <strong>{booking.apartment?.title}</strong>
                                    <p className="muted-text">
                                        {booking.user?.name} • {booking.apartment?.location}
                                    </p>
                                </div>

                                <div className="recent-booking-meta">
                                    <span className={`status-badge status-${booking.status}`}>
                                        {booking.status}
                                    </span>
                                    <p>€{booking.total_price}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}