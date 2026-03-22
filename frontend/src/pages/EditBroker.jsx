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
        specialty: "",
        languages: "",
        phone: "",
        email: "",
        description: "",
        image: "",
        is_active: true,
    });

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
                    specialty: data.specialty || "",
                    languages: data.languages || "",
                    phone: data.phone || "",
                    email: data.email || "",
                    description: data.description || "",
                    image: data.image || "",
                    is_active: Boolean(data.is_active),
                });
            } catch (err) {
                setError(err.message || "Failed to load broker.");
            } finally {
                setLoading(false);
            }
        }

        fetchBroker();
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

            const data = await apiFetch(`/admin/brokers/${id}`, {
                method: "PUT",
                body: JSON.stringify(form),
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

                <label>Image URL</label>
                <input type="text" name="image" value={form.image} onChange={handleChange} />

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