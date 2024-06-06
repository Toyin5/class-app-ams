// Onboarding.tsx

import React, { useEffect, useState } from "react";
import Layout from "../layouts/Layout";
import { useSearchParams } from "react-router-dom";
import { uploadUserAvatar } from "../services/Cloudinary";
import { Toast, ToastProps } from "../components/Toast";
import { ServiceResponse, api } from "../utils/Axios";
import apiUrls from "../utils/apiUrls";
import { Loader } from "../components/Loader";
import useLocalStorage from "../hooks/useLocalStorage";

interface OnboardingData {
  firstName: string;
  lastName: string;
  avatar: File | null;
  intro: string;
  qualifications: [string];
  title: string;
}

const Onboarding: React.FC = () => {
  const [searchParams, _] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [user, _1] = useLocalStorage<{}>("user", {});
  const [toast, setToast] = useState<ToastProps>({
    isVisible: false,
    message: "",
    variant: "info",
  });

  const showToast = (
    message: string,
    variant: "info" | "error" | "success"
  ) => {
    setToast({
      isVisible: true,
      message: message,
      variant: variant,
    });
    // Hide the toast after 5 seconds (adjust the timeout as needed)
    setTimeout(() => {
      setToast({
        isVisible: false,
        message: "",
        variant: "info", // Reset variant to 'info'
      });
    }, 5000);
  };

  const userId = searchParams.get("user");
  useEffect(() => {
    if (!userId) {
      window.location.href = "/";
    }
    if (user) {
      window.location.href = "/dashboard";
    }
  }, []);
  const [formData, setFormData] = useState<OnboardingData>({
    firstName: "",
    lastName: "",
    avatar: null,
    intro: "",
    qualifications: [""],
    title: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    setFormData((prevData) => ({ ...prevData, avatar: file ?? null }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const url = await uploadUserAvatar(formData.avatar!);
      const response = (await api.post(apiUrls.user.onboard, {
        firstName: formData.firstName,
        lastName: formData.lastName,
        avatar: url,
        intro: formData.intro,
        title: formData.title,
        qualifications: formData.qualifications,
      })) as ServiceResponse;
      setLoading(false);
      showToast(response.message, "success");
      // setTimeout(() => {
      //   window.location.href = `/onboard${userId}`;
      // }, 2000);
    } catch (error) {
      if (error instanceof ServiceResponse) {
        console.log(error);
        showToast(error.message!, "error");
        setLoading(false);
        setTimeout(() => {
          window.location.href = `/login`;
        }, 2000);
      }
      console.log(error);
      showToast("An error occurred!", "error");
      setLoading(false);
    }
  };

  return (
    <Layout>
      {toast.isVisible && (
        <Toast
          message={toast.message}
          variant={toast.variant}
          isVisible={toast.isVisible}
        />
      )}
      {loading ? (
        <Loader />
      ) : (
        <div className="max-w-2xl mx-auto p-6 bg-white rounded-md shadow-md">
          <h2 className="text-2xl font-bold mb-4 text-center">Onboarding</h2>

          <div className="grid grid-cols-2 gap-4">
            <label>
              First Name:
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                className="w-full border rounded p-2"
                required
              />
            </label>
            <label>
              Last Name:
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                className="w-full border rounded p-2"
                required
              />
            </label>
          </div>
          <label>
            Introduction:
            <input
              type="text"
              name="intro"
              value={formData.intro}
              onChange={handleInputChange}
              className="w-full border rounded p-2 mt-4"
              required
            />
          </label>
          <label>
            Qualifications:
            <input
              type="text"
              name="qualifications"
              value={formData.qualifications}
              onChange={handleInputChange}
              className="w-full border rounded p-2 mt-4"
              required
            />
          </label>
          <label>
            Title:
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="w-full border rounded p-2 mt-4"
              required
            />
          </label>
          <div className="flex items-center mb-4">
            <label className="form-control w-full max-w-xs">
              <div className="label">
                <span className="label-text">Avatar</span>
                <span className="label-text-alt">Pick a file</span>
              </div>
              <input
                type="file"
                accept="image/*"
                name="avatar"
                onChange={handleAvatarChange}
                className="file-input file-input-bordered w-full max-w-xs"
                required
              />
            </label>
          </div>
          <button
            onClick={handleSave}
            className="bg-blue-500 text-white rounded-full px-4 py-2 mt-4"
          >
            Save
          </button>
        </div>
      )}
    </Layout>
  );
};

export default Onboarding;
