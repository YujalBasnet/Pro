import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import { AuthProvider } from "./context/AuthContext";

// Layouts
import MainLayout from "./layouts/MainLayout";
import DashboardLayout from "./layouts/DashboardLayout";

// Pages
import Home from "./pages/public/Home";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Services from "./pages/public/Services";
import About from "./pages/public/About";
import Contact from "./pages/public/Contact";
import MechanicsList from "./pages/customer/MechanicsList";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminMechanics from "./pages/admin/AdminMechanics";
import AdminRequests from "./pages/admin/AdminRequests";
import CustomerDashboard from "./pages/customer/CustomerDashboard";
import MechanicDashboard from "./pages/mechanic/MechanicDashboard";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Toaster position="top-right" />

        <Routes>
          {/* Public routes with MainLayout */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/services" element={<Services />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/hire-mechanics" element={<MechanicsList />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>

          {/* Protected dashboard routes */}
          <Route element={<DashboardLayout />}>
            {/* Admin */}
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route path="/admin/mechanics" element={<AdminMechanics />} />
            <Route path="/admin/requests" element={<AdminRequests />} />

            {/* Customer */}
            <Route path="/customer/dashboard" element={<CustomerDashboard />} />

            {/* Mechanic */}
            <Route path="/mechanic/dashboard" element={<MechanicDashboard />} />
          </Route>

          {/* Catch-all route */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;