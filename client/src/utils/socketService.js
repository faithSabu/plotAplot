import io from "socket.io-client";

const ENDPOINT = "http://localhost:8000";

const socket = io(ENDPOINT);

socket.on("connect", () => {
  console.info("Connected to server");
});

export default socket;
