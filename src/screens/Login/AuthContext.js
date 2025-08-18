// AuthContext.js
import React, { createContext, useState, useContext } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [confirmation, setConfirmation] = useState(null);
const [user, setUser] = useState(null); // guarda el usuario logueado


  return (
    <AuthContext.Provider value={{ confirmation, setConfirmation, user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);