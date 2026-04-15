import { useEffect, useState } from "react";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import { apiFetch } from "../api/client";
import ApartmentCard from "../components/ApartmentCard";
import Loading from "../components/Loading";
import SkeletonGrid from "../components/SkeletonGrid";

export default function Apartments() {
    const [apartments, setApartments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [page, setPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);

    const [location, setLocation] = useState("");
    const [rentalType, setRentalType] = useState("");
    const [bedrooms, setBedrooms] = useState("");
    const [bathrooms, setBathrooms] = useState("");
    const [availability, setAvailability] = useState("");
    const [sortBy, setSortBy] = useState("");

    const [nightRange, setNightRange] = useState([0, 300]);
    const [monthRange, setMonthRange] = useState([0, 5000]);

    async function fetchApartments(pageNumber = 1) {
        try {
            setLoading(true);
            setError("");

            const params = new URLSearchParams();
            params.append("page", pageNumber);

            if (location.trim()) params.append("location", location.trim());
            if (rentalType) params.append("rental_type", rentalType);
            if (bedrooms) params.append("bedrooms", bedrooms);
            if (bathrooms) params.append("bathrooms", bathrooms);
            if (availability) params.append("is_available", availability);

            params.append("night_min", nightRange[0]);
            params.append("night_max", nightRange[1]);
            params.append("month_min", monthRange[0]);
            params.append("month_max", monthRange[1]);

            if (sortBy) {
                if (sortBy === "night_price_asc") {
                    params.append("sort_by", "night_price");
                    params.append("sort_order", "asc");
                } else if (sortBy === "night_price_desc") {
                    params.append("sort_by", "night_price");
                    params.append("sort_order", "desc");
                } else if (sortBy === "month_price_asc") {
                    params.append("sort_by", "month_price");
                    params.append("sort_order", "asc");
                } else if (sortBy === "month_price_desc") {
                    params.append("sort_by", "month_price");
                    params.append("sort_order", "desc");
                } else if (sortBy === "bedrooms_desc") {
                    params.append("sort_by", "bedrooms");
                    params.append("sort_order", "desc");
                } else if (sortBy === "newest") {
                    params.append("sort_by", "newest");
                } else if (sortBy === "oldest") {
                    params.append("sort_by", "oldest");
                }
            }

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

    // Instant auto-search with debounce
    useEffect(() => {
        const timeout = setTimeout(() => {
            fetchApartments(1);
        }, 350);

        return () => clearTimeout(timeout);
    }, [
        location,
        rentalType,
        bedrooms,
        bathrooms,
        availability,
        sortBy,
        nightRange,
        monthRange,
    ]);

    function handleSubmit(e) {
        e.preventDefault();
        fetchApartments(1);
    }

    function handleReset() {
        setLocation("");
        setRentalType("");
        setBedrooms("");
        setBathrooms("");
        setAvailability("");
        setSortBy("");
        setNightRange([0, 300]);
        setMonthRange([0, 5000]);
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
            <p className="filter-auto-note">Filters update automatically as you adjust them.</p>

            <form className="filter-form advanced-filter-form" onSubmit={handleSubmit}>
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

                <select
                    value={bedrooms}
                    onChange={(e) => setBedrooms(e.target.value)}
                >
                    <option value="">Any bedrooms</option>
                    <option value="1">1+ bedrooms</option>
                    <option value="2">2+ bedrooms</option>
                    <option value="3">3+ bedrooms</option>
                    <option value="4">4+ bedrooms</option>
                </select>

                <select
                    value={bathrooms}
                    onChange={(e) => setBathrooms(e.target.value)}
                >
                    <option value="">Any bathrooms</option>
                    <option value="1">1+ bathrooms</option>
                    <option value="2">2+ bathrooms</option>
                    <option value="3">3+ bathrooms</option>
                </select>

                <select
                    value={availability}
                    onChange={(e) => setAvailability(e.target.value)}
                >
                    <option value="">All availability</option>
                    <option value="true">Available only</option>
                    <option value="false">Unavailable only</option>
                </select>

                <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                >
                    <option value="">Default sorting</option>
                    <option value="night_price_asc">Night price: low to high</option>
                    <option value="night_price_desc">Night price: high to low</option>
                    <option value="month_price_asc">Month price: low to high</option>
                    <option value="month_price_desc">Month price: high to low</option>
                    <option value="bedrooms_desc">Most bedrooms</option>
                    <option value="newest">Newest first</option>
                    <option value="oldest">Oldest first</option>
                </select>

                <div className="slider-filter-block">
                    <label className="slider-label">
                        Nightly Price: €{nightRange[0]} - €{nightRange[1]}
                    </label>
                    <Slider
                        range
                        min={0}
                        max={300}
                        step={5}
                        value={nightRange}
                        onChange={setNightRange}
                        allowCross={false}
                    />
                </div>

                <div className="slider-filter-block">
                    <label className="slider-label">
                        Monthly Price: €{monthRange[0]} - €{monthRange[1]}
                    </label>
                    <Slider
                        range
                        min={0}
                        max={5000}
                        step={50}
                        value={monthRange}
                        onChange={setMonthRange}
                        allowCross={false}
                    />
                </div>

                <div className="filter-actions">
                    <button type="submit" className="btn">
                        Search
                    </button>

                    <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={handleReset}
                    >
                        Reset
                    </button>
                </div>
            </form>

            {loading ? (
                <SkeletonGrid count={6} />
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