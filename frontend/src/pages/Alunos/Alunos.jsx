import React, { useState, useEffect } from 'react';
import Modal from '../../components/Modal/Modal';
import PageHeader from '../../components/PageHeader/PageHeader';
import DataTable from '../../components/DataTable/DataTable';
import '../Professores/Professores.css';

export default function Alunos() {
  const [alunos, setAlunos] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Estados do formulário
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [cpf, setCpf] = useState('');
  const [idade, setIdade] = useState('');
  
  const [disciplinas, setDisciplinas] = useState([]);
  
  const [mensagem, setMensagem] = useState({ texto: '', tipo: '' });

  const API_URL = 'http://localhost:5195/api/Aluno';
  const DISC_API_URL = 'http://localhost:5195/api/Disciplina';

  useEffect(() => {
    carregarAlunos();
    carregarDisciplinas();
  }, []);

  const carregarDisciplinas = async () => {
    try {
      const response = await fetch(DISC_API_URL);
      if (response.ok) {
        const data = await response.json();
        setDisciplinas(data.map(d => ({ value: d.id, label: d.nome })));
      }
    } catch (error) {
      console.error('Erro ao buscar disciplinas:', error);
    }
  };

  const handleFilterChange = async (disciplinaId) => {
    if (!disciplinaId) {
      carregarAlunos();
      return;
    }
    try {
      const response = await fetch(`${API_URL}/disciplina/${disciplinaId}`);
      if (response.ok) {
        const data = await response.json();
        setAlunos(data);
      } else {
        setAlunos([]);
      }
    } catch (error) {
      console.error('Erro ao filtrar por disciplina:', error);
    }
  };

  const carregarAlunos = async () => {
    try {
      const response = await fetch(API_URL);
      if (response.ok) {
        const data = await response.json();
        setAlunos(data);
      }
    } catch (error) {
      console.error('Erro ao buscar alunos:', error);
    }
  };

  const handleSearch = async (searchValue) => {
    if (!searchValue.trim()) {
      carregarAlunos();
      return;
    }
    try {
      const response = await fetch(`${API_URL}/${searchValue}`);
      if (response.ok) {
        const data = await response.json();
        setAlunos([data]);
      } else {
        setAlunos([]);
      }
    } catch (error) {
      console.error('Erro na pesquisa:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensagem({ texto: '', tipo: '' });

    const novoAluno = {
      nome: nome,
      email: email,
      cpf: cpf,
      idade: Number(idade) // Conversão explícita para número, conforme restrições
    };

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(novoAluno)
      });

      if (response.ok) {
        setNome('');
        setEmail('');
        setCpf('');
        setIdade('');
        setIsModalOpen(false);
        carregarAlunos();
      } else {
        const erroMsg = await response.text();
        setMensagem({ texto: `Erro: ${erroMsg}`, tipo: 'error' });
      }
    } catch (error) {
      console.error('Erro no POST:', error);
      setMensagem({ texto: 'Erro de conexão.', tipo: 'error' });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Tem certeza que deseja excluir?')) return;
    try {
      const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      if (response.ok) {
        carregarAlunos();
      } else {
        alert('Erro ao excluir registro.');
      }
    } catch (error) {
      console.error('Erro no DELETE:', error);
    }
  };

  const columns = [
    { header: 'ID', key: 'id' },
    { header: 'Nome', key: 'nome' },
    { header: 'CPF', key: 'cpf' },
    { header: 'E-mail', key: 'email' },
    { header: 'Idade', key: 'idade' }
  ];

  return (
    <div className="page-container">
      <PageHeader 
        title="Alunos" 
        buttonText="Aluno(a)" 
        onAddClick={() => setIsModalOpen(true)} 
        onSearch={handleSearch}
        showFilter={true}
        filterOptions={disciplinas}
        onFilterChange={handleFilterChange}
      />

      <DataTable columns={columns} data={alunos} onDelete={handleDelete} />

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Adicionar aluno(a):">
        {mensagem.texto && (
          <div className={`form-msg ${mensagem.tipo}`}>{mensagem.texto}</div>
        )}
        <form onSubmit={handleSubmit} className="professor-form">
          <div className="form-row">
            <div className="form-group">
              <label>Nome Completo:</label>
              <input 
                type="text" 
                value={nome} 
                onChange={(e) => setNome(e.target.value)} 
                required 
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>E-mail:</label>
              <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
              />
            </div>
          </div>
          <div className="form-row split">
            <div className="form-group">
              <label>CPF:</label>
              <input 
                type="text" 
                value={cpf} 
                onChange={(e) => setCpf(e.target.value)} 
                required 
              />
            </div>
            <div className="form-group">
              <label>Idade:</label>
              <input 
                type="number" 
                value={idade} 
                onChange={(e) => setIdade(e.target.value)} 
                required 
              />
            </div>
          </div>
          <div className="form-actions">
            <button type="submit" className="btn-submit">Enviar</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
