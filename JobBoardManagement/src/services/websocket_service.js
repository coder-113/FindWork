// utils/websocket.js
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import { updateIsOnlineThunk } from "../features/userSlice";
import { store } from "../store";
let stompClient = null;

export const connectWebSocket = () => {
  const socket = new SockJS("http://localhost:8080/ws");
  stompClient = new Client({
    webSocketFactory: () => socket,
    debug: (error) => console.log(error),
  });

  stompClient.onConnect = () => {
    stompClient.subscribe("/topic/user-status", (message) => {
      if (message.body) {
        const res = JSON.parse(message.body);
        handleUpdateStatusUser(res);
      }
    });
  };
  stompClient.activate();
};

export const disconnectWebSocket = (client) => {
  if (client && client.deactivate) {
    client.deactivate();
  }
};

const handleUpdateStatusUser = async (user) => {
  store.dispatch(updateIsOnlineThunk(user));
};
