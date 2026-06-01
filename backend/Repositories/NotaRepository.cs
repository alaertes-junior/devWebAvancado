using devWebAvancado.Data;
using devWebAvancado.Models;
using Microsoft.EntityFrameworkCore;

namespace devWebAvancado.Repositories
{
    public class NotaRepository : INotaRepository
    {
        private readonly AppDbContext _context;

        public NotaRepository(AppDbContext context)
        {
            _context = context;
        }

        public List<Nota> GetAll()
        {
            var notas = _context.Notas
                .Include(n => n.Aluno)
                .Include(n => n.Disciplina)
                .AsNoTracking()
                .ToList();

            foreach (var n in notas)
            {
                if (n.Aluno != null) { n.Aluno.Notas = null!; n.Aluno.Presencas = null!; n.Aluno.Disciplinas = null!; }
                if (n.Disciplina != null) { n.Disciplina.Notas = null!; n.Disciplina.Presencas = null!; n.Disciplina.Alunos = null!; }
            }
            return notas;
        }

        public Nota? GetById(int id)
        {
            var nota = _context.Notas
                .Include(n => n.Aluno)
                .Include(n => n.Disciplina)
                .AsNoTracking()
                .FirstOrDefault(n => n.Id == id);
                
            if (nota != null)
            {
                if (nota.Aluno != null) { nota.Aluno.Notas = null!; nota.Aluno.Presencas = null!; nota.Aluno.Disciplinas = null!; }
                if (nota.Disciplina != null) { nota.Disciplina.Notas = null!; nota.Disciplina.Presencas = null!; nota.Disciplina.Alunos = null!; }
            }
            return nota;
        }

        public List<Nota> GetByIdAluno(int alunoId)
        {
            return _context.Notas.Where(n => n.AlunoId == alunoId).ToList();
        }

        public List<Nota> GetByDisciplinaId(int disciplinaId)
        {
            var notas = _context.Notas
                .Where(n => n.DisciplinaId == disciplinaId)
                .Include(n => n.Aluno)
                .Include(n => n.Disciplina)
                .AsNoTracking()
                .ToList();

            foreach (var n in notas)
            {
                if (n.Aluno != null) { n.Aluno.Notas = null!; n.Aluno.Presencas = null!; n.Aluno.Disciplinas = null!; }
                if (n.Disciplina != null) { n.Disciplina.Notas = null!; n.Disciplina.Presencas = null!; n.Disciplina.Alunos = null!; }
            }
            return notas;
        }

        public List<Nota> GetByIdAlunoIdDisciplina(int alunoId, int disciplinaId)
        {
            return _context.Notas.Where(n => n.AlunoId == alunoId && n.DisciplinaId == disciplinaId).ToList();
        }

        public (double Media, StatusDisciplina Status) GetMediaByIdAlunoIdDisciplina(int alunoId, int disciplinaId)
        {
            var consulta = _context.Notas.Where(n => n.AlunoId == alunoId && n.DisciplinaId == disciplinaId);
            if (!consulta.Any())
            {
                return (0, StatusDisciplina.Reprovado);
            }

            double media = consulta.Average(n => n.Valor);
            var status = media >= 6 ? StatusDisciplina.Aprovado : StatusDisciplina.Reprovado;
            return (media, status);
        }

        public void Add(Nota nota)
        {
            if (nota.Valor < 0 || nota.Valor > 10)
            {
                throw new Exception("A nota deve estar entre 0 e 10.");
            }

            _context.Notas.Add(nota);
            _context.SaveChanges();
        }

        public void Update(Nota nota)
        {
            var existente = _context.Notas.Find(nota.Id);
            if (existente == null)
            {
                return;
            }

            if (nota.Valor < 0 || nota.Valor > 10)
            {
                throw new Exception("A nota deve estar entre 0 e 10.");
            }

            existente.Valor = nota.Valor;
            _context.SaveChanges();
        }

        public void Delete(int id)
        {
            var nota = _context.Notas.Find(id);
            if (nota != null)
            {
                _context.Notas.Remove(nota);
                _context.SaveChanges();
            }
        }
    }
}