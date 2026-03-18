import { useEffect, useMemo, useState } from "react";
import { apiFetch } from "../api/client";
import { useAuth } from "../context/AuthContext";

export default function FindBroker() {
    const { user } = useAuth();

    const [brokers, setBrokers] = useState([]);
    const [search, setSearch] = useState("");
    const [area, setArea] = useState("");
    const [selectedBroker, setSelectedBroker] = useState(null);

    const [form, setForm] = useState({
        name: user?.name || "",
        email: user?.email || "",
        message: "",
    });

    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");

    async function fetchBrokers() {
        try {
            const params = new URLSearchParams();
            if (search) params.append("search", search);
            if (area) params.append("area", area);

            const endpoint = params.toString()
                ? `/brokers?${params.toString()}`
                : "/brokers";

            const data = await apiFetch(endpoint);
            setBrokers(data || []);
        } catch (err) {
            setError(err.message || "Failed to load brokers.");
        }
    }

    useEffect(() => {
        fetchBrokers();
    }, [search, area]);

    const areas = useMemo(
        () => [...new Set(brokers.map((broker) => broker.area))],
        [brokers]
    );

    async function sendMessage(e) {
        e.preventDefault();
        if (!selectedBroker) return;

        try {
            setSuccess("");
            setError("");

            const data = await apiFetch(`/brokers/${selectedBroker.id}/message`, {
                method: "POST",
                body: JSON.stringify(form),
            });

            setSuccess(data.message || "Message sent successfully.");
            setForm({
                name: user?.name || "",
                email: user?.email || "",
                message: "",
            });
        } catch (err) {
            setError(err.message || "Failed to send message.");
        }
    }

    return (
        <div className="container page">
            <section className="broker-hero">
                <h1>Find a Broker</h1>
                <p>
                    Connect with local brokers who can help you find the right apartment
                    based on area, budget, and rental type.
                </p>
            </section>

            <section className="broker-filter-bar">
                <input
                    type="text"
                    placeholder="Search by broker name, area, or specialty"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

                <select value={area} onChange={(e) => setArea(e.target.value)}>
                    <option value="">All areas</option>
                    {areas.map((item) => (
                        <option key={item} value={item}>
                            {item}
                        </option>
                    ))}
                </select>
            </section>

            <section className="broker-grid">
                {brokers.length === 0 ? (
                    <p>No brokers found.</p>
                ) : (
                    brokers.map((broker) => (
                        <div key={broker.id} className="broker-card">
                            <img
                                src={
                                    broker.image ||
                                    "https://via.placeholder.com/500x300?text=Broker"
                                }
                                alt={broker.name}
                                className="broker-image"
                            />

                            <div className="broker-body">
                                <div className="broker-top">
                                    <h3>{broker.name}</h3>
                                    <span className="broker-area-badge">{broker.area}</span>
                                </div>

                                <p className="broker-specialty">{broker.specialty}</p>
                                <p className="broker-description">{broker.description}</p>

                                <p><strong>Languages:</strong> {broker.languages || "Not specified"}</p>
                                <p><strong>Phone:</strong> <a href={`tel:${broker.phone}`}>{broker.phone}</a></p>
                                <p><strong>Email:</strong> <a href={`mailto:${broker.email}`}>{broker.email}</a></p>

                                <div className="broker-actions">
                                    <a href={`mailto:${broker.email}`} className="btn">
                                        Email Broker
                                    </a>

                                    <a href={`tel:${broker.phone}`} className="btn btn-secondary">
                                        Call Broker
                                    </a>

                                    <button
                                        className="btn"
                                        type="button"
                                        onClick={() => setSelectedBroker(broker)}
                                    >
                                        Message Broker
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </section>

            {selectedBroker && (
                <div className="broker-modal-overlay" onClick={() => setSelectedBroker(null)}>
                    <div
                        className="broker-modal"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h2>Message {selectedBroker.name}</h2>

                        <form className="auth-form" onSubmit={sendMessage}>
                            <input
                                type="text"
                                placeholder="Your name"
                                value={form.name}
                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                            />

                            <input
                                type="email"
                                placeholder="Your email"
                                value={form.email}
                                onChange={(e) => setForm({ ...form, email: e.target.value })}
                            />

                            <textarea
                                rows="5"
                                placeholder="Write your message"
                                value={form.message}
                                onChange={(e) => setForm({ ...form, message: e.target.value })}
                            />

                            {success && <p className="success-text">{success}</p>}
                            {error && <p className="error-text">{error}</p>}

                            <div className="broker-actions">
                                <button type="submit" className="btn">
                                    Send Message
                                </button>

                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={() => setSelectedBroker(null)}
                                >
                                    Close
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}