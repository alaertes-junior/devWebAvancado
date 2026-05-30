import React, { useState } from "react";
import MainLayout from "./layouts/MainLayout";
import Professores from "./pages/Professores/Professores";
import Disciplinas from "./pages/Disciplinas/Disciplinas";
import Alunos from "./pages/Alunos/Alunos";
import Notas from "./pages/Notas/Notas";
import Frequencia from "./pages/Frequencia/Frequencia";
import './App.css';

function App() {
  const [activePage, setActivePage] = useState('Professores');

  return (
    <MainLayout activePage={activePage} setActivePage={setActivePage}>
      {activePage === 'Professores' && <Professores />}
      {activePage === 'Disciplinas' && <Disciplinas />}
      {activePage === 'Alunos' && <Alunos />}
      {activePage === 'Notas' && <Notas />}
      {activePage === 'Frequência' && <Frequencia />}
    </MainLayout>
  )
}

export default App;
