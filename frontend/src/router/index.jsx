import {createBrowserRouter, Navigate} from "react-router-dom";
import Login from "../pages/Login.jsx";
import GuestLayout from "../components/GuestLayout.jsx";
import DefaultLayout from "../components/DefaultLayout.jsx";
import Dashboard from "../pages/Dashboard.jsx"; 
import CarManagement from "../pages/CarManagement.jsx";
import UserManagement from "../pages/UserManagement.jsx";
import TransactionManagement from "../pages/TransactionManagement.jsx";
import Profile from "../pages/Profile.jsx";
import MyTransactions from "../pages/MyTransaction.jsx";

// Komponen placeholder untuk halaman lain
const Cars = () => <div>Halaman Manajemen Mobil</div>;
const Users = () => <div>Halaman Manajemen Customer</div>;

const router = createBrowserRouter([
  // Rute untuk user yang sudah login
  {
    path: '/',
    element: <DefaultLayout />,
    children: [
      {
        path: '/',
        element: <Navigate to="/dashboard" />
      },
      {
        path: '/dashboard',
        element: <Dashboard /> 
      },
      // Admin Route
      {
        path: '/cars',
        element: <CarManagement />
      },
      {
        path: '/users',
        element: <UserManagement />
      },
      {
        path: '/transactions',
        element: <TransactionManagement />
      },
      // Customer Route
      {
        path: '/profile',
        element: <Profile />
      },
      {
        path: '/my-transactions',
        element: <MyTransactions />
      }
    ]
  },

  // Rute untuk user tamu (belum login)
  {
    path: '/',
    element: <GuestLayout />,
    children: [
      {
        path: '/login',
        element: <Login />
      }
    ]
  }
]);

export default router;