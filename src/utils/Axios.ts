import axios, { AxiosInstance, AxiosResponse } from "axios";
const BACKEND_API = import.meta.env.VITE_BACKEND_URL;
export class ServiceResponse {
  success: boolean;
  message: string;
  responseObject: any | null;
  errors?: {
    success: boolean;
    message?: string;
    responseObject: any | null;
  };

  constructor(
    success: boolean,
    message: string,
    responseObject: any | null,
    errors?: {
      success: boolean;
      message?: string;
      responseObject: any | null;
    }
  ) {
    this.success = success;
    this.message = message;
    this.responseObject = responseObject;
    this.errors = errors;
  }
}

const api: AxiosInstance = axios.create({
  baseURL: BACKEND_API,
  timeout: 60000, // Set timeout to 60 seconds
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => {
    // Check if the response data has the expected structure
    if (
      response.data &&
      response.data.success !== undefined &&
      response.data.message !== undefined &&
      response.data.responseObject !== undefined
    ) {
      // Create a new instance of your custom response class
      const customResponse = new ServiceResponse(
        response.data.success,
        response.data.message,
        response.data.responseObject,
        response.data.errors
      );

      // Return the custom response
      return customResponse as unknown as AxiosResponse;
    } else {
      // If the response data doesn't match the expected structure, return the original response
      return response;
    }
  },
  (error) => {
    // Check if the error is an HTTP 500 error
    if (error.response && error.response.status === 500) {
      // Handle the 500 error here
      console.error("HTTP 500 Error:", error);

      // You can also create a custom error response for 500 errors if needed
      const customErrorResponse = new ServiceResponse(
        false,
        "Internal Server Error",
        null,
        error.response.data
      );
      return Promise.reject(customErrorResponse);
    } else if (error.response && error.response.status === 401) {
      // Handle the 500 error here
      console.error("HTTP 401 Error:", error);

      // You can also create a custom error response for 500 errors if needed
      const customErrorResponse = new ServiceResponse(
        false,
        "Unauthorized! Login in again",
        null,
        error.response.data
      );
      return Promise.reject(customErrorResponse);
    } else {
      // For other errors, simply reject the promise with the original error
      return Promise.reject(error);
    }
  }
);

export { api };
