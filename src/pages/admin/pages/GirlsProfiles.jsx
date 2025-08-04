import { useState, useEffect } from "react";
import { FiPlus, FiEye, FiTrash2, FiEdit, FiUpload } from "react-icons/fi";
import toast from "react-hot-toast";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import Table from "../components/Table";
import Modal from "../components/Modal";
import SearchBar from "../components/SearchBar";
import Pagination from "../components/Pagination";
import { db } from "../../../Firebase";
import { uploadImageToCloudinary } from "../../../utils/Cloudinary";

const GirlsProfiles = () => {
  const [profiles, setProfiles] = useState([]);
  const [filteredProfiles, setFilteredProfiles] = useState([]);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    age: "",
    location: "",
    rate: "",
    phone: "",
    status: "available",
    description: "",
    imageUrl: "",
  });

  // Firebase collection reference
  const profilesCollection = collection(db, "girlsProfiles");

  // Real-time data fetching
  useEffect(() => {
    const q = query(profilesCollection, orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const profilesData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setProfiles(profilesData);
        setFilteredProfiles(profilesData);
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

  const handleSearch = (query) => {
    const filtered = profiles.filter(
      (profile) =>
        profile.name.toLowerCase().includes(query.toLowerCase()) ||
        profile.location.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredProfiles(filtered);
    setCurrentPage(1);
  };

  const handleViewDetails = (profile) => {
    setSelectedProfile(profile);
    setShowModal(true);
  };

  const handleEdit = (profile) => {
    setSelectedProfile(profile);
    setFormData({
      ...profile,
      age: profile.age.toString(),
    });
    setShowEditModal(true);
  };

  const handleDelete = (profile) => {
    setSelectedProfile(profile);
    setShowDeleteModal(true);
  };

  // Handle image upload to Cloudinary
  const handleImageUpload = async (file) => {
    if (!file) return null;

    setUploadingImage(true);
    try {
      const imageUrl = await uploadImageToCloudinary(file, "girls-profiles");
      setFormData((prev) => ({
        ...prev,
        imageUrl: imageUrl,
      }));
      toast.success("Image uploaded successfully");
      return imageUrl;
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Failed to upload image");
      return null;
    } finally {
      setUploadingImage(false);
    }
  };

  // Create new profile
  const handleCreateProfile = async (e) => {
    e.preventDefault();
    setCreating(true);

    try {
      const profileData = {
        ...formData,
        age: parseInt(formData.age),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      await addDoc(profilesCollection, profileData);

      resetForm();
      setShowCreateModal(false);
      toast.success("Profile created successfully");
    } catch (error) {
      console.error("Error creating profile:", error);
      toast.error("Failed to create profile");
    } finally {
      setCreating(false);
    }
  };

  // Update existing profile
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setUpdating(true);

    try {
      const profileRef = doc(db, "girlsProfiles", selectedProfile.id);
      const updatedData = {
        ...formData,
        age: parseInt(formData.age),
        updatedAt: serverTimestamp(),
      };

      await updateDoc(profileRef, updatedData);

      resetForm();
      setShowEditModal(false);
      toast.success("Profile updated successfully");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    } finally {
      setUpdating(false);
    }
  };

  // Delete profile
  const confirmDelete = async () => {
    setDeleting(true);

    try {
      const profileRef = doc(db, "girlsProfiles", selectedProfile.id);
      await deleteDoc(profileRef);

      setShowDeleteModal(false);
      toast.success("Profile deleted successfully");
    } catch (error) {
      console.error("Error deleting profile:", error);
      toast.error("Failed to delete profile");
    } finally {
      setDeleting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      age: "",
      location: "",
      rate: "",
      phone: "",
      status: "available",
      description: "",
      imageUrl: "",
    });
  };

  const columns = [
    {
      key: "imageUrl",
      label: "Photo",
      render: (profile) => (
        <img
          src={profile.imageUrl || "/placeholder.svg"}
          alt={profile.name}
          className="w-12 h-12 rounded-full object-cover"
        />
      ),
    },
    { key: "name", label: "Name" },
    { key: "age", label: "Age" },
    { key: "location", label: "Location" },
    { key: "rate", label: "Rate" },
    { key: "phone", label: "Phone" },
    {
      key: "status",
      label: "Status",
      render: (profile) => (
        <span
          className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
            profile.status === "available"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {profile.status === "available" ? "Available" : "Unavailable"}
        </span>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      render: (profile) => (
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleViewDetails(profile)}
            className="p-1 text-blue-600 hover:bg-blue-50 rounded"
          >
            <FiEye size={16} />
          </button>
          <button
            onClick={() => handleEdit(profile)}
            className="p-1 text-green-600 hover:bg-green-50 rounded"
          >
            <FiEdit size={16} />
          </button>
          <button
            onClick={() => handleDelete(profile)}
            className="p-1 text-red-600 hover:bg-red-50 rounded"
          >
            <FiTrash2 size={16} />
          </button>
        </div>
      ),
    },
  ];

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProfiles.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredProfiles.length / itemsPerPage);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Girls Profiles</h1>
          <p className="text-gray-600">Manage all profile information</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors duration-200"
        >
          <FiPlus size={20} />
          <span>Add Profile</span>
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <SearchBar
            onSearch={handleSearch}
            placeholder="Search by name or location..."
          />
        </div>

        <Table
          columns={columns}
          data={currentItems}
          emptyMessage="No profiles found"
          loading={loading}
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

      {/* View Details Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Profile Details"
        size="lg"
      >
        {selectedProfile && (
          <div className="space-y-6">
            <div className="flex flex-col items-center">
              <img
                src={selectedProfile.imageUrl || "/placeholder.svg"}
                alt={selectedProfile.name}
                className="w-32 h-32 rounded-full object-cover mb-4"
              />
              <h3 className="text-xl font-semibold text-gray-900">
                {selectedProfile.name}
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Age
                </label>
                <p className="text-gray-900">{selectedProfile.age} years</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <p className="text-gray-900">{selectedProfile.location}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Rate
                </label>
                <p className="text-gray-900">{selectedProfile.rate}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                <p className="text-gray-900">{selectedProfile.phone}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <span
                  className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${
                    selectedProfile.status === "available"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {selectedProfile.status === "available"
                    ? "Available"
                    : "Unavailable"}
                </span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <p className="text-gray-900">
                {selectedProfile.description || "No description available"}
              </p>
            </div>
          </div>
        )}
      </Modal>

      {/* Create/Edit Profile Modal */}
      <Modal
        isOpen={showCreateModal || showEditModal}
        onClose={() => {
          setShowCreateModal(false);
          setShowEditModal(false);
          resetForm();
        }}
        title={showEditModal ? "Edit Profile" : "Add New Profile"}
        size="lg"
      >
        <form
          onSubmit={showEditModal ? handleUpdateProfile : handleCreateProfile}
          className="space-y-4"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={creating || updating || uploadingImage}
              />
            </div>

            {/* Age */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Age
              </label>
              <input
                type="number"
                required
                min="18"
                value={formData.age}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, age: e.target.value }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={creating || updating}
              />
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location
              </label>
              <input
                type="text"
                required
                value={formData.location}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, location: e.target.value }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={creating || updating}
              />
            </div>

            {/* Rate */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Rate
              </label>
              <input
                type="text"
                required
                placeholder="e.g., $200/hour"
                value={formData.rate}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, rate: e.target.value }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={creating || updating}
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone
              </label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => {
                  const value = e.target.value;
                  // Allow only numbers
                  if (/^\d{0,10}$/.test(value)) {
                    setFormData((prev) => ({ ...prev, phone: value }));
                  }
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={creating || updating}
              />
              {formData.phone.length > 0 && formData.phone.length !== 10 && (
                <p className="text-red-500 text-sm mt-1">
                  Phone number must be 10 digits
                </p>
              )}
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, status: e.target.value }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={creating || updating}
              >
                <option value="available">Available</option>
                <option value="unavailable">Unavailable</option>
              </select>
            </div>
          </div>

          {/* Image Upload + Preview */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload Profile Image
            </label>
            <div className="flex flex-col  gap-4">
              <div className="flex-1">
                <input
                  type="file"
                  accept="image/*"
                  onChange={async (e) => {
                    const file = e.target.files[0];
                    if (file) {
                      await handleImageUpload(file);
                      // Clear the input so the same file can be selected again if needed
                      e.target.value = "";
                    }
                  }}
                  className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4
                       file:rounded-lg file:border-0 file:text-sm file:font-semibold
                       file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100
                       disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={creating || updating || uploadingImage}
                />
                {uploadingImage && (
                  <div className="flex items-center mt-2 text-sm text-blue-600">
                    <FiUpload className="animate-bounce mr-2" size={16} />
                    Uploading image...
                  </div>
                )}
              </div>{" "}
              {formData.imageUrl && (
                <div className="relative">
                  <img
                    src={formData.imageUrl}
                    alt="Profile Preview"
                    className="w-full h-full rounded-md object-cover border border-gray-300"
                  />
                  {uploadingImage && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                    </div>
                  )}
                </div>
              )}
              {formData.imageUrl && (
                <button
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({ ...prev, imageUrl: "" }))
                  }
                  className="px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded-lg border border-red-200"
                  disabled={creating || updating || uploadingImage}
                >
                  Remove
                </button>
              )}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows="3"
              placeholder="Brief description..."
              disabled={creating || updating}
            />
          </div>

          {/* Buttons */}
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={() => {
                setShowCreateModal(false);
                setShowEditModal(false);
                resetForm();
              }}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors duration-200"
              disabled={creating || updating}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={creating || updating || uploadingImage}
            >
              {creating || updating ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  {showEditModal ? "Updating..." : "Creating..."}
                </div>
              ) : showEditModal ? (
                "Update Profile"
              ) : (
                "Add Profile"
              )}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Confirm Delete"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Are you sure you want to delete {selectedProfile?.name}'s profile?
            This action cannot be undone.
          </p>
          <div className="flex space-x-3">
            <button
              onClick={() => setShowDeleteModal(false)}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors duration-200"
              disabled={deleting}
            >
              Cancel
            </button>
            <button
              onClick={confirmDelete}
              className="flex-1 px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={deleting}
            >
              {deleting ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Deleting...
                </div>
              ) : (
                "Delete"
              )}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default GirlsProfiles;
