import React, { useEffect, useState } from "react";
import OtpInput from "react-otp-input";
import Layout from "../layouts/Layout";
import { useSearchParams } from "react-router-dom";
import { Toast, ToastProps } from "../components/Toast";
import { ServiceResponse, api } from "../utils/Axios";
import apiUrls from "../utils/apiUrls";
import { Loader } from "../components/Loader";

const Verification: React.FC = () => {
  const [otp, setOtp] = useState<string>("");
  const [loading, setLoading] = useState(false);
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
  const [searchParams, _] = useSearchParams();

  const userId = searchParams.get("id");
  useEffect(() => {
    if (!userId) {
      window.location.href = "/";
    }
  }, []);
  const handleVerify = async () => {
    setLoading(true);
    try {
      const response = (await api.post(apiUrls.user.verify, {
        token: otp,
        id: userId,
      })) as ServiceResponse;
      setLoading(false);
      showToast(response.message, "success");
      setTimeout(() => {
        window.location.href = `/onboard?user=${userId}`;
      }, 2000);
    } catch (error) {
      if (error instanceof ServiceResponse) {
        console.log(error);
        showToast(error.errors?.message!, "info");
        setLoading(false);
      }
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
        <div className="hero min-h-screen bg-base-200">
          <div className="hero-content text-center">
            <div className="max-w-md">
              <h1 className="text-5xl font-bold">Verify your Email</h1>
              <p className="py-6">Enter the Pin sent to your email.</p>
              <OtpInput
                value={otp}
                onChange={setOtp}
                numInputs={6}
                containerStyle="flex justify-between gap-1"
                inputType="number"
                inputStyle="!w-[15%] aspect-square border-[0.25px] border-[#0068FF]/10 focus:border-abeg-teal focus:border rounded-[3px] mt-6"
                renderSeparator={<span>-</span>}
                renderInput={(props) => <input {...props} />}
              />
              <button
                className="bg-blue-500 text-white px-4 py-2 my-5 rounded-md"
                onClick={handleVerify}
              >
                Verify
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Verification;
