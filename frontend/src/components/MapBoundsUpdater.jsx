import { useMapEvents } from "react-leaflet";

export default function MapBoundsUpdater({ onBoundsChange }) {
    useMapEvents({
        moveend(mapEvent) {
            const map = mapEvent.target;
            const bounds = map.getBounds();

            onBoundsChange({
                lat_min: bounds.getSouth(),
                lat_max: bounds.getNorth(),
                lng_min: bounds.getWest(),
                lng_max: bounds.getEast(),
            });
        },
        zoomend(mapEvent) {
            const map = mapEvent.target;
            const bounds = map.getBounds();

            onBoundsChange({
                lat_min: bounds.getSouth(),
                lat_max: bounds.getNorth(),
                lng_min: bounds.getWest(),
                lng_max: bounds.getEast(),
            });
        },
    });

    return null;
}