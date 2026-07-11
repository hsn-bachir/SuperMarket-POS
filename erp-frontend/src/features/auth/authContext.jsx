import { createContext, useContext, useEffect, useState } from "react";
import { getAccessToken, clearTokens } from "./authStorage";
import { getMe } from "./api/authApi";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadUser = async () => {
    try {
      const token = getAccessToken();

      if (!token) {
        setUser(null);
        return null;
      }

      const res = await getMe();

      setUser(res.data);

      return res.data; // return user
    } catch (err) {
      clearTokens();
      setUser(null);
      return null;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  // 🔥 ADD THIS
  const reloadUser = async () => {
    return await loadUser();
  };

  const logout = () => {
    clearTokens();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        logout,
        loading,
        reloadUser, // 🔥 IMPORTANT
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
