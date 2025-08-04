import { Col, DatePicker, Form, Input, Row, Select } from "antd";
import dayjs from "dayjs"; // Use dayjs instead of moment
import Button from "../common/Button";
import { addDoc, collection } from "firebase/firestore";

import toast from "react-hot-toast";
import { useState, useCallback } from "react";
import { FaSpinner } from "react-icons/fa";
import { db } from "../../Firebase";

const { Option } = Select;

const BookingForm = ({
  inputStyle = "!bg-white/15 !text-white",
  labelStyle = {},
}) => {
  const [form] = Form.useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedDateTime, setSelectedDateTime] = useState(null);

  const onFinish = async (values) => {
    setIsSubmitting(true);

    try {
      const bookingData = {
        ...values,
        dateTime: values.dateTime?.format("YYYY-MM-DD HH:mm"),
        createdAt: new Date().toISOString(),
        status: "pending" 
      };

      // Add document to Firestore
      await addDoc(collection(db, "bookings"), bookingData);

      toast.success("Booking submitted successfully!");
      form.resetFields();
      setSelectedDateTime(null); // Reset local state
    } catch (error) {
      console.error("Error submitting booking:", error);
      toast.error("Failed to submit booking. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Memoized date change handler to prevent re-renders
  const handleDateTimeChange = useCallback((date) => {
    setSelectedDateTime(date);
    // Don't call form.setFieldsValue here to avoid conflicts
  }, []);

  // Function to disable past dates
  const disabledDate = useCallback((current) => {
    return current && current < dayjs().startOf('day');
  }, []);

  return (
    <div>
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{
          location: "Delhi",
          companion: "Alone",
          // No initial dateTime value
        }}
        preserve={false} // Don't preserve field values on unmount
      >
        <Row gutter={24}>
          <Col xs={24} md={12}>
            <Form.Item
              label={
                <span style={{ color: "white", ...labelStyle }}>Full Name</span>
              }
              name="fullName"
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
                showTime={{
                  format: 'HH:mm',
                  use12Hours: false,
                  hideDisabledOptions: true,
                }}
                style={{ 
                  width: "100%",
                }}
                // Remove custom className that might conflict
                 className={inputStyle}
                format="YYYY-MM-DD HH:mm"
                placeholder="Select date and time"
                disabledDate={disabledDate}
                onChange={handleDateTimeChange}
                value={selectedDateTime}              
                allowClear
                autoFocus={false}
                open={undefined} // Let DatePicker manage its own open state
              />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item>
          <Button 
            children={
              isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <FaSpinner className="animate-spin" />
                  Processing...
                </span>
              ) : (
                "Book Now"
              )
            } 
            type="submit" 
            className="w-full mt-5"
            disabled={isSubmitting}
          />
        </Form.Item>
      </Form>

      {/* Add this CSS to override any conflicting styles */}

    </div>
  );
};

export default BookingForm;