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
        featured_image: null,
    });

    const [imagePreview, setImagePreview] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [submitting, setSubmitting] = useState(false);

    function handleChange(e) {
        const { name, value, type, checked, files } = e.target;

        if (type === "file") {
            const file = files[0] || null;
            setForm((prev) => ({ ...prev, [name]: file }));
            setImagePreview(file ? URL.createObjectURL(file) : "");
            return;
        }

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

            const formData = new FormData();
            formData.append("title", form.title);
            formData.append("description", form.description);
            formData.append("location", form.location);
            formData.append("address", form.address);
            formData.append("rental_type", form.rental_type);
            formData.append("bedrooms", form.bedrooms);
            formData.append("bathrooms", form.bathrooms);
            formData.append("is_available", form.is_available ? "1" : "0");

            if (form.price_per_night !== "") formData.append("price_per_night", form.price_per_night);
            if (form.price_per_month !== "") formData.append("price_per_month", form.price_per_month);
            if (form.size !== "") formData.append("size", form.size);
            if (form.featured_image) formData.append("featured_image", form.featured_image);

            const data = await apiFetch("/apartments", {
                method: "POST",
                body: formData,
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
                <label>Apartment Title</label>
                <input type="text" name="title" value={form.title} onChange={handleChange} />

                <label>Description</label>
                <textarea name="description" value={form.description} onChange={handleChange} rows="5" />

                <label>City / Location</label>
                <input type="text" name="location" value={form.location} onChange={handleChange} />

                <label>Full Address</label>
                <input type="text" name="address" value={form.address} onChange={handleChange} />

                <label>Rental Type</label>
                <select name="rental_type" value={form.rental_type} onChange={handleChange}>
                    <option value="both">Both (Nightly + Monthly)</option>
                    <option value="nightly">Nightly Only</option>
                    <option value="monthly">Monthly Only</option>
                </select>

                <label>Price Per Night (€)</label>
                <input type="number" name="price_per_night" value={form.price_per_night} onChange={handleChange} />

                <label>Price Per Month (€)</label>
                <input type="number" name="price_per_month" value={form.price_per_month} onChange={handleChange} />

                <label>Number of Bedrooms</label>
                <input type="number" name="bedrooms" value={form.bedrooms} onChange={handleChange} />

                <label>Number of Bathrooms</label>
                <input type="number" name="bathrooms" value={form.bathrooms} onChange={handleChange} />

                <label>Apartment Size (m²)</label>
                <input type="number" name="size" value={form.size} onChange={handleChange} />

                <label>Featured Image</label>
                <input type="file" name="featured_image" accept="image/*" onChange={handleChange} />

                {imagePreview && (
                    <img src={imagePreview} alt="Preview" className="image-preview" />
                )}

                <label className="checkbox-row">
                    <input
                        type="checkbox"
                        name="is_available"
                        checked={form.is_available}
                        onChange={handleChange}
                    />
                    Apartment Available
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