import {
  FaEnvelope,
  FaFacebookF,
  FaInstagram,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaTwitter,
  FaWhatsapp,
} from "react-icons/fa";
import { Link } from "react-router";
import { FooterBg } from "../../assets";

const Footer = () => {
  return (
    <div
      className="relative w-full bg-cover"
      style={{ backgroundImage: `url(${FooterBg})` }}
    >
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(45deg, var(--black-color) 0%,rgba(0,0,0,0.9) 20%, rgba(201, 68, 208, 0.7) 50%,rgba(201, 68, 208, 0.7) 50%, rgba(0,0,0,0.9) 80%, var(--black-color) 100%)",
        }}
      ></div>
      <footer className="relative text-white pt-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 py-20 px-6 md:px-20">
          {/* Column 1 - Logo & Social */}
          <div className="flex flex-col gap-3">
            <h3 className="text-2xl font-semibold mb-4">Logo</h3>
            <p className="text-base mb-4">
              Your premium destination for massage, companionship, and ultimate
              relaxation.
            </p>
            <div className="flex gap-6">
              <FaWhatsapp className="text-xl " />
              <FaFacebookF className="text-xl " />
              <FaTwitter className="text-xl" />
              <FaInstagram className="text-xl" />
            </div>
          </div>

          {/* Column 2 - Quick Links */}
          <div className="flex flex-col gap-3">
            <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-3 text-base">
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/about">About Us</Link>
              </li>
              <li>
                <Link to="/">Contact Us</Link>
              </li>
              <li>
                <Link to="/booking">Advanced Booking Page</Link>
              </li>
              <li>
                <Link to="/disclaimer">Terms & 18+ Disclaimer Page</Link>
              </li>
            </ul>
          </div>

          {/* Column 3 - Contact Info */}
          <div className="flex flex-col gap-3">
            <h3 className="text-xl font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3 text-base">
              <li className="flex items-center gap-4">
                <FaPhoneAlt /> 011 40363064
              </li>
              <li className="flex items-center gap-4">
                <FaEnvelope /> Amit@caavm.com
              </li>
              <li className="flex items-center gap-5">
                <FaMapMarkerAlt size={20} /> 1st Floor,276, Gagan Vihar Delhi
                110051, India
              </li>
            </ul>
          </div>

          {/* Column 4 - Opening Hours */}
          <div className="flex flex-col gap-3">
            <h3 className="text-xl font-semibold mb-4">Open Hours</h3>
            <p className="text-base">
              We are available Monday to Sunday, 10:00 AM – 3:00 PM.
            </p>
          </div>
        </div>

        {/* Bottom line */}
        <div className="mt-10 bg-black/50 py-6 w-full text-center px-6 md:px-20 text-white font-light flex justify-between max-md:flex-col max-md:gap-7">
          <p>
            Privacy policy <span className="px-2 font-semibold">·</span> Terms
            Of Service{" "}
          </p>
          <p>Copyright © {new Date().getFullYear()} — All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
