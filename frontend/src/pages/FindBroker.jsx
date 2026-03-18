import { useMemo, useState } from "react";

const brokers = [
    {
        id: 1,
        name: "Anna Lehtinen",
        area: "Helsinki",
        specialty: "City apartments & short stays",
        languages: ["English", "Finnish"],
        phone: "+358 40 123 4567",
        email: "anna@urbanstay.fi",
        image:
            "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&q=80",
        description:
            "Anna helps clients find modern apartments in central Helsinki, especially for short-term stays and remote workers.",
    },
    {
        id: 2,
        name: "Mikko Saarinen",
        area: "Espoo",
        specialty: "Family homes & monthly rentals",
        languages: ["English", "Finnish", "Swedish"],
        phone: "+358 50 234 5678",
        email: "mikko@urbanstay.fi",
        image:
            "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80",
        description:
            "Mikko focuses on family-friendly apartments and long-term monthly rentals in Espoo and nearby areas.",
    },
    {
        id: 3,
        name: "Sofia Niemi",
        area: "Vantaa",
        specialty: "Affordable rentals & student housing",
        languages: ["English", "Finnish"],
        phone: "+358 45 345 6789",
        email: "sofia@urbanstay.fi",
        image:
            "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=800&q=80",
        description:
            "Sofia helps students and young professionals find affordable apartments with good transport connections.",
    },
    {
        id: 4,
        name: "Joonas Virtanen",
        area: "Tampere",
        specialty: "Budget studios & first-time renters",
        languages: ["English", "Finnish"],
        phone: "+358 44 456 7890",
        email: "joonas@urbanstay.fi",
        image:
            "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80",
        description:
            "Joonas specializes in practical and affordable options for people moving into a new city for work or study.",
    },
    {
        id: 5,
        name: "Emilia Koski",
        area: "Turku",
        specialty: "Premium apartments & relocation support",
        languages: ["English", "Finnish", "German"],
        phone: "+358 41 567 8901",
        email: "emilia@urbanstay.fi",
        image:
            "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=800&q=80",
        description:
            "Emilia assists clients looking for high-quality apartments and relocation support in Turku.",
    },
    {
        id: 6,
        name: "Lauri Hämäläinen",
        area: "Oulu",
        specialty: "Long stays & furnished apartments",
        languages: ["English", "Finnish"],
        phone: "+358 46 678 9012",
        email: "lauri@urbanstay.fi",
        image:
            "https://images.unsplash.com/photo-1504593811423-6dd665756598?auto=format&fit=crop&w=800&q=80",
        description:
            "Lauri helps professionals and students find furnished apartments for longer stays in Oulu.",
    },
];

export default function FindBroker() {
    const [search, setSearch] = useState("");
    const [area, setArea] = useState("");

    const areas = [...new Set(brokers.map((broker) => broker.area))];

    const filteredBrokers = useMemo(() => {
        return brokers.filter((broker) => {
            const matchesSearch =
                broker.name.toLowerCase().includes(search.toLowerCase()) ||
                broker.area.toLowerCase().includes(search.toLowerCase()) ||
                broker.specialty.toLowerCase().includes(search.toLowerCase());

            const matchesArea = area ? broker.area === area : true;

            return matchesSearch && matchesArea;
        });
    }, [search, area]);

    return (
        <div className="container page">
            <section className="broker-hero">
                <h1>Find a Broker</h1>
                <p>
                    Need help finding the right apartment? Our local brokers can guide you
                    based on city, budget, rental type, and lifestyle.
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

            <section className="broker-info-box">
                <h2>How brokers can help</h2>
                <ul className="broker-help-list">
                    <li>Recommend apartments based on your preferred area and budget</li>
                    <li>Help you compare nightly and monthly rental options</li>
                    <li>Answer questions about transport, neighborhood, and move-in process</li>
                    <li>Support international renters with practical guidance</li>
                </ul>
            </section>

            <section className="broker-grid">
                {filteredBrokers.length === 0 ? (
                    <p>No brokers found for your search.</p>
                ) : (
                    filteredBrokers.map((broker) => (
                        <div key={broker.id} className="broker-card">
                            <img
                                src={broker.image}
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

                                <p>
                                    <strong>Languages:</strong> {broker.languages.join(", ")}
                                </p>
                                <p>
                                    <strong>Phone:</strong>{" "}
                                    <a href={`tel:${broker.phone}`}>{broker.phone}</a>
                                </p>
                                <p>
                                    <strong>Email:</strong>{" "}
                                    <a href={`mailto:${broker.email}`}>{broker.email}</a>
                                </p>

                                <div className="broker-actions">
                                    <a href={`mailto:${broker.email}`} className="btn">
                                        Message Broker
                                    </a>
                                    <a href={`tel:${broker.phone}`} className="btn btn-secondary">
                                        Call Broker
                                    </a>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </section>
        </div>
    );
}