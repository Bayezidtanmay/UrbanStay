import { useEffect, useState } from "react";
import { apiFetch } from "../api/client";
import { useAuth } from "../context/AuthContext";

export default function ReviewSection({ apartmentId }) {
    const { user } = useAuth();

    const [reviews, setReviews] = useState([]);
    const [averageRating, setAverageRating] = useState(null);
    const [totalReviews, setTotalReviews] = useState(0);

    const [form, setForm] = useState({
        rating: 5,
        comment: "",
    });

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    async function fetchReviews() {
        try {
            setLoading(true);
            const data = await apiFetch(`/apartments/${apartmentId}/reviews`);
            setReviews(data.reviews || []);
            setAverageRating(data.average_rating);
            setTotalReviews(data.total_reviews || 0);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchReviews();
    }, [apartmentId]);

    async function handleSubmit(e) {
        e.preventDefault();
        setMessage("");
        setError("");

        if (!user) {
            setError("You must be logged in to leave a review.");
            return;
        }

        try {
            setSubmitting(true);

            const data = await apiFetch(`/apartments/${apartmentId}/reviews`, {
                method: "POST",
                body: JSON.stringify(form),
            });

            setMessage(data.message || "Review added successfully.");
            setForm({ rating: 5, comment: "" });
            fetchReviews();
        } catch (err) {
            setError(err.message);
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <div className="details-card section-card">
            <h2>Reviews</h2>

            <p>
                <strong>Average Rating:</strong>{" "}
                {averageRating ?? "No rating yet"}
            </p>
            <p>
                <strong>Total Reviews:</strong> {totalReviews}
            </p>

            {loading ? (
                <p className="loading">Loading reviews...</p>
            ) : reviews.length === 0 ? (
                <p>No reviews yet.</p>
            ) : (
                <div className="review-list">
                    {reviews.map((review) => (
                        <div key={review.id} className="review-item">
                            <p><strong>{review.user?.name}</strong></p>
                            <p>Rating: {review.rating}/5</p>
                            <p>{review.comment}</p>
                        </div>
                    ))}
                </div>
            )}

            <h3 className="subheading">Leave a review</h3>

            <form className="auth-form" onSubmit={handleSubmit}>
                <select
                    value={form.rating}
                    onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })}
                >
                    <option value={5}>5 - Excellent</option>
                    <option value={4}>4 - Very good</option>
                    <option value={3}>3 - Good</option>
                    <option value={2}>2 - Fair</option>
                    <option value={1}>1 - Poor</option>
                </select>

                <textarea
                    placeholder="Write your review"
                    value={form.comment}
                    onChange={(e) => setForm({ ...form, comment: e.target.value })}
                    rows="4"
                />

                {message && <p className="success-text">{message}</p>}
                {error && <p className="error-text">{error}</p>}

                <button type="submit" className="btn" disabled={submitting}>
                    {submitting ? "Submitting..." : "Submit Review"}
                </button>
            </form>
        </div>
    );
}