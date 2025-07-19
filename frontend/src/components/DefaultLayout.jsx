import { Navigate, Outlet, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import axiosClient from "../api/axios.js";
import { useEffect } from "react";

export default function DefaultLayout() {
  const { user, token, setUser, setToken } = useAuth();

  if (!token) {
    return <Navigate to="/login" />;
  }

  useEffect(() => {
    if (!user.id) {
        axiosClient.get('/user')
            .then(({data}) => {
                setUser(data);
            })
            .catch(err => {
                console.error(err);
            });
    }
  }, []);

  const onLogout = (ev) => {
    ev.preventDefault();
    axiosClient.post('/logout')
      .then(() => {
        setUser({});
        setToken(null);
      });
  };

  return (
    <div id="defaultLayout">
      <aside>
        <Link to="/dashboard">Home</Link>
        
        {/* --- MENU UNTUK ADMIN --- */}
        {user.role === 'admin' && (
          <>
            <Link to="/cars">Manajemen Mobil</Link>
            <Link to="/users">Manajemen Customer</Link>
            <Link to="/transactions">Manajemen Transaksi</Link>
          </>
        )}

        {/* --- MENU UNTUK CUSTOMER --- */}
        {user.role === 'customer' && (
          <>
            <Link to="/my-transactions">Riwayat Transaksi</Link>
            <Link to="/profile">Profil Saya</Link>
          </>
        )}
      </aside>
      <div className="content">
        <header>
          <div>Rental Mobil App</div>
          <div>
            {user.username}
            <a onClick={onLogout} className="btn-logout" href="#">
              Logout
            </a>
          </div>
        </header>
        <main>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
