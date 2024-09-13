import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import { store } from "../store";
import { updateNotificationBySocket } from "../features/notificationSlice";
import { sendNotificationAsync } from "./NotificationService";
import { signOut } from "../features/authSlice";
import Swal from "sweetalert2";

let stompClient = null;

export const connectWebSocket = (user) => {
  if (user) {
    const socket = new SockJS(process.env.REACT_APP_WEBSOCKET_ENDPOINT);
    stompClient = new Client({
      webSocketFactory: () => socket,
      debug: (error) => console.log(error),
    });

    stompClient.onConnect = () => {
      stompClient.subscribe("/topic/notifications", (message) => {
        if (message.body) {
          const res = JSON.parse(message.body);
          if (user.id === res.recipient.id) {
            handleReciptMessage(res);
          }
        }
      });
      stompClient.subscribe("/topic/deactivated", (message) => {
        if (message.body) {
          const res = JSON.parse(message.body);
          if (user.id === res.id) {
            handleSignOut();
          }
        }
      });
    };

    stompClient.activate();
  }
};

export const disconnectWebSocket = () => {
  if (stompClient !== null) {
    stompClient.deactivate();
  }
};

const handleReciptMessage = async (reciptMessage) => {
  store.dispatch(updateNotificationBySocket(reciptMessage));
};

const handleSignOut = async () => {
  await Swal.fire({
    title: "Account Deactivated",
    text: "Your account has been deactivated. You will be logged out now.",
    icon: "warning",
    confirmButtonText: "OK",
    showLoaderOnConfirm: true,
  });
  store.dispatch(signOut());
};
