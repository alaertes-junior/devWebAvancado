import React, { useState } from 'react';
import './Login.css';
import logoImg from '../../assets/positivo_univer_bi_pos_cmyk-1024x315.png';

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('http://localhost:5195/api/Auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, senha }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify({ nome: data.nome, role: data.role }));
        onLogin();
      } else {
        const errorData = await response.text();
        setError(errorData || 'Erro ao realizar login');
      }
    } catch (err) {
      setError('Erro de conexão com o servidor');
      console.error(err);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-logo-container">
          <img src={logoImg} alt="Universidade Positivo" className="login-logo" />
        </div>
        <form onSubmit={handleSubmit} className="login-form">
          {error && <div className="login-error" style={{ color: 'red', marginBottom: '10px', textAlign: 'center' }}>{error}</div>}
          <div className="login-group">
            <label>E-mail</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
