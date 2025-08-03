import React from "react";
import Slider from "react-slick";
import {
  FaLongArrowAltLeft,
  FaLongArrowAltRight,
  FaQuoteRight,
} from "react-icons/fa";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const reviews = [
  {
    title: "Great Service",
    desc: "From the moment I booked the escort, I felt pampered. Great massage and the girl was so friendly. Fungirl.in is my new go-to destination for relaxation!",
    name: "Priya Sharma",
  },
  {
    title: "Incredible Experience",
    desc: "She was polite, professional, and made me feel completely at ease. The entire experience felt classy and discreet. Will definitely return!",
    name: "Rahul Mehta",
  },
  {
    title: "Top-notch Professionalism",
    desc: "Very responsive team and the escort was punctual and respectful. Everything was well arranged — nothing felt shady or rushed.",
    name: "Anjali Verma",
  },
  {
    title: "Exactly What I Needed",
    desc: "After a stressful week, this was the perfect way to unwind. She had a warm smile and calming presence. Thank you for making it hassle-free.",
    name: "Nikhil Roy",
  },
  {
    title: "Classy & Elegant",
    desc: "The escort carried herself with such grace. Our dinner conversation was delightful, and she was equally charming in private.",
    name: "Sameer Kapoor",
  },
  {
    title: "Confidential & Comfortable",
    desc: "I was nervous initially, but their discreet process and kind attitude made all the difference. Totally exceeded expectations.",
    name: "Sneha R.",
  },
  {
    title: "Felt Truly Special",
    desc: "The attention to detail, the way she spoke, her attire — everything felt tailored to make me feel important. 10/10 service.",
    name: "Amit Joshi",
  },
];

// Custom Arrows using Tailwind
const CustomArrows = ({ currentSlide, slideCount, onPrev, onNext }) => {
  return (
    <div className="absolute -bottom-11 right-0 z-10 flex gap-3">
      <button
        onClick={onPrev}
        disabled={currentSlide === 0}
        className={`w-8 h-8 flex cursor-pointer items-center justify-center rounded-full bg-[var(--primary-color)] text-white transition-opacity ${
          currentSlide === 0
            ? "opacity-50 cursor-not-allowed"
            : "hover:bg-[var(--primary-color)]"
        }`}
      >
        <FaLongArrowAltLeft />
      </button>
      <button
        onClick={onNext}
        disabled={currentSlide === slideCount - 1}
        className={`w-8 h-8 flex cursor-pointer items-center justify-center rounded-full bg-[var(--primary-color)] text-white transition-opacity ${
          currentSlide === slideCount - 1
            ? "opacity-50 cursor-not-allowed"
            : "hover:bg-[var(--primary-color)]"
        }`}
      >
        <FaLongArrowAltRight />
      </button>
    </div>
  );
};

const Carousel = () => {
  const sliderRef = React.useRef();
  const [currentSlide, setCurrentSlide] = React.useState(0);

  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    beforeChange: (oldIndex, newIndex) => setCurrentSlide(newIndex),
  };

  return (
    <div className="relative w-[100%] max-w-xl">
      <Slider ref={sliderRef} {...settings}>
        {reviews.map((item,index) => (
          <div key={index}>
            <div className="text-white relative mt-5 bg-white/16 px-4 py-2 rounded-lg flex flex-col gap-3">
              <div className="px-3 pt-3 flex gap-3 flex-col">
                <div className="absolute right-3 -top-5">
                  <FaQuoteRight className="text-5xl text-[var(--primary-color)]" />
                </div>
                <h3 className="md:text-lg text-base font-semibold">
                  {item.title}
                </h3>
                <p className="md:text-lg text-base">{item.desc}</p>
              </div>
              <p className="md:text-lg text-base text-right">– {item.name}</p>
            </div>
          </div>
        ))}
      </Slider>

      <CustomArrows
        currentSlide={currentSlide}
        slideCount={reviews.length}
        onPrev={() => sliderRef.current.slickPrev()}
        onNext={() => sliderRef.current.slickNext()}
      />
    </div>
  );
};

export default Carousel;
