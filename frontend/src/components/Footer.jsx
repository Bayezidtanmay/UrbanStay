import { useState } from "react";

export default function Footer() {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");

    function handleSubscribe(e) {
        e.preventDefault();

        if (!email) return;

        // demo only (no backend)
        setMessage("Subscribed successfully! 🎉");
        setEmail("");

        setTimeout(() => setMessage(""), 3000);
    }

    return (
        <footer className="footer">
            <div className="container footer-container">
                {/* LEFT */}
                <div className="footer-brand">
                    <h2>UrbanStay</h2>
                    <p>
                        Discover modern apartments with a seamless booking experience.
                        Designed for comfort, built for simplicity.
                    </p>
                </div>

                {/* LINKS */}
                <div className="footer-links">
                    <h4>Explore</h4>
                    <ul>
                        <li>Home</li>
                        <li>Apartments</li>
                        <li>Map View</li>
                        <li>Favorites</li>
                    </ul>
                </div>

                {/* CONTACT */}
                <div className="footer-links">
                    <h4>Contact</h4>
                    <ul>
                        <li>Email: support@urbanstay.com</li>
                        <li>Phone: +358 40 123 4567</li>
                        <li>Helsinki, Finland</li>
                    </ul>
                </div>

                {/* NEWSLETTER */}
                <div className="footer-newsletter">
                    <h4>Newsletter</h4>
                    <p>Get latest apartments and offers.</p>

                    <form onSubmit={handleSubscribe} className="newsletter-form">
                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <button type="submit">Subscribe</button>
                    </form>

                    {message && <p className="success-text">{message}</p>}
                </div>
            </div>

            <div className="footer-bottom">
                © {new Date().getFullYear()} UrbanStay. All rights reserved.
            </div>
        </footer>
    );
}