import axios from "axios";
import { useEffect, useState } from "react";
import { useAuthContext } from "../context/context";
import ChatList from "../components/chatList";
import SingleChat from "../components/singleChat";
import Sidebar from "../components/sidebar";
import { SocketProvider } from "../context/socket";
import useIsSmallScreen from "../hooks/useSmallScreen";
import Header from "../components/header";

// Define types for User and Chat Props
interface IUser {
  _id: string;
  name: string;
  picture?: string;
  id: string;
  message: string;
}

const Chat: React.FC = () => {
  const { setSelectedChat, selectedChat, user } = useAuthContext();
  const [fetchedUser, setFetchedUser] = useState<IUser[]>([]);
  const url = import.meta.env.VITE_SERVER;
  const isSmallScreen = useIsSmallScreen();

  const fetchUsers = async () => {
    try {
      const response = await axios.get<IUser[]>(`${url}/auth/users`);
      if (response) {
        setFetchedUser(response.data);
      }
    } catch (error) {
      console.log("Internal Errors, error:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <SocketProvider>
      <div className="w-screen p-5 h-screen overflow-hidden bg-slate-100">
        <div className="w-full h-full flex gap-2 pt-1">
          <Sidebar />
          <div className="w-full h-fit md:w-[600px]">
            <Header />
            <div className="w-full h-full bg-neutral-50 flex flex-col overflow-y-auto rounded-xl shadow-xl px-6 shadow-blue-200">
              <h2 className="text-black text-2xl font-bold text-start mt-3 border-b-2">
                People
              </h2>
              {fetchedUser.length > 0 ? (
                fetchedUser.map(
                  (data) =>
                    data._id !== user?.id && (
                      <ChatList
                        name={data.name}
                        id={data._id}
                        key={data._id}
                        image={data.picture}
                        onClick={() => setSelectedChat(data)}
                      />
                    )
                )
              ) : (
                <h3 className="w-full h-[200px] text-lg text-neutral-700 flex items-center justify-center">
                  No users Found
                </h3>
              )}
            </div>
          </div>
          {!isSmallScreen && (
            <div className="md:w-full">
              {selectedChat ? (
                <SingleChat />
              ) : (
                <p className=" h-full w-full flex items-center justify-center text-neutral-600">
                  Select a chat to start a conversation
                </p>
              )}
            </div>
          )}
          {isSmallScreen && selectedChat && (
            <div className="fixed inset-0 z-50">
              <SingleChat />
            </div>
          )}
        </div>
      </div>
    </SocketProvider>
  );
};

export default Chat;
