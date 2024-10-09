import axios from "axios";
import React, { useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { Bounce, ToastContainer, toast } from "react-toastify";
import { useAuthContext } from "../context/context";

function Register() {
  const url = import.meta.env.VITE_SERVER;

  const [formdata, setFormdata] = useState({
    name: "",
    email: "",
    password: "",
    confirmedPassword: "",
  });

  const [viewPassword, setViewPassword] = useState(false);
  const [viewPasswordConfrim, setViewPasswordConfirm] = useState(false);
  const { setToken } = useAuthContext();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormdata({ ...formdata, [e.target.name]: e.target.value });
  };

  const handleViewPassword = () => {
    setViewPassword((prev) => !prev);
  };
  const handleViewPasswordConfirm = () => {
    setViewPasswordConfirm((prev) => !prev);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formdata.email.includes("@") && formdata.password.length > 7) {
      if (formdata.password !== formdata.confirmedPassword) {
        toast.error("Password is not matching", {
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
        return;
      }
      await axios
        .post(`${url}/auth/register`, formdata)
        .then((response) => {
          toast.success(response?.data.message, {
            position: "top-right",
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
            progress: undefined,
            theme: "dark",
            transition: Bounce,
          });

          const { token } = response.data;
          setToken(token);

          setTimeout(() => {
            navigate("/login");
          }, 4000);
        })
        .catch((err) => {
          console.log(err);
          toast.error(err.response.data, {
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
      toast.error(
        "Invalid email or password & password must have atleast 8 characters",
        {
          position: "top-right",
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          progress: undefined,
          theme: "dark",
          transition: Bounce,
        }
      );
      toast.clearWaitingQueue();
    }
  };

  const handleKeydown = (e) => {
    if (e.key === "Enter") {
      handleSubmit(e);
    }
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
          <h1 className="text-black font-semibold">Register</h1>
        </div>
        <div className="w-full h-full flex flex-col py-6 gap-y-5 items-center">
          <div className="relative z-10 w-full px-6">
            <input
              className="w-full h-10 px-2 text-black bg-transparent border-b-[1px] border-gray-200  focus:border-black focus:outline-none transition duration-1000 ease-in-out delay-200"
              placeholder="Username"
              name="name"
              type="text"
              onChange={handleChange}
              value={formdata.name}
              onKeyDown={handleKeydown}
            />
          </div>
          <div className="relative z-10 w-full px-6">
            <input
              className="w-full h-10 px-2 text-black bg-transparent border-b-[1px] border-gray-200  focus:border-black focus:outline-none transition duration-1000 ease-in-out delay-200"
              placeholder="Email"
              name="email"
              type="email"
              onChange={handleChange}
              value={formdata.email}
              onKeyDown={handleKeydown}
            />
          </div>

          <div className="relative z-10 w-full px-6">
            <input
              className="w-full h-10 px-2 text-black bg-transparent border-b-[1px] border-gray-200  focus:border-black focus:outline-none transition duration-1000 ease-in-out delay-200"
              placeholder="Password"
              name="password"
              type={viewPassword ? "text" : "password"}
              onChange={handleChange}
              value={formdata.password}
              onKeyDown={handleKeydown}
            />
            <span
              role="button"
              className="text-black absolute top-[10px] right-[10px] select-none"
              onClick={handleViewPassword}
            >
              {viewPassword ? (
                <FaRegEyeSlash className="w-6 h-4" />
              ) : (
                <FaRegEye className="w-6 h-4" />
              )}
            </span>
          </div>
          <div className="relative z-10 w-full px-6">
            <input
              className="w-full h-10 px-2 text-black bg-transparent border-b-[1px] border-gray-200  focus:border-black focus:outline-none transition duration-1000 ease-in-out delay-200"
              placeholder="Confirm Password"
              name="confirmedPassword"
              type={viewPasswordConfrim ? "text" : "password"}
              onChange={handleChange}
              value={formdata.confirmedPassword}
              onKeyDown={handleKeydown}
            />
            <span
              role="button"
              className="text-black absolute top-[10px] right-[10px] "
              onClick={handleViewPasswordConfirm}
            >
              {viewPasswordConfrim ? (
                <FaRegEyeSlash className="w-6 h-4" />
              ) : (
                <FaRegEye className="w-6 h-4" />
              )}
            </span>
          </div>

          <div>
            <h3 className="text-gray-600">
              Already have an{" "}
              <span>
                <Link to={"/login"} className="hover:text-purple-600">
                  {" "}
                  account
                </Link>
              </span>
            </h3>
          </div>
          <button
            className="focus:outline-none bg-gradient-to-r from-rose-600 to-indigo-800 hover:delay-1000 hover:from-indigo-800 hover:to-rose-600 w-[15rem] rounded-full"
            onClick={handleSubmit}
          >
            SignUp
          </button>
        </div>
      </div>
    </div>
  );
}

export default Register;
