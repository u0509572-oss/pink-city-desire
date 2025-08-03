import { AboutUsBg, AboutUsfront } from "../assets";
import Container from "../components/common/Container";

const AboutUs = () => {
  return (
    <div
      className="relative w-full bg-cover bg-center"
      style={{ backgroundImage: `url(${AboutUsBg})` }}
    >
      <div className="absolute inset-0 bg-[linear-gradient(185.26deg,var(--black-color)_23.34%,var(--primary-color)_123.16%)] opacity-90"></div>
      <div className="relative text-white section-container">
        <Container>
          <div className="flex flex-col md:flex-row w-full gap-10">
            <div className="basis-5/12">
              <img
                src={AboutUsfront}
                className="h-80 w-full m-auto md:h-full object-cover"
                alt="About image"
              />
            </div>
            <div className="basis-7/12 text-white">
              <div className="flex gap-2 flex-col">
                {/* Who We Are */}
                <h2 className="text-2xl">Who We Are</h2>
                <p className="text-sm">
                  We are a team of certified and experienced massage therapists
                  dedicated to offering premium body care and holistic healing.
                  Whether you're here to relieve stress, treat body aches, or
                  simply escape the chaos of everyday life, we promise a
                  luxurious experience from start to finish.
                </p>

                {/* What We Offer */}
                <h2 className="text-2xl">✨ What We Offer</h2>
                <div>
                  <p className="text-sm">
                    From short relaxation sessions to full-night premium
                    therapy, our services include:
                  </p>
                  <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
                    <li>Swedish & Deep Tissue Massage</li>
                    <li>Thai Stretching & Oil Massage</li>
                    <li>Aromatherapy & Hot Stone Therapy</li>
                    <li>Full Body Detox & Foot Reflexology</li>
                    <li>VIP Home & Hotel Services</li>
                    <li>Couples & Sleep Therapy Packages</li>
                  </ul>
                  <p className="mt-3 text-sm">
                    All treatments are performed with high-quality oils, calming
                    music, and a touch of personalized care to ensure 100%
                    satisfaction.
                  </p>
                </div>

                {/* Why Choose Us */}
                <h2 className="text-2xl">💎 Why Choose Us?</h2>
                <ul className="list-inside space-y-1 text-sm">
                  <li>
                    ✅ Highly trained, respectful, and discreet therapists
                  </li>
                  <li>
                    ✅ Clean, calm, and private environment (or home service)
                  </li>
                  <li>✅ Flexible hours — Day, Evening & Overnight Sessions</li>
                  <li>
                    ✅ Premium oils, hot towels, and customized techniques
                  </li>
                  <li>✅ Customer happiness is our mission — every time</li>
                </ul>

                {/* Contact */}
                <h2 className="text-2xl">📞 Contact Us</h2>
                <div>
                  <p className="text-sm">
                    <strong>Phone / WhatsApp:</strong> +98 xxx xxx xxxx
                  </p>
                  <p className="text-sm">
                    <strong>Instagram:</strong>{" "}
                    <a
                      href="https://instagram.com/yourspa.iran"
                      className="text-blue-400"
                    >
                      @yourspa.iran
                    </a>
                  </p>
                  <p className="text-sm">
                    <strong>Location:</strong> Tehran / [Your Area or Home
                    Service Range]
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </div>
    </div>
  );
};

export default AboutUs;
