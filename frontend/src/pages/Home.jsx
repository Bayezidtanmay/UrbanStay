import { Link } from "react-router-dom";

export default function Home() {
    return (
        <div className="container page">
            <section className="hero">
                <h1>Find your perfect apartment with UrbanStay</h1>
                <p>
                    Search modern apartments by location, price range, and rental type.
                </p>
                <Link to="/apartments" className="btn">
                    Explore Apartments
                </Link>
            </section>
        </div>
    );
}