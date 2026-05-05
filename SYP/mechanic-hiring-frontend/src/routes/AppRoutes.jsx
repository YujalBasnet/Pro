import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "../components/common/ProtectedRoute";

// Public Pages
import Home from "../pages/public/Home";
import About from "../pages/public/About";
import Services from "../pages/public/Services";
import Contact from "../pages/public/Contact";

// Auth Pages
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";

// Customer Pages
import CustomerDashboard from "../pages/customer/CustomerDashboard";
import MechanicsList from "../pages/customer/MechanicsList";
import HireMechanics from "../pages/customer/HireMechanics";
import ServiceRequest from "../pages/customer/ServiceRequest";
import JobTracking from "../pages/customer/JobTracking";
import Profile from "../pages/customer/Profile";

// Mechanic Pages
import MechanicDashboard from "../pages/mechanic/MechanicDashboard";
import MechanicJobs from "../pages/mechanic/MechanicJobs";
import MechanicProfile from "../pages/mechanic/MechanicProfile";

// Admin Pages
import AdminDashboard from "../pages/admin/AdminDashboard";
import AdminUsers from "../pages/admin/AdminUsers";
import AdminMechanics from "../pages/admin/AdminMechanics";
import AdminRequests from "../pages/admin/AdminRequests";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/services" element={<Services />} />
      <Route path="/contact" element={<Contact />} />

      {/* Auth */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Customer */}
      <Route
        path="/customer/dashboard"
        element={
          <ProtectedRoute allowedRoles={["customer"]}>
            <CustomerDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/customer/mechanics"
        element={
          <ProtectedRoute allowedRoles={["customer"]}>
            <MechanicsList />
          </ProtectedRoute>
        }
      />
      <Route
        path="/customer/hire"
        element={
          <ProtectedRoute allowedRoles={["customer"]}>
            <HireMechanics />
          </ProtectedRoute>
        }
      />
      <Route
        path="/customer/request"
        element={
          <ProtectedRoute allowedRoles={["customer"]}>
            <ServiceRequest />
          </ProtectedRoute>
        }
      />
      <Route
        path="/customer/tracking"
        element={
          <ProtectedRoute allowedRoles={["customer"]}>
            <JobTracking />
          </ProtectedRoute>
        }
      />
      <Route
        path="/customer/profile"
        element={
          <ProtectedRoute allowedRoles={["customer"]}>
            <Profile />
          </ProtectedRoute>
        }
      />

      {/* Mechanic */}
      <Route
        path="/mechanic/dashboard"
        element={
          <ProtectedRoute allowedRoles={["mechanic"]}>
            <MechanicDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/mechanic/jobs"
        element={
          <ProtectedRoute allowedRoles={["mechanic"]}>
            <MechanicJobs />
          </ProtectedRoute>
        }
      />
      <Route
        path="/mechanic/profile"
        element={
          <ProtectedRoute allowedRoles={["mechanic"]}>
            <MechanicProfile />
          </ProtectedRoute>
        }
      />

      {/* Admin */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/users"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminUsers />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/mechanics"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminMechanics />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/requests"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminRequests />
          </ProtectedRoute>
        }
      />

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;