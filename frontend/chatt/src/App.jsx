import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import HomePage from "./pages/HomePage";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import SettingPage from "./pages/SettingPage";
import ProfilePage from "./pages/ProfilePage";

import { useAuthStore } from "./store/useAuthStore"; // Zustand store
import { Loader } from "lucide-react";
import { Toaster } from "react-hot-toast";
import Navbar from "./components/navbar";
import { useThemeStore } from "./store/useThemeStore";

const App = () => {
  const { authUser, checkAuth, isCheckingAuth, onlineUsers } = useAuthStore();
  const { theme } = useThemeStore();
  console.log({ onlineUsers });
  // Run auth check on app load
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Wait until auth check is complete
  if (isCheckingAuth) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );
  }

  return (
    <div data-theme={theme}>
      {" "}
      <Router>
        <Navbar />
        <div>
          <Routes>
            <Route
              path="/"
              element={authUser ? <HomePage /> : <Navigate to="/login" />}
            />
            <Route
              path="/signup"
              element={!authUser ? <SignUpPage /> : <Navigate to="/" />}
            />
            <Route
              path="/login"
              element={!authUser ? <LoginPage /> : <Navigate to="/" />}
            />
            <Route
              path="/settings"
              element={authUser ? <SettingPage /> : <Navigate to="/login" />}
            />

            <Route
              path="/profile"
              element={authUser ? <ProfilePage /> : <Navigate to="/login" />}
            />
          </Routes>
          <Toaster />
        </div>
      </Router>
    </div>
  );
};

export default App;
