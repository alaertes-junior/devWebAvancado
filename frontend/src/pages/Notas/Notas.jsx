import React, { useState, useEffect } from 'react';
import Modal from '../../components/Modal/Modal';
import PageHeader from '../../components/PageHeader/PageHeader';
import './Notas.css';

export default function Notas() {
  const [notas, setNotas] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
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

  const NotaSummary = ({ alunoId, disciplinaId }) => {
    const [resumo, setResumo] = useState(null);
    useEffect(() => {
      const fetchResumo = async () => {
        try {
          const response = await fetch(`${API_URL}/media/${alunoId}/${disciplinaId}`);
          if (response.ok) {
            const data = await response.json();
            setResumo(data);
          }
        } catch (e) {
          console.error(e);
        }
      };
      if (alunoId && disciplinaId) fetchResumo();
    }, [alunoId, disciplinaId]);
  
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensagem({ texto: '', tipo: '' });

    const novaNota = {
      valor: Number(valor),
      descricao: descricao,
      alunoId: Number(alunoId),
      disciplinaId: Number(disciplinaId)
    };

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(novaNota)
      });

      if (response.ok) {
        setValor('');
        setDescricao('');
        setAlunoId('');
        setDisciplinaId('');
        setIsModalOpen(false);
        carregarNotas();
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
                <h3 className="aluno-group-nome">🎓 {grupo.aluno.nome}</h3>
                {disciplinaSelecionada && (
                  <NotaSummary alunoId={grupo.aluno.id} disciplinaId={disciplinaSelecionada} />
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
                        <div className={`nota-badge ${nota.valor >= 7 ? 'aprovado' : 'reprovado'}`}>
                          {nota.valor.toFixed(1)}
                        </div>
                        <button 
                          className="btn-delete" 
                          onClick={() => handleDelete(nota.id)}
                          title="Excluir"
                        >
                          🗑️
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

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Adicionar nota:">
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
