import { createContext, useContext, useState, useEffect } from "react";
import { checkSessionAPI } from "../api/auth";
import * as SecureStore from "expo-secure-store";

export const AuthContext = createContext(null);

export const AuthContextProvider = ({ children }) => {
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    const response = await checkSessionAPI();

    if (!response.success) {
      /* Hubo un token que fue rechazado... */
      await SecureStore.deleteItemAsync("token");
      setIsAuth(false);
    }

    if (response.success) {
      setIsAuth(response.data.auth);
    }
  };

  const value = { isAuth, setIsAuth };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => useContext(AuthContext);
