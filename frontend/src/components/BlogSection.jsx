export default function BlogSection() {
    const blogs = [
        {
            title: "Best Areas to Live in Helsinki",
            desc: "Explore top neighborhoods for comfort, transport, and lifestyle.",
            image: "https://images.unsplash.com/photo-1507089947368-19c1da9775ae",
        },
        {
            title: "Monthly vs Nightly Rentals",
            desc: "Which option saves you more money? Let’s break it down.",
            image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267",
        },
        {
            title: "Tips for First-Time Renters",
            desc: "Avoid common mistakes when renting your first apartment.",
            image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2",
        },
    ];

    return (
        <section className="section">
            <div className="container">
                <h2 className="section-title">Latest Insights</h2>
                <p className="section-subtitle">
                    Learn more about renting, cities, and smart living.
                </p>

                <div className="blog-grid">
                    {blogs.map((blog, index) => (
                        <div key={index} className="blog-card">
                            <img src={blog.image} alt={blog.title} />
                            <div className="blog-content">
                                <h3>{blog.title}</h3>
                                <p>{blog.desc}</p>
                                <button className="btn btn-outline">Read More</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}