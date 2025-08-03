import { DummyImg1, DummyImg2, DummyImg3 } from "../assets";
import Container from "../components/common/Container";
import Card from "../components/Gallery/Card";

const data = [
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
  return (
    <div className="text-white section-container">
      <Container>
        <div className="flex gap-x-4 gap-y-10 justify-center flex-wrap">
          {data.map((card, i) => (
            <Card key={i} {...card} />
          ))}
        </div>
      </Container>
    </div>
  );
};

export default Gallery;
