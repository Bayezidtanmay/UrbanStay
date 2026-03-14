import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

export default function ApartmentMap({ latitude, longitude, title, small = false }) {
    if (!latitude || !longitude) {
        return null;
    }

    return (
        <div className={small ? "card-map-wrapper" : "details-map-wrapper"}>
            <MapContainer
                center={[latitude, longitude]}
                zoom={14}
                scrollWheelZoom={false}
                style={{ height: "100%", width: "100%" }}
            >
                <TileLayer
                    attribution='&copy; OpenStreetMap contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={[latitude, longitude]}>
                    <Popup>{title}</Popup>
                </Marker>
            </MapContainer>
        </div>
    );
}