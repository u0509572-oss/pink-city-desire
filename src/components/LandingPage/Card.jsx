import { useNavigate } from "react-router";
import { Whatsapp } from "../../assets";
import Button from "../common/Button";

const Card = ({ imgurl, name, details, number }) => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col bg-[var(--white-color)]/8 rounded-xl min-w-60 max-w-90 p-2 gap-2 sm:gap-3 md:gap-4 text-white">
      <img
        src={imgurl}
        className="w-full aspect-square object-cover rounded-xl"
        alt="landing image"
      />
      <h3 className="text-2xl md:text-3xl px-2 font-semibold">{name}</h3>
      <p className="text-base/6 md:text-lg/7 px-2">{details}</p>
      <div className="flex gap-4 mx-2 mb-2">
        <Button
          children={"Book Now"}
          onClick={() => {
            navigate("/booking");
          }}
          className="!w-full"
        />
        <button
          className="cursor-pointer"
          onClick={() => {
            if (number) {
              const formattedNumber = number.replace(/\D/g, ""); // Remove non-digit characters
              const message = encodeURIComponent(
                "Hi, I want to book a service."
              );
              window.open(
                `https://wa.me/${formattedNumber}?text=${message}`,
                "_blank"
              );
            } else {
              console.warn("Contact number not loaded yet.");
            }
          }}
        >
          <img
            src={Whatsapp}
            className="w-8 md:w-12 lg:w-14 aspect-square"
            alt="WhatsApp Icon"
          />
        </button>
      </div>
    </div>
  );
};

export default Card;
