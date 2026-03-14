import { Link } from "react-router-dom";
import ApartmentMap from "./ApartmentMap";

export default function ApartmentCard({ apartment }) {
    return (
        <div className="apartment-card">
            <img
                src={
                    apartment.featured_image
                        ? apartment.featured_image
                        : "https://via.placeholder.com/400x250?text=UrbanStay"
                }
                alt={apartment.title}
                className="apartment-image"
            />

            <div className="apartment-body">
                <h3>{apartment.title}</h3>
                <p>{apartment.location}</p>
                <p>{apartment.address}</p>
                <p>Rental type: {apartment.rental_type}</p>

                <div className="prices">
                    {apartment.price_per_night && (
                        <span>€{apartment.price_per_night} / night</span>
                    )}
                    {apartment.price_per_month && (
                        <span>€{apartment.price_per_month} / month</span>
                    )}
                </div>

                <ApartmentMap
                    latitude={apartment.latitude}
                    longitude={apartment.longitude}
                    title={apartment.title}
                    small={true}
                />

                <Link to={`/apartments/${apartment.id}`} className="btn">
                    View Details
                </Link>
            </div>
        </div>
    );
}