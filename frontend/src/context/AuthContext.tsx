import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import type { IUser } from '../types/types';

interface AuthContextProps {
  currentUser: IUser | null;
  login: (user: IUser) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<IUser | null>(null);

  const login = (user: IUser) => setCurrentUser(user);
  const logout = () => setCurrentUser(null);

  return (
    <AuthContext.Provider value={{ currentUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};