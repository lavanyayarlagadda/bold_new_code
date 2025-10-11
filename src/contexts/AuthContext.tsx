import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

// Mock users for demo
const mockUsers: User[] = [
  {
    id: '1',
    email: 'admin@company.com',
    name: 'Sarah Johnson',
    role: 'admin',
    organizationId: 'org-1',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?w=150',
    isOnboarded: true,
  },
  {
    id: '2',
    email: 'staff@company.com',
    name: 'Michael Chen',
    role: 'staff',
    organizationId: 'org-1',
    avatar: 'https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?w=150',
    isOnboarded: true,
  },
  {
    id: '3',
    email: 'partner@company.com',
    name: 'Emma Williams',
    role: 'partner',
    organizationId: 'org-1',
    avatar: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?w=150',
    isOnboarded: true,
  },
  {
    id: '4',
    email: 'client@company.com',
    name: 'Robert Davis',
    role: 'client',
    organizationId: 'org-1',
    avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?w=150',
    isOnboarded: true,
  },
];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Mock authentication
    const foundUser = mockUsers.find(u => u.email === email);
    
    if (foundUser && password === 'password') {
      setUser(foundUser);
      localStorage.setItem('user', JSON.stringify(foundUser));
      setIsLoading(false);
      return true;
    }
    
    setIsLoading(false);
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}