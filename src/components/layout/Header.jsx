import { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";

import Button from "../common/Button";
import Container from "../common/Container";
import { Link, NavLink } from "react-router";
import { db } from "../../Firebase";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [logoUrl, setLogoUrl] = useState(""); 

  const navItems = [
    { label: "Home", path: "/" },
    { label: "Gallery", path: "/gallery" },
    { label: "About Us", path: "/about" },
    { label: "Advance Booking", path: "/booking" },
    { label: "Terms & 18+ Disclaimer Page", path: "/disclaimer" },
  ];

  // Fetch logo URL from Firestore
  useEffect(() => {
    const fetchLogo = async () => {
      try {
        const docRef = doc(db, "websiteInformation", "siteConfig");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setLogoUrl(data.logoUrl);
        } else {
          console.warn("No such document: siteConfig");
        }
      } catch (error) {
        console.error("Error fetching logo:", error);
      }
    };

    fetchLogo();
  }, []);

  return (
    <div className="bg-[var(--primary-color)]">
      <Container>
        <nav
          className="flex items-end justify-between pt-3 relative"
          aria-label="Main Navigation"
        >
          <div className="flex items-center gap-4">
            {/* Hamburger Button */}
            <div
              className="lg:hidden flex flex-col space-y-1 cursor-pointer mb-2"
              onClick={() => setIsMenuOpen((prev) => !prev)}
            >
              <span className="w-6 h-0.5 bg-white"></span>
              <span className="w-6 h-0.5 bg-white"></span>
              <span className="w-6 h-0.5 bg-white"></span>
            </div>

            {/* Logo */}
            <Link to={"/"}>
              <img
                src={logoUrl || "./website_logo.PNG"}
                className="w-14 mb-1"
                alt="Website Logo"
              />
            </Link>
          </div>

          {/* Nav Items (desktop) */}
          <div className="hidden lg:flex space-x-0.5 list-none">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `text-[var(--white-color)] text-sm lg:text-base px-3 lg:px-5 py-2 cursor-pointer transition-colors duration-200
                     hover:bg-[var(--black-color)]/50 border-b-4 ${
                       isActive
                         ? "border-b-white bg-[var(--black-color)]"
                         : "border-b-transparent"
                     }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </div>

          <div className="flex gap-2">
            <Button
              children={"Contact Us"}
              bgColor="bg-[var(--black-color)]"
              className="mb-2"
            />
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="absolute top-full left-0 w-full bg-[var(--primary-color)] flex flex-col lg:hidden shadow-md z-10">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={({ isActive }) =>
                    `text-[var(--white-color)] text-base px-5 py-3 cursor-pointer transition-colors duration-200
                     hover:bg-[var(--black-color)]/50 border-b ${
                       isActive
                         ? "border-b-white bg-[var(--black-color)]"
                         : "border-b-transparent"
                     }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </div>
          )}
        </nav>
      </Container>
    </div>
  );
};

export default Header;
