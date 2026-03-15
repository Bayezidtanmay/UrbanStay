import { useEffect } from "react";
import { useMap } from "react-leaflet";

export default function MapFlyToLocation({ apartment }) {
    const map = useMap();

    useEffect(() => {
        if (!apartment?.latitude || !apartment?.longitude) return;

        map.flyTo([apartment.latitude, apartment.longitude], 14, {
            duration: 1.2,
        });
    }, [apartment, map]);

    return null;
}