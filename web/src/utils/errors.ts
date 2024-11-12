import { AxiosError } from "axios";

export const getAxiosErrorMessage = (error: unknown): string => {
  if (error instanceof AxiosError) {
    if (error.response?.data?.error) {
      return error.response.data.error;
    }

    if (error.response?.data?.message) {
      return error.response.data.message;
    }

    return error.message || "An error occurred, please try again.";
  }
  return "An unknown error occurred.";
};
