import { Checkbox, Col, DatePicker, Form, Input, Row, Select } from "antd";
import moment from "moment";
import Button from "../common/Button";

const { Option } = Select;

const locations = ["Delhi", "Mumbai", "Bangalore", "Chennai"];
const hourOptions = ["1hr", "2hrs", "full-night"];
const companions = ["Alone", "Friend", "Family", "Partner"];

const BookingForm = ({
  inputStyle = "!bg-black/5 !border-white/50 !text-white",
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
        <Row gutter={24} className="gap-y-2">
          <Col xs={24} md={12} lg={8}>
            <Form.Item
              label={
                <span style={{ color: "white", ...labelStyle }}>Name</span>
              }
              name="fullname"
              rules={[{ required: true, message: "Please enter your name" }]}
            >
              <Input className={inputStyle} />
            </Form.Item>
          </Col>

          <Col xs={24} md={12} lg={8}>
            <Form.Item
              label={
                <span style={{ color: "white", ...labelStyle }}>
                  Select Location
                </span>
              }
              name="location"
              rules={[{ required: true, message: "Please select a location" }]}
            >
              <Select
                placeholder="Select location"
                className={`custom-select-bf ${inputStyle}`}
              >
                {locations.map((loc) => (
                  <Option key={loc} value={loc}>
                    {loc}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          <Col xs={24} md={12} lg={8}>
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

          <Col xs={24} md={12} lg={8}>
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

          <Col xs={24} md={12} lg={8}>
            <Form.Item
              label={
                <span style={{ color: "white", ...labelStyle }}>Call No.</span>
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

          <Col xs={24} md={12} lg={8}>
            <Form.Item
              label={
                <span style={{ color: "white", ...labelStyle }}>
                  Whatsapp number
                </span>
              }
              name="wno"
              rules={[
                {
                  required: true,
                  message: "Please enter your whatsapp number",
                },
                {
                  pattern: /^[0-9]{10}$/,
                  message: "Enter a valid 10-digit whatsapp number",
                },
              ]}
            >
              <Input className={inputStyle} />
            </Form.Item>
          </Col>

          <Col xs={24} md={12} lg={8}>
            <Form.Item
              label={
                <span style={{ color: "white", ...labelStyle }}>
                  Select hours
                </span>
              }
              name="hours"
              rules={[{ required: true, message: "Please select hours" }]}
            >
              <Select
                placeholder="Select hours"
                className={`custom-select-bf ${inputStyle}`}
              >
                {hourOptions.map((hour) => (
                  <Option key={hour} value={hour}>
                    {hour}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          <Col xs={24} md={12} lg={8}>
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
                className={`custom-select-bf ${inputStyle}`}
              >
                {companions.map((loc) => (
                  <Option key={loc} value={loc}>
                    {loc}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          <Col xs={24} md={12} lg={8}>
            <Form.Item className="!m-0" shouldUpdate>
              {() => (
                <Form.Item
                  label={
                    <span style={{ color: "white", ...labelStyle }}>
                      Would you like to receive a photo on WhatsApp?
                    </span>
                  }
                  name="wrecieve"
                  rules={[
                    { required: true, message: "Please select an option" },
                  ]}
                >
                  <div className="flex gap-4">
                    {["yes", "no"].map((option) => (
                      <button
                        key={option}
                        type="button"
                        onClick={() =>
                          form.setFieldsValue({ wrecieve: option })
                        }
                        className={`px-6 py-1 rounded-md text-white cursor-pointer border border-white/50 ${
                          form.getFieldValue("wrecieve") === option
                            ? "bg-[var(--primary-color)]"
                            : "bg-black/50"
                        }`}
                      >
                        {option === "yes" ? "Yes" : "No"}
                      </button>
                    ))}
                  </div>
                </Form.Item>
              )}
            </Form.Item>
          </Col>

          <Col xs={24} md={12} lg={8}>
            <Form.Item className="!m-0" shouldUpdate>
              {() => (
                <Form.Item
                  label={
                    <span style={{ color: "white", ...labelStyle }}>
                      Hotel preference
                    </span>
                  }
                  name="hotel"
                  rules={[
                    { required: true, message: "Please select an option" },
                  ]}
                >
                  <div className="flex gap-4">
                    {["yes", "no"].map((option) => (
                      <button
                        key={option}
                        type="button"
                        onClick={() => form.setFieldsValue({ hotel: option })}
                        className={`px-6 py-1 rounded-md text-white cursor-pointer border border-white/50 ${
                          form.getFieldValue("hotel") === option
                            ? "bg-[var(--primary-color)]"
                            : "bg-black/50"
                        }`}
                      >
                        {option === "yes" ? "Yes" : "No"}
                      </button>
                    ))}
                  </div>
                </Form.Item>
              )}
            </Form.Item>
          </Col>

          <Col xs={24} md={12} lg={8}>
            <Form.Item className="!m-0" shouldUpdate>
              {() => (
                <Form.Item
                  label={
                    <span style={{ color: "white", ...labelStyle }}>
                      Cab preference
                    </span>
                  }
                  name="cab"
                  rules={[
                    { required: true, message: "Please select an option" },
                  ]}
                >
                  <div className="flex gap-4">
                    {["yes", "no"].map((option) => (
                      <button
                        key={option}
                        type="button"
                        onClick={() => form.setFieldsValue({ cab: option })}
                        className={`px-6 py-1 rounded-md text-white cursor-pointer border border-white/50 ${
                          form.getFieldValue("cab") === option
                            ? "bg-[var(--primary-color)]"
                            : "bg-black/50"
                        }`}
                      >
                        {option === "yes" ? "Yes" : "No"}
                      </button>
                    ))}
                  </div>
                </Form.Item>
              )}
            </Form.Item>
          </Col>

          <Col xs={24} md={12} lg={8}>
            <Form.Item
              label={
                <span style={{ color: "white", ...labelStyle }}>
                  Pickup Addresses
                </span>
              }
              name="pickup"
              rules={[
                { required: true, message: "Please enter pickup address" },
              ]}
            >
              <Input className={inputStyle} />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              name="agreement"
              valuePropName="checked"
              rules={[
                {
                  validator: (_, value) =>
                    value
                      ? Promise.resolve()
                      : Promise.reject("Please confirm this"),
                },
              ]}
            >
              <label className="flex items-center gap-2 text-white cursor-pointer">
                <input
                  type="checkbox"
                  className="w-5 h-5 accent-[var(--primary-color)] cursor-pointer"
                />
                I confirm that I am above 18 years of age.
              </label>
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item>
              <div className="w-full flex justify-end">
                <Button
                  children={"Book Now"}
                  type="submit"
                  bgColor="bg-[#4BFFFF]"
                  textColor="text-[var(--black-color)]"
                  className="!px-30"
                />
              </div>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default BookingForm;
