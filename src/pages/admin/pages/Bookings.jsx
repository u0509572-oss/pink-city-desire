import { useState, useEffect } from "react";
import { FiPlus, FiEye, FiTrash2 } from "react-icons/fi";
import toast from "react-hot-toast";
import Table from "../components/Table";
import Modal from "../components/Modal";
import SearchBar from "../components/SearchBar";
import Pagination from "../components/Pagination";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../../../Firebase";

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [errors, setErrors] = useState({});
  const [minDateTime, setMinDateTime] = useState("");
  const [loading, setLoading] = useState(true);
  const [newBooking, setNewBooking] = useState({
    fullName: "",
    location: "",
    email: "",
    phone: "",
    dateTime: "",
    whatsapp: "",
    hoursBooked: "",
    companion: false,
    cabRequired: false,
    hotelRequired: false,
    pickupAddress: "",
    ageConfirmation: false,
    status: "pending",
  });

  useEffect(() => {
    // Set minimum datetime to current time
    const now = new Date();
    now.setHours(now.getHours() + 1);
    setMinDateTime(now.toISOString().slice(0, 16));

    // Set up real-time listener for bookings
    const unsubscribe = onSnapshot(
      collection(db, "bookings"),
      (snapshot) => {
        const bookingsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setBookings(bookingsData);
        setFilteredBookings(bookingsData);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching profiles:", error);
        toast.error("Failed to fetch profiles");
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // Validation functions
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone) => {
    const phoneRegex = /^\+?[1-9]\d{9,14}$/;
    const cleanPhone = phone.replace(/\s+/g, "").replace(/[()-]/g, "");
    return phoneRegex.test(cleanPhone) && cleanPhone.length >= 10;
  };

  const validateForm = (booking) => {
    const newErrors = {};

    if (!booking.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!booking.email.trim()) newErrors.email = "Email is required";
    else if (!validateEmail(booking.email))
      newErrors.email = "Please enter a valid email address";
    if (!booking.phone.trim()) newErrors.phone = "Phone number is required";
    else if (!validatePhone(booking.phone))
      newErrors.phone = "Please enter a valid 10+ digit phone number";
    if (!booking.whatsapp.trim())
      newErrors.whatsapp = "WhatsApp number is required";
    else if (!validatePhone(booking.whatsapp))
      newErrors.whatsapp = "Please enter a valid 10+ digit WhatsApp number";
    if (!booking.location.trim()) newErrors.location = "Location is required";
    if (!booking.dateTime) newErrors.dateTime = "Date and time is required";
    else if (new Date(booking.dateTime) < new Date(minDateTime))
      newErrors.dateTime = "Date and time must be in the future";
    if (!booking.hoursBooked || booking.hoursBooked < 1)
      newErrors.hoursBooked = "Hours booked must be at least 1";
    if (!booking.pickupAddress.trim())
      newErrors.pickupAddress = "Pickup address is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSearch = (query) => {
    const filtered = bookings.filter(
      (booking) =>
        booking.fullName.toLowerCase().includes(query.toLowerCase()) ||
        booking.email.toLowerCase().includes(query.toLowerCase()) ||
        booking.phone.includes(query)
    );
    setFilteredBookings(filtered);
    setCurrentPage(1);
  };

  const handleViewDetails = (booking) => {
    setSelectedBooking(booking);
    setShowModal(true);
  };

  const handleMarkCompleted = async (bookingId) => {
    try {
      const bookingRef = doc(db, "bookings", bookingId);
      await updateDoc(bookingRef, { status: "completed" });
      toast.success("Booking marked as completed");
      setShowModal(false);
    } catch (error) {
      console.error("Error marking booking as completed:", error);
      toast.error("Failed to mark booking as completed");
    }
  };

  const handleDeleteBooking = async (bookingId) => {
    try {
      await deleteDoc(doc(db, "bookings", bookingId));
      toast.success("Booking deleted successfully");
      setShowModal(false);
    } catch (error) {
      console.error("Error deleting booking:", error);
      toast.error("Failed to delete booking");
    }
  };

  const handleCreateBooking = async (e) => {
    e.preventDefault();

    if (!validateForm(newBooking)) {
      return;
    }

    try {
      const booking = {
        ...newBooking,
        hoursBooked: Number.parseInt(newBooking.hoursBooked),
        createdAt: new Date().toISOString(),
      };

      await addDoc(collection(db, "bookings"), booking);
      setNewBooking({
        fullName: "",
        location: "",
        email: "",
        phone: "",
        dateTime: "",
        whatsapp: "",
        hoursBooked: "",
        companion: false,
        cabRequired: false,
        hotelRequired: false,
        pickupAddress: "",
        ageConfirmation: false,
        status: "pending",
      });
      setShowCreateModal(false);
      toast.success("Booking created successfully");
    } catch (error) {
      console.error("Error creating booking:", error);
      toast.error("Failed to create booking");
    }
  };

  const columns = [
    { key: "fullName", label: "Full Name" },
    { key: "location", label: "Location" },
    { key: "email", label: "Email" },
    { key: "phone", label: "Phone" },
    { key: "dateTime", label: "Date & Time" },
    {
      key: "status",
      label: "Status",
      render: (row) => (
        <span
          className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
            row.status === "completed"
              ? "bg-green-100 text-green-700"
              : "bg-yellow-100 text-yellow-700"
          }`}
        >
          {row.status.charAt(0).toUpperCase() + row.status.slice(1)}
        </span>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      render: (booking) => (
        <div className="flex space-x-2">
          <button
            onClick={() => handleViewDetails(booking)}
            className="flex items-center space-x-1 px-3 py-1 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors duration-200"
          >
            <FiEye size={14} />
            <span>View</span>
          </button>
          <button
            onClick={() => handleDeleteBooking(booking.id)}
            className="flex items-center space-x-1 px-3 py-1 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors duration-200"
          >
            <FiTrash2 size={14} />
            <span>Delete</span>
          </button>
        </div>
      ),
    },
  ];
 const handleFieldChange = (field, value) => {
  const updatedBooking = { ...newBooking, [field]: value };
  setNewBooking(updatedBooking);
  validateForm(updatedBooking);
};


  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredBookings.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);

  const formatDateTime = (dateTimeString) => {
    if (!dateTimeString) return "";
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateTimeString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Bookings</h1>
          <p className="text-gray-600">Manage all booking requests</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors duration-200"
        >
          <FiPlus size={20} />
          <span>Create Booking</span>
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <SearchBar
            onSearch={handleSearch}
            placeholder="Search by name, email, or phone..."
          />
        </div>

        <Table
          columns={columns}
          data={currentItems}
          loading={loading}
          emptyMessage="No bookings found"
        />

        {totalPages > 1 && (
          <div className="py-2 px-6 border-t border-gray-200">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </div>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Booking Details"
        size="lg"
      >
        {selectedBooking && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {selectedBooking.fullName && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <p className="text-gray-900">{selectedBooking.fullName}</p>
                </div>
              )}

              {selectedBooking.email && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <p className="text-gray-900">{selectedBooking.email}</p>
                </div>
              )}

              {selectedBooking.location && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Location
                  </label>
                  <p className="text-gray-900">{selectedBooking.location}</p>
                </div>
              )}

              {selectedBooking.whatsapp && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    WhatsApp Number
                  </label>
                  <p className="text-gray-900">{selectedBooking.whatsapp}</p>
                </div>
              )}

              {selectedBooking.hoursBooked && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Hours Booked
                  </label>
                  <p className="text-gray-900">
                    {selectedBooking.hoursBooked} hours
                  </p>
                </div>
              )}

              {selectedBooking.dateTime && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date & Time
                  </label>
                  <p className="text-gray-900">
                    {formatDateTime(selectedBooking.dateTime)}
                  </p>
                </div>
              )}
            </div>

            {selectedBooking.pickupAddress && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Pickup Address
                </label>
                <p className="text-gray-900">{selectedBooking.pickupAddress}</p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Companion
                </label>
                <span
                  className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                    selectedBooking.companion
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {selectedBooking.companion ? "Yes" : "No"}
                </span>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cab Required
                </label>
                <span
                  className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                    selectedBooking.cabRequired
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {selectedBooking.cabRequired ? "Yes" : "No"}
                </span>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Hotel Required
                </label>
                <span
                  className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                    selectedBooking.hotelRequired
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {selectedBooking.hotelRequired ? "Yes" : "No"}
                </span>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Age Confirmation
                </label>
                <span
                  className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                    selectedBooking.ageConfirmation
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {selectedBooking.ageConfirmation
                    ? "Confirmed"
                    : "Not Confirmed"}
                </span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <span
                className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${
                  selectedBooking.status === "completed"
                    ? "bg-green-100 text-green-800"
                    : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {selectedBooking.status === "completed"
                  ? "Completed"
                  : "Pending"}
              </span>
            </div>

            {selectedBooking.status === "pending" && (
              <div className="pt-4 border-t border-gray-200 flex space-x-3">
                <button
                  onClick={() => handleMarkCompleted(selectedBooking.id)}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors duration-200"
                >
                  Mark as Completed
                </button>
                <button
                  onClick={() => handleDeleteBooking(selectedBooking.id)}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors duration-200"
                >
                  Delete Booking
                </button>
              </div>
            )}
          </div>
        )}
      </Modal>

      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create New Booking"
        size="lg"
      >
        <form onSubmit={handleCreateBooking} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                placeholder="Enter full name"
                required
                value={newBooking.fullName}
                onChange={(e) =>
                  setNewBooking((prev) => ({
                    ...prev,
                    fullName: e.target.value,
                  }))
                }
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.fullName ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.fullName && (
                <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                placeholder="Enter email"
                required
                value={newBooking.email}
                onChange={(e) => handleFieldChange("email", e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.email ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location
              </label>
              <input
                type="text"
                placeholder="Enter location"
                required
                value={newBooking.location}
                onChange={(e) =>
                  setNewBooking((prev) => ({
                    ...prev,
                    location: e.target.value,
                  }))
                }
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.location ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.location && (
                <p className="text-red-500 text-sm mt-1">{errors.location}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone
              </label>
              <input
                type="tel"
                required
                placeholder="Enter phone number (10+ digits)"
                value={newBooking.phone}
                onChange={(e) => handleFieldChange("phone", e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.phone ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.phone && (
                <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                WhatsApp Number
              </label>
              <input
                type="tel"
                required
                placeholder="Enter WhatsApp number (10+ digits)"
                value={newBooking.whatsapp}
                onChange={(e) => handleFieldChange("whatsapp", e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.whatsapp ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.whatsapp && (
                <p className="text-red-500 text-sm mt-1">{errors.whatsapp}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font Neurobiol0-medium text-gray-700 mb-1">
                Hours Booked
              </label>
              <input
                type="number"
                min="1"
                placeholder="Enter number of hours"
                required
                value={newBooking.hoursBooked}
                onChange={(e) =>
                  setNewBooking((prev) => ({
                    ...prev,
                    hoursBooked: e.target.value,
                  }))
                }
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.hoursBooked ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.hoursBooked && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.hoursBooked}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date & Time
              </label>
              <input
                type="datetime-local"
                required
                placeholder="Select date and time"
                min={minDateTime}
                value={newBooking.dateTime}
                onChange={(e) =>
                  setNewBooking((prev) => ({
                    ...prev,
                    dateTime: e.target.value,
                  }))
                }
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.dateTime ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.dateTime && (
                <p className="text-red-500 text-sm mt-1">{errors.dateTime}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Pickup Address
            </label>
            <textarea
              placeholder="Enter pickup address"
              required
              value={newBooking.pickupAddress}
              onChange={(e) =>
                setNewBooking((prev) => ({
                  ...prev,
                  pickupAddress: e.target.value,
                }))
              }
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.pickupAddress ? "border-red-500" : "border-gray-300"
              }`}
              rows="3"
            />
            {errors.pickupAddress && (
              <p className="text-red-500 text-sm mt-1">
                {errors.pickupAddress}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="companion"
                checked={newBooking.companion}
                onChange={(e) =>
                  setNewBooking((prev) => ({
                    ...prev,
                    companion: e.target.checked,
                  }))
                }
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="companion" className="ml-2 text-sm text-gray-700">
                Companion Required
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="cabRequired"
                checked={newBooking.cabRequired}
                onChange={(e) =>
                  setNewBooking((prev) => ({
                    ...prev,
                    cabRequired: e.target.checked,
                  }))
                }
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label
                htmlFor="cabRequired"
                className="ml-2 text-sm text-gray-700"
              >
                Cab Required
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="hotelRequired"
                checked={newBooking.hotelRequired}
                onChange={(e) =>
                  setNewBooking((prev) => ({
                    ...prev,
                    hotelRequired: e.target.checked,
                  }))
                }
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label
                htmlFor="hotelRequired"
                className="ml-2 text-sm text-gray-700"
              >
                Hotel Required
              </label>
            </div>

            <div className="flex items-center col-span-1 md:col-span-3">
              <input
                type="checkbox"
                id="ageConfirmation"
                checked={newBooking.ageConfirmation}
                onChange={(e) =>
                  setNewBooking((prev) => ({
                    ...prev,
                    ageConfirmation: e.target.checked,
                  }))
                }
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label
                htmlFor="ageConfirmation"
                className="ml-2 text-sm text-gray-700"
              >
                Age Confirmation
              </label>
            </div>
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={() => setShowCreateModal(false)}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-gray-900 text-white rounded-xl hover:bg-gray-800"
            >
              Create Booking
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Bookings;
