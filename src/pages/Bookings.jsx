import { BookingsBg } from "../assets";
import BookingForm from "../components/Booking Form/BookingForm";
import Container from "../components/common/Container";

const Bookings = () => {
  return (
    <div
      className="relative w-full bg-cover bg-center"
      style={{ backgroundImage: `url(${BookingsBg})` }}
    >
      <div className="absolute inset-0 bg-[linear-gradient(285.91deg,rgba(201,68,208,0.8)_-57.37%,rgba(0,0,0,0.8)_91.52%)]"></div>
      <div className="relative text-white section-container">
        <Container>
          <div className="flex flex-col gap-8 md:gap-14">
            <div>
              <h2 className="responsive-heading font-semibold">
                Book your call girl
              </h2>
              <p className="font-light">
                Safe, Private, and 100% Satisfaction Guaranteed.
              </p>
            </div>
            <div className="">
              <BookingForm />
            </div>
          </div>
        </Container>
      </div>
    </div>
  );
};

export default Bookings;
