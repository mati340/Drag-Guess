import React from "react";
import socketIOClient from "socket.io-client";

const ENDPOINT = "http://localhost:8080";

export const socket = socketIOClient(ENDPOINT)
const SocketContext = React.createContext(socket)

export const SocketProvider = SocketContext.Provider
export const SocketConsumer = SocketContext.Consumer
export default SocketContext