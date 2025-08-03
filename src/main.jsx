import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";
import App from "./App.jsx";
import "./index.css";
import AboutUs from "./pages/AboutUs.jsx";
import Bookings from "./pages/Bookings.jsx";
import Gallery from "./pages/Gallery.jsx";
import Home from "./pages/Home.jsx";
import Profile from "./pages/Profile.jsx";
import TermsAndCond from "./pages/TermsAndCond.jsx";
import ScrollToTop from "./components/layout/ScrollToTop.jsx";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <StrictMode>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<Home />} />
          <Route path="disclaimer" element={<TermsAndCond />} />
          <Route path="gallery" element={<Gallery />} />
          <Route path="about" element={<AboutUs />} />
          <Route path="booking" element={<Bookings />} />
          <Route path="profile" element={<Profile />} />
        </Route>
      </Routes>
    </StrictMode>
  </BrowserRouter>
);
