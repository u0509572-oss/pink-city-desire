import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";
import App from "./App.jsx";
import "./index.css";

// Public pages
import AboutUs from "./pages/AboutUs.jsx";
import Bookings from "./pages/Bookings.jsx";
import Gallery from "./pages/Gallery.jsx";
import Home from "./pages/Home.jsx";
import Profile from "./pages/Profile.jsx";
import TermsAndCond from "./pages/TermsAndCond.jsx";

// Admin pages
//import Dashboard from "./pages/admin/pages/Dashboard.jsx";
import AdminBookings from "./pages/admin/pages/Bookings.jsx";
import GirlsProfiles from "./pages/admin/pages/GirlsProfiles.jsx";
import Settings from "./pages/admin/pages/Settings.jsx";

// Components
import ScrollToTop from "./components/layout/ScrollToTop.jsx";
import AdminLogin from "./pages/AdminLogin.jsx";
import { AuthProvider } from "./contexts/AuthContext.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import PlansCreation from "./pages/admin/pages/PlansCreation.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<App />}>
            {/* Public routes */}
            <Route index element={<Home />} />
            <Route path="disclaimer" element={<TermsAndCond />} />
            <Route path="gallery" element={<Gallery />} />
            <Route path="about" element={<AboutUs />} />
            <Route path="booking" element={<Bookings />} />
            <Route path="profile" element={<Profile />} />
            <Route path="login" element={<AdminLogin />} />

            {/* Admin routes */}
            {/* <Route
              path="admin/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            /> */}
            <Route
              path="admin/bookings"
              element={
                <ProtectedRoute>
                  <AdminBookings />
                </ProtectedRoute>
              }
            />
            <Route
              path="admin/profiles"
              element={
                <ProtectedRoute>
                  <GirlsProfiles />
                </ProtectedRoute>
              }
            />
            <Route
              path="admin/plans"
              element={
                <ProtectedRoute>
                  <PlansCreation />
                </ProtectedRoute>
              }
            />
            <Route
              path="admin/settings"
              element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              }
            />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
