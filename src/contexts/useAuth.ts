
import { useState, useEffect } from "react";
import { User } from "./types";
import { LOCAL_STORAGE_USER_KEY } from "./constants";

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  
  // Load user from localStorage on initial load
  useEffect(() => {
    const storedUser = localStorage.getItem(LOCAL_STORAGE_USER_KEY);
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);
  
  // Save user to localStorage whenever it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(LOCAL_STORAGE_USER_KEY);
    }
  }, [user]);
  
  return {
    user,
    setUser,
    isSignedIn: !!user
  };
};
