import { ROUTES } from "@/utils/constants";
import React, { createContext, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const user = JSON.parse(sessionStorage.getItem("user")) || null;
  const login = (userData) => {
    window.sessionStorage.setItem("user", JSON.stringify(userData));
  };

  const logout = () => {
    navigate(`${ROUTES.ADMIN}${ROUTES.LOGIN}`);
    window.sessionStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
