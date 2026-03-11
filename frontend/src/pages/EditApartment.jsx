import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { apiFetch } from "../api/client";
import Loading from "../components/Loading";

export default function EditApartment() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

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

    useEffect(() => {
        async function fetchApartment() {
            try {
                setLoading(true);
                setError("");

                const data = await apiFetch(`/apartments/${id}`);
                const apartment = data.apartment;

                setForm({
                    title: apartment.title || "",
                    description: apartment.description || "",
                    location: apartment.location || "",
                    address: apartment.address || "",
                    price_per_night: apartment.price_per_night ?? "",
                    price_per_month: apartment.price_per_month ?? "",
                    rental_type: apartment.rental_type || "both",
                    bedrooms: apartment.bedrooms ?? 1,
                    bathrooms: apartment.bathrooms ?? 1,
                    size: apartment.size ?? "",
                    is_available: Boolean(apartment.is_available),
                    featured_image: apartment.featured_image || "",
                });
            } catch (err) {
                setError(err.message || "Failed to load apartment.");
            } finally {
                setLoading(false);
            }
        }

        fetchApartment();
    }, [id]);

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
                price_per_night:
                    form.price_per_night === "" ? null : Number(form.price_per_night),
                price_per_month:
                    form.price_per_month === "" ? null : Number(form.price_per_month),
                bedrooms: Number(form.bedrooms),
                bathrooms: Number(form.bathrooms),
                size: form.size === "" ? null : Number(form.size),
            };

            const data = await apiFetch(`/apartments/${id}`, {
                method: "PUT",
                body: JSON.stringify(payload),
            });

            setSuccess(data.message || "Apartment updated successfully.");

            setTimeout(() => {
                navigate("/admin/apartments");
            }, 1000);
        } catch (err) {
            setError(err.message || "Failed to update apartment.");
        } finally {
            setSubmitting(false);
        }
    }

    if (loading) return <Loading />;

    return (
        <div className="container page form-page-wide">
            <h1>Edit Apartment</h1>

            <form className="auth-form" onSubmit={handleSubmit}>

                <label>Apartment Title</label>
                <input
                    type="text"
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                />

                <label>Description</label>
                <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    rows="5"
                />

                <label>City / Location</label>
                <input
                    type="text"
                    name="location"
                    value={form.location}
                    onChange={handleChange}
                />

                <label>Full Address</label>
                <input
                    type="text"
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                />

                <label>Rental Type</label>
                <select
                    name="rental_type"
                    value={form.rental_type}
                    onChange={handleChange}
                >
                    <option value="both">Both (Nightly + Monthly)</option>
                    <option value="nightly">Nightly Only</option>
                    <option value="monthly">Monthly Only</option>
                </select>

                <label>Price Per Night (€)</label>
                <input
                    type="number"
                    name="price_per_night"
                    value={form.price_per_night}
                    onChange={handleChange}
                />

                <label>Price Per Month (€)</label>
                <input
                    type="number"
                    name="price_per_month"
                    value={form.price_per_month}
                    onChange={handleChange}
                />

                <label>Number of Bedrooms</label>
                <input
                    type="number"
                    name="bedrooms"
                    value={form.bedrooms}
                    onChange={handleChange}
                />

                <label>Number of Bathrooms</label>
                <input
                    type="number"
                    name="bathrooms"
                    value={form.bathrooms}
                    onChange={handleChange}
                />

                <label>Apartment Size (m²)</label>
                <input
                    type="number"
                    name="size"
                    value={form.size}
                    onChange={handleChange}
                />

                <label>Featured Image URL</label>
                <input
                    type="text"
                    name="featured_image"
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
                    Apartment Available
                </label>

                {success && <p className="success-text">{success}</p>}
                {error && <p className="error-text">{error}</p>}

                <button type="submit" className="btn" disabled={submitting}>
                    {submitting ? "Updating..." : "Update Apartment"}
                </button>

            </form>
        </div>
    );
}