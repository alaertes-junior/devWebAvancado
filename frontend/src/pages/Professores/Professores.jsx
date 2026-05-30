import React, { useState, useEffect } from 'react';
import Modal from '../../components/Modal/Modal';
import PageHeader from '../../components/PageHeader/PageHeader';
import DataTable from '../../components/DataTable/DataTable';
import './Professores.css';

export default function Professores() {
  const [professores, setProfessores] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Estados do formulário
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [cpf, setCpf] = useState('');
  const [departamento, setDepartamento] = useState('');
  
  const [mensagem, setMensagem] = useState({ texto: '', tipo: '' });

  const API_URL = 'http://localhost:5195/api/Professor';

  useEffect(() => {
    carregarProfessores();
  }, []);

  const carregarProfessores = async () => {
    try {
      const response = await fetch(API_URL);
      if (response.ok) {
        const data = await response.json();
        setProfessores(data);
      }
    } catch (error) {
      console.error('Erro ao buscar professores:', error);
    }
  };

  // Função para lidar com a pesquisa vinda do PageHeader
  const handleSearch = async (searchValue) => {
    // Se a busca estiver vazia, carrega todos
    if (!searchValue.trim()) {
      carregarProfessores();
      return;
    }

    try {
      // Como o campo diz "Pesquisa por ID", fazemos GET específico
      const response = await fetch(`${API_URL}/${searchValue}`);
      if (response.ok) {
        const data = await response.json();
        // A API retorna um objeto único para GetById, então envelopamos em um array para a tabela
        setProfessores([data]);
      } else {
        // Se não encontrar, limpa a tabela
        setProfessores([]);
      }
    } catch (error) {
      console.error('Erro na pesquisa:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensagem({ texto: '', tipo: '' });

    const novoProfessor = {
      nome: nome,
      email: email,
      cpf: cpf,
      departamento: departamento
    };

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(novoProfessor)
      });

      if (response.ok) {
        setNome('');
        setEmail('');
        setCpf('');
        setDepartamento('');
        setIsModalOpen(false);
        carregarProfessores();
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
        carregarProfessores();
      } else {
        alert('Erro ao excluir registro.');
      }
    } catch (error) {
      console.error('Erro no DELETE:', error);
    }
  };

  // Configuração das colunas para passar ao DataTable global
  const columns = [
    { header: 'ID', key: 'id' },
    { header: 'Nome', key: 'nome' },
    { header: 'CPF', key: 'cpf' },
    { header: 'E-mail', key: 'email' },
    { header: 'Departamento', key: 'departamento' }
  ];

  return (
    <div className="page-container">
      {/* Componente Global de Cabeçalho */}
      <PageHeader 
        title="Professores" 
        buttonText="Professor(a)" 
        onAddClick={() => setIsModalOpen(true)} 
        onSearch={handleSearch}
      />

      {/* Componente Global de Tabela */}
      <DataTable columns={columns} data={professores} onDelete={handleDelete} />

      {/* Componente Global de Modal (mantido o conteúdo local do form) */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Adicionar professor:">
        {mensagem.texto && (
          <div className={`form-msg ${mensagem.tipo}`}>{mensagem.texto}</div>
        )}
        <form onSubmit={handleSubmit} className="professor-form">
          <div className="form-row">
            <div className="form-group">
              <label>Nome:</label>
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
              <label>Departamento:</label>
              <input 
                type="text" 
                value={departamento} 
                onChange={(e) => setDepartamento(e.target.value)} 
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
