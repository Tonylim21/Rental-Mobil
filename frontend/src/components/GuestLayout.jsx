import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function GuestLayout() {
  const { token } = useAuth();

  // Jika user sudah login (punya token), jangan biarkan dia ke halaman login.
  // Arahkan langsung ke dashboard.
  if (token) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <div>
      {/* Outlet akan merender komponen anak (dalam kasus ini, halaman Login) */}
      <Outlet />
    </div>
  );
}
