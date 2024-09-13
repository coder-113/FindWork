import { useEffect, useRef, useState } from "react";
import axiosRequest from "./axiosRequest"; // Import axiosRequest đã cấu hình

export function useActive(userId, time) {
  const [active, setActive] = useState(false);
  const timer = useRef();
  const events = ["keypress", "mousemove", "touchmove", "click", "scroll"];

  useEffect(() => {
    const handleEvent = () => {
      setActive(true);
      if (timer.current) {
        window.clearTimeout(timer.current);
      }
      timer.current = window.setTimeout(() => {
        setActive(false);
      }, time);
    };

    events.forEach((event) => document.addEventListener(event, handleEvent));
    return () => {
      events.forEach((event) =>
        document.removeEventListener(event, handleEvent)
      );
    };
  }, [time]);

  useEffect(() => {
    const updateStatus = async (status) => {
      try {
        await axiosRequest.post("/users/update-status", {
          userId,
          status: status === "offline" ? false : true,
        });
      } catch (error) {
        console.error("Error updating user status:", error);
      }
    };

    if (active) {
      updateStatus("online");
    } else {
      updateStatus("offline");
    }
  }, [active, userId]);

  return active;
}
