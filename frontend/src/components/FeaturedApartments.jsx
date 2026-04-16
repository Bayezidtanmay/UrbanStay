import { useEffect, useState } from "react";
import { apiFetch } from "../api/client";
import ApartmentCard from "./ApartmentCard";

export default function FeaturedApartments() {
    const [apartments, setApartments] = useState([]);

    useEffect(() => {
        async function fetchData() {
            try {
                const data = await apiFetch("/apartments");
                setApartments((data.data || []).slice(0, 4));
            } catch (error) {
                console.error(error);
            }
        }

        fetchData();
    }, []);

    return (
        <section className="section">
            <div className="container">
                <h2 className="section-title">Featured Apartments</h2>
                <p className="section-subtitle">
                    Handpicked stays in top locations for modern living and flexible booking.
                </p>

                <div className="featured-grid">
                    {apartments.map((apt) => (
                        <ApartmentCard key={apt.id} apartment={apt} />
                    ))}
                </div>
            </div>
        </section>
    );
}