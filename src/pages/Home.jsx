import { RiWhatsappFill } from "react-icons/ri";
import {
  DummyImg1,
  DummyImg2,
  DummyImg3,
  HomePage2Img,
  HomePage4Img,
  HomePage5Img,
  HomePage7Img,
  HomePage8Img,
  HomePageImg,
  Section2Img,
  Section7Img,
  Section9Img,
  Whatsapp,
} from "../assets";
import Button from "../components/common/Button";
import Container from "../components/common/Container";
import Table from "../components/common/Table";
import BookingForm from "../components/LandingPage/BookingForm";
import Card from "../components/LandingPage/Card";
import GalleryCard from "../components/LandingPage/GalleyCard";
import Carousel from "../components/LandingPage/Carousel";
import FAQCollapse from "../components/LandingPage/FAQCollapse";
import { useNavigate } from "react-router";
import Footer from "../components/layout/Footer";
import { useState, useEffect } from "react";
import {
  doc,
  getDoc,
  collection,
  getDocs,
  query,
  orderBy,
  limit,
} from "firebase/firestore";
import { db } from "../Firebase";

// Fallback data - will be used if Firebase collection is empty or fails to load
const fallbackData = [
  {
    imgurl: DummyImg1,
    name: "Alisa Chopra",
    details: "Airhostess Jaipur Call Girl – Sophisticated, Stylish, Sensual",
  },
  {
    imgurl: DummyImg2,
    name: "Alisa Chopra",
    details: "Airhostess Jaipur Call Girl – Sophisticated, Stylish, Sensual",
  },
  {
    imgurl: DummyImg3,
    name: "Alisa Chopra",
    details: "Airhostess Jaipur Call Girl – Sophisticated, Stylish, Sensual",
  },
];

const columns = [
  {
    title: "Jaipur Call Girl Near Me",
    dataIndex: "title",
    key: "title",
    width: "26%",
  },
  {
    title: "2 Hours",
    dataIndex: "rate1",
    key: "rate1",
    width: "18%",
  },
  {
    title: "4 Hours",
    dataIndex: "rate2",
    key: "rate2",
    width: "18%",
  },
  {
    title: "Full Night",
    dataIndex: "rate3",
    key: "rate3",
    width: "18%",
  },
  {
    title: "CTA",
    dataIndex: "cta",
    key: "cta",
    width: "20%",
  },
];

