import React from 'react';
import LoginForm from '../components/loginForm.jsx';
import '../../public/styles/homepage.css';

export const Homepage = () => {
  return (
    <div className="homepage-container">
      <div className="login-card">
        <h1>Gestor de Citas</h1>
        <p>Ingresa tu correo y contraseña para acceder</p>
        <LoginForm />
      </div>
    </div>
  );
}

export default Homepage;
