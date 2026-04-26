using devWebAvancado.Data;
using devWebAvancado.Models;

namespace devWebAvancado.Repositories
{
    public class PresencaRepository : IPresencaRepository
    {
        private readonly AppDbContext _Context;
        private const double LimiteFaltasReprovacao = 25.0;

        public PresencaRepository(AppDbContext context)
        {
            _Context = context;
        }

        public List<Presenca> GetAll()
        {
            return _Context.Presencas.ToList();
        }

        public List<Presenca> GetByAlunoId(int alunoId)
        {
            return _Context.Presencas
                .Where(p => p.AlunoId == alunoId)
                .ToList();
        }

        public List<Presenca> GetByAlunoIdDisciplinaId(int alunoId, int disciplinaId)
        {
            return _Context.Presencas
                .Where(p => p.AlunoId == alunoId && p.DisciplinaId == disciplinaId)
                .ToList();
        }

        public (double PercentualFaltas, bool AlertaReprovacao) GetPercentualFaltas(int alunoId, int disciplinaId)
        {
            var registros = _Context.Presencas
                .Where(p => p.AlunoId == alunoId && p.DisciplinaId == disciplinaId)
                .ToList();

            if (!registros.Any())
                return (0, false);

            int totalAulas = registros.Count;
            int totalFaltas = registros.Count(p => !p.Presente);

            double percentualFaltas = (double)totalFaltas / totalAulas * 100;
            bool alertaReprovacao = percentualFaltas >= LimiteFaltasReprovacao;

            return (percentualFaltas, alertaReprovacao);
        }

        public void Add(Presenca presenca)
        {
            if (presenca.AlunoId <= 0)
                throw new Exception("O ID do aluno é obrigatório.");

            if (presenca.DisciplinaId <= 0)
                throw new Exception("O ID da disciplina é obrigatório.");

            if (presenca.DataAula == default)
                throw new Exception("A data da aula é obrigatória.");

            var duplicado = _Context.Presencas
                .Any(p => p.AlunoId == presenca.AlunoId
                       && p.DisciplinaId == presenca.DisciplinaId
                       && p.DataAula.Date == presenca.DataAula.Date);

            if (duplicado)
                throw new Exception("Já existe um registro de presença para este aluno nesta disciplina nesta data.");

            _Context.Presencas.Add(presenca);
            _Context.SaveChanges();
        }

        public void Update(Presenca presenca)
        {
            var existente = _Context.Presencas.Find(presenca.Id);

            if (existente == null)
                throw new Exception("Registro de presença não encontrado.");

            existente.Presente = presenca.Presente;
            existente.DataAula = presenca.DataAula;

            _Context.SaveChanges();
        }

        public void Delete(int id)
        {
            var presenca = _Context.Presencas.Find(id);
            if (presenca == null)
                throw new Exception("Registro de presença não encontrado.");

            _Context.Presencas.Remove(presenca);
            _Context.SaveChanges();
        }
    }
}
