import { useEffect, useState } from "react";
import { apiFetch } from "../api/client";
import { Link } from "react-router-dom";
import Loading from "../components/Loading";

export default function Favorites() {
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    async function fetchFavorites() {
        try {
            setLoading(true);
            setError("");
            const data = await apiFetch("/favorites");
            setFavorites(data || []);
        } catch (err) {
            setError(err.message || "Failed to load favorites.");
        } finally {
            setLoading(false);
        }
    }

    async function removeFavorite(apartmentId) {
        try {
            await apiFetch(`/favorites/${apartmentId}`, {
                method: "DELETE",
            });
            fetchFavorites();
        } catch (err) {
            setError(err.message || "Failed to remove favorite.");
        }
    }

    useEffect(() => {
        fetchFavorites();
    }, []);

    if (loading) return <Loading />;

    return (
        <div className="container page">
            <h1>My Favorites</h1>

            {error && <p className="error-text">{error}</p>}

            {favorites.length === 0 ? (
                <p>You have no favorite apartments yet.</p>
            ) : (
                <div className="apartment-grid">
                    {favorites.map((item) => {
                        const apartment = item.apartment;
                        if (!apartment) return null;

                        return (
                            <div key={item.id} className="apartment-card">
                                <img
                                    src={
                                        apartment.featured_image
                                            ? apartment.featured_image
                                            : "https://via.placeholder.com/400x250?text=UrbanStay"
                                    }
                                    alt={apartment.title}
                                    className="apartment-image"
                                />

                                <div className="apartment-body">
                                    <h3>{apartment.title}</h3>
                                    <p>{apartment.location}</p>
                                    <p>{apartment.address}</p>

                                    <div className="prices">
                                        {apartment.price_per_night && (
                                            <span>€{apartment.price_per_night} / night</span>
                                        )}
                                        {apartment.price_per_month && (
                                            <span>€{apartment.price_per_month} / month</span>
                                        )}
                                    </div>

                                    <div className="favorite-actions">
                                        <Link to={`/apartments/${apartment.id}`} className="btn">
                                            View Details
                                        </Link>

                                        <button
                                            className="btn btn-danger"
                                            onClick={() => removeFavorite(apartment.id)}
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}