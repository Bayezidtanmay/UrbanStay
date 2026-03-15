import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { apiFetch } from "../api/client";
import { useAuth } from "../context/AuthContext";

export default function ApartmentCard({ apartment }) {
    const { user } = useAuth();

    const [isFavorite, setIsFavorite] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        async function checkFavorite() {
            if (!user) return;

            try {
                const result = await apiFetch(`/favorites/check/${apartment.id}`);
                setIsFavorite(result.is_favorite);
            } catch (error) {
                console.error(error.message);
            }
        }

        checkFavorite();
    }, [user, apartment.id]);

    async function toggleFavorite(e) {
        e.preventDefault(); // prevent card navigation
        e.stopPropagation();

        if (!user) return;

        try {
            setLoading(true);

            if (isFavorite) {
                await apiFetch(`/favorites/${apartment.id}`, {
                    method: "DELETE",
                });
                setIsFavorite(false);
            } else {
                await apiFetch(`/favorites/${apartment.id}`, {
                    method: "POST",
                });
                setIsFavorite(true);
            }
        } catch (error) {
            console.error(error.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <Link to={`/apartments/${apartment.id}`} className="apartment-card">

            {/* FAVORITE ICON */}
            {user && (
                <button
                    className="favorite-icon"
                    onClick={toggleFavorite}
                    disabled={loading}
                >
                    {isFavorite ? "❤️" : "🤍"}
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