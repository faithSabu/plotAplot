import io from "socket.io-client";

const ENDPOINT = "https://3.110.207.172:8000";

const socket = io(ENDPOINT);

socket.on("connect", () => {
  console.log("Connected to server");
});

export default socket;
