import React, { createContext, useContext, useState } from 'react';

type AuthMode = "login" | "signup";

interface AuthContextType {
  authMode: AuthMode;
  setAuthMode: React.Dispatch<React.SetStateAction<AuthMode>>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);


export const AuthModeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authMode, setAuthMode] = useState<AuthMode>("login");

  return (
    <AuthContext.Provider value={{ authMode, setAuthMode }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthMode = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthMode must be used within a AuthModeProvider');
  }
  return context;
};
