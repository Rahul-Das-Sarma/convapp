import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  ReactNode,
} from "react";
import { io, Socket } from "socket.io-client";
import { useAuthContext } from "./context";

const url = import.meta.env.VITE_SERVER;

interface ISocketContext {
  socket: React.MutableRefObject<Socket | null>;
  isConnected: boolean;
  setIsConnected: (value: boolean) => void;
  onlineUser: { userId: string }[];
}

const SocketContext = createContext<ISocketContext | undefined>(undefined);

export const useSocket = (): ISocketContext => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
};

interface ISocketProviderProps {
  children: ReactNode;
}

export const SocketProvider: React.FC<ISocketProviderProps> = ({
  children,
}) => {
  const [isConnected, setIsConnected] = useState(false);
  const [onlineUser, setOnlineUser] = useState<{ userId: string }[]>([]);
  const { user } = useAuthContext();
  const socket = useRef<Socket | null>(null);

  useEffect(() => {
    socket.current = io(url, {
      withCredentials: true,
    });

    socket.current.on("connected", () => {
      setIsConnected(true);
      socket.current?.emit("setup", user?.id);
    });

    socket.current?.emit("addNewUser", user?.id);

    socket.current?.on("getOnlineUsers", (users: { userId: string }[]) => {
      setOnlineUser(users);
    });

    socket.current?.on("disconnect", () => {
      setIsConnected(false);
      socket.current?.emit("removeUser", user?.id);
    });

    return () => {
      socket.current?.off("connect");
      socket.current?.off("disconnect");
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
