import React, { useState, useEffect } from 'react';
import Modal from '../../components/Modal/Modal';
import PageHeader from '../../components/PageHeader/PageHeader';
import './Frequencia.css';

const FrequenciaSummary = ({ alunoId, disciplinaId, apiUrl }) => {
  const [resumo, setResumo] = useState(null);
  
  useEffect(() => {
    const fetchResumo = async () => {
      try {
        const response = await fetch(`${apiUrl}/faltas/${alunoId}/${disciplinaId}`);
        if (response.ok) {
          const data = await response.json();
          setResumo(data);
        } else {
          setResumo(null);
        }
      } catch (e) {
        console.error(e);
        setResumo(null);
      }
    };
    if (alunoId && disciplinaId) {
      fetchResumo();
    } else {
      setResumo(null);
    }
  }, [alunoId, disciplinaId, apiUrl]);

  if (!resumo) return null;

  return (
    <div className="summary-box">
      <strong>Faltas:</strong> {resumo.percentualFaltas}%
      <span className={`summary-status ${!resumo.alertaReprovacao ? 'aprovado' : 'reprovado'}`}>
        {' - ' + resumo.mensagem}
      </span>
    </div>
  );
};

export default function Frequencia() {
  const [frequencias, setFrequencias] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFrequencia, setEditingFrequencia] = useState(null);
  
  // Estados do formulário
  const [dataAula, setDataAula] = useState('');
  const [presente, setPresente] = useState('true');
  const [alunoId, setAlunoId] = useState('');
  const [disciplinaId, setDisciplinaId] = useState('');
  
  const [disciplinas, setDisciplinas] = useState([]);
  const [disciplinaSelecionada, setDisciplinaSelecionada] = useState('');
  
  const [mensagem, setMensagem] = useState({ texto: '', tipo: '' });

  const API_URL = 'http://localhost:5195/api/Presenca';
  const DISC_API_URL = 'http://localhost:5195/api/Disciplina';

  useEffect(() => {
    carregarFrequencias();
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
    setDisciplinaSelecionada(disciplinaId);
    setFrequencias([]); // Clears old frequencias instantly to avoid race-condition summary calls while fetching
    if (!disciplinaId) {
      carregarFrequencias();
      return;
    }
    try {
      const response = await fetch(`${API_URL}/disciplina/${disciplinaId}`);
      if (response.ok) {
        const data = await response.json();
        setFrequencias(data);
      } else {
        setFrequencias([]);
      }
    } catch (error) {
      console.error('Erro ao filtrar por disciplina:', error);
    }
  };

  const carregarFrequencias = async () => {
    try {
      const response = await fetch(API_URL);
      if (response.ok) {
        const data = await response.json();
        setFrequencias(data);
      }
    } catch (error) {
      console.error('Erro ao buscar frequências:', error);
    }
  };

  const handleSearch = async (searchValue) => {
    if (!searchValue.trim()) {
      carregarFrequencias();
      return;
    }
    try {
      const response = await fetch(`${API_URL}/${searchValue}`);
      if (response.ok) {
        const data = await response.json();
        setFrequencias([data]);
      } else {
        setFrequencias([]);
      }
    } catch (error) {
      console.error('Erro na pesquisa:', error);
    }
  };

  const handleEditClick = (freq) => {
    setEditingFrequencia(freq);
    const dateObj = new Date(freq.dataAula);
    const formattedDate = dateObj.toISOString().split('T')[0];
    setDataAula(formattedDate);
    setPresente(freq.presente ? 'true' : 'false');
    setAlunoId(freq.alunoId.toString());
    setDisciplinaId(freq.disciplinaId.toString());
    setMensagem({ texto: '', tipo: '' });
    setIsModalOpen(true);
  };

  const handleClose = () => {
    setIsModalOpen(false);
    setEditingFrequencia(null);
    setDataAula('');
    setPresente('true');
    setAlunoId('');
    setDisciplinaId('');
    setMensagem({ texto: '', tipo: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensagem({ texto: '', tipo: '' });

    const presencaData = {
      dataAula: new Date(dataAula).toISOString(),
      presente: presente === 'true',
      alunoId: Number(alunoId),
      disciplinaId: Number(disciplinaId)
    };

    if (editingFrequencia) {
      presencaData.id = editingFrequencia.id;
    }

    try {
      const url = editingFrequencia ? `${API_URL}/${editingFrequencia.id}` : API_URL;
      const method = editingFrequencia ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(presencaData)
      });

      if (response.ok) {
        handleClose();
        carregarFrequencias();
      } else {
        const erroMsg = await response.text();
        setMensagem({ texto: `Erro: ${erroMsg}`, tipo: 'error' });
      }
    } catch (error) {
      console.error('Erro ao salvar presença:', error);
      setMensagem({ texto: 'Erro de conexão.', tipo: 'error' });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Tem certeza que deseja excluir?')) return;
    try {
      const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      if (response.ok) {
        carregarFrequencias();
      } else {
        alert('Erro ao excluir registro.');
      }
    } catch (error) {
      console.error('Erro no DELETE:', error);
    }
  };

  const formatarData = (dataString) => {
    const data = new Date(dataString);
    return data.toLocaleDateString('pt-BR');
  };

  const agruparPorAluno = (lista) => {
    const grupos = {};
    lista.forEach(freq => {
      const id = freq.alunoId;
      if (!grupos[id]) {
        grupos[id] = {
          aluno: freq.aluno || { id: freq.alunoId, nome: `Aluno #${freq.alunoId}` },
          itens: []
        };
      }
      grupos[id].itens.push(freq);
    });
    return Object.values(grupos);
  };

  const frequenciasAgrupadas = agruparPorAluno(frequencias);

  return (
    <div className="page-container">
      <PageHeader 
        title="Frequência" 
        buttonText="Chamada" 
        onAddClick={() => setIsModalOpen(true)} 
        onSearch={handleSearch}
        showFilter={true}
        filterOptions={disciplinas}
        onFilterChange={handleFilterChange}
      />

      <div className="freq-grid">
        {frequenciasAgrupadas.length === 0 ? (
          <p className="no-data">Nenhum registro de chamada encontrado.</p>
        ) : (
          frequenciasAgrupadas.map((grupo) => (
            <div key={grupo.aluno.id} className="card aluno-card-group">
              <div className="card-header">
                <h3 className="aluno-group-nome">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#305677" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                    <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
                    <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5"></path>
                  </svg>
                  {grupo.aluno.nome}
                </h3>
                {disciplinaSelecionada && (
                  <FrequenciaSummary alunoId={grupo.aluno.id} disciplinaId={disciplinaSelecionada} apiUrl={API_URL} />
                )}
              </div>
              <div className="card-body">
                <div className="itens-list">
                  {grupo.itens.map(freq => (
                    <div key={freq.id} className="item-row">
                      <div className="item-info">
                        <span className="disciplina-nome">
                          {freq.disciplina && freq.disciplina.nome ? freq.disciplina.nome : `Disciplina #${freq.disciplinaId}`}
                        </span>
                        <span className="item-desc" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                            <line x1="16" y1="2" x2="16" y2="6"></line>
                            <line x1="8" y1="2" x2="8" y2="6"></line>
                            <line x1="3" y1="10" x2="21" y2="10"></line>
                          </svg>
                          {formatarData(freq.dataAula)}
                        </span>
                      </div>
                      <div className="item-actions">
                        <div className={`status-badge ${freq.presente ? 'presente' : 'falta'}`}>
                          {freq.presente ? 'Presente' : 'Falta'}
                        </div>
                        <button 
                          className="btn-edit" 
                          onClick={() => handleEditClick(freq)}
                          title="Editar"
                          style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4px' }}
                        >
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#305677" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="edit-icon">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                            <path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                          </svg>
                        </button>
                        <button 
                          className="btn-delete" 
                          onClick={() => handleDelete(freq.id)}
                          title="Excluir"
                          style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4px' }}
                        >
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="trash-icon">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                            <line x1="10" y1="11" x2="10" y2="17"></line>
                            <line x1="14" y1="11" x2="14" y2="17"></line>
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={handleClose} title={editingFrequencia ? "Editar frequência:" : "Lançar frequência:"}>
        {mensagem.texto && (
          <div className={`form-msg ${mensagem.tipo}`}>{mensagem.texto}</div>
        )}
        <form onSubmit={handleSubmit} className="professor-form">
          <div className="form-row split">
            <div className="form-group">
              <label>ID do Aluno:</label>
              <input 
                type="number" 
                value={alunoId} 
                onChange={(e) => setAlunoId(e.target.value)} 
                required 
              />
            </div>
            <div className="form-group">
              <label>ID da Disciplina:</label>
              <input 
                type="number" 
                value={disciplinaId} 
                onChange={(e) => setDisciplinaId(e.target.value)} 
                required 
              />
            </div>
          </div>
          <div className="form-row split">
            <div className="form-group">
              <label>Data da Aula:</label>
              <input 
                type="date" 
                value={dataAula} 
                onChange={(e) => setDataAula(e.target.value)} 
                required 
              />
            </div>
            <div className="form-group">
              <label>Situação:</label>
              <select 
                value={presente} 
                onChange={(e) => setPresente(e.target.value)} 
                required
                className="modal-select"
              >
                <option value="true">Presente</option>
                <option value="false">Falta</option>
              </select>
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
