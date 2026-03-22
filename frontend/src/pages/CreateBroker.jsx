import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../api/client";

export default function CreateBroker() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: "",
        area: "",
        specialty: "",
        languages: "",
        phone: "",
        email: "",
        description: "",
        image: null,
        is_active: true,
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
            formData.append("name", form.name);
            formData.append("area", form.area);
            formData.append("specialty", form.specialty);
            formData.append("languages", form.languages);
            formData.append("phone", form.phone);
            formData.append("email", form.email);
            formData.append("description", form.description);
            formData.append("is_active", form.is_active ? "1" : "0");

            if (form.image) {
                formData.append("image", form.image);
            }

            const data = await apiFetch("/admin/brokers", {
                method: "POST",
                body: formData,
            });

            setSuccess(data.message || "Broker created successfully.");

            setTimeout(() => {
                navigate("/admin/brokers");
            }, 1000);
        } catch (err) {
            setError(err.message || "Failed to create broker.");
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <div className="container page form-page-wide">
            <h1>Create Broker</h1>

            <form className="auth-form" onSubmit={handleSubmit}>
                <label>Name</label>
                <input type="text" name="name" value={form.name} onChange={handleChange} />

                <label>Area</label>
                <input type="text" name="area" value={form.area} onChange={handleChange} />

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

                <label>Broker Photo</label>
                <input type="file" name="image" accept="image/*" onChange={handleChange} />

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
                    {submitting ? "Creating..." : "Create Broker"}
                </button>
            </form>
        </div>
    );
}