import { Col, DatePicker, Form, Input, Row, Select } from "antd";
import moment from "moment";
import Button from "../common/Button";

const { Option } = Select;

const BookingForm = ({
  inputStyle = "!bg-white/15 !text-white",
  labelStyle = {},
}) => {
  const [form] = Form.useForm();

  const onFinish = (values) => {
    console.log("Form Submitted:", {
      ...values,
      dateTime: values.dateTime?.format("YYYY-MM-DD HH:mm"),
    });
  };

  return (
    <div>
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{
          location: "Delhi",
          companion: "Alone",
          dateTime: moment(),
        }}
      >
        <Row gutter={24}>
          <Col xs={24} md={12}>
            <Form.Item
              label={
                <span style={{ color: "white", ...labelStyle }}>Full Name</span>
              }
              name="fullname"
              rules={[
                { required: true, message: "Please enter your full name" },
              ]}
            >
              <Input className={inputStyle} />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              label={
                <span style={{ color: "white", ...labelStyle }}>Location</span>
              }
              name="location"
              rules={[{ required: true, message: "Please select a location" }]}
            >
              <Select
                placeholder="Select location"
                className={`custom-select ${inputStyle}`}
              >
                <Option value="Delhi">Delhi</Option>
                <Option value="Mumbai">Mumbai</Option>
                <Option value="Bangalore">Bangalore</Option>
                <Option value="Chennai">Chennai</Option>
              </Select>
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              label={
                <span style={{ color: "white", ...labelStyle }}>Email</span>
              }
              name="email"
              rules={[
                { required: true, message: "Please enter your email" },
                { type: "email", message: "Invalid email address" },
              ]}
            >
              <Input className={inputStyle} />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              label={
                <span style={{ color: "white", ...labelStyle }}>
                  Select Companion
                </span>
              }
              name="companion"
              rules={[
                { required: true, message: "Please select a companion option" },
              ]}
            >
              <Select
                placeholder="Choose an option"
                className={`custom-select ${inputStyle}`}
              >
                <Option value="Alone">Alone</Option>
                <Option value="Friend">Friend</Option>
                <Option value="Family">Family</Option>
                <Option value="Partner">Partner</Option>
              </Select>
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              label={
                <span style={{ color: "white", ...labelStyle }}>
                  Phone Number
                </span>
              }
              name="phone"
              rules={[
                { required: true, message: "Please enter your phone number" },
                {
                  pattern: /^[0-9]{10}$/,
                  message: "Enter a valid 10-digit phone number",
                },
              ]}
            >
              <Input className={inputStyle} />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              label={
                <span style={{ color: "white", ...labelStyle }}>
                  Select Date & Time
                </span>
              }
              name="dateTime"
              rules={[
                { required: true, message: "Please choose date and time" },
              ]}
            >
              <DatePicker
                showTime
                style={{ width: "100%" }}
                className={inputStyle}
                format="YYYY-MM-DD HH:mm"
              />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item>
          <Button children={"Book Now"} type="submit" className="w-full mt-5" />
        </Form.Item>
      </Form>
    </div>
  );
};

export default BookingForm;
