import { useState } from "react";
import Layout from "../layouts/Layout";
import { ServiceResponse, api } from "../utils/Axios";
import apiUrls from "../utils/apiUrls";
import { Loader } from "../components/Loader";
import { Toast, ToastProps } from "../components/Toast";
import useLocalStorage from "../hooks/useLocalStorage";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<ToastProps>({
    isVisible: false,
    message: "",
    variant: "info",
  });
  const [_, setUser] = useLocalStorage("user", {});
  const userId = localStorage.getItem("userId");
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

  const handleLogin = async () => {
    try {
      setLoading(true);
      const response = (await api.post(apiUrls.user.login, {
        email,
        password,
      })) as ServiceResponse;

      setLoading(false);
      showToast(response.message, "success");
      setUser(response.responseObject!);
      console.log(response.responseObject);
      if (response.responseObject?.isOnboardingCompleted) {
        setTimeout(() => {
          window.location.href = `/dashboard`;
        }, 2000);
      } else {
        setTimeout(() => {
          window.location.href = `/onboard?user=${userId}`;
        }, 2000);
      }
    } catch (error: any) {
      if (error instanceof ServiceResponse) {
        if (error.errors?.message!.includes("Unverified")) {
          showToast(error.errors?.message!, "info");
          setLoading(false);
          setTimeout(() => {
            window.location.href = `/verify?id=${userId}`;
          }, 2000);
        } else {
          showToast(error.errors?.message!, "info");
          setLoading(false);
        }
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
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="w-full max-w-md bg-white p-8 rounded shadow-md">
          <h2 className="text-2xl font-bold mb-4">Class APP Login</h2>
          {loading ? (
            <Loader />
          ) : (
            <div>
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="email"
                >
                  Email
                </label>
                <input
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
                  type="email"
                  id="email"
                  placeholder="john.doe@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="mb-6">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="password"
                >
                  Password
                </label>
                <input
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
                  type="password"
                  id="password"
                  placeholder="********"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="flex items-center justify-between">
                <button
                  onClick={handleLogin}
                  type="button"
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  Login
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Login;
