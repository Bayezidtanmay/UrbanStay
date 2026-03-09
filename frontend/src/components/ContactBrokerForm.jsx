import { useState } from "react";
import { apiFetch } from "../api/client";
import { useAuth } from "../context/AuthContext";

export default function ContactBrokerForm({ apartmentId }) {
    const { user } = useAuth();

    const [form, setForm] = useState({
        name: user?.name || "",
        email: user?.email || "",
        message: "",
    });

    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();
        setSuccess("");
        setError("");

        try {
            setSubmitting(true);

            const data = await apiFetch(`/apartments/${apartmentId}/contact`, {
                method: "POST",
                body: JSON.stringify(form),
            });

            setSuccess(data.message || "Message sent successfully.");
            setForm({
                name: user?.name || "",
                email: user?.email || "",
                message: "",
            });
        } catch (err) {
            setError(err.message);
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <div className="details-card section-card">
            <h2>Contact Broker</h2>

            <form className="auth-form" onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Your name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                />

                <input
                    type="email"
                    placeholder="Your email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                />

                <textarea
                    placeholder="Write your message"
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    rows="5"
                />

                {success && <p className="success-text">{success}</p>}
                {error && <p className="error-text">{error}</p>}

                <button type="submit" className="btn" disabled={submitting}>
                    {submitting ? "Sending..." : "Send Message"}
                </button>
            </form>
        </div>
    );
}