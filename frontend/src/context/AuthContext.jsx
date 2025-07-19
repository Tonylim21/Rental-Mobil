import { createContext, useContext, useState } from "react";

// Membuat Context
const AuthContext = createContext({
  user: null,
  token: null,
  setUser: () => {},
  setToken: () => {},
});

// Membuat komponen Provider
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState({});
  
  // Ambil token dari localStorage saat pertama kali load
  const [token, _setToken] = useState(localStorage.getItem('ACCESS_TOKEN'));

  // Fungsi khusus untuk mengatur token
  const setToken = (newToken) => {
    _setToken(newToken);
    if (newToken) {
      // Simpan token ke localStorage
      localStorage.setItem('ACCESS_TOKEN', newToken);
    } else {
      // Hapus token dari localStorage
      localStorage.removeItem('ACCESS_TOKEN');
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      setUser,
      setToken,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook untuk mempermudah penggunaan context
export const useAuth = () => {
  return useContext(AuthContext);
};
