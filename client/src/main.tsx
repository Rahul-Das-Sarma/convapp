import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.js";
import "./index.css";
import AuthProvider from "./context/context.js";
import { BrowserRouter } from "react-router-dom";

import { Bounce, ToastContainer } from "react-toastify";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
          transition={Bounce}
          limit={1}
        />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
