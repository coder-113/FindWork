import React, { Suspense } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter as Router } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store";
// import persistStore from "redux-persist/es/persistStore";
import LoadingSpinner from "./components/loading-spinner/LoadingSpinner";
// import { I18nextProvider } from "react-i18next";
// import i18n from "./translation/translatetion";
import Kommunicate from "@kommunicate/kommunicate-chatbot-plugin";

Kommunicate.init("kommunicate-support", {
  appId: process.env.REACT_APP_CHATBOT_ID,
  automaticChatOpenOnNavigation: true,
  popupWidget: true,
});


const root = ReactDOM.createRoot(document.getElementById("root"));
// const persistor = persistStore(store);
root.render(
  <Router>
    <Provider store={store}>
      {/* <I18nextProvider i18n={i18n}> */}
      {/* <PersistGate loading={null} persistor={persistor}> */}
      <App />
      {/* </PersistGate> */}
      {/* </I18nextProvider> */}
    </Provider>
  </Router>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
