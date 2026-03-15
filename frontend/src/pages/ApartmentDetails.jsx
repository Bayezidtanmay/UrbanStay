import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { apiFetch } from "../api/client";
import Loading from "../components/Loading";
import BookingForm from "../components/BookingForm";
import ReviewSection from "../components/ReviewSection";
import ContactBrokerForm from "../components/ContactBrokerForm";
import ImageSlider from "../components/ImageSlider";
import ApartmentMap from "../components/ApartmentMap";

export default function ApartmentDetails() {
    const { id } = useParams();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

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

    if (loading) return <Loading />;
    if (!data?.apartment) {
        return <p className="container page">Apartment not found.</p>;
    }

    const { apartment, average_rating, total_reviews } = data;

    return (
        <div className="container page">
            <h1>{apartment.title}</h1>

            <ImageSlider
                featuredImage={apartment.featured_image}
                galleryImages={apartment.images || []}
                title={apartment.title}
            />

            <div className="details-card">
                <p><strong>Location:</strong> {apartment.location}</p>
                <p><strong>Address:</strong> {apartment.address}</p>
                <p><strong>Description:</strong> {apartment.description}</p>
                <p><strong>Rental Type:</strong> {apartment.rental_type}</p>
                <p><strong>Bedrooms:</strong> {apartment.bedrooms}</p>
                <p><strong>Bathrooms:</strong> {apartment.bathrooms}</p>
                <p><strong>Size:</strong> {apartment.size} m²</p>
                <p><strong>Availability:</strong> {apartment.is_available ? "Available" : "Not available"}</p>
                <p><strong>Average Rating:</strong> {average_rating ?? "No rating yet"}</p>
                <p><strong>Total Reviews:</strong> {total_reviews}</p>

                {apartment.price_per_night && (
                    <p><strong>Price per night:</strong> €{apartment.price_per_night}</p>
                )}

                {apartment.price_per_month && (
                    <p><strong>Price per month:</strong> €{apartment.price_per_month}</p>
                )}
            </div>

            <ApartmentMap
                latitude={apartment.latitude}
                longitude={apartment.longitude}
                title={apartment.title}
            />

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