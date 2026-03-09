import { useEffect, useState } from "react";
import { apiFetch } from "../api/client";
import ApartmentCard from "../components/ApartmentCard";
import Loading from "../components/Loading";

export default function Apartments() {
    const [apartments, setApartments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [location, setLocation] = useState("");
    const [rentalType, setRentalType] = useState("");
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");

    async function fetchApartments() {
        try {
            setLoading(true);

            const params = new URLSearchParams();

            if (location) params.append("location", location);
            if (rentalType) params.append("rental_type", rentalType);
            if (minPrice) params.append("min_price", minPrice);
            if (maxPrice) params.append("max_price", maxPrice);

            const data = await apiFetch(`/apartments?${params.toString()}`);
            setApartments(data.data || []);
        } catch (error) {
            console.error(error.message);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchApartments();
    }, []);

    function handleSubmit(e) {
        e.preventDefault();
        fetchApartments();
    }

    return (
        <div className="container page">
            <h1>Apartments</h1>

            <form className="filter-form" onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Search by location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                />

                <select
                    value={rentalType}
                    onChange={(e) => setRentalType(e.target.value)}
                >
                    <option value="">All rental types</option>
                    <option value="nightly">Nightly</option>
                    <option value="monthly">Monthly</option>
                    <option value="both">Both</option>
                </select>

                <input
                    type="number"
                    placeholder="Min price"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                />

                <input
                    type="number"
                    placeholder="Max price"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                />

                <button type="submit" className="btn">
                    Search
                </button>
            </form>

            {loading ? (
                <Loading />
            ) : apartments.length === 0 ? (
                <p>No apartments found.</p>
            ) : (
                <div className="apartment-grid">
                    {apartments.map((apartment) => (
                        <ApartmentCard key={apartment.id} apartment={apartment} />
                    ))}
                </div>
            )}
        </div>
    );
}