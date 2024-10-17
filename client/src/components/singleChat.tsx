import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useAuthContext } from "../context/context";
import ScrollableChats from "./scrollableChats";
import { GoDotFill } from "react-icons/go";
import { useSocket } from "../context/socket";
import { IoIosSend } from "react-icons/io";
import useIsSmallScreen from "../hooks/useSmallScreen";
import Picker from "emoji-picker-react";
import { BsEmojiGrin } from "react-icons/bs";
import LoadingAnimation from "./loadingAnimation";

interface IUser {
  id?: string;
  name?: string;
  _id?: string;
  online?: boolean;
}

interface IMessage {
  _id: string;
  message: string;
  sender: IUser;
  receiver: IUser;
  updatedAt: string;
}

const SingleChat: React.FC = () => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [message, setMessage] = useState<string>("");
  const [fetchedMessage, setFetchedMessage] = useState<IMessage[]>([]);
  const [fetchedUser, setFetchedUser] = useState<IUser | undefined>(undefined);
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const url = import.meta.env.VITE_SERVER;
  const { selectedChat, setSelectedChat, token, user } = useAuthContext();
  const [typingUser, setTypingUser] = useState<string>("");
  const [typingTimer, setTypingTimer] = useState<NodeJS.Timeout | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { socket, onlineUser } = useSocket();
  const isSmallScreen = useIsSmallScreen();

  const handleFocus = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleBlur = () => {
    setTimeout(handleFocus, 0);
  };

  const fetchUser = async () => {
    if (!selectedChat) return;
    try {
      const response = await axios.get(`${url}/auth/user/${selectedChat?._id}`);
      const { data } = response;
      if (data) {
        setFetchedUser((prev) => ({
          ...prev,
          online: data.online,
        }));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchMessages = async () => {
    if (!selectedChat) return;
    setIsLoading(true);
    try {
      const response = await axios.get(`${url}/message/${selectedChat._id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setFetchedMessage(response.data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async () => {
    if (message) {
      try {
        socket.current?.emit(
          "new-message",
          message,
          user?.id,
          selectedChat?._id
        );
        setMessage("");
        setShowEmojiPicker(false);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  const handleClick = () => {
    sendMessage();
  };

  const handleEmojiSelect = (emojiObject: { emoji: string }) => {
    setMessage((prevMessage) => prevMessage + emojiObject.emoji);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);

    if (typingTimer) clearTimeout(typingTimer);
    if (!isTyping) {
      socket.current?.emit("typing", selectedChat?._id, user?.id);
    }

    const newTimer = setTimeout(() => {
      socket.current?.emit("stop-typing", selectedChat?._id);
    }, 1000);

    setTypingTimer(newTimer);
  };

  const handleReturn = () => {
    if (isSmallScreen) {
      setSelectedChat(null);
    }
  };
  useEffect(() => {
    setShowEmojiPicker(false);
    handleFocus();

    if (selectedChat) {
      setFetchedUser(selectedChat);
      fetchMessages();
      fetchUser();
      socket.current?.emit("join-chat", selectedChat._id);
    }

    // Cleanup function
    return () => {
      // Emit the leave-chat event without returning the socket
      socket.current?.emit("leave-chat", selectedChat?._id);
    };
  }, [selectedChat]);

  useEffect(() => {
    socket.current?.on("typing", (userId: string) => {
      setIsTyping(true);
      setTypingUser(userId);
    });
    socket.current?.on("stop-typing", () => {
      setIsTyping(false);
      setTypingUser("");
    });

    socket.current?.on("message-sent", (message: IMessage) => {
      setFetchedMessage((prev) => [...prev, message]);
    });
    socket.current?.on("message-received", (message: IMessage) => {
      if (
        message.receiver._id === user?.id &&
        message.sender._id === selectedChat?._id
      ) {
        setFetchedMessage((prev) => [...prev, message]);
      }
    });
    socket.current?.on("error", (error: any) => {
      console.log(error);
    });

    return () => {
      socket.current?.off("typing");
      socket.current?.off("stop-typing");
      socket.current?.off("message-sent");
      socket.current?.off("message-received");
      socket.current?.off("error");
    };
  }, [selectedChat]);

  return (
    <div className="h-full w-full flex flex-col bg-neutral-50 text-neutral-500 rounded-xl shadow-xl shadow-blue-200 pl-3">
      {fetchedUser ? (
        <div className="flex flex-col w-full h-full">
          <div className="flex-shrink-0 py-5 px-2 text-start flex gap-x-2 items-center justify-start border-b-[1px]">
            <div onClick={handleReturn}>
              <img src="/profile.jpg" className="w-11 h-11 rounded-full" />
            </div>
            <div>
              {fetchedUser?.name}
              {onlineUser.some((user) => user?.userId === fetchedUser._id) && (
                <p className="text-xs flex items-center text-neutral-400">
                  <span>
                    <GoDotFill fill="green" />
                  </span>
                  {typingUser === selectedChat?._id ? "typing..." : "online"}
                </p>
              )}
            </div>
          </div>
          <div className="flex-grow p-2 overflow-auto bg-neutral-50">
            {isLoading ? (
              <LoadingAnimation />
            ) : (
              <ScrollableChats messages={fetchedMessage} />
            )}
          </div>
          <div className="flex-shrink-0 w-full bg-slate-100 p-2 rounded-xl">
            <div className="flex items-center gap-x-2">
              <div className="flex-grow flex gap-x-3 ">
                <input
                  ref={inputRef}
                  className="w-full bg-slate-100 focus:outline-none px-2"
                  onChange={handleChange}
                  value={message}
                  onBlur={handleBlur}
                  onKeyDown={handleKeyDown}
                  placeholder="Type your message"
                />

                <div className="relative flex items-center">
                  <BsEmojiGrin
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  />
                  {showEmojiPicker && (
                    <div className="fixed right-1 bottom-14">
                      <Picker onEmojiClick={handleEmojiSelect} />
                    </div>
                  )}
                </div>

                <button
                  className="border-none hover:outline-none bg-slate-100 hover:bg-slate-200"
                  onClick={handleClick}
                >
                  <IoIosSend />
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="h-full w-full flex items-center justify-center">
          Loading...
        </div>
      )}
    </div>
  );
};

export default SingleChat;
