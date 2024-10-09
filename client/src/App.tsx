import "./App.css";
import { useAuthContext } from "./context/context";
import Register from "./pages/register";

import "react-toastify/dist/ReactToastify.css";
import { Navigate, Route, Routes } from "react-router-dom";
import Login from "./pages/login";
import Chat from "./pages/chat";

function App() {
  const { user } = useAuthContext();

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center">
      <Routes>
        <Route
          path="/"
          element={
            user ? (
              <Navigate to={"/chat"} replace={true} />
            ) : (
              <Navigate to={"/login"} replace={true} />
            )
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/chat"
          element={user ? <Chat /> : <Navigate to={"/login"} replace={true} />}
        />
      </Routes>
    </div>
  );
}

export default App;
