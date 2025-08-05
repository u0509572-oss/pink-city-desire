import { useEffect, useState } from "react";
import { DummyImg1, DummyImg2, DummyImg3 } from "../assets";
import Container from "../components/common/Container";
import Card from "../components/Gallery/Card";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../Firebase";

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
  {
    imgurl: DummyImg1,
    name: "Alisa Chopra",
    details: "Airhostess Jaipur Call Girl – Sophisticated, Stylish, Sensual",
  },
];

const Gallery = () => {
  const [modelsData, setModelsData] = useState(fallbackData);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch girls profiles
        const girlsProfilesRef = collection(db, "girlsProfiles");
        const girlsSnapshot = await getDocs(girlsProfilesRef);

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
    <div className="text-white section-container">
      <Container>
        <div className="flex gap-x-4 gap-y-10 justify-center flex-wrap">
          {loading ? (
            <div className="flex justify-center items-center py-10">
              <p className="text-white text-lg">Loading models...</p>
            </div>
          ) : (
            <div className="flex gap-10 justify-center flex-wrap">
              {modelsData.slice(0, 6).map((card, i) => (
                <Card key={card.id || i} {...card} />
              ))}
            </div>
          )}
        </div>
      </Container>
    </div>
  );
};

export default Gallery;
