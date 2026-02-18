import { io } from "socket.io-client";

const socket = io("https://medqueue-maj3.onrender.com");

export default socket;
