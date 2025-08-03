import { Whatsapp } from "../../assets";
import Button from "../common/Button";

const Card = ({ imgurl, name, details }) => {
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
        <Button children={"Book Now"} className="!w-full" />
        <button className="cursor-pointer">
          <img src={Whatsapp} className="w-12" alt="landing image" />
        </button>
      </div>
    </div>
  );
};

export default Card;
