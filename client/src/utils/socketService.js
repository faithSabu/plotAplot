// src/socketService.js
import { useDispatch, useSelector } from "react-redux";
import socketIOClient from "socket.io-client";
import { store } from "../redux/store";

const ENDPOINT = "http://localhost:8000";

const socket = socketIOClient(ENDPOINT);

socket.on("connect", () => {
  console.log("Connected to server");
});

export default socket;
