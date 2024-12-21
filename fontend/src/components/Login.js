import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../components/Login.css';

const Login = () => {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await fetch('http://192.168.6.180:4200/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          password,
        }),
        credentials: 'include', // Include cookies for backend session handling
      });

      const data = await response.json();

      if (response.ok) {
        // Store user data in local storage
        localStorage.setItem(
          'userData',
          JSON.stringify({
            name: data.name,
            userId: data.userId, // Assuming backend sends `userId`
            walletBalance: data.walletBalance, // Storing wallet balance
          })
        );
        navigate('/home'); // Redirect to home page
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      console.error('Error:', err);
      setError('An error occurred during login');
    }
  };

  return (
    <div className="loginPage">
      <div className="loginContainer">
        <h2 className="title">Login</h2>
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Enter your name"
        />
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="Enter your password"
        />
        {error && <p className="error">{error}</p>}
        <button onClick={handleLogin}>Log in</button>
        <Link to="/change-password" className="signupLink">
          Forgot password? Change it here
        </Link>
        <Link to="/" className="signupLink">
          Don't have an account? Sign up here
        </Link>
      </div>
    </div>
  );
};

export default Login;
