import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import NotificationBell from "./NotificationBell";

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
                    <Link to="/map">Map View</Link>
                    <Link to="/favorites">Favorites</Link>
                    <Link to="/find-broker">Find a Broker</Link>

                    {!user && (
                        <>
                            <Link to="/login">Login</Link>
                            <Link to="/register">Register</Link>
                        </>
                    )}

                    {user && (
                        <>
                            <Link to="/dashboard">Dashboard</Link>
                            {isAdmin && <Link to="/admin">Admin</Link>}

                            <Link to="/profile/edit" className="navbar-user">
                                <span className="navbar-avatar-wrap">
                                    <img
                                        src={
                                            user.profile_photo ||
                                            "https://via.placeholder.com/80x80?text=U"
                                        }
                                        alt={user.name || "User"}
                                        className="navbar-avatar"
                                    />
                                </span>

                                <span className="navbar-user-text">
                                    Hi, {user.name}
                                </span>
                            </Link>

                            <button onClick={handleLogout} className="btn btn-small">
                                Logout
                            </button>

                            <NotificationBell />
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}