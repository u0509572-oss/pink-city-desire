import { Collapse } from "antd";
import { FaMinus, FaPlus } from "react-icons/fa";
const faqData = [
  {
    question:
      "What kind of massage and wellness services do you offer to clients?",
    answer:
      "We provide a range of relaxing massage therapies, wellness sessions, and personal companionship experiences designed to help you unwind and rejuvenate both physically and emotionally. Each service is tailored to your specific needs for maximum comfort.",
  },
  {
    question:
      "How do you ensure that my identity and personal information remain private?",
    answer:
      "Your privacy is of utmost importance to us. We follow strict confidentiality protocols and never share your personal details with any third party. Our systems are secured, and every booking is handled discreetly and respectfully.",
  },
  {
    question:
      "What are the steps to book an appointment through your platform?",
    answer:
      "Booking is simple and convenient. You can schedule a session via our website using the booking form, or directly contact us through our WhatsApp number. Once your preferred time and service are confirmed, we’ll send you all the details for your appointment.",
  },
  {
    question:
      "What kind of massage and wellness services do you offer to clients?",
    answer:
      "We provide a range of relaxing massage therapies, wellness sessions, and personal companionship experiences designed to help you unwind and rejuvenate both physically and emotionally. Each service is tailored to your specific needs for maximum comfort.",
  },
  {
    question:
      "How do you ensure that my identity and personal information remain private?",
    answer:
      "Your privacy is of utmost importance to us. We follow strict confidentiality protocols and never share your personal details with any third party. Our systems are secured, and every booking is handled discreetly and respectfully.",
  },
];

const getItems = () =>
  faqData.map(({ question, answer }, index) => ({
    key: `${index + 1}`,
    label: (
      <span className="text-white font-medium">
        {index + 1}. {question}
      </span>
    ),
    children: <p className="text-white pl-5 pt-2">{answer}</p>,
    className:
      "mb-4 !rounded-lg !border-none bg-[var(--black-color)]/30 px-4 py-2",
  }));

const FAQCollapse = () => {
  return (
    <Collapse
      bordered={false}
      defaultActiveKey={["1"]}
      expandIconPosition="end"
      expandIcon={({ isActive }) =>
        isActive ? (
          <FaMinus style={{ color: "white" }} />
        ) : (
          <FaPlus style={{ color: "white" }} />
        )
      }
      items={getItems()}
    />
  );
};

export default FAQCollapse;
