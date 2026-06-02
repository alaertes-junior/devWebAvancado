import React, { useState } from 'react';
import './Login.css';
import logoImg from '../../assets/positivo_univer_bi_pos_cmyk-1024x315.png';

export default function Login({ onLogin }) {
  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate login for now
    onLogin();
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-logo-container">
          <img src={logoImg} alt="Universidade Positivo" className="login-logo" />
        </div>
        <form onSubmit={handleSubmit} className="login-form">
          <div className="login-group">
            <label>Usuário</label>
            <input 
              type="text" 
              value={usuario} 
              onChange={(e) => setUsuario(e.target.value)} 
              required 
            />
          </div>
          <div className="login-group">
            <label>Senha</label>
            <input 
              type="password" 
              value={senha} 
              onChange={(e) => setSenha(e.target.value)} 
              required 
            />
          </div>
          <button type="submit" className="login-btn">Entrar</button>
        </form>
      </div>
    </div>
  );
}
