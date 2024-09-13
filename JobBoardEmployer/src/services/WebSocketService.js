import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import { store } from "../store";
import { updateNotificationBySocket } from "../features/notificationSlice";
import { sendNotificationAsync } from "./NotificationService";

let stompClient = null;

export const connectWebSocket = (user) => {
  const socket = new SockJS(`http://localhost:8080/ws`);
  stompClient = new Client({
    webSocketFactory: () => socket,
    debug: (str) => console.log(str),
  });

  stompClient.onConnect = () => {
    console.log("Connect to WebSocket");
    stompClient.subscribe("/topic/notifications", (message) => {
      if (message.body) {
        const res = JSON.parse(message.body);
        console.log(res);
        if (user.id === res.recipient.id) {
          handleReciptMessage(res);
        }
      }
    });
  };

  stompClient.activate();
};

export const disconnectWebSocket = () => {
  if (stompClient !== null) {
    stompClient.deactivate();
  }
  console.log("Disconnected from WebSocket");
};

const handleReciptMessage = async (reciptMessage) => {
  store.dispatch(updateNotificationBySocket(reciptMessage));
};
