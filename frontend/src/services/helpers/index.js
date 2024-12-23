import { notifications } from "@mantine/notifications"; 

export const successMessage = (msg) => {
  notifications.show({ 
    id: "success-notification",
    withCloseButton: true,
    autoClose: 3500,
    title: msg,
    color: "green", 
    className: "success-notification inter",
    loading: false,
  });
};

export const errorMessage = (error) => {
  notifications.show({
    id: "failure-notification",
    withCloseButton: true,
    autoClose: 3500,
    message: error || "Internal Server Error",
    color: "red", 
    className: "failure-notification",
    loading: false,
  });
};

export const warningMessage = (error) => {
  notifications.show({
    id: "warning-notification",
    withCloseButton: true,
    autoClose: 3500,
    message: error || "Internal Server Error",
    color: "yellow", 
    className: "warning-notification",
    loading: false,
  });
};
