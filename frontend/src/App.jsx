import React, { useState } from "react";
import MainLayout from "./layouts/MainLayout";
import Login from "./pages/Login/Login";
import Professores from "./pages/Professores/Professores";
import Disciplinas from "./pages/Disciplinas/Disciplinas";
import Alunos from "./pages/Alunos/Alunos";
import Notas from "./pages/Notas/Notas";
import Frequencia from "./pages/Frequencia/Frequencia";
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activePage, setActivePage] = useState('Professores');

  if (!isAuthenticated) {
    return <Login onLogin={() => setIsAuthenticated(true)} />;
  }

  return (
    <MainLayout activePage={activePage} setActivePage={setActivePage} onLogout={() => setIsAuthenticated(false)}>
      {activePage === 'Professores' && <Professores />}
      {activePage === 'Disciplinas' && <Disciplinas />}
      {activePage === 'Alunos' && <Alunos />}
      {activePage === 'Notas' && <Notas />}
      {activePage === 'Frequência' && <Frequencia />}
    </MainLayout>
  )
}

export default App;
