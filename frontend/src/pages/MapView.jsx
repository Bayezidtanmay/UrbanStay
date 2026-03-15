import { useCallback, useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Link } from "react-router-dom";
import L from "leaflet";
import { apiFetch } from "../api/client";
import MapBoundsUpdater from "../components/MapBoundsUpdater";
import MapFlyToLocation from "../components/MapFlyToLocation";

function createPriceIcon(apartment, isActive = false) {
    let parts = [];

    if (apartment.price_per_night) {
        parts.push(`€${Math.round(Number(apartment.price_per_night))}/n`);
    }

    if (apartment.price_per_month) {
        parts.push(`€${Math.round(Number(apartment.price_per_month))}/m`);
    }

    const priceLabel = parts.length > 0 ? parts.join(" • ") : "View";

    return L.divIcon({
        className: "custom-price-marker-wrapper",
        html: `<div class="custom-price-marker ${isActive ? "active-price-marker" : ""}">${priceLabel}</div>`,
        iconSize: [170, 40],
        iconAnchor: [85, 20],
        popupAnchor: [0, -18],
    });
}

export default function MapView() {
    const [apartments, setApartments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [activeApartmentId, setActiveApartmentId] = useState(null);
    const [selectedApartment, setSelectedApartment] = useState(null);

    const markerRefs = useRef({});

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

    useEffect(() => {
        if (!selectedApartment) return;

        const marker = markerRefs.current[selectedApartment.id];
        if (marker) {
            marker.openPopup();
        }
    }, [selectedApartment]);

    function handleCardClick(apartment) {
        setSelectedApartment(apartment);
        setActiveApartmentId(apartment.id);
    }

    return (
        <div className="map-page-split">
            <div className="map-list-panel">
                <div className="map-header map-header-sticky">
                    <h1>Explore Apartments on Map</h1>
                    <p>{loading ? "Updating apartments..." : `${apartments.length} apartments in view`}</p>
                </div>

                <div className="map-list-content">
                    {apartments.length === 0 ? (
                        <p>No apartments in this area.</p>
                    ) : (
                        apartments.map((apartment) => (
                            <div
                                key={apartment.id}
                                className={`map-list-card ${activeApartmentId === apartment.id ? "active-map-list-card" : ""}`}
                                onMouseEnter={() => setActiveApartmentId(apartment.id)}
                                onMouseLeave={() => setActiveApartmentId(null)}
                                onClick={() => handleCardClick(apartment)}
                            >
                                <img
                                    src={
                                        apartment.featured_image
                                            ? apartment.featured_image
                                            : "https://via.placeholder.com/400x250?text=UrbanStay"
                                    }
                                    alt={apartment.title}
                                    className="map-list-image"
                                />

                                <div className="map-list-body">
                                    <h3>{apartment.title}</h3>
                                    <p>{apartment.location}</p>
                                    <p>{apartment.address}</p>

                                    <div className="map-list-prices">
                                        {apartment.price_per_night && (
                                            <span>€{apartment.price_per_night} / night</span>
                                        )}
                                        {apartment.price_per_month && (
                                            <span>€{apartment.price_per_month} / month</span>
                                        )}
                                    </div>

                                    <Link
                                        to={`/apartments/${apartment.id}`}
                                        className="btn map-card-btn"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        View Apartment
                                    </Link>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            <div className="map-canvas-panel">
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
                    <MapFlyToLocation apartment={selectedApartment} />

                    {apartments.map((apartment) => {
                        if (!apartment.latitude || !apartment.longitude) return null;

                        return (
                            <Marker
                                key={apartment.id}
                                position={[apartment.latitude, apartment.longitude]}
                                icon={createPriceIcon(apartment, activeApartmentId === apartment.id)}
                                ref={(ref) => {
                                    if (ref) markerRefs.current[apartment.id] = ref;
                                }}
                                eventHandlers={{
                                    mouseover: () => setActiveApartmentId(apartment.id),
                                    mouseout: () => setActiveApartmentId(null),
                                    click: () => {
                                        setSelectedApartment(apartment);
                                        setActiveApartmentId(apartment.id);
                                    },
                                }}
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