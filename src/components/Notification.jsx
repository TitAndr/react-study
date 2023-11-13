/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-refresh/only-export-components */
import { useContext, useEffect } from "react";
import { GlobalContext } from "../context/GlobalState";
import toast, { Toaster } from "react-hot-toast";
import { useTranslation } from "react-i18next";

const Notification = () => {
  const { notification } = useContext(GlobalContext);
  const { t } = useTranslation();

  useEffect(() => {
    if (notification) {
      toast[notification?.type](
        notification?.message
          ? t(notification?.message, notification.params)
          : notification?.message,
        {
          duration: 5000,
          position: "top-right",
          style: {
            fontSize: "1.2rem",
            fontWeight: "bold",
          },
        }
      );

      return () => toast.remove();
    }
  }, [notification]);

  return <Toaster />;
};

export default Notification;
