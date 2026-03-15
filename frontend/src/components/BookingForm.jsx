import { useState } from "react";
import DatePicker from "react-datepicker";
import { apiFetch } from "../api/client";
import { useAuth } from "../context/AuthContext";

export default function BookingForm({ apartmentId, rentalType, onSuccess }) {
    const { user } = useAuth();

    const [form, setForm] = useState({
        booking_type: rentalType === "both" ? "nightly" : rentalType,
        start_date: null,
        end_date: null,
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

        if (!form.start_date || !form.end_date) {
            setError("Please select both start and end dates.");
            return;
        }

        try {
            setSubmitting(true);

            const data = await apiFetch("/bookings", {
                method: "POST",
                body: JSON.stringify({
                    apartment_id: apartmentId,
                    booking_type: form.booking_type,
                    start_date: form.start_date.toISOString().split("T")[0],
                    end_date: form.end_date.toISOString().split("T")[0],
                }),
            });

            setMessage(data.message || "Booking created successfully.");
            setForm({
                booking_type: rentalType === "both" ? "nightly" : rentalType,
                start_date: null,
                end_date: null,
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
                <label>Booking Type</label>
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

                <label>Start Date</label>
                <DatePicker
                    selected={form.start_date}
                    onChange={(date) => setForm({ ...form, start_date: date })}
                    minDate={new Date()}
                    dateFormat="yyyy-MM-dd"
                    placeholderText="Select start date"
                    className="datepicker-input"
                />

                <label>End Date</label>
                <DatePicker
                    selected={form.end_date}
                    onChange={(date) => setForm({ ...form, end_date: date })}
                    minDate={form.start_date || new Date()}
                    dateFormat="yyyy-MM-dd"
                    placeholderText="Select end date"
                    className="datepicker-input"
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