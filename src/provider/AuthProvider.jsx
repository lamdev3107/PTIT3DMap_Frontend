import { ROUTES } from "@/utils/constants";
import React, { createContext, useContext } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user")) || {};
  const login = (userData) => {
    window.localStorage.setItem("user", JSON.stringify(userData));
  };

  const logout = () => {
    navigate(ROUTES.LOGIN);
    window.localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
