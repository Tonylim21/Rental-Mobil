import { useRef, useState } from "react";
import axiosClient from "../api/axios.js";
import { useAuth } from "../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const usernameRef = useRef();
  const passwordRef = useRef();
  const [errors, setErrors] = useState(null);
  const { setUser, setToken } = useAuth();
  const navigate = useNavigate();

  const onSubmit = (ev) => {
    ev.preventDefault();
    setErrors(null);

    const payload = {
      // Pastikan key ini (username/email) sesuai dengan yang diharapkan backend
      username: usernameRef.current.value,
      password: passwordRef.current.value,
    };

    axiosClient.post('/login', payload)
      .then(({ data }) => {
        // Jika login sukses, simpan data user dan token
        setUser(data.user);
        setToken(data.access_token);
        navigate('/dashboard'); // Arahkan ke dashboard
      })
      .catch((err) => {
        const response = err.response;
        // Tangani error validasi dari Laravel (422) atau error kredensial (401)
        if (response && (response.status === 422 || response.status === 401)) {
          setErrors(response.data.message || response.data.errors);
        }
      });
  };

  return (
    <div className="login-signup-form animated fadeInDown">
      <div className="form">
        <form onSubmit={onSubmit}>
          <h1 className="title">Login ke Akun Anda</h1>

          {errors && (
            <div className="alert">
              <p>{typeof errors === "string" ? errors : Object.values(errors).join(' ')}</p>
            </div>
          )}

          <input ref={usernameRef} type="text" placeholder="Username" />
          <input ref={passwordRef} type="password" placeholder="Password" />
          <button className="btn btn-block">Login</button>
        </form>
      </div>
    </div>
  );
}
