import React, { useEffect, useRef, useState } from "react";
import { useAuthContext } from "../context/context";
import SameSender from "./containers/sameSender";
import OtherSender from "./containers/otherSender";

const ScrollableChats = ({ messages }) => {
  const { user } = useAuthContext();
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  return (
    <>
      {messages?.map((message) => {
        return message.sender._id === user.id ? (
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
