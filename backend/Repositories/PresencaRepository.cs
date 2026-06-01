using devWebAvancado.Data;
using devWebAvancado.Models;
using Microsoft.EntityFrameworkCore;

namespace devWebAvancado.Repositories
{
    public class PresencaRepository : IPresencaRepository
    {
        private readonly AppDbContext _context;
        private const double LimiteFaltasReprovacao = 25.0;

        public PresencaRepository(AppDbContext context)
        {
            _context = context;
        }

        public List<Presenca> GetAll()
        {
            var presencas = _context.Presencas
                .Include(p => p.Aluno)
                .Include(p => p.Disciplina)
                .AsNoTracking()
                .ToList();
                
            foreach (var p in presencas)
            {
                if (p.Aluno != null) { p.Aluno.Notas = null!; p.Aluno.Presencas = null!; p.Aluno.Disciplinas = null!; }
                if (p.Disciplina != null) { p.Disciplina.Notas = null!; p.Disciplina.Presencas = null!; p.Disciplina.Alunos = null!; }
            }
            return presencas;
        }

        public Presenca? GetById(int id)
        {
            var presenca = _context.Presencas
                .Include(p => p.Aluno)
                .Include(p => p.Disciplina)
                .AsNoTracking()
                .FirstOrDefault(p => p.Id == id);
                
            if (presenca != null)
            {
                if (presenca.Aluno != null) { presenca.Aluno.Notas = null!; presenca.Aluno.Presencas = null!; presenca.Aluno.Disciplinas = null!; }
                if (presenca.Disciplina != null) { presenca.Disciplina.Notas = null!; presenca.Disciplina.Presencas = null!; presenca.Disciplina.Alunos = null!; }
            }
            return presenca;
        }

        public List<Presenca> GetByAlunoId(int alunoId)
        {
            return _context.Presencas.Where(p => p.AlunoId == alunoId).ToList();
        }

        public List<Presenca> GetByDisciplinaId(int disciplinaId)
        {
            var presencas = _context.Presencas
                .Where(p => p.DisciplinaId == disciplinaId)
                .Include(p => p.Aluno)
                .Include(p => p.Disciplina)
                .AsNoTracking()
                .ToList();
                
            foreach (var p in presencas)
            {
                if (p.Aluno != null) { p.Aluno.Notas = null!; p.Aluno.Presencas = null!; p.Aluno.Disciplinas = null!; }
                if (p.Disciplina != null) { p.Disciplina.Notas = null!; p.Disciplina.Presencas = null!; p.Disciplina.Alunos = null!; }
            }
            return presencas;
        }

        public List<Presenca> GetByAlunoIdDisciplinaId(int alunoId, int disciplinaId)
        {
            return _context.Presencas.Where(p => p.AlunoId == alunoId && p.DisciplinaId == disciplinaId).ToList();
        }

        public (double PercentualFaltas, bool AlertaReprovacao) GetPercentualFaltas(int alunoId, int disciplinaId)
        {
            var registros = _context.Presencas
                .Where(p => p.AlunoId == alunoId && p.DisciplinaId == disciplinaId)
                .ToList();

            if (!registros.Any())
            {
                return (0, false);
            }

            int totalAulas = registros.Count;
            int totalFaltas = registros.Count(p => !p.Presente);

            double percentualFaltas = (double)totalFaltas / totalAulas * 100;
            bool alertaReprovacao = percentualFaltas >= LimiteFaltasReprovacao;

            return (percentualFaltas, alertaReprovacao);
        }

        public void Add(Presenca presenca)
        {
            if (presenca.AlunoId <= 0)
            {
                throw new Exception("O ID do aluno é obrigatório.");
            }

            if (presenca.DisciplinaId <= 0)
            {
                throw new Exception("O ID da disciplina é obrigatório.");
            }

            if (presenca.DataAula == default)
            {
                throw new Exception("A data da aula é obrigatória.");
            }

            var duplicado = _context.Presencas
                .Any(p => p.AlunoId == presenca.AlunoId
                       && p.DisciplinaId == presenca.DisciplinaId
                       && p.DataAula.Date == presenca.DataAula.Date);

            if (duplicado)
            {
                throw new Exception("Já existe um registro de presença para este aluno nesta disciplina nesta data.");
            }

            _context.Presencas.Add(presenca);
            _context.SaveChanges();
        }

        public void Update(Presenca presenca)
        {
            var existente = _context.Presencas.Find(presenca.Id);
            if (existente == null)
            {
                throw new Exception("Registro de presença não encontrado.");
            }

            existente.Presente = presenca.Presente;
            existente.DataAula = presenca.DataAula;

            _context.SaveChanges();
        }

        public void Delete(int id)
        {
            var presenca = _context.Presencas.Find(id);
            if (presenca == null)
            {
                throw new Exception("Registro de presença não encontrado.");
            }

            _context.Presencas.Remove(presenca);
            _context.SaveChanges();
        }
    }
}
