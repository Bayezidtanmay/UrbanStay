import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiFetch } from "../api/client";
import Loading from "../components/Loading";

export default function AdminBrokers() {
    const [brokers, setBrokers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    async function fetchBrokers() {
        try {
            setLoading(true);
            setError("");

            const data = await apiFetch("/admin/brokers");
            setBrokers(data || []);
        } catch (err) {
            setError(err.message || "Failed to load brokers.");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchBrokers();
    }, []);

    async function deleteBroker(id) {
        const confirmed = window.confirm("Delete this broker?");
        if (!confirmed) return;

        try {
            setMessage("");
            setError("");

            const data = await apiFetch(`/admin/brokers/${id}`, {
                method: "DELETE",
            });

            setMessage(data.message || "Broker deleted successfully.");
            fetchBrokers();
        } catch (err) {
            setError(err.message || "Failed to delete broker.");
        }
    }

    if (loading) return <Loading />;

    return (
        <div className="container page">
            <div className="admin-header">
                <h1>Manage Brokers</h1>
                <Link to="/admin/brokers/create" className="btn">
                    Add Broker
                </Link>
            </div>

            {message && <p className="success-text">{message}</p>}
            {error && <p className="error-text">{error}</p>}

            {brokers.length === 0 ? (
                <p>No brokers available.</p>
            ) : (
                brokers.map((broker) => (
                    <div key={broker.id} className="admin-item">
                        <h3>{broker.name}</h3>
                        <p><strong>Area:</strong> {broker.area}</p>
                        <p><strong>Specialty:</strong> {broker.specialty}</p>
                        <p><strong>Email:</strong> {broker.email}</p>
                        <p><strong>Phone:</strong> {broker.phone}</p>
                        <p><strong>Status:</strong> {broker.is_active ? "Active" : "Inactive"}</p>

                        <div className="admin-actions">
                            <Link to={`/admin/brokers/edit/${broker.id}`} className="btn">
                                Edit
                            </Link>

                            <button
                                className="btn btn-danger"
                                onClick={() => deleteBroker(broker.id)}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
}