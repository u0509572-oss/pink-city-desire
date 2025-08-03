const Card = ({ imgurl, name, details }) => {
  return (
    <div className="flex flex-col min-w-40 max-w-56 gap-2 text-white">
      <img
        src={imgurl}
        loading="lazy"
        className="w-full aspect-square object-cover mb-1"
        alt="gallery image"
      />
      <h3 className="text-lg md:text-xl font-semibold text-[var(--primary-color)]">
        {name}
      </h3>
      <p className="text-xs/4 md:text-sm/5">{details}</p>
    </div>
  );
};

export default Card;
