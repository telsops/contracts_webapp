import React from 'react';
import type { User, Admin, Estate } from '../types';

interface AuthContextType {
  user: User | null;
  admin: Admin | null;
  loginUser: (user: User, estate: Estate) => void;
  loginAdmin: (admin: Admin) => void;
  logout: () => void;
}

export const AuthContext = React.createContext<AuthContextType>({
  user: null,
  admin: null,
  loginUser: () => {},
  loginAdmin: () => {},
  logout: () => {},
});