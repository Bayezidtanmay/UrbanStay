import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../api/client";

export default function CreateApartment() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        title: "",
        description: "",
        location: "",
        address: "",
        price_per_night: "",
        price_per_month: "",
        rental_type: "both",
        bedrooms: 1,
        bathrooms: 1,
        size: "",
        is_available: true,
        featured_image: "",
    });

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [submitting, setSubmitting] = useState(false);

    function handleChange(e) {
        const { name, value, type, checked } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");
        setSuccess("");

        try {
            setSubmitting(true);

            const payload = {
                ...form,
                price_per_night: form.price_per_night === "" ? null : Number(form.price_per_night),
                price_per_month: form.price_per_month === "" ? null : Number(form.price_per_month),
                bedrooms: Number(form.bedrooms),
                bathrooms: Number(form.bathrooms),
                size: form.size === "" ? null : Number(form.size),
            };

            const data = await apiFetch("/apartments", {
                method: "POST",
                body: JSON.stringify(payload),
            });

            setSuccess(data.message || "Apartment created successfully.");

            setTimeout(() => {
                navigate("/admin/apartments");
            }, 1000);
        } catch (err) {
            setError(err.message || "Failed to create apartment.");
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <div className="container page form-page-wide">
            <h1>Create Apartment</h1>

            <form className="auth-form" onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="title"
                    placeholder="Title"
                    value={form.title}
                    onChange={handleChange}
                />

                <textarea
                    name="description"
                    placeholder="Description"
                    value={form.description}
                    onChange={handleChange}
                    rows="5"
                />

                <input
                    type="text"
                    name="location"
                    placeholder="Location"
                    value={form.location}
                    onChange={handleChange}
                />

                <input
                    type="text"
                    name="address"
                    placeholder="Address"
                    value={form.address}
                    onChange={handleChange}
                />

                <select
                    name="rental_type"
                    value={form.rental_type}
                    onChange={handleChange}
                >
                    <option value="both">Both</option>
                    <option value="nightly">Nightly</option>
                    <option value="monthly">Monthly</option>
                </select>

                <input
                    type="number"
                    name="price_per_night"
                    placeholder="Price per night"
                    value={form.price_per_night}
                    onChange={handleChange}
                />

                <input
                    type="number"
                    name="price_per_month"
                    placeholder="Price per month"
                    value={form.price_per_month}
                    onChange={handleChange}
                />

                <input
                    type="number"
                    name="bedrooms"
                    placeholder="Bedrooms"
                    value={form.bedrooms}
                    onChange={handleChange}
                />

                <input
                    type="number"
                    name="bathrooms"
                    placeholder="Bathrooms"
                    value={form.bathrooms}
                    onChange={handleChange}
                />

                <input
                    type="number"
                    name="size"
                    placeholder="Size in m²"
                    value={form.size}
                    onChange={handleChange}
                />

                <input
                    type="text"
                    name="featured_image"
                    placeholder="Featured image URL"
                    value={form.featured_image}
                    onChange={handleChange}
                />

                <label className="checkbox-row">
                    <input
                        type="checkbox"
                        name="is_available"
                        checked={form.is_available}
                        onChange={handleChange}
                    />
                    Available
                </label>

                {success && <p className="success-text">{success}</p>}
                {error && <p className="error-text">{error}</p>}

                <button type="submit" className="btn" disabled={submitting}>
                    {submitting ? "Creating..." : "Create Apartment"}
                </button>
            </form>
        </div>
    );
}