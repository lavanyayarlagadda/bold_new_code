import React, { createContext, useContext, useState, useEffect } from "react";
import { useLoginMutation } from "../redux/services/authApi";
import { User } from "../types";

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // RTK Query login mutation
  const [loginApi] = useLoginMutation();

  // Load saved session
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Call backend login API
      const response = await loginApi({ email, password }).unwrap();
  
      const userData: User = {
        userId: response.loggedUserId,
        email: email,
        name: response.fullName,
        roleId: response.roleId,
        clientId: response.clientId,
        avatar: "",
        isOnboarded: true,
      };

      // Save JWT token
      localStorage.setItem("token", response.token);

      // Store user session
      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);

      setIsLoading(false);
      return true;
    } catch (err) {
      console.error("Login failed:", err);
      setIsLoading(false);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updated = { ...user, ...userData };
      setUser(updated);
      localStorage.setItem("user", JSON.stringify(updated));
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, login, logout, isLoading, updateUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
