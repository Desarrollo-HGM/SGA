// src/context/AuthContext.tsx
import { createContext, useState, useEffect } from "react";
import { login as loginService, validateToken } from "../services/auth";

export const AuthContext = createContext<any>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    if (savedToken) {
      validateToken()
        .then((res) => {
          if (res.valid) {
            setToken(savedToken);
            if (savedUser) setUser(JSON.parse(savedUser));
          } else {
            logout();
          }
        })
        .catch(() => logout());
    }
  }, []);

  const login = async (username: string, password: string) => {
    const { token, user } = await loginService(username, password);
    setUser(user);
    setToken(token);
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    return { user, token };
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