const Home = () => {
  const navigate = useNavigate();
  const [contactNumber, setContactNumber] = useState("");
  const [modelsData, setModelsData] = useState(fallbackData);
  const [loading, setLoading] = useState(true);

  const dataSource = [
    {
      key: "1",
      title: "Russian Call Girl Jaipur",
      rate1: "₹ 5000",
      rate2: "₹ 12000",
      rate3: "₹ 25000",
      cta: (
        <Button
          children={"Book Now"}
          onClick={() => {
            navigate("/booking");
          }}
          className="!py-1.5"
        ></Button>
      ),
    },
    {
      key: "2",
      title: "Russian Call Girl Jaipur",
      rate1: "₹ 5000",
      rate2: "₹ 12000",
      rate3: "₹ 25000",
      cta: (
        <Button
          children={"Book Now"}
          onClick={() => {
            navigate("/booking");
          }}
          className="!py-1.5"
        ></Button>
      ),
    },
    {
      key: "3",
      title: "Russian Call Girl Jaipur",
      rate1: "₹ 5000",
      rate2: "₹ 12000",
      rate3: "₹ 25000",
      cta: (
        <Button
          children={"Book Now"}
          onClick={() => {
            navigate("/booking");
          }}
          className="!py-1.5"
        ></Button>
      ),
    },
    {
      key: "4",
      title: "Russian Call Girl Jaipur",
      rate1: "₹ 5000",
      rate2: "₹ 12000",
      rate3: "₹ 25000",
      cta: (
        <Button
          children={"Book Now"}
          onClick={() => {
            navigate("/booking");
          }}
          className="!py-1.5"
        ></Button>
      ),
    },
  ];

  // Fetch contact number and models data from Firestore
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch contact number
        const docRef = doc(db, "websiteInformation", "siteConfig");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setContactNumber(data.contactNumber1);
        } else {
          console.warn("No such document: siteConfig");
        }

        // Fetch girls profiles
        const girlsProfilesRef = collection(db, "girlsProfiles");
        const girlsQuery = query(
          girlsProfilesRef,
          orderBy("createdAt", "desc"),
          limit(3)
        );
        const girlsSnapshot = await getDocs(girlsQuery);

        if (!girlsSnapshot.empty) {
          const girlsData = [];
          girlsSnapshot.forEach((doc) => {
            const data = doc.data();
            girlsData.push({
              id: doc.id,
              imgurl: data.imageUrl || DummyImg1,
              name: data.name || "Unknown",
              details: data.description || "Professional Escort Service",
              // Include additional fields that might be useful
              // age: data.age,
              // location: data.location,
              // services: data.services,
              // rates: data.rates,
              // ...data
            });
          });

          // console.log(`Fetched ${girlsData.length} profiles from Firebase`);
          setModelsData(girlsData);
        } else {
          console.log(
            "No girls profiles found in Firebase, using fallback data"
          );
          // Keep fallback data that was already set in useState
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        // Keep fallback data in case of error
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <section>
      {/* Landing Section */}
      <div className="relative w-full">
        <img
          src={HomePageImg}
          className="w-full min-h-120 object-cover"
          alt="landing image"
        />
        <button
          className="absolute right-5 bottom-5 md:right-10 md:bottom-10 cursor-pointer"
          onClick={() => {
            if (contactNumber) {
              const formattedNumber = contactNumber.replace(/\D/g, ""); // Remove non-digit characters
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

      {/* Section 2 */}
      <div
        className="relative w-full bg-cover bg-center"
        style={{ backgroundImage: `url(${HomePage2Img})` }}
      >
        <div className="absolute inset-0 bg-black/75"></div>
        <div className="relative section-container">
          <Container>
            <div className="flex justify-between items-center lg:flex-row flex-col gap-10 md:gap-20">
              <div className="flex justify-center items-center flex-1/2">
                <div className="absolute w-48 sm:w-60 md:w-96 mr-5 aspect-[3/4] rounded-xl border-[var(--primary-color)] border-2 -rotate-15"></div>
                <img
                  src={Section2Img}
                  className="z-10 w-48 sm:w-60 md:w-96 aspect-[3/4] object-cover rounded-xl"
                  alt="landing image"
                />
              </div>
              <div className="flex flex-col justify-center flex-1/2 gap-6 md:gap-8 text-white">
                <h2 className="responsive-heading font-semibold">
                  Discreet Escort Services in Jaipur – From ₹2,999 | Cash on
                  Arrival | Open 24x7
                </h2>
                <p className="responsive-paragraph">
                  Discover Jaipur's most exclusive and discreet companion
                  booking service. PinkCityDesires offers elite, elegant escorts
                  for upscale social, travel, and private engagements. Privacy
                  guaranteed.
                </p>
                <div className="flex gap-4">
                  <Button
                    children="View girl's Gallery"
                    bgColor="bg-[var(--black-color)]"
                    className="border"
                    onClick={() => {
                      navigate("/gallery");
                    }}
                  />
                  <Button
                    children={"Book Now"}
                    onClick={() => {
                      navigate("/booking");
                    }}
                  />
                </div>
              </div>
            </div>
          </Container>
        </div>
      </div>

      {/* Section 3 - Model list */}
      <div className="text-white section-container">
        <Container>
          <div className="flex justify-center">
            <h2 className="text-center max-w-5xl mb-8 md:mb-16 responsive-heading font-semibold">
              Unforgettable One-Night Experience with Jaipur's Finest Escorts –
              Book Now
            </h2>
          </div>
          {loading ? (
            <div className="flex justify-center items-center py-10">
              <p className="text-white text-lg">Loading models...</p>
            </div>
          ) : (
            <div className="flex gap-10 justify-center flex-wrap">
              {modelsData.slice(0, 6).map((card, i) => (
                <Card key={card.id || i} {...card} number={contactNumber} />
              ))}
            </div>
          )}
        </Container>
      </div>

      {/* Section 4 */}
      <div
        className="relative w-full bg-cover bg-center"
        style={{ backgroundImage: `url(${HomePage4Img})` }}
      >
        <div className="absolute inset-0 bg-[linear-gradient(185.26deg,var(--black-color)_23.34%,var(--primary-color)_123.16%)] opacity-90"></div>
        <div className="relative text-white section-container">
          <Container>
            <div className="flex flex-col gap-8 md:gap-14 items-center">
              <h2 className="text-center max-w-5xl responsive-heading font-semibold">
                Welcome to PinkCityDesires – Jaipur's Most Trusted Elite
                Companion Service
              </h2>
              <div>
                <p className="responsive-paragraph text-center mb-4">
                  Hello, sweetheart — welcome to Jaipur, the beautiful capital
                  of Rajasthan and a city known not just for its rich heritage,
                  but also for being one of the most exciting destinations for
                  luxurious adult companionship. If you're looking to explore
                  Jaipur in the company of a stunning, elegant, and engaging
                  companion, you're in the right place. At PinkCityDesires, we
                  offer a curated selection of high-class, well-mannered, and
                  discreet call girls who are here to fulfill your deepest
                  desires and provide an unforgettable experience.
                </p>
                <p className="responsive-paragraph text-center mb-4">
                  We understand that every gentleman has unique preferences and
                  fantasies. That's why our companions are selected for their
                  beauty, charm, intelligence, and ability to adapt to your
                  individual needs — whether it's a romantic dinner date, a
                  private evening, or a weekend escape.
                </p>
                <p className="responsive-paragraph text-center">
                  Our goal is to deliver 100% satisfaction in a safe,
                  respectful, and confidential environment. With us, you're not
                  just booking a service — you're creating a memory.
                </p>
              </div>
              <div className="flex gap-4 justify-center max-sm:flex-col-reverse">
                <Button
                  children={
                    <div className="flex gap-3 justify-center items-center">
                      <RiWhatsappFill size={22} />
                      <p>WhatsApp Now</p>
                    </div>
                  }
                  bgColor="bg-[var(--black-color)]"
                  className="border !md:text-xl"
                  onClick={() => {
                    if (contactNumber) {
                      const formattedNumber = contactNumber.replace(/\D/g, ""); // Remove non-digit characters
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
                />
                <Button
                  children={"Book Safely"}
                  className=" !md:text-xl !md:px-10"
                  onClick={() => {
                    navigate("/booking");
                  }}
                />
              </div>
            </div>
          </Container>
        </div>
      </div>

      {/* Section 5 */}
      <div
        className="relative w-full bg-cover bg-center"
        style={{ backgroundImage: `url(${HomePage5Img})` }}
      >
        <div className="absolute inset-0 bg-black/85"></div>
        <div className="relative text-white section-container">
          <Container>
            <div className="flex flex-col gap-8 md:gap-14 items-center">
              <div className="max-w-4xl flex flex-col items-center  gap-8 md:gap-14">
                <h2 className="text-center responsive-heading font-medium">
                  Discover the Hottest Female Escorts in Jaipur – 100% Real
                  Images & Fresh New Profiles
                </h2>
                <p className="responsive-paragraph text-center">
                  At Jaipur Escorts, we offer 100% real and verified photos of
                  our stunning, newly joined companions. Unlike others, we never
                  use fake images. Choose from our gorgeous selection and enjoy
                  an unforgettable, pleasure-filled experience with a truly
                  authentic escort. Your satisfaction and privacy are our top
                  priority.
                </p>
              </div>
              <Table
                className="w-full"
                dataSource={dataSource}
                columns={columns}
              />
            </div>
          </Container>
        </div>
      </div>

      {/* Section 6 - Model Gallery */}
      <div className="relative w-full">
        <div className="relative text-white section-container">
          <Container>
            <div className="flex flex-col gap-8 md:gap-14 items-center mb-10 md:mb-20">
              <div className="max-w-5xl flex flex-col items-center gap-6 md:gap-10 p-5 md:px-15 md:py-10 border-2 border-white">
                <h2 className="text-center responsive-heading font-medium">
                  Top One-Night Escort Service in Jaipur – Discreet, Delightful,
                  and Just a Call Away
                </h2>
                <Button
                  children={"View All Gallery"}
                  className=" !md:text-xl !md:px-10"
                  onClick={() => {
                    navigate("/gallery");
                  }}
                />
              </div>
            </div>
            {loading ? (
              <div className="flex justify-center items-center py-10">
                <p className="text-white text-lg">Loading gallery...</p>
              </div>
            ) : (
              <div className="flex gap-10 justify-center flex-wrap">
                {modelsData.slice(0, 6).map((card, i) => (
                  <GalleryCard key={card.id || i} {...card} />
                ))}
              </div>
            )}
          </Container>
        </div>
      </div>

      {/* Section 7 - Booking Form */}
      <div
        className="relative w-full bg-cover bg-center"
        style={{ backgroundImage: `url(${HomePage7Img})` }}
      >
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.64)_0%,rgba(201,68,208,0.8)_100%)] opacity-90"></div>

        <div className="relative section-container overflow-hidden">
          <Container>
            <div className="relative flex justify-between items-center lg:flex-row flex-col gap-10 md:gap-20">
              <div className="flex flex-col w-full">
                <div className="flex flex-col justify-center gap-2 md:gap-4 text-white">
                  <p className="responsive-paragraph font-semibold">
                    Advance Booking
                  </p>
                  <h2 className="responsive-heading font-semibold">
                    VIP CALL GIRLS SERVICE NEAR YOU
                  </h2>
                </div>
                <div className="flex flex-wrap w-full sm:w-[60%] mt-10 gap-10">
                  <BookingForm />
                </div>
              </div>
              <div className="sm:absolute max-sm:flex sm:-right-30 sm:-bottom-30 lg:-bottom-40 flex justify-center items-center">
                <div className="absolute w-60 sm:w-60 md:w-80 lg:w-96 mr-5 aspect-[3/4] rounded-xl border-[var(--primary-color)] border-2 -rotate-15"></div>
                <img
                  src={Section7Img}
                  className="z-10 w-60 sm:w-60 md:w-80 lg:w-96 aspect-[3/4] object-cover rounded-xl"
                  alt="landing image"
                />
              </div>
            </div>
          </Container>
        </div>
      </div>

      {/* Section 8 - Testimonials */}
      <div className="relative section-container max-md:my-10">
        <Container>
          <div className="flex justify-between items-center lg:flex-row flex-col gap-10 md:gap-20">
            <div className="flex justify-center items-center w-full lg:w-1/2">
              <div className="relative w-full max-w-[20rem] lg:max-w-[30rem] aspect-square">
                {/* <div className="flex justify-center w-1/2 items-center relative"> */}
                <div
                  className="absolute inset-0 opacity-20 rounded-3xl -rotate-10 -left-4"
                  style={{ backgroundImage: `url(${HomePage8Img})` }}
                ></div>
                <img
                  src={HomePage8Img}
                  className="absolute inset-0 w-full h-full object-cover rounded-3xl z-10"
                  alt="landing image"
                />
                {/* </div> */}
              </div>
            </div>
            <div className="flex flex-col justify-center items-center w-full lg:w-1/2 gap-6 md:gap-8 text-white">
              <h2 className="responsive-heading font-medium">
                What Our{" "}
                <span className="text-[var(--primary-color)]">Customers</span>{" "}
                Say
              </h2>
              <Carousel />
            </div>
          </div>
        </Container>
      </div>

      {/* Section 9 - FAQ */}
      <div
        className="relative w-full bg-cover bg-center"
        style={{ backgroundImage: `url(${Section9Img})` }}
      >
        <div className="absolute inset-0 bg-[linear-gradient(180deg,var(--primary-color)_0%,var(--black-color)_100%)] opacity-90"></div>
        <div className="relative text-white section-container">
          <Container>
            <div className="flex flex-col gap-8 md:gap-14 items-center">
              <h2 className="text-center max-w-5xl responsive-heading font-semibold">
                Frequently Asked Questions
              </h2>
              <div className="w-full">
                <FAQCollapse />
              </div>
            </div>
          </Container>
        </div>
      </div>

      <Footer />
    </section>
  );
};

export default Home;
