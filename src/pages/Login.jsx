import React from 'react';
import './login.css';
function Login() {
  const handleLogin = () => {
    window.location.href = "http://localhost:5000/api/auth/google";
  };

  return (
  <div style={{
      textAlign: 'center',
      padding: '60px',
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      borderRadius: '12px',
      animation: 'fadeIn 1s ease-out'
    }}>
      <h1 style={{ marginBottom: '20px' }}>Login with Google</h1>
      <button onClick={handleLogin}>Sign in with Google</button>
    </div>
  );
}

export default Login;