import React, { useEffect, useState } from "react";
import { useAuthContext } from "../context/context";
import axios from "axios";
import { useSocket } from "../context/socket";
import { useNavigate } from "react-router-dom";
import { Bounce, toast } from "react-toastify";

interface ChatListProps {
  id: string;
  name: string;
  image?: string;
  onClick: () => void;
}

interface Message {
  _id: string;
  message: string;
  createdAt: string;
  sender: {
    _id: string;
  };
}

const ChatList: React.FC<ChatListProps> = ({ id, name, image, onClick }) => {
  let time: string | undefined;
  const { token, user, setUser, setSelectedChat } = useAuthContext();
  const [fetchedMessage, setFetchedMessage] = useState<Message | null>(null);
  const url = import.meta.env.VITE_SERVER;
  const { socket } = useSocket();
  const navigate = useNavigate();

  const fetchMessages = async () => {
    try {
      const response = await axios.get(`${url}/message/fetch/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setFetchedMessage(response.data);
    } catch (error: any) {
      console.log(error.response.data.message);
      if (error.response.data.logout) {
        toast.error("Token expired!", {
          position: "top-right",
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          progress: undefined,
          theme: "dark",
          transition: Bounce,
        });
        toast.clearWaitingQueue();

        setTimeout(() => {
          socket?.current?.emit("removeUser", user?.id);
          socket?.current?.disconnect();
          setUser(null);
          setSelectedChat(null);

          localStorage.removeItem("user");
          localStorage.removeItem("token");
          navigate("/login");
        }, 3000);
      }
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [id]);

  if (fetchedMessage) {
    time = new Date(fetchedMessage.createdAt).toLocaleTimeString();
  }

  useEffect(() => {
    socket.current?.on("message-received", (message: Message) => {
      if (message.sender._id === id) {
        setFetchedMessage(message);
      }
    });
    return () => {
      socket.current?.off("message-received");
    };
  }, []);

  return (
    <div
      className="w-full h-[5rem] flex flex-row items-center justify-evenly bg-neutral-50 cursor-pointer select-none hover:bg-neutral-100 border-b-[1px] border-neutral-300 text-neutral-600 last:border-b-0"
      onClick={onClick}
    >
      <div className="w-full flex gap-x-3 pr-3 justify-center items-center">
        <div className="w-full flex gap-x-3">
          <img
            src={image ? image : "/profile.jpg"}
            alt="pic"
            className="rounded-full h-12 w-12"
          />
          <div className=" h-full flex flex-col items-start gap-1">
            <div>{name}</div>
            <div className="w-[10rem] flex">
              <span className="truncate text-xs text-neutral-400">
                {fetchedMessage?.message}
              </span>
            </div>
          </div>
        </div>
        <div className="text-xs">{time}</div>
      </div>
    </div>
  );
};

export default ChatList;
