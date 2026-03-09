import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Register() {
    const { register } = useAuth();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
    });

    const [error, setError] = useState("");

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");

        try {
            await register(
                form.name,
                form.email,
                form.password,
                form.password_confirmation
            );
            navigate("/");
        } catch (err) {
            setError(err.message);
        }
    }

    return (
        <div className="container page form-page">
            <h1>Register</h1>

            <form className="auth-form" onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                />

                <input
                    type="email"
                    placeholder="Email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                />

                <input
                    type="password"
                    placeholder="Password"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                />

                <input
                    type="password"
                    placeholder="Confirm Password"
                    value={form.password_confirmation}
                    onChange={(e) =>
                        setForm({ ...form, password_confirmation: e.target.value })
                    }
                />

                {error && <p className="error-text">{error}</p>}

                <button type="submit" className="btn">
                    Register
                </button>
            </form>
        </div>
    );
}