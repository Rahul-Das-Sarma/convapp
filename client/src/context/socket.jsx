import { createContext, useContext, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { useAuthContext } from "./context";

const url = import.meta.env.VITE_SERVER;

const SocketContext = createContext();

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [onlineUser, setOnlineUser] = useState([]);
  const { user } = useAuthContext();
  const socket = useRef(null);

  useEffect(() => {
    socket.current = io(url, {
      withCredentials: true,
    });
    socket.current.on("connected", () => {
      setIsConnected(true);
      socket.current.emit("setup", user.id);
    });

    socket.current.emit("addNewUser", user.id);

    socket.current.on("getOnlineUsers", (users) => {
      setOnlineUser(users);
    });

    socket.current.on("disconnect", () => {
      setIsConnected(false);
      socket.current.emit("removeUser", user.id);
    });

    return () => {
      socket.current.off("connect");
      socket.current.off("disconnect");
    };
  }, [user]);

  return (
    <SocketContext.Provider
      value={{ socket, isConnected, setIsConnected, onlineUser }}
    >
      {children}
    </SocketContext.Provider>
  );
};
