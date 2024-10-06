import { toast } from "react-toastify";

export const useNotification = () => {
  const showNotification = (message, type = "success") => {
    toast.dismiss(); // Dismiss all existing toasts
    toast[type](message, {
      position: "bottom-right",
      autoClose: 3000,
    });
  };

  return { showNotification };
};