import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

// Decode JWT payload without a library (browser-safe)
const decodeToken = (token) => {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch {
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [initializing, setInitializing] = useState(true);

  const API_BASE_URL = "http://localhost:3000/api/users";

  // Restore user from stored token on app load (no /me endpoint needed)
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      const decoded = decodeToken(storedToken);
      if (decoded) {
        axios.defaults.headers.common["Authorization"] =
          `Bearer ${storedToken}`;
        setUser({
          firstName: decoded.firstName,
          lastName: decoded.lastName,
          email: decoded.email,
          role: decoded.role,
        });
      } else {
        localStorage.removeItem("token");
      }
    }
    setInitializing(false);
  }, []);

  // Keep axios header in sync with token
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      localStorage.setItem("token", token);
    } else {
      delete axios.defaults.headers.common["Authorization"];
      localStorage.removeItem("token");
    }
  }, [token]);

  const register = async (userData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(`${API_BASE_URL}`, userData);
      setToken(response.data.token);
      setUser(response.data.user);
      return response.data;
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Registration failed";
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(`${API_BASE_URL}/login`, {
        email,
        password,
      });
      setToken(response.data.token);
      setUser(response.data.user);
      return response.data;
    } catch (err) {
      const message = err.response?.data?.message || "Login failed";
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setError(null);
  };

  const value = {
    user,
    token,
    loading,
    error,
    initializing,
    register,
    login,
    logout,
    isAuthenticated: !!token,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
