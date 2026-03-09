import { createContext, useContext, useEffect, useState } from "react";
import { apiFetch } from "../api/client";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    async function fetchUser() {
        const token = localStorage.getItem("token");

        if (!token) {
            setLoading(false);
            return;
        }

        try {
            const data = await apiFetch("/user");
            setUser(data);
        } catch (error) {
            localStorage.removeItem("token");
            setUser(null);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchUser();
    }, []);

    async function login(email, password) {
        const data = await apiFetch("/login", {
            method: "POST",
            body: JSON.stringify({ email, password }),
        });

        localStorage.setItem("token", data.token);
        setUser(data.user);
        return data;
    }

    async function register(name, email, password, password_confirmation) {
        const data = await apiFetch("/register", {
            method: "POST",
            body: JSON.stringify({
                name,
                email,
                password,
                password_confirmation,
            }),
        });

        localStorage.setItem("token", data.token);
        setUser(data.user);
        return data;
    }

    async function logout() {
        try {
            await apiFetch("/logout", { method: "POST" });
        } catch (error) {
            //
        }

        localStorage.removeItem("token");
        setUser(null);
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                login,
                register,
                logout,
                isAuthenticated: !!user,
                isAdmin: user?.role === "admin",
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}