import { Link } from "react-router-dom";

export default function AdminDashboard() {
    return (
        <div className="container page">
            <h1>Admin Dashboard</h1>

            <div className="admin-grid">
                <Link to="/admin/apartments" className="admin-card">
                    <h2>Manage Apartments</h2>
                    <p>Create, view, edit, and delete apartments</p>
                </Link>

                <Link to="/admin/apartments/create" className="admin-card">
                    <h2>Create Apartment</h2>
                    <p>Add a new apartment from the admin panel</p>
                </Link>

                <Link to="/admin/bookings" className="admin-card">
                    <h2>Manage Bookings</h2>
                    <p>Approve or reject bookings</p>
                </Link>

                <Link to="/admin/messages" className="admin-card">
                    <h2>Contact Messages</h2>
                    <p>View apartment inquiry messages</p>
                </Link>

                <Link to="/admin/brokers" className="admin-card">
                    <h2>Manage Brokers</h2>
                    <p>Create, edit, and delete brokers</p>
                </Link>

                <Link to="/admin/broker-messages" className="admin-card">
                    <h2>Broker Messages</h2>
                    <p>View and manage messages sent to brokers</p>
                </Link>
            </div>
        </div>
    );
}