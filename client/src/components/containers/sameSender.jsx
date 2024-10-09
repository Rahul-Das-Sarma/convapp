import React from "react";

const SameSender = ({ message, scrollRef, time }) => {
  const date = new Date(time).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="w-full h-fit flex justify-end select-text overflow-x-hidden">
      <div className=" flex justify-end">
        <div className="max-w-[200px] min-w-[100px] p-2 flex flex-col items-start rounded-3xl bg-purple-700 text-white my-[2px] t">
          <p className=" w-full break-words whitespace-pre-line text-start">
            {message}
          </p>
          <span className="text-xs font-medium text-end w-full ">{date}</span>
        </div>
      </div>
    </div>
  );
};

export default SameSender;
