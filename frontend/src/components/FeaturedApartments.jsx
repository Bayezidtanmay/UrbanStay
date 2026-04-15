import { useEffect, useState } from "react";
import { apiFetch } from "../api/client";
import ApartmentCard from "./ApartmentCard";

export default function FeaturedApartments() {
    const [apartments, setApartments] = useState([]);

    useEffect(() => {
        async function fetchData() {
            try {
                const data = await apiFetch("/apartments");
                setApartments(data.data.slice(0, 3)); // top 3
            } catch (e) {
                console.error(e);
            }
        }
        fetchData();
    }, []);

    return (
        <section className="section">
            <div className="container">
                <h2 className="section-title">Featured Apartments</h2>

                <div className="grid">
                    {apartments.map((apt) => (
                        <ApartmentCard key={apt.id} apartment={apt} />
                    ))}
                </div>
            </div>
        </section>
    );
}