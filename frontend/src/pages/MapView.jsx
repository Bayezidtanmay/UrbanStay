import { useCallback, useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Link } from "react-router-dom";
import { apiFetch } from "../api/client";
import MapBoundsUpdater from "../components/MapBoundsUpdater";

export default function MapView() {
    const [apartments, setApartments] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchApartments = useCallback(async (bounds = null) => {
        try {
            setLoading(true);

            let endpoint = "/apartments";

            if (bounds) {
                const params = new URLSearchParams({
                    lat_min: bounds.lat_min,
                    lat_max: bounds.lat_max,
                    lng_min: bounds.lng_min,
                    lng_max: bounds.lng_max,
                });

                endpoint = `/apartments?${params.toString()}`;
            }

            const data = await apiFetch(endpoint);
            setApartments(data.data || []);
        } catch (error) {
            console.error("Failed to fetch apartments:", error.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchApartments();
    }, [fetchApartments]);

    return (
        <div className="map-page">
            <div className="map-header">
                <h1>Explore Apartments on Map</h1>
                <p>{loading ? "Updating apartments..." : `${apartments.length} apartments in view`}</p>
            </div>

            <div className="map-view-wrapper">
                <MapContainer
                    center={[60.1699, 24.9384]}
                    zoom={10}
                    style={{ height: "100%", width: "100%" }}
                >
                    <TileLayer
                        attribution="&copy; OpenStreetMap contributors"
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />

                    <MapBoundsUpdater onBoundsChange={fetchApartments} />

                    {apartments.map((apartment) => {
                        if (!apartment.latitude || !apartment.longitude) return null;

                        return (
                            <Marker
                                key={apartment.id}
                                position={[apartment.latitude, apartment.longitude]}
                            >
                                <Popup>
                                    <div className="map-popup">
                                        {apartment.featured_image && (
                                            <img
                                                src={apartment.featured_image}
                                                alt={apartment.title}
                                                className="map-popup-image"
                                            />
                                        )}

                                        <h3>{apartment.title}</h3>
                                        <p>{apartment.location}</p>

                                        {apartment.price_per_night && (
                                            <p>€{apartment.price_per_night} / night</p>
                                        )}

                                        {apartment.price_per_month && (
                                            <p>€{apartment.price_per_month} / month</p>
                                        )}

                                        <Link to={`/apartments/${apartment.id}`} className="btn">
                                            View Apartment
                                        </Link>
                                    </div>
                                </Popup>
                            </Marker>
                        );
                    })}
                </MapContainer>
            </div>
        </div>
    );
}