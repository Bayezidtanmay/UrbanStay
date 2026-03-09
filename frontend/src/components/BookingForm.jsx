import { useState } from "react";
import { apiFetch } from "../api/client";
import { useAuth } from "../context/AuthContext";

export default function BookingForm({ apartmentId, rentalType, onSuccess }) {
    const { user } = useAuth();

    const [form, setForm] = useState({
        booking_type: rentalType === "both" ? "nightly" : rentalType,
        start_date: "",
        end_date: "",
    });

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();
        setMessage("");
        setError("");

        if (!user) {
            setError("You must be logged in to make a booking.");
            return;
        }

        try {
            setSubmitting(true);

            const data = await apiFetch("/bookings", {
                method: "POST",
                body: JSON.stringify({
                    apartment_id: apartmentId,
                    booking_type: form.booking_type,
                    start_date: form.start_date,
                    end_date: form.end_date,
                }),
            });

            setMessage(data.message || "Booking created successfully.");
            setForm({
                booking_type: rentalType === "both" ? "nightly" : rentalType,
                start_date: "",
                end_date: "",
            });

            if (onSuccess) onSuccess(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <div className="details-card section-card">
            <h2>Book this apartment</h2>

            <form className="auth-form" onSubmit={handleSubmit}>
                <select
                    value={form.booking_type}
                    onChange={(e) =>
                        setForm({ ...form, booking_type: e.target.value })
                    }
                    disabled={rentalType !== "both"}
                >
                    {rentalType === "both" && (
                        <>
                            <option value="nightly">Nightly</option>
                            <option value="monthly">Monthly</option>
                        </>
                    )}
                    {rentalType === "nightly" && (
                        <option value="nightly">Nightly</option>
                    )}
                    {rentalType === "monthly" && (
                        <option value="monthly">Monthly</option>
                    )}
                </select>

                <input
                    type="date"
                    value={form.start_date}
                    onChange={(e) => setForm({ ...form, start_date: e.target.value })}
                />

                <input
                    type="date"
                    value={form.end_date}
                    onChange={(e) => setForm({ ...form, end_date: e.target.value })}
                />

                {message && <p className="success-text">{message}</p>}
                {error && <p className="error-text">{error}</p>}

                <button type="submit" className="btn" disabled={submitting}>
                    {submitting ? "Booking..." : "Book Now"}
                </button>
            </form>
        </div>
    );
}