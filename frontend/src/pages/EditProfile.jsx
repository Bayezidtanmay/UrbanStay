import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../api/client";
import Loading from "../components/Loading";

export default function EditProfile() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
        city: "",
        bio: "",
        profile_photo: null,
    });

    const [currentPhoto, setCurrentPhoto] = useState("");
    const [photoPreview, setPhotoPreview] = useState("");
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        async function fetchProfile() {
            try {
                setLoading(true);
                setError("");

                const data = await apiFetch("/profile");

                setForm({
                    name: data.name || "",
                    email: data.email || "",
                    phone: data.phone || "",
                    city: data.city || "",
                    bio: data.bio || "",
                    profile_photo: null,
                });

                setCurrentPhoto(data.profile_photo || "");
            } catch (err) {
                setError(err.message || "Failed to load profile.");
            } finally {
                setLoading(false);
            }
        }

        fetchProfile();
    }, []);

    function handleChange(e) {
        const { name, value, type, files } = e.target;

        if (type === "file") {
            const file = files[0] || null;
            setForm((prev) => ({ ...prev, [name]: file }));
            setPhotoPreview(file ? URL.createObjectURL(file) : "");
            return;
        }

        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setSuccess("");
        setError("");

        try {
            setSubmitting(true);

            const formData = new FormData();
            formData.append("name", form.name);
            formData.append("email", form.email);
            formData.append("phone", form.phone);
            formData.append("city", form.city);
            formData.append("bio", form.bio);

            if (form.profile_photo) {
                formData.append("profile_photo", form.profile_photo);
            }

            const data = await apiFetch("/profile", {
                method: "POST",
                body: formData,
            });

            setSuccess(data.message || "Profile updated successfully.");

            setTimeout(() => {
                navigate("/dashboard");
            }, 1000);
        } catch (err) {
            setError(err.message || "Failed to update profile.");
        } finally {
            setSubmitting(false);
        }
    }

    if (loading) return <Loading />;

    return (
        <div className="container page form-page-wide">
            <h1>Edit Profile</h1>

            <form className="auth-form" onSubmit={handleSubmit}>
                <label>Full Name</label>
                <input type="text" name="name" value={form.name} onChange={handleChange} />

                <label>Email</label>
                <input type="email" name="email" value={form.email} onChange={handleChange} />

                <label>Phone</label>
                <input type="text" name="phone" value={form.phone} onChange={handleChange} />

                <label>City</label>
                <input type="text" name="city" value={form.city} onChange={handleChange} />

                <label>Short Bio</label>
                <textarea name="bio" rows="5" value={form.bio} onChange={handleChange} />

                <label>Profile Photo</label>
                <input type="file" name="profile_photo" accept="image/*" onChange={handleChange} />

                {currentPhoto && !photoPreview && (
                    <img src={currentPhoto} alt="Current profile" className="profile-photo-preview" />
                )}

                {photoPreview && (
                    <img src={photoPreview} alt="Preview" className="profile-photo-preview" />
                )}

                {success && <p className="success-text">{success}</p>}
                {error && <p className="error-text">{error}</p>}

                <button type="submit" className="btn" disabled={submitting}>
                    {submitting ? "Saving..." : "Save Profile"}
                </button>
            </form>
        </div>
    );
}