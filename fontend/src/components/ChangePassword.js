import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import './ChangePassword.css';

const ChangePassword = () => {
  const [name, setName] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChangePassword = async e => {
    e.preventDefault();
    try {
      //10.1.28.179    //192.168.6.180
      const response = await fetch(
        'http://192.168.6.180:4200/change-password',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name,
            newPassword,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message || 'Password changed successfully!');
        // Redirect to login page after successful password change
        navigate('/');
      } else {
        setMessage(data.message || 'Failed to change password');
      }
    } catch (err) {
      console.error('Error:', err);
      setMessage('An error occurred while changing the password');
    }
  };

  return (
    <div>
      <h2>Change Password</h2>
      <form onSubmit={handleChangePassword}>
        <input
          type="text"
          placeholder="Enter your name"
          value={name}
          onChange={e => setName(e.target.value)}
        />
        <input
          type="password"
          placeholder="Enter your new password"
          value={newPassword}
          onChange={e => setNewPassword(e.target.value)}
        />
        <button type="submit">Change Password</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default ChangePassword;
