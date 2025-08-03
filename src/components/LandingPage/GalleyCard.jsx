import Button from "../common/Button";

const GalleryCard = ({ imgurl, name, details }) => {
  return (
    <div className="relative flex flex-col items-center bg-[var(--white-color)]/8 w-90 gap-2 sm:gap-3 md:gap-4 text-white group overflow-hidden hover:shadow-[0_8px_40px_-4px_rgba(0,0,0,0.5)]">
      <img
        src={imgurl}
        className="w-full aspect-[5/6] object-cover"
        alt="landing image"
      />
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-[linear-gradient(180deg,transparent_0%,var(--black-color)_90%)] pointer-events-none"></div>
      <div className="absolute bottom-0 max-w-80 pt-4 flex flex-col gap-6 items-center rounded-b-md border border-white/50 mb-2  opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 ease-in-out backdrop-blur-md w-full z-10">
        <h3 className="text-2xl md:text-3xl px-4 font-semibold">{name}</h3>
        <p className="text-base/6 md:text-lg/7 px-4">{details}</p>
        <Button children={"Message Me"} className="!w-full" />
      </div>
    </div>
  );
};

export default GalleryCard;
