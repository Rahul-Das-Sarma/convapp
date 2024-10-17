import { createContext, ReactNode, useContext, useState } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";

interface IUser {
  // Define your user object structure
  id: string;
  name: string;
  email: string;
}

interface IChat {
  id: string;
  message: string;
  _id: string;
  // Other properties related to chat
}

interface IAuthContext {
  isAuthenticated: boolean;
  setIsAuthenticated: (value: boolean) => void;
  user: IUser | null;
  setUser: (value: IUser | null) => void;
  token: string | null;
  setToken: (value: string | null) => void;
  chats: IChat[] | null;
  setChats: (value: IChat[] | null) => void;
  selectedChat: IChat | null;
  setSelectedChat: (value: IChat | null) => void;
}

interface IAuthProvider {
  children: ReactNode;
}

const AuthContext = createContext<IAuthContext | undefined>(undefined);
export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
};

const AuthProvider = ({ children }: IAuthProvider) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useLocalStorage<IUser | null>("user", null);
  const [token, setToken] = useLocalStorage<string | null>("token", null);
  const [chats, setChats] = useState<IChat[] | null>(null);
  const [selectedChat, setSelectedChat] = useState<IChat | null>(null);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        setIsAuthenticated,
        user,
        setUser,
        token,
        setToken,
        chats,
        setChats,
        selectedChat,
        setSelectedChat,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
