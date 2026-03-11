import { Link } from "react-router-dom";

export default function AdminDashboard() {
    return (
        <div className="container page">
            <h1>Admin Dashboard</h1>

            <div className="admin-grid">

                <Link to="/admin/apartments" className="admin-card">
                    <h2>Manage Apartments</h2>
                    <p>Create, edit, and delete apartments</p>
                </Link>

                <Link to="/admin/bookings" className="admin-card">
                    <h2>Manage Bookings</h2>
                    <p>Approve or reject bookings</p>
                </Link>

                <Link to="/admin/messages" className="admin-card">
                    <h2>Contact Messages</h2>
                    <p>View messages from customers</p>
                </Link>

            </div>
        </div>
    );
}