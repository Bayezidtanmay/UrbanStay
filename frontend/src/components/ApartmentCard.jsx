import { Link } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useFavorites } from "../context/FavoritesContext";

export default function ApartmentCard({ apartment }) {
    const { user } = useAuth();
    const { isFavorite, toggleFavorite } = useFavorites();
    const [loading, setLoading] = useState(false);

    const favorite = isFavorite(apartment.id);

    async function handleToggleFavorite(e) {
        e.preventDefault();
        e.stopPropagation();

        if (!user) return;

        try {
            setLoading(true);
            await toggleFavorite(apartment.id);
        } finally {
            setLoading(false);
        }
    }

    return (
        <Link to={`/apartments/${apartment.id}`} className="apartment-card">
            {user && (
                <button
                    className="favorite-icon"
                    onClick={handleToggleFavorite}
                    disabled={loading}
                >
                    {favorite ? "❤️" : "🤍"}
                </button>
            )}

            <img
                src={
                    apartment.featured_image ||
                    "https://via.placeholder.com/400x250?text=UrbanStay"
                }
                alt={apartment.title}
                className="apartment-image"
            />

            <div className="apartment-body">
                <h3>{apartment.title}</h3>
                <p>{apartment.location}</p>

                <div className="prices">
                    {apartment.price_per_night && (
                        <span>€{apartment.price_per_night} / night</span>
                    )}

                    {apartment.price_per_month && (
                        <span>€{apartment.price_per_month} / month</span>
                    )}
                </div>
            </div>
        </Link>
    );
}