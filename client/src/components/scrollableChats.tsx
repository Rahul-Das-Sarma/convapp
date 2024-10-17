import { useEffect, useRef } from "react";
import { useAuthContext } from "../context/context";
import SameSender from "./containers/sameSender";
import OtherSender from "./containers/otherSender";
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

interface IScrollableChatsProps {
  messages: IMessage[];
}

const ScrollableChats: React.FC<IScrollableChatsProps> = ({ messages }) => {
  const { user } = useAuthContext();
  const scrollRef = useRef<HTMLSpanElement | null>(null); // Explicitly type ref

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <>
      {messages?.map((message) => {
        return message.sender._id === user?.id ? (
          <SameSender
            key={message._id}
            message={message.message}
            time={message.updatedAt}
          />
        ) : (
          <OtherSender
            key={message._id}
            message={message.message}
            time={message.updatedAt}
          />
        );
      })}
      <span ref={scrollRef}></span>
    </>
  );
};

export default ScrollableChats;
