import {
  Photo1,
  Photo2,
  Photo3,
  Photo4,
  ProfileAvatar,
  ProfileBanner,
  video1,
  video2,
  video3,
  video4,
} from "../assets";
import Button from "../components/common/Button";
import Container from "../components/common/Container";
import Table from "../components/common/Table";

const dataSource = [
  {
    key: "1",
    package: "Zen Boost",
    duration: "2 Hours",
    price: "3000",
    desc: "Quick escape into calm — full-body relaxation that melts away stress in minutes.",
  },
  {
    key: "2",
    package: "Bliss Recharge",
    duration: "4 Hours",
    price: "6000",
    desc: "Quick escape into calm — full-body relaxation that melts away stress in minutes.",
  },
  {
    key: "3",
    package: "Royal Escape",
    duration: "6 Hours",
    price: "8000",
    desc: "Quick escape into calm — full-body relaxation that melts away stress in minutes.",
  },
  {
    key: "4",
    package: "Hot Stone Nirvana",
    duration: "8 Hours",
    price: "10000",
    desc: "Quick escape into calm — full-body relaxation that melts away stress in minutes.",
  },
  {
    key: "5",
    package: "Midnight Serenity",
    duration: "full night",
    price: "15000",
    desc: "Quick escape into calm — full-body relaxation that melts away stress in minutes.",
  },
];

const columns = [
  {
    title: "Packages",
    dataIndex: "package",
    key: "package",
    width: "20%",
  },
  {
    title: "Duration",
    dataIndex: "duration",
    key: "duration",
    width: "17.5%",
  },
  {
    title: "Price",
    dataIndex: "price",
    key: "price",
    width: "17.5%",
  },
  {
    title: "Description",
    dataIndex: "desc",
    key: "desc",
    width: "45%",
  },
];

const Profile = () => {
  return (
    <Container>
      <div className="mb-15 max-w-xl md:max-w-3xl xl:max-w-5xl mx-auto text-white">
        <img
          src={ProfileBanner}
          className="w-full h-50 md:h-70 object-cover object-center rounded-b-xl"
          alt="Banner image"
        />
        <div className="relative h-16 md:h-18 xl:h-22">
          <div className="absolute max-sm:left-1/2 transform -translate-x-1/2 -top-10 md:-top-15 left-15 md:left-20 xl:left-30 rounded-full p-1.5 bg-black">
            <div
              style={{
                background: "linear-gradient(0deg, #ffffff, #C944D0)",
              }}
              className="rounded-full  p-0.5"
            >
              <img
                src={ProfileAvatar}
                alt="Avatar image"
                className="w-20 md:w-25 xl:w-30 aspect-square object-cover rounded-full"
              />
            </div>
          </div>
        </div>
        <div className="mx-5 md:mx-7.5 xl:mx-15 flex flex-col gap-4">
          <div className="flex gap-2 flex-col sm:flex-row justify-between items-center">
            <div className="flex items-center gap-5">
              <h2 className="responsive-heading font-semibold text-[var(--primary-color)]">
                Alisa Chopra
              </h2>
              <div className="flex items-center gap-1 p-0.5 px-1 border border-[#60D669] rounded-lg text-xs text-[#60D669]">
                <div className="bg-[#CAFFCC59]/35 h-3 w-3 rounded-full flex items-center justify-center">
                  <div className="bg-[#00FF08] h-2 w-2 rounded-full border-2 border-[#ACFFAE]"></div>
                </div>
                <p className="">Available</p>
              </div>
            </div>
            <p>⭐4.8(29)</p>
          </div>
          <div className="w-full flex gap-2 flex-col md:flex-row justify-between items-center">
            <p className="responsive-paragraph">
              Airhostess Jaipur Call Girl – Sophisticated, Stylish, Sensual
            </p>
            <div className="flex flex-col md:flex-row gap-2">
              <Button
                children="Message Me"
                bgColor="bg-[var(--black-color)]"
                className="border"
              />
              <Button children={"Book Now"} />
            </div>
          </div>
          <div className="w-full overflow-x-auto">
            <Table
              className="w-full"
              dataSource={dataSource}
              columns={columns}
              tableClassName="!border-collapse"
              headClassName="font-normal !bg-[var(--white-color)]/10 !text-[var(--primary-color)] !text-xs md:!text-sm lg:!text-base"
              rowClassName="font-normal !whitespace-normal break-words !text-xs md:!text-sm lg:!text-base"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-0.5">
            <div className="">
              <p className="text-center bg-[var(--primary-color)] py-1 rounded-sm md:rounded-r-none">
                Photos
              </p>
              <div className="grid grid-cols-2 gap-3 mt-5 md:mr-1">
                <img
                  src={Photo1}
                  loading="lazy"
                  className="w-full aspect-square object-cover"
                  alt="gallery image"
                />
                <img
                  src={Photo2}
                  loading="lazy"
                  className="w-full aspect-square object-cover"
                  alt="gallery image"
                />
                <img
                  src={Photo3}
                  loading="lazy"
                  className="w-full aspect-square object-cover"
                  alt="gallery image"
                />
                <img
                  src={Photo4}
                  loading="lazy"
                  className="w-full aspect-square object-cover"
                  alt="gallery image"
                />
              </div>
            </div>
            <div className="">
              <p className="text-center bg-[var(--primary-color)] py-1 rounded-sm md:rounded-l-none">
                Videos
              </p>
              <div className="grid grid-cols-2 gap-3 mt-5 md:ml-1">
                <img
                  src={video1}
                  loading="lazy"
                  className="w-full aspect-square object-cover"
                  alt="gallery image"
                />
                <img
                  src={video2}
                  loading="lazy"
                  className="w-full aspect-square object-cover"
                  alt="gallery image"
                />
                <img
                  src={video3}
                  loading="lazy"
                  className="w-full aspect-square object-cover"
                  alt="gallery image"
                />
                <img
                  src={video4}
                  loading="lazy"
                  className="w-full aspect-square object-cover"
                  alt="gallery image"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default Profile;
