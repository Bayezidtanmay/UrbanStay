import { useEffect, useState } from "react";
import { apiFetch } from "../api/client";
import Loading from "../components/Loading";

export default function AdminApartments() {

    const [apartments, setApartments] = useState([]);
    const [loading, setLoading] = useState(true);

    async function fetchApartments() {
        try {
            setLoading(true);
            const data = await apiFetch("/apartments");
            setApartments(data.data || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchApartments();
    }, []);

    async function deleteApartment(id) {
        if (!confirm("Delete this apartment?")) return;

        try {
            await apiFetch(`/apartments/${id}`, {
                method: "DELETE",
            });

            fetchApartments();
        } catch (err) {
            console.error(err);
        }
    }

    if (loading) return <Loading />;

    return (
        <div className="container page">
            <h1>Manage Apartments</h1>

            {apartments.map((apt) => (
                <div key={apt.id} className="admin-item">

                    <h3>{apt.title}</h3>
                    <p>{apt.location}</p>

                    <button
                        className="btn btn-danger"
                        onClick={() => deleteApartment(apt.id)}
                    >
                        Delete
                    </button>

                </div>
            ))}
        </div>
    );
}