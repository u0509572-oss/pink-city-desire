import { useState, useEffect } from "react";
import { FiSave, FiUpload, FiLoader } from "react-icons/fi";
import toast from "react-hot-toast";
import {
  doc,
  updateDoc,
  collection,
  getDocs,
  setDoc,
  where,
  query,
} from "firebase/firestore";
import { uploadImageToCloudinary } from "../../../utils/Cloudinary";
import { db } from "../../../Firebase";

const Settings = () => {
  const [websiteInfo, setWebsiteInfo] = useState({
    logoFile: null,
    logoPreview: "",
    contactNumber1: "",
    contactNumber2: "",
  });

  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [websiteLoading, setWebsiteLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);


  // Fetch website information on mount
  useEffect(() => {
    const fetchWebsiteInfo = async () => {
      try {
        const websiteInfoRef = collection(db, "websiteInformation");
        const querySnapshot = await getDocs(websiteInfoRef);
        if (!querySnapshot.empty) {
          const data = querySnapshot.docs[0].data();
          setWebsiteInfo({
            logoFile: null,
            logoPreview: data.logoUrl || "",
            contactNumber1: data.contactNumber1 || "",
            contactNumber2: data.contactNumber2 || "",
          });
        }
      } catch (error) {
        console.error("Error fetching website info:", error);
        toast.error("Failed to load website information");
      }
    };

    fetchWebsiteInfo();
  }, [db]);

  const handleWebsiteInfoSave = async (e) => {
    e.preventDefault();
    setWebsiteLoading(true);
    try {
      let logoUrl = websiteInfo.logoPreview;

      // Upload logo to Cloudinary if a new file is selected
      if (websiteInfo.logoFile) {
        logoUrl = await uploadImageToCloudinary(
          websiteInfo.logoFile,
          "website_logos"
        );
      }

      // Save to websiteInformation collection
      const websiteInfoRef = doc(db, "websiteInformation", "siteConfig");
      await setDoc(
        websiteInfoRef,
        {
          logoUrl,
          contactNumber1: websiteInfo.contactNumber1,
          contactNumber2: websiteInfo.contactNumber2,
        },
        { merge: true }
      );

      toast.success("Website information updated successfully");
    } catch (error) {
      console.error("Error saving website info:", error);
      toast.error(error.message || "Failed to update website information");
    } finally {
      setWebsiteLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPasswordLoading(true);

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New passwords do not match");
      setPasswordLoading(false);
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error("Password must be at least 6 characters long");
      setPasswordLoading(false);
      return;
    }

    try {
      // Verify current password and update new password in adminAuthentication
      const adminRef = collection(db, "adminAuthentication");
      const q = query(adminRef, where("email", "==", "pcb-admin@gmail.com"));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        toast.error("Admin account not found");
        setPasswordLoading(false);
        return;
      }

      const adminDoc = querySnapshot.docs[0];
      const storedPassword = adminDoc.data().password;

      if (passwordData.oldPassword !== storedPassword) {
        toast.error("Current password is incorrect");
        setPasswordLoading(false);
        return;
      }

      // Update password
      await updateDoc(doc(db, "adminAuthentication", adminDoc.id), {
        password: passwordData.newPassword,
      });

      setPasswordData({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      toast.success("Password changed successfully");
    } catch (error) {
      console.error("Error updating password:", error);
      toast.error("Failed to change password");
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setWebsiteInfo((prev) => ({
        ...prev,
        logoFile: file,
        logoPreview: URL.createObjectURL(file),
      }));
    } else {
      toast.error("Please select a valid image file");
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
        <p className="text-gray-600">Manage your application settings</p>
      </div>

      <div className="bg-white p-6 rounded-xl border border-gray-200">
        <div className="grid grid-cols-1 gap-8">
          {/* Website Information Section */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Website Information
            </h2>

            <form onSubmit={handleWebsiteInfoSave} className="space-y-4">
              {/* Upload Logo */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Logo
                </label>

                <div className="relative group w-full border-2 border-dashed border-gray-300 rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 transition-colors duration-200">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoChange}
                    className="absolute inset-0 opacity-0 cursor-pointer z-10"
                  />
                  <div className="flex flex-col items-center text-center z-0">
                    <FiUpload
                      className="text-gray-500 group-hover:text-blue-600 mb-2"
                      size={24}
                    />
                    <p className="text-sm text-gray-500 group-hover:text-blue-600">
                      Click or drag to upload your logo
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      Only image files are accepted
                    </p>
                  </div>
                </div>

                {websiteInfo.logoPreview && (
                  <div className="mt-4 flex items-center space-x-4">
                    <img
                      src={websiteInfo.logoPreview}
                      alt="Logo preview"
                      className="h-16 w-auto object-contain border border-gray-200 rounded-lg p-2 bg-white"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setWebsiteInfo((prev) => ({
                          ...prev,
                          logoFile: null,
                          logoPreview: "",
                        }))
                      }
                      className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>

              {/* Contact Numbers */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contact Number 1
                </label>
                <input
                  type="tel"
                  required
                  value={websiteInfo.contactNumber1}
                  onChange={(e) =>
                    setWebsiteInfo((prev) => ({
                      ...prev,
                      contactNumber1: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contact Number 2
                </label>
                <input
                  type="tel"
                  required
                  value={websiteInfo.contactNumber2}
                  onChange={(e) =>
                    setWebsiteInfo((prev) => ({
                      ...prev,
                      contactNumber2: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <button
                type="submit"
                disabled={websiteLoading}
                className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-gray-900 text-white rounded-xl hover:bg-gray-800 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors duration-200"
              >
                {websiteLoading ? (
                  <>
                    <FiLoader className="animate-spin" size={16} />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <FiSave size={16} />
                    <span>Save Website Info</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Change Password Section */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Change Password
            </h2>

            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Password
                </label>
                <input
                  type="password"
                  required
                  value={passwordData.oldPassword}
                  onChange={(e) =>
                    setPasswordData((prev) => ({
                      ...prev,
                      oldPassword: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Password
                </label>
                <input
                  type="password"
                  required
                  minLength="6"
                  value={passwordData.newPassword}
                  onChange={(e) =>
                    setPasswordData((prev) => ({
                      ...prev,
                      newPassword: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  required
                  minLength="6"
                  value={passwordData.confirmPassword}
                  onChange={(e) =>
                    setPasswordData((prev) => ({
                      ...prev,
                      confirmPassword: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <button
                type="submit"
                disabled={passwordLoading}
                className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-gray-900 text-white rounded-xl hover:bg-gray-800 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors duration-200"
              >
                {passwordLoading ? (
                  <>
                    <FiLoader className="animate-spin" size={16} />
                    <span>Changing...</span>
                  </>
                ) : (
                  <>
                    <FiSave size={16} />
                    <span>Change Password</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;