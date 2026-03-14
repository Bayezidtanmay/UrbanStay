import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Link } from "react-router-dom";

export default function MapView() {
    const [apartments, setApartments] = useState([]);

    useEffect(() => {
        fetch("http://127.0.0.1:8000/api/apartments")
            .then((res) => res.json())
            .then((data) => {
                setApartments(data.data || []);
            });
    }, []);

    return (
        <div style={{ height: "100vh" }}>
            <MapContainer
                center={[60.1699, 24.9384]}
                zoom={7}
                style={{ height: "100%", width: "100%" }}
            >
                <TileLayer
                    attribution="&copy; OpenStreetMap"
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {apartments.map((apartment) => {
                    if (!apartment.latitude || !apartment.longitude) return null;

                    return (
                        <Marker
                            key={apartment.id}
                            position={[apartment.latitude, apartment.longitude]}
                        >
                            <Popup>
                                <strong>{apartment.title}</strong>
                                <br />
                                {apartment.location}
                                <br />
                                <Link to={`/apartments/${apartment.id}`}>
                                    View Apartment
                                </Link>
                            </Popup>
                        </Marker>
                    );
                })}
            </MapContainer>
        </div>
    );
}