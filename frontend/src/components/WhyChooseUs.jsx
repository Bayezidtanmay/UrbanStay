export default function WhyChooseUs() {
    const features = [
        {
            title: "Verified Listings",
            desc: "All apartments are verified for quality and accuracy.",
        },
        {
            title: "Secure Booking",
            desc: "Safe and transparent booking experience.",
        },
        {
            title: "Flexible Options",
            desc: "Choose nightly or monthly rentals easily.",
        },
    ];

    return (
        <section className="section light">
            <div className="container">
                <h2 className="section-title">Why Choose UrbanStay</h2>

                <div className="features-grid">
                    {features.map((f, i) => (
                        <div key={i} className="feature-card">
                            <h3>{f.title}</h3>
                            <p>{f.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}