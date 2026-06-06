import React, { useState, useEffect } from 'react';
import Modal from '../../components/Modal/Modal';
import PageHeader from '../../components/PageHeader/PageHeader';
import DataTable from '../../components/DataTable/DataTable';

// Podemos reaproveitar o CSS de Professores se for apenas o formulário,
// mas para mantermos a modularidade, usaremos classes genéricas no JSX
// ou criaremos um Disciplinas.css se necessário. Vamos reutilizar o CSS base que migramos.
import '../Professores/Professores.css'; 

export default function Disciplinas() {
  const [disciplinas, setDisciplinas] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDisciplina, setEditingDisciplina] = useState(null);
  
  // Estados do formulário
  const [nome, setNome] = useState('');
  const [cargaHoraria, setCargaHoraria] = useState('');
  const [nivel, setNivel] = useState('');
  const [professorId, setProfessorId] = useState('');
  
  const [mensagem, setMensagem] = useState({ texto: '', tipo: '' });

  const API_URL = 'http://localhost:5195/api/Disciplina';

  useEffect(() => {
    carregarDisciplinas();
  }, []);

  const getHeaders = (hasBody = false) => {
    const token = localStorage.getItem('token');
    const headers = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    if (hasBody) {
      headers['Content-Type'] = 'application/json';
    }
    return headers;
  };

  const carregarDisciplinas = async () => {
    try {
      const response = await fetch(API_URL, { headers: getHeaders() });
      if (response.ok) {
        const data = await response.json();
        setDisciplinas(data);
      }
    } catch (error) {
      console.error('Erro ao buscar disciplinas:', error);
    }
  };

  const handleSearch = async (searchValue) => {
    if (!searchValue.trim()) {
      carregarDisciplinas();
      return;
    }
    try {
      const response = await fetch(`${API_URL}/${searchValue}`, { headers: getHeaders() });
      if (response.ok) {
        const data = await response.json();
        setDisciplinas([data]);
      } else {
        setDisciplinas([]);
      }
    } catch (error) {
      console.error('Erro na pesquisa:', error);
    }
  };

  const handleEditClick = (disciplina) => {
    setEditingDisciplina(disciplina);
    setNome(disciplina.nome);
    setCargaHoraria(disciplina.cargaHoraria.toString());
    setNivel(disciplina.nivel);
    setProfessorId(disciplina.professorId.toString());
    setMensagem({ texto: '', tipo: '' });
    setIsModalOpen(true);
  };

  const handleClose = () => {
    setIsModalOpen(false);
    setEditingDisciplina(null);
    setNome('');
    setCargaHoraria('');
    setNivel('');
    setProfessorId('');
    setMensagem({ texto: '', tipo: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensagem({ texto: '', tipo: '' });

    const disciplinaData = {
      nome: nome,
      cargaHoraria: Number(cargaHoraria),
      nivel: nivel,
      professorId: Number(professorId)
    };

    if (editingDisciplina) {
      disciplinaData.id = editingDisciplina.id;
    }

    try {
      const url = editingDisciplina ? `${API_URL}/${editingDisciplina.id}` : API_URL;
      const method = editingDisciplina ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method: method,
        headers: getHeaders(true),
        body: JSON.stringify(disciplinaData)
      });

      if (response.ok) {
        handleClose();
        carregarDisciplinas();
      } else {
        const erroMsg = await response.text();
        setMensagem({ texto: `Erro: ${erroMsg}`, tipo: 'error' });
      }
    } catch (error) {
      console.error('Erro ao salvar disciplina:', error);
      setMensagem({ texto: 'Erro de conexão.', tipo: 'error' });
    }
  };

  // Preparar os dados para a tabela, transformando o objeto do backend no formato de exibição
  const disciplinasFormatadas = disciplinas.map(d => ({
    ...d,
    // O Figma pede "Docente". Se a API trouxer os dados populados do Professor, usamos o nome. 
    // Caso contrário mostramos o ID para controle.
    docente: d.professor && d.professor.nome ? d.professor.nome : d.professorId
  }));

  const handleDelete = async (id) => {
    if (!window.confirm('Tem certeza que deseja excluir?')) return;
    try {
      const response = await fetch(`${API_URL}/${id}`, { 
        method: 'DELETE',
        headers: getHeaders()
      });
      if (response.ok) {
        carregarDisciplinas();
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
    { header: 'Carga Horária', key: 'cargaHoraria' },
    { header: 'Nível', key: 'nivel' },
    { header: 'Docente (Resp.)', key: 'docente' }
  ];

  return (
    <div className="page-container">
      <PageHeader 
        title="Disciplinas" 
        buttonText="Disciplina" 
        onAddClick={() => setIsModalOpen(true)} 
        onSearch={handleSearch}
      />

      <DataTable columns={columns} data={disciplinasFormatadas} onEdit={handleEditClick} onDelete={handleDelete} />

      <Modal isOpen={isModalOpen} onClose={handleClose} title={editingDisciplina ? "Editar disciplina:" : "Adicionar disciplina:"}>
        {mensagem.texto && (
          <div className={`form-msg ${mensagem.tipo}`}>{mensagem.texto}</div>
        )}
        <form onSubmit={handleSubmit} className="professor-form">
          <div className="form-row">
            <div className="form-group">
              <label>Nome da Disciplina:</label>
              <input 
                type="text" 
                value={nome} 
                onChange={(e) => setNome(e.target.value)} 
                required 
              />
            </div>
          </div>
          <div className="form-row split">
            <div className="form-group">
              <label>Carga Horária:</label>
              <input 
                type="number" 
                value={cargaHoraria} 
                onChange={(e) => setCargaHoraria(e.target.value)} 
                required 
              />
            </div>
            <div className="form-group">
              <label>Nível:</label>
              <input 
                type="text" 
                placeholder="Ex: Avançado"
                value={nivel} 
                onChange={(e) => setNivel(e.target.value)} 
                required 
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>ID do Professor (Docente):</label>
              <input 
                type="number" 
                value={professorId} 
                onChange={(e) => setProfessorId(e.target.value)} 
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
