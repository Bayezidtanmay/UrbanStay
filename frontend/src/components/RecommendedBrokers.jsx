import { useEffect, useState } from "react";
import { apiFetch } from "../api/client";

export default function RecommendedBrokers({ area }) {
    const [brokers, setBrokers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchBrokers() {
            try {
                setLoading(true);
                const data = await apiFetch(`/brokers/recommended/${encodeURIComponent(area)}`);
                setBrokers(data || []);
            } catch (error) {
                console.error(error.message);
            } finally {
                setLoading(false);
            }
        }

        if (area) {
            fetchBrokers();
        }
    }, [area]);

    if (!area || loading || brokers.length === 0) return null;

    return (
        <div className="details-card section-card">
            <h2>Recommended Brokers for {area}</h2>

            <div className="recommended-broker-grid">
                {brokers.map((broker) => (
                    <div key={broker.id} className="recommended-broker-card">
                        <img
                            src={broker.image || "https://via.placeholder.com/300x200?text=Broker"}
                            alt={broker.name}
                            className="recommended-broker-image"
                        />

                        <div>
                            <h3>{broker.name}</h3>
                            <p>{broker.specialty}</p>
                            <p><strong>Phone:</strong> <a href={`tel:${broker.phone}`}>{broker.phone}</a></p>
                            <p><strong>Email:</strong> <a href={`mailto:${broker.email}`}>{broker.email}</a></p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}