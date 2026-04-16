import { useParams } from "react-router-dom";

const blogs = [
    {
        id: "helsinki-renting",
        title: "Renting in Helsinki: What You Should Know",
        content:
            "Helsinki offers a variety of rental options, from modern studios to family apartments. Prices can vary depending on the area. Popular areas include Kamppi, Kallio, and Espoo. Always check transportation, nearby services, and rental contracts before booking.",
    },
    {
        id: "short-vs-long",
        title: "Short Stay vs Long Term Rentals",
        content:
            "Short-term rentals are ideal for travelers and temporary stays, while long-term rentals offer stability and lower monthly costs. Choose based on your needs, budget, and flexibility.",
    },
    {
        id: "apartment-hunting",
        title: "Top Tips for Apartment Hunting",
        content:
            "Start early, set a clear budget, and use trusted platforms. Always visit the apartment if possible and verify the landlord. Consider amenities, location, and transport connections.",
    },
];

export default function BlogDetails() {
    const { id } = useParams();

    const blog = blogs.find((b) => b.id === id);

    if (!blog) {
        return <p className="container page">Blog not found.</p>;
    }

    return (
        <div className="container page">
            <h1>{blog.title}</h1>
            <p style={{ marginTop: "16px", lineHeight: "1.7" }}>
                {blog.content}
            </p>
        </div>
    );
}