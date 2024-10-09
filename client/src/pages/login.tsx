import axios from "axios";
import React, { useEffect, useState } from "react";
import { CiUser } from "react-icons/ci";
import { FaRegEye, FaRegEyeSlash, FaUser } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { Bounce, toast } from "react-toastify";
import { useAuthContext } from "../context/context";

function Login() {
  const [formdata, setFormData] = useState({
    email: "",
    password: "",
  });

  const [viewPassword, setViewPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [loading, setLoading] = useState(false);

  const url = import.meta.env.VITE_SERVER;

  const { setToken, setUser, user } = useAuthContext();

  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({ ...formdata, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !loading &&
      formdata.email.includes("@") &&
      formdata.password.length > 7
    ) {
      setLoading(true);
      await axios
        .post(`${url}/auth/login`, formdata)
        .then((response) => {
          const { token, message, ...other } = response.data;
          setLoading(false);
          setToken(token);
          setUser(other);
          navigate("/");
        })
        .catch((error) => {
          setLoading(false);
          console.log(error?.response);
          toast.error(error?.response.data.message, {
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
        });
    } else {
      setLoading(false);
      toast.error("Invalid email or password", {
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
    }
  };

  const handleKeydown = (e) => {
    if (e.key === "Enter") {
      handleSubmit(e);
    }
  };

  const handleView = () => {
    setViewPassword((prev) => !prev);
  };

  return (
    <div
      className="w-screen h-full flex items-center justify-center"
      style={{
        backgroundImage: "url(bg.jpg)",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="w-[300px] md:w-[450px] h-[600px] bg-white flex flex-col items-center rounded-md py-6">
        <div className="w-full h-[18rem] flex items-center justify-center">
          <h1 className="text-black">Login</h1>
        </div>
        <div className="w-full h-full flex flex-col py-6 gap-y-5 items-center ml-4">
          <div className="relative z-10 w-full px-6">
            <input
              className="w-full h-10 px-2 text-black bg-transparent border-b-[1px] border-gray-200  focus:border-black focus:outline-none transition duration-700 ease-in-out delay-200 focus:placeholder-transparent"
              placeholder={"Email"}
              name="email"
              type="email"
              value={formdata.email}
              onChange={handleChange}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              onKeyDown={handleKeydown}
            />

            <span className="text-black absolute left-2 top-3 ">
              {isFocused ? <FaUser fill="black" /> : <FaUser fill="gray" />}
            </span>
          </div>

          <div className="relative z-10 w-full px-6">
            <input
              className="w-full h-10 px-2  text-black bg-transparent border-b-[1px] border-gray-200  focus:border-black focus:outline-none transition duration-1000 ease-in-out delay-200 focus:placeholder-transparent"
              placeholder="Password"
              name="password"
              type={viewPassword ? "text" : "password"}
              value={formdata.password}
              onChange={handleChange}
              onKeyDown={handleKeydown}
            />
            <span
              role="button"
              className="text-black absolute bottom-2 right-6 select-none"
              onClick={handleView}
            >
              {viewPassword ? (
                <FaRegEyeSlash className="w-6 h-4" />
              ) : (
                <FaRegEye className="w-6 h-4" />
              )}
            </span>
          </div>

          <div>
            <h3 className="text-gray-600">
              Don't have an {""}
              <span>
                <Link to={"/register"} className="hover:text-purple-600">
                  account
                </Link>
              </span>
            </h3>
          </div>
          <button
            className=" focus:outline-none bg-gradient-to-r from-rose-600 to-indigo-800 hover:delay-1000 hover:from-indigo-800 hover:to-rose-600 w-[15rem] rounded-full"
            onClick={handleSubmit}
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;
