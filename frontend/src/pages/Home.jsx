import { Link } from "react-router-dom";
import FeaturedApartments from "../components/FeaturedApartments";
import WhyChooseUs from "../components/WhyChooseUs";
import BlogSection from "../components/BlogSection";

export default function Home() {
    return (
        <div className="container page">
            <section className="hero-card">
                <h1>Find your perfect apartment with UrbanStay</h1>
                <p>
                    Search modern apartments by location, price range, rental type, and map.
                    Discover stylish stays with a professional booking experience.
                </p>
                <Link to="/apartments" className="btn">
                    Explore Apartments
                </Link>
            </section>

            <FeaturedApartments />
            <WhyChooseUs />
            <BlogSection />
        </div>
    );
}