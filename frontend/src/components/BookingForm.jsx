import { useEffect, useMemo, useState } from "react";
import DatePicker from "react-datepicker";
import { apiFetch } from "../api/client";
import { useAuth } from "../context/AuthContext";

function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}

function buildBlockedDates(bookings = []) {
    const blocked = [];

    bookings.forEach((booking) => {
        if (!["pending", "confirmed"].includes(booking.status)) return;

        const start = new Date(booking.start_date);
        const end = new Date(booking.end_date);

        const current = new Date(start);
        while (current <= end) {
            blocked.push(new Date(current));
            current.setDate(current.getDate() + 1);
        }
    });

    return blocked;
}

function isSameDay(date1, date2) {
    return (
        date1.getFullYear() === date2.getFullYear() &&
        date1.getMonth() === date2.getMonth() &&
        date1.getDate() === date2.getDate()
    );
}

function getFirstDayOfMonth(date) {
    return new Date(date.getFullYear(), date.getMonth(), 1);
}

function getLastDayOfMonth(date) {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0);
}

function getFirstDayOfNextMonth() {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth() + 1, 1);
}

function getLastDayOfNextMonth() {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth() + 2, 0);
}

export default function BookingForm({
    apartmentId,
    rentalType,
    pricePerNight,
    pricePerMonth,
    bookings = [],
    onSuccess,
}) {
    const { user } = useAuth();

    const [form, setForm] = useState({
        booking_type: rentalType === "both" ? "nightly" : rentalType,
        start_date: null,
        end_date: null,
    });

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const blockedDates = useMemo(() => buildBlockedDates(bookings), [bookings]);
    const isMonthly = form.booking_type === "monthly";

    function getDayClassName(date) {
        const isBlocked = blockedDates.some((blockedDate) =>
            isSameDay(blockedDate, date)
        );

        return isBlocked ? "blocked-date" : undefined;
    }

    useEffect(() => {
        setForm((prev) => ({
            ...prev,
            booking_type: rentalType === "both" ? prev.booking_type : rentalType,
        }));
    }, [rentalType]);

    useEffect(() => {
        if (form.booking_type === "monthly") {
            setForm((prev) => ({
                ...prev,
                start_date: getFirstDayOfNextMonth(),
                end_date: getLastDayOfNextMonth(),
            }));
        }
    }, [form.booking_type]);

    function resetDatesForMode(type) {
        if (type === "monthly") {
            setForm((prev) => ({
                ...prev,
                booking_type: type,
                start_date: getFirstDayOfNextMonth(),
                end_date: getLastDayOfNextMonth(),
            }));
        } else {
            setForm((prev) => ({
                ...prev,
                booking_type: type,
                start_date: null,
                end_date: null,
            }));
        }
    }

    function handleStartDateChange(date) {
        if (!date) {
            setForm((prev) => ({ ...prev, start_date: null, end_date: null }));
            return;
        }

        if (form.booking_type === "monthly") {
            const correctedStart = getFirstDayOfMonth(date);
            const correctedEnd =
                form.end_date && form.end_date >= correctedStart
                    ? getLastDayOfMonth(form.end_date)
                    : getLastDayOfMonth(correctedStart);

            setForm((prev) => ({
                ...prev,
                start_date: correctedStart,
                end_date: correctedEnd,
            }));
            return;
        }

        setForm((prev) => ({
            ...prev,
            start_date: date,
            end_date: null,
        }));
    }

    function handleEndDateChange(date) {
        if (!date) {
            setForm((prev) => ({ ...prev, end_date: null }));
            return;
        }

        if (form.booking_type === "monthly") {
            const correctedEnd = getLastDayOfMonth(date);

            setForm((prev) => ({
                ...prev,
                end_date: correctedEnd,
            }));
            return;
        }

        setForm((prev) => ({
            ...prev,
            end_date: date,
        }));
    }

    const totalPreview = useMemo(() => {
        if (!form.start_date || !form.end_date) return null;

        const start = new Date(form.start_date);
        const end = new Date(form.end_date);

        if (form.booking_type === "nightly") {
            const diffMs = end - start;
            const nights = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
            if (nights <= 0 || !pricePerNight) return null;

            return {
                label: `${nights} night${nights > 1 ? "s" : ""}`,
                total: (Number(pricePerNight) * nights).toFixed(2),
            };
        }

        const yearDiff = end.getFullYear() - start.getFullYear();
        const monthDiff = end.getMonth() - start.getMonth();
        let months = yearDiff * 12 + monthDiff + 1;

        if (months < 1) months = 1;
        if (!pricePerMonth) return null;

        return {
            label: `${months} month${months > 1 ? "s" : ""}`,
            total: (Number(pricePerMonth) * months).toFixed(2),
        };
    }, [form.start_date, form.end_date, form.booking_type, pricePerNight, pricePerMonth]);

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
                    start_date: formatDate(form.start_date),
                    end_date: formatDate(form.end_date),
                }),
            });

            setMessage(data.message || "Booking created successfully.");

            setForm({
                booking_type: rentalType === "both" ? "nightly" : rentalType,
                start_date: rentalType === "monthly" ? getFirstDayOfNextMonth() : null,
                end_date: rentalType === "monthly" ? getLastDayOfNextMonth() : null,
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
                    onChange={(e) => resetDatesForMode(e.target.value)}
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

                <p className="booking-hint">
                    {isMonthly
                        ? "Monthly bookings must start on the 1st day of a month and end on the last day of a month. By default, next month is selected."
                        : "Nightly mode: booked and pending dates are blocked in the calendar."}
                </p>

                <label>{isMonthly ? "Move-in Date" : "Start Date"}</label>
                <DatePicker
                    selected={form.start_date}
                    onChange={handleStartDateChange}
                    minDate={isMonthly ? getFirstDayOfNextMonth() : new Date()}
                    dateFormat="yyyy-MM-dd"
                    placeholderText={isMonthly ? "Select move-in date" : "Select start date"}
                    className="datepicker-input"
                    excludeDates={blockedDates}
                    dayClassName={getDayClassName}
                />

                <label>{isMonthly ? "Move-out Date" : "End Date"}</label>
                <DatePicker
                    selected={form.end_date}
                    onChange={handleEndDateChange}
                    minDate={form.start_date || (isMonthly ? getFirstDayOfNextMonth() : new Date())}
                    dateFormat="yyyy-MM-dd"
                    placeholderText={isMonthly ? "Select move-out date" : "Select end date"}
                    className="datepicker-input"
                    excludeDates={blockedDates}
                    dayClassName={getDayClassName}
                />

                {totalPreview && (
                    <div className="booking-summary">
                        <p><strong>Estimated Duration:</strong> {totalPreview.label}</p>
                        <p><strong>Estimated Total:</strong> €{totalPreview.total}</p>
                    </div>
                )}

                {blockedDates.length > 0 && (
                    <p className="booking-hint">
                        Some dates are unavailable because they are already booked or pending.
                    </p>
                )}

                {message && <p className="success-text">{message}</p>}
                {error && <p className="error-text">{error}</p>}

                <button type="submit" className="btn" disabled={submitting}>
                    {submitting ? "Booking..." : "Book Now"}
                </button>
            </form>
        </div>
    );
}