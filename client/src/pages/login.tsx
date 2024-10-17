import axios, { AxiosError } from "axios";
import React, { useEffect, useState } from "react";
import { FaRegEye, FaRegEyeSlash, FaUser } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { Bounce, toast } from "react-toastify";
import { useAuthContext } from "../context/context";

interface IFormData {
  email: string;
  password: string;
}

interface ILoginResponse {
  token: string;
  message: string; // Ensure this matches the response from your API
  // Include other expected properties
}

interface IAuthContext {
  setToken: (token: string) => void;
  setUser: (user: any) => void; // Adjust 'any' to a specific user type if available
  user: any; // Adjust 'any' to a specific user type if available
}

function Login() {
  const [formdata, setFormData] = useState<IFormData>({
    email: "",
    password: "",
  });

  const [viewPassword, setViewPassword] = useState<boolean>(false);
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const url = import.meta.env.VITE_SERVER;

  const { setToken, setUser, user } = useAuthContext() as IAuthContext;

  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [navigate, user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formdata, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (
      !loading &&
      formdata.email.includes("@") &&
      formdata.password.length > 7
    ) {
      setLoading(true);
      try {
        const response = await axios.post<ILoginResponse>(
          `${url}/auth/login`,
          formdata
        );
        const { token, message, ...other } = response.data;
        setLoading(false);
        setToken(token);
        setUser(other);
        navigate("/");
      } catch (error) {
        setLoading(false);
        const axiosError = error as AxiosError;

        // Safely access the message property
        const errorMessage =
          // @ts-ignore
          axiosError.response?.data?.message || "An error occurred";

        toast.error(errorMessage, {
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

  const handleKeydown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSubmit(e as unknown as React.FormEvent<HTMLFormElement>);
    }
  };

  const handleView = () => {
    setViewPassword((prev) => !prev);
  };

  const handleButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    handleSubmit(e as unknown as React.FormEvent<HTMLFormElement>);
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
              className="w-full h-10 px-2 text-black bg-transparent border-b-[1px] border-gray-200 focus:border-black focus:outline-none transition duration-700 ease-in-out delay-200 focus:placeholder-transparent"
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
              className="w-full h-10 px-2 text-black bg-transparent border-b-[1px] border-gray-200 focus:border-black focus:outline-none transition duration-1000 ease-in-out delay-200 focus:placeholder-transparent"
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
            className="focus:outline-none bg-gradient-to-r from-rose-600 to-indigo-800 hover:delay-1000 hover:from-indigo-800 hover:to-rose-600 w-[15rem] rounded-full"
            onClick={handleButtonClick}
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;
