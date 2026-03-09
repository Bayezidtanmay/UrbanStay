import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
    const { user, logout, isAdmin } = useAuth();
    const navigate = useNavigate();

    async function handleLogout() {
        await logout();
        navigate("/login");
    }

    return (
        <nav className="navbar">
            <div className="container nav-content">
                <Link to="/" className="logo">
                    UrbanStay
                </Link>

                <div className="nav-links">
                    <Link to="/">Home</Link>
                    <Link to="/apartments">Apartments</Link>

                    {!user && (
                        <>
                            <Link to="/login">Login</Link>
                            <Link to="/register">Register</Link>
                        </>
                    )}

                    {user && (
                        <>
                            <span className="welcome">Hi, {user.name}</span>
                            {isAdmin && <span className="admin-badge">Admin</span>}
                            <button onClick={handleLogout} className="btn btn-small">
                                Logout
                            </button>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}