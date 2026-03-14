import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "../components/Navbar";
import ProtectedRoute from "../components/ProtectedRoute";
import Home from "../pages/Home";
import Apartments from "../pages/Apartments";
import ApartmentDetails from "../pages/ApartmentDetails";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import AdminRoute from "../components/AdminRoute";
import AdminDashboard from "../pages/AdminDashboard";
import AdminApartments from "../pages/AdminApartments";
import CreateApartment from "../pages/CreateApartment";
import AdminBookings from "../pages/AdminBookings";
import AdminMessages from "../pages/AdminMessages";
import EditApartment from "../pages/EditApartment";
import MapView from "../pages/MapView";

export default function AppRouter() {
    return (
        <BrowserRouter>
            <Navbar />

            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/apartments" element={<Apartments />} />
                <Route path="/apartments/:id" element={<ApartmentDetails />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/admin"
                    element={
                        <AdminRoute>
                            <AdminDashboard />
                        </AdminRoute>
                    }
                />

                <Route
                    path="/admin/apartments"
                    element={
                        <AdminRoute>
                            <AdminApartments />
                        </AdminRoute>
                    }
                />

                <Route
                    path="/admin/apartments/create"
                    element={
                        <AdminRoute>
                            <CreateApartment />
                        </AdminRoute>
                    }
                />

                <Route
                    path="/admin/bookings"
                    element={
                        <AdminRoute>
                            <AdminBookings />
                        </AdminRoute>
                    }
                />

                <Route
                    path="/admin/messages"
                    element={
                        <AdminRoute>
                            <AdminMessages />
                        </AdminRoute>
                    }
                />

                <Route
                    path="/admin/apartments/edit/:id"
                    element={
                        <AdminRoute>
                            <EditApartment />
                        </AdminRoute>
                    }
                />
                <Route path="/map" element={<MapView />} />
            </Routes>
        </BrowserRouter>
    );
}