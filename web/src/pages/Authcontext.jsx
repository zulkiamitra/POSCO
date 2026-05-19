import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const login = (role, email) => {
    const userData = {
      admin: { id: 1, name: "Dr. Ahmad Fauzi", email: "admin@posco.id", role: "admin", wilayah: "Kota Padang" },
      kader: { id: 2, name: "Siti Rahayu", email: "siti@posco.id", role: "kader", wilayah: "Kecamatan Koto Tangah", posyandu: "Posyandu Melati" },
      orangtua: { id: 4, name: "Budi Santoso", email: "budi@posco.id", role: "orangtua", wilayah: "Kecamatan Koto Tangah" },
    };
    setUser(userData[role]);
    return true;
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);