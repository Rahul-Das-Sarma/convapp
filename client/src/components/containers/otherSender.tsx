interface IOtherSender {
  message: string;
  time: string | Date;
}
const OtherSender = ({ message, time }: IOtherSender) => {
  const date = new Date(time).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
  return (
    <div className=" w-full flex">
      <div className="w-auto h-auto rounded-md flex flex-col justify-start select-all">
        <div className="  p-2 flex flex-col items-start rounded-3xl bg-gray-300 text-neutral-800  my-[2px] t">
          <p className="max-w-[200px] min-w-[100px] text-start break-words whitespace-pre-line">
            {" "}
            {message}
          </p>

          <span className="text-xs font-medium text-end w-full">{date}</span>
        </div>
      </div>
    </div>
  );
};

export default OtherSender;
