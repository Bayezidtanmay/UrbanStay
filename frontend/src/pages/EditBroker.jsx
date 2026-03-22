import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { apiFetch } from "../api/client";
import Loading from "../components/Loading";

export default function EditBroker() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: "",
        area: "",
        service_areas: "",
        specialty: "",
        languages: "",
        phone: "",
        email: "",
        description: "",
        image: null,
        is_active: true,
    });

    const [currentImage, setCurrentImage] = useState("");
    const [imagePreview, setImagePreview] = useState("");
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        async function fetchBroker() {
            try {
                setLoading(true);
                setError("");

                const data = await apiFetch(`/brokers/${id}`);

                setForm({
                    name: data.name || "",
                    area: data.area || "",
                    service_areas: Array.isArray(data.service_areas)
                        ? data.service_areas.join(", ")
                        : "",
                    specialty: data.specialty || "",
                    languages: data.languages || "",
                    phone: data.phone || "",
                    email: data.email || "",
                    description: data.description || "",
                    image: null,
                    is_active: Boolean(data.is_active),
                });

                setCurrentImage(data.image || "");
            } catch (err) {
                setError(err.message || "Failed to load broker.");
            } finally {
                setLoading(false);
            }
        }

        fetchBroker();
    }, [id]);

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
            formData.append("_method", "PUT");
            formData.append("name", form.name);
            formData.append("area", form.area);
            formData.append("specialty", form.specialty);
            formData.append("languages", form.languages);
            formData.append("phone", form.phone);
            formData.append("email", form.email);
            formData.append("description", form.description);
            formData.append("is_active", form.is_active ? "1" : "0");

            const serviceAreasArray = form.service_areas
                .split(",")
                .map((item) => item.trim())
                .filter(Boolean);

            serviceAreasArray.forEach((area, index) => {
                formData.append(`service_areas[${index}]`, area);
            });

            if (form.image) {
                formData.append("image", form.image);
            }

            const data = await apiFetch(`/admin/brokers/${id}`, {
                method: "POST",
                body: formData,
            });

            setSuccess(data.message || "Broker updated successfully.");

            setTimeout(() => {
                navigate("/admin/brokers");
            }, 1000);
        } catch (err) {
            setError(err.message || "Failed to update broker.");
        } finally {
            setSubmitting(false);
        }
    }

    if (loading) return <Loading />;

    return (
        <div className="container page form-page-wide">
            <h1>Edit Broker</h1>

            <form className="auth-form" onSubmit={handleSubmit}>
                <label>Name</label>
                <input type="text" name="name" value={form.name} onChange={handleChange} />

                <label>Main Area</label>
                <input type="text" name="area" value={form.area} onChange={handleChange} />

                <label>Service Areas (comma separated)</label>
                <input
                    type="text"
                    name="service_areas"
                    value={form.service_areas}
                    onChange={handleChange}
                    placeholder="Helsinki, Espoo, Vantaa"
                />

                <label>Specialty</label>
                <input type="text" name="specialty" value={form.specialty} onChange={handleChange} />

                <label>Languages</label>
                <input type="text" name="languages" value={form.languages} onChange={handleChange} />

                <label>Phone</label>
                <input type="text" name="phone" value={form.phone} onChange={handleChange} />

                <label>Email</label>
                <input type="email" name="email" value={form.email} onChange={handleChange} />

                <label>Description</label>
                <textarea name="description" rows="5" value={form.description} onChange={handleChange} />

                <label>Upload New Broker Photo</label>
                <input type="file" name="image" accept="image/*" onChange={handleChange} />

                {currentImage && !imagePreview && (
                    <img src={currentImage} alt="Current broker" className="image-preview" />
                )}

                {imagePreview && (
                    <img src={imagePreview} alt="Broker preview" className="image-preview" />
                )}

                <label className="checkbox-row">
                    <input
                        type="checkbox"
                        name="is_active"
                        checked={form.is_active}
                        onChange={handleChange}
                    />
                    Active Broker
                </label>

                {success && <p className="success-text">{success}</p>}
                {error && <p className="error-text">{error}</p>}

                <button type="submit" className="btn" disabled={submitting}>
                    {submitting ? "Updating..." : "Update Broker"}
                </button>
            </form>
        </div>
    );
}