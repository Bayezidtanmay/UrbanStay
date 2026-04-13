import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { apiFetch } from "../api/client";
import { useAuth } from "../context/AuthContext";
import Loading from "../components/Loading";
import BookingForm from "../components/BookingForm";
import ReviewSection from "../components/ReviewSection";
import ContactBrokerForm from "../components/ContactBrokerForm";
import ImageSlider from "../components/ImageSlider";
import ApartmentMap from "../components/ApartmentMap";
import RecommendedBrokers from "../components/RecommendedBrokers";

export default function ApartmentDetails() {
    const { id } = useParams();
    const { user } = useAuth();

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isFavorite, setIsFavorite] = useState(false);
    const [favoriteLoading, setFavoriteLoading] = useState(false);

    useEffect(() => {
        async function fetchApartment() {
            try {
                const result = await apiFetch(`/apartments/${id}`);
                setData(result);
            } catch (error) {
                console.error(error.message);
            } finally {
                setLoading(false);
            }
        }

        fetchApartment();
    }, [id]);

    useEffect(() => {
        async function checkFavorite() {
            if (!user || !id) return;

            try {
                const result = await apiFetch(`/favorites/check/${id}`);
                setIsFavorite(result.is_favorite);
            } catch (error) {
                console.error(error.message);
            }
        }

        checkFavorite();
    }, [user, id]);

    async function toggleFavorite() {
        if (!user || !data?.apartment) return;

        try {
            setFavoriteLoading(true);

            if (isFavorite) {
                await apiFetch(`/favorites/${data.apartment.id}`, {
                    method: "DELETE",
                });
                setIsFavorite(false);
            } else {
                await apiFetch(`/favorites/${data.apartment.id}`, {
                    method: "POST",
                });
                setIsFavorite(true);
            }
        } catch (error) {
            console.error(error.message);
        } finally {
            setFavoriteLoading(false);
        }
    }

    if (loading) return <Loading />;

    if (!data?.apartment) {
        return <p className="container page">Apartment not found.</p>;
    }

    const { apartment, average_rating, total_reviews } = data;

    return (
        <div className="container page">
            <h1>{apartment.title}</h1>

            {user && (
                <button
                    className="btn favorite-btn"
                    onClick={toggleFavorite}
                    disabled={favoriteLoading}
                >
                    {favoriteLoading
                        ? "Saving..."
                        : isFavorite
                            ? "♥ Remove from Favorites"
                            : "♡ Save to Favorites"}
                </button>
            )}

            <ImageSlider
                featuredImage={apartment.featured_image}
                galleryImages={apartment.images || []}
                title={apartment.title}
            />

            <div className="details-grid">
                <div className="details-card">
                    <p><strong>Location:</strong> {apartment.location}</p>
                    <p><strong>Address:</strong> {apartment.address}</p>
                    <p><strong>Description:</strong> {apartment.description}</p>
                    <p><strong>Rental Type:</strong> {apartment.rental_type}</p>
                    <p><strong>Availability:</strong> {apartment.is_available ? "Available" : "Not available"}</p>
                </div>

                <div className="details-card">
                    <p><strong>Bedrooms:</strong> {apartment.bedrooms}</p>
                    <p><strong>Bathrooms:</strong> {apartment.bathrooms}</p>
                    <p><strong>Size:</strong> {apartment.size} m²</p>
                    <p><strong>Average Rating:</strong> {average_rating ?? "No rating yet"}</p>
                    <p><strong>Total Reviews:</strong> {total_reviews}</p>

                    {apartment.price_per_night && (
                        <p><strong>Price per night:</strong> €{apartment.price_per_night}</p>
                    )}

                    {apartment.price_per_month && (
                        <p><strong>Price per month:</strong> €{apartment.price_per_month}</p>
                    )}
                </div>
            </div>

            <ApartmentMap
                latitude={apartment.latitude}
                longitude={apartment.longitude}
                title={apartment.title}
            />

            <RecommendedBrokers area={apartment.location} />

            <BookingForm
                apartmentId={apartment.id}
                rentalType={apartment.rental_type}
                pricePerNight={apartment.price_per_night}
                pricePerMonth={apartment.price_per_month}
                bookings={apartment.bookings || []}
            />

            <ReviewSection apartmentId={apartment.id} />

            <ContactBrokerForm apartmentId={apartment.id} />
        </div>
    );
}