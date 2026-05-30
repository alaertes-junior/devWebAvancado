import React, { useState, useEffect } from 'react';
import Modal from '../../components/Modal/Modal';
import PageHeader from '../../components/PageHeader/PageHeader';
import './Frequencia.css';

export default function Frequencia() {
  const [frequencias, setFrequencias] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
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

  const FrequenciaSummary = ({ alunoId, disciplinaId }) => {
    const [resumo, setResumo] = useState(null);
    useEffect(() => {
      const fetchResumo = async () => {
        try {
          const response = await fetch(`${API_URL}/faltas/${alunoId}/${disciplinaId}`);
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
        <strong>Faltas:</strong> {resumo.percentualFaltas}%
        <span className={`summary-status ${!resumo.alertaReprovacao ? 'aprovado' : 'reprovado'}`}>
          {' - ' + resumo.mensagem}
        </span>
      </div>
    );
  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensagem({ texto: '', tipo: '' });

    const novaPresenca = {
      dataAula: new Date(dataAula).toISOString(),
      presente: presente === 'true',
      alunoId: Number(alunoId),
      disciplinaId: Number(disciplinaId)
    };

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(novaPresenca)
      });

      if (response.ok) {
        setDataAula('');
        setPresente('true');
        setAlunoId('');
        setDisciplinaId('');
        setIsModalOpen(false);
        carregarFrequencias();
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
                <h3 className="aluno-group-nome">🎓 {grupo.aluno.nome}</h3>
                {disciplinaSelecionada && (
                  <FrequenciaSummary alunoId={grupo.aluno.id} disciplinaId={disciplinaSelecionada} />
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
                        <span className="item-desc">📅 {formatarData(freq.dataAula)}</span>
                      </div>
                      <div className="item-actions">
                        <div className={`status-badge ${freq.presente ? 'presente' : 'falta'}`}>
                          {freq.presente ? 'Presente' : 'Falta'}
                        </div>
                        <button 
                          className="btn-delete" 
                          onClick={() => handleDelete(freq.id)}
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

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Lançar frequência:">
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
