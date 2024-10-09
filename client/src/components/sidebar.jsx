import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../context/context";
import { toast } from "react-toastify";
import { useSocket } from "../context/socket";
import { IoMdMenu } from "react-icons/io";
import { IoLogOut } from "react-icons/io5";

const Sidebar = () => {
  const navigate = useNavigate();
  const { setUser, setSelectedChat, user } = useAuthContext();
  const { socket } = useSocket();

  const handleLogout = (e) => {
    e.preventDefault();
    if (socket) {
      socket.current.emit("removeUser", user.id);
      socket.current.disconnect();
      setUser(null);
      setSelectedChat(null);

      localStorage.removeItem("user");
      localStorage.removeItem("token");
      navigate("/login");
    }
  };

  return (
    <div className=" w-16 md:w-28 h-full flex flex-col bg-purple-700 items-center justify-end py-4 rounded-xl">
      <div className=" h-[60%]">
        <div className="group relative">
          <img
            src="/profile.jpg"
            className="w-11 h-11 rounded-full cursor-pointer "
          />
          <div className="w-[150px] h-fit py-3 absolute group bg-neutral-100 hidden text-neutral-700 shadow-2xl shadow-blue-200 group-hover:block bottom-[30px] left-[40px] rounded-r-xl rounded-t-xl cursor-pointer select-none">
            {user.name}
          </div>
        </div>
      </div>

      <div onClick={handleLogout}>
        <IoLogOut className="h-10 w-10 cursor-pointer" />
      </div>
    </div>
  );
};

export default Sidebar;
