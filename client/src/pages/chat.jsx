import axios from "axios";
import React, { useEffect, useState } from "react";
import { useAuthContext } from "../context/context";
import ChatList from "../components/chatList";
import SingleChat from "../components/singleChat";
import Sidebar from "../components/sidebar";
import { SocketProvider, useSocket } from "../context/socket";
import useIsSmallScreen from "../hooks/useSmallScreen";
import LottieAnimation from "../components/loadingAnimation";
import Header from "../components/header";

const Chat = () => {
  const { setSelectedChat, selectedChat } = useAuthContext();
  const [fetchedUser, setFetchedUser] = useState([]);
  const url = import.meta.env.VITE_SERVER;
  const { user } = useAuthContext();
  const isSmallScreen = useIsSmallScreen();

  const fetch = async () => {
    try {
      await axios
        .get(`${url}/auth/users`)
        .then((response) => {
          if (response) {
            setFetchedUser(response.data);
          }
        })
        .catch((err) => {
          console.log("fetching errors", err);
        });
    } catch (error) {
      console.log("Internal Errors, error:", error);
    }
  };

  useEffect(() => {
    fetch();
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
              {fetchedUser?.length > 1 ? (
                fetchedUser?.map((data) => {
                  return (
                    data._id !== user.id && (
                      <ChatList
                        name={data.name}
                        id={data._id}
                        key={data._id}
                        image={data.picture}
                        onClick={() => setSelectedChat(data)}
                      />
                    )
                  );
                })
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
            <div className="fixed inset-0 z-50">{<SingleChat />}</div>
          )}
        </div>
      </div>
    </SocketProvider>
  );
};

export default Chat;
