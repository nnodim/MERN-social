import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import Profile from "./pages/profile/Profile";
import Register from "./pages/register/Register";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthContext } from "./context/AuthContext";
import { useContext } from "react";
import Messenger from "./pages/messenger/Messenger";
import { io } from "socket.io-client";
import { useEffect, useRef } from "react";

function App() {
  const socket = useRef();
  useEffect(() => {
    socket.current = io("ws://localhost:5000");
  })
  const { user: currentUser } = useContext(AuthContext);
  if (currentUser) {
    return (
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Navigate to="/" replace />} />
          <Route path="/register" element={<Navigate to="/" replace />} />
          <Route path="/profile/:username" element={<Profile />} />
          <Route path="/messenger" element={<Messenger />} />
        </Routes>
      </div>
    );
  } else {
    return (
      <div className="App">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile/:username" element={<Navigate to="/login" replace />} />
          <Route path="/messenger" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    );
  }
}

export default App;
