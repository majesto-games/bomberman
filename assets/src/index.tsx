import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { Socket } from "phoenix";

let socket = new Socket("/socket", { params: { userToken: "123" } });
socket.connect();

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);
