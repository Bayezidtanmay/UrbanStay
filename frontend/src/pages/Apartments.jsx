import { useEffect, useState } from "react";
import { apiFetch } from "../api/client";
import ApartmentCard from "../components/ApartmentCard";
import Loading from "../components/Loading";

export default function Apartments() {
    const [apartments, setApartments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [page, setPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);

    const [location, setLocation] = useState("");
    const [rentalType, setRentalType] = useState("");
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");

    async function fetchApartments(pageNumber = 1) {
        try {
            setLoading(true);
            setError("");

            const params = new URLSearchParams();

            params.append("page", pageNumber);

            if (location.trim()) params.append("location", location.trim());
            if (rentalType) params.append("rental_type", rentalType);
            if (minPrice) params.append("min_price", minPrice);
            if (maxPrice) params.append("max_price", maxPrice);

            const endpoint = `/apartments?${params.toString()}`;

            const data = await apiFetch(endpoint);

            setApartments(data.data || []);
            setPage(data.current_page);
            setLastPage(data.last_page);
        } catch (err) {
            setError(err.message || "Failed to load apartments.");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchApartments(1);
    }, []);

    function handleSubmit(e) {
        e.preventDefault();
        fetchApartments(1);
    }

    function goToNextPage() {
        if (page < lastPage) {
            fetchApartments(page + 1);
        }
    }

    function goToPreviousPage() {
        if (page > 1) {
            fetchApartments(page - 1);
        }
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
            ) : error ? (
                <p className="error-text">{error}</p>
            ) : apartments.length === 0 ? (
                <p>No apartments found.</p>
            ) : (
                <>
                    <div className="apartment-grid">
                        {apartments.map((apartment) => (
                            <ApartmentCard key={apartment.id} apartment={apartment} />
                        ))}
                    </div>

                    <div className="pagination">
                        <button
                            className="btn"
                            disabled={page === 1}
                            onClick={goToPreviousPage}
                        >
                            Previous
                        </button>

                        <span className="page-info">
                            Page {page} of {lastPage}
                        </span>

                        <button
                            className="btn"
                            disabled={page === lastPage}
                            onClick={goToNextPage}
                        >
                            Next
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}