import React, { useState, useEffect } from 'react';
import Modal from '../../components/Modal/Modal';
import PageHeader from '../../components/PageHeader/PageHeader';
import './Notas.css';

const NotaSummary = ({ alunoId, disciplinaId, apiUrl }) => {
  const [resumo, setResumo] = useState(null);
  
  useEffect(() => {
    const fetchResumo = async () => {
      try {
        const response = await fetch(`${apiUrl}/media/${alunoId}/${disciplinaId}`);
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
      <strong>Média Final:</strong> {resumo.mediaFinal.toFixed(1)}
      <span className={`summary-status ${resumo.situacao === 'Aprovado' ? 'aprovado' : 'reprovado'}`}>
        {' - ' + resumo.situacao}
      </span>
    </div>
  );
};

export default function Notas() {
  const [notas, setNotas] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNota, setEditingNota] = useState(null);

  // Estados do formulário
  const [valor, setValor] = useState('');
  const [descricao, setDescricao] = useState('');
  const [alunoId, setAlunoId] = useState('');
  const [disciplinaId, setDisciplinaId] = useState('');

  const [disciplinas, setDisciplinas] = useState([]);
  const [disciplinaSelecionada, setDisciplinaSelecionada] = useState('');

  const [mensagem, setMensagem] = useState({ texto: '', tipo: '' });

  const API_URL = 'http://localhost:5195/api/Nota';
  const DISC_API_URL = 'http://localhost:5195/api/Disciplina';

  useEffect(() => {
    carregarNotas();
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
    setNotas([]); // Clears old notes instantly to avoid race-condition summary calls while fetching
    if (!disciplinaId) {
      carregarNotas();
      return;
    }
    try {
      const response = await fetch(`${API_URL}/disciplina/${disciplinaId}`);
      if (response.ok) {
        const data = await response.json();
        setNotas(data);
      } else {
        setNotas([]);
      }
    } catch (error) {
      console.error('Erro ao filtrar por disciplina:', error);
    }
  };

  const carregarNotas = async () => {
    try {
      const response = await fetch(API_URL);
      if (response.ok) {
        const data = await response.json();
        setNotas(data);
      }
    } catch (error) {
      console.error('Erro ao buscar notas:', error);
    }
  };

  const handleSearch = async (searchValue) => {
    if (!searchValue.trim()) {
      carregarNotas();
      return;
    }
    try {
      const response = await fetch(`${API_URL}/${searchValue}`);
      if (response.ok) {
        const data = await response.json();
        setNotas([data]);
      } else {
        setNotas([]);
      }
    } catch (error) {
      console.error('Erro na pesquisa:', error);
    }
  };

  const handleEditClick = (nota) => {
    setEditingNota(nota);
    setValor(nota.valor.toString());
    setDescricao(nota.descricao);
    setAlunoId(nota.alunoId.toString());
    setDisciplinaId(nota.disciplinaId.toString());
    setMensagem({ texto: '', tipo: '' });
    setIsModalOpen(true);
  };

  const handleClose = () => {
    setIsModalOpen(false);
    setEditingNota(null);
    setValor('');
    setDescricao('');
    setAlunoId('');
    setDisciplinaId('');
    setMensagem({ texto: '', tipo: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensagem({ texto: '', tipo: '' });

    const notaData = {
      valor: Number(valor),
      descricao: descricao,
      alunoId: Number(alunoId),
      disciplinaId: Number(disciplinaId)
    };

    if (editingNota) {
      notaData.id = editingNota.id;
    }

    try {
      const url = editingNota ? `${API_URL}/${editingNota.id}` : API_URL;
      const method = editingNota ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(notaData)
      });

      if (response.ok) {
        handleClose();
        carregarNotas();
      } else {
        const erroMsg = await response.text();
        setMensagem({ texto: `Erro: ${erroMsg}`, tipo: 'error' });
      }
    } catch (error) {
      console.error('Erro ao salvar nota:', error);
      setMensagem({ texto: 'Erro de conexão.', tipo: 'error' });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Tem certeza que deseja excluir?')) return;
    try {
      const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      if (response.ok) {
        carregarNotas();
      } else {
        alert('Erro ao excluir registro.');
      }
    } catch (error) {
      console.error('Erro no DELETE:', error);
    }
  };

  const agruparPorAluno = (lista) => {
    const grupos = {};
    lista.forEach(nota => {
      const id = nota.alunoId;
      if (!grupos[id]) {
        grupos[id] = {
          aluno: nota.aluno || { id: nota.alunoId, nome: `Aluno #${nota.alunoId}` },
          itens: []
        };
      }
      grupos[id].itens.push(nota);
    });
    return Object.values(grupos);
  };

  const notasAgrupadas = agruparPorAluno(notas);

  return (
    <div className="page-container">
      <PageHeader
        title="Notas"
        buttonText="Nota"
        onAddClick={() => setIsModalOpen(true)}
        onSearch={handleSearch}
        showFilter={true}
        filterOptions={disciplinas}
        onFilterChange={handleFilterChange}
      />

      <div className="cards-grid">
        {notasAgrupadas.length === 0 ? (
          <p className="no-data">Nenhuma nota encontrada.</p>
        ) : (
          notasAgrupadas.map((grupo) => (
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
                  <NotaSummary alunoId={grupo.aluno.id} disciplinaId={disciplinaSelecionada} apiUrl={API_URL} />
                )}
              </div>
              <div className="card-body">
                <div className="itens-list">
                  {grupo.itens.map(nota => (
                    <div key={nota.id} className="item-row">
                      <div className="item-info">
                        <span className="disciplina-nome">
                          {nota.disciplina && nota.disciplina.nome ? nota.disciplina.nome : `Disciplina #${nota.disciplinaId}`}
                        </span>
                        <span className="item-desc">{nota.descricao}</span>
                      </div>
                      <div className="item-actions">
                        <div className={`nota-badge ${nota.valor >= 6 ? 'aprovado' : 'reprovado'}`}>
                          {nota.valor.toFixed(1)}
                        </div>
                        <button
                          className="btn-edit"
                          onClick={() => handleEditClick(nota)}
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
                          onClick={() => handleDelete(nota.id)}
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

      <Modal isOpen={isModalOpen} onClose={handleClose} title={editingNota ? "Editar nota:" : "Adicionar nota:"}>
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
          <div className="form-row">
            <div className="form-group">
              <label>Descrição (ex: Prova 1):</label>
              <input
                type="text"
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Valor da Nota:</label>
              <input
                type="number"
                step="0.1"
                value={valor}
                onChange={(e) => setValor(e.target.value)}
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
