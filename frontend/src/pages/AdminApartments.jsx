import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiFetch } from "../api/client";
import Loading from "../components/Loading";

export default function AdminApartments() {
    const [apartments, setApartments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    async function fetchApartments() {
        try {
            setLoading(true);
            setError("");
            const data = await apiFetch("/apartments");
            setApartments(data.data || []);
        } catch (err) {
            setError(err.message || "Failed to load apartments.");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchApartments();
    }, []);

    async function deleteApartment(id) {
        const confirmed = window.confirm("Delete this apartment?");
        if (!confirmed) return;

        try {
            setMessage("");
            setError("");

            const data = await apiFetch(`/apartments/${id}`, {
                method: "DELETE",
            });

            setMessage(data.message || "Apartment deleted successfully.");
            fetchApartments();
        } catch (err) {
            setError(err.message || "Failed to delete apartment.");
        }
    }

    if (loading) return <Loading />;

    return (
        <div className="container page">
            <div className="admin-header">
                <h1>Manage Apartments</h1>
                <Link to="/admin/apartments/create" className="btn">
                    Add Apartment
                </Link>
            </div>

            {message && <p className="success-text">{message}</p>}
            {error && <p className="error-text">{error}</p>}

            {apartments.length === 0 ? (
                <p>No apartments available.</p>
            ) : (
                apartments.map((apt) => (
                    <div key={apt.id} className="admin-item">
                        <h3>{apt.title}</h3>
                        <p><strong>Location:</strong> {apt.location}</p>
                        <p><strong>Rental Type:</strong> {apt.rental_type}</p>

                        {apt.price_per_night && (
                            <p><strong>Nightly:</strong> €{apt.price_per_night}</p>
                        )}

                        {apt.price_per_month && (
                            <p><strong>Monthly:</strong> €{apt.price_per_month}</p>
                        )}

                        <div className="admin-actions">
                            <Link to={`/admin/apartments/edit/${apt.id}`} className="btn">
                                Edit
                            </Link>

                            <button
                                className="btn btn-danger"
                                onClick={() => deleteApartment(apt.id)}
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