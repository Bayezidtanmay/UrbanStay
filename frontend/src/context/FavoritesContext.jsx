import { createContext, useContext, useEffect, useState } from "react";
import { apiFetch } from "../api/client";
import { useAuth } from "./AuthContext";

const FavoritesContext = createContext(null);

export function FavoritesProvider({ children }) {
    const { user } = useAuth();
    const [favoriteIds, setFavoriteIds] = useState([]);
    const [loadingFavorites, setLoadingFavorites] = useState(false);

    async function fetchFavorites() {
        if (!user) {
            setFavoriteIds([]);
            return;
        }

        try {
            setLoadingFavorites(true);
            const data = await apiFetch("/favorites");
            const ids = (data || [])
                .map((item) => item.apartment?.id)
                .filter(Boolean);

            setFavoriteIds(ids);
        } catch (error) {
            console.error(error.message);
        } finally {
            setLoadingFavorites(false);
        }
    }

    useEffect(() => {
        fetchFavorites();
    }, [user]);

    function isFavorite(apartmentId) {
        return favoriteIds.includes(apartmentId);
    }

    function addFavoriteLocally(apartmentId) {
        setFavoriteIds((prev) =>
            prev.includes(apartmentId) ? prev : [...prev, apartmentId]
        );
    }

    function removeFavoriteLocally(apartmentId) {
        setFavoriteIds((prev) => prev.filter((id) => id !== apartmentId));
    }

    async function toggleFavorite(apartmentId) {
        if (!user) return false;

        const alreadyFavorite = isFavorite(apartmentId);

        try {
            if (alreadyFavorite) {
                await apiFetch(`/favorites/${apartmentId}`, {
                    method: "DELETE",
                });
                removeFavoriteLocally(apartmentId);
                return false;
            } else {
                await apiFetch(`/favorites/${apartmentId}`, {
                    method: "POST",
                });
                addFavoriteLocally(apartmentId);
                return true;
            }
        } catch (error) {
            console.error(error.message);
            return alreadyFavorite;
        }
    }

    return (
        <FavoritesContext.Provider
            value={{
                favoriteIds,
                favoritesCount: favoriteIds.length,
                loadingFavorites,
                fetchFavorites,
                isFavorite,
                toggleFavorite,
                addFavoriteLocally,
                removeFavoriteLocally,
            }}
        >
            {children}
        </FavoritesContext.Provider>
    );
}

export function useFavorites() {
    const context = useContext(FavoritesContext);

    if (!context) {
        throw new Error("useFavorites must be used inside FavoritesProvider");
    }

    return context;
}