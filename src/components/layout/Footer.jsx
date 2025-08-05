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
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../Firebase";

const Footer = () => {
  const [information, setInformation] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch contact number
        const docRef = doc(db, "websiteInformation", "siteConfig");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setInformation(data);
        } else {
          console.warn("No such document: siteConfig");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);
  console.log(information);

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
            {/* Logo */}
            <Link to={"/"}>
              <img
                src={information.logoUrl || "./website_logo.PNG"}
                className="w-14 mb-1"
                alt="Website Logo"
              />
            </Link>
            <p className="text-base mb-4">
              Your premium destination for massage, companionship, and ultimate
              relaxation.
            </p>
            <div className="flex gap-6">
              <Link to={information.contactNumber1}>
                <FaWhatsapp className="text-xl " />
              </Link>
              <Link to={information.facebookUrl}>
                <FaFacebookF className="text-xl " />
              </Link>
              <Link to={information.twitterUrl}>
                <FaTwitter className="text-xl" />
              </Link>
              <Link to={information.instagramUrl}>
                {" "}
                <FaInstagram className="text-xl" />
              </Link>
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
                <FaPhoneAlt /> {information.contactNumber2}
              </li>
              <li className="flex items-center gap-4">
                <FaEnvelope /> {information.email}
              </li>
              <li className="flex items-center gap-5">
                <FaMapMarkerAlt size={20} /> {information.address}
              </li>
            </ul>
          </div>

          {/* Column 4 - Opening Hours */}
          <div className="flex flex-col gap-3">
            <h3 className="text-xl font-semibold mb-4">Open Hours</h3>
            <p className="text-base">
              We are available {information.openingHours}
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
