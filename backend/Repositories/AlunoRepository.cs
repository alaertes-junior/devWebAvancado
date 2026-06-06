using devWebAvancado.Data;
using devWebAvancado.Models;
using Microsoft.EntityFrameworkCore;

namespace devWebAvancado.Repositories
{
    public class AlunoRepository : IAlunoRepository
    {
        private readonly AppDbContext _context;

        public AlunoRepository(AppDbContext context)
        {
            _context = context;
        }

        public List<Aluno> GetAll()
        {
            return _context.Alunos.ToList();
        }

        public List<Aluno> GetAllByCourse(int id)
        {
            return _context.Alunos
                .Where(a => a.Disciplinas.Any(d => d.Id == id))
                .ToList();
        }

        public Aluno? GetById(int id)
        {
            return _context.Alunos
                .FirstOrDefault(a => a.Id == id);
        }

        public void Add(Aluno aluno)
        {
            if (aluno.Idade > 17 || aluno.Idade < 15)
            {
                throw new Exception("Idade do aluno deve ser entre 15 e 17 anos.");
            }

            if (aluno.Nome.Length < 3 || aluno.Nome.Length > 40)
            {
                throw new Exception("O nome deve ter entre 3 a 40 caracteres.");
            }

            // Vincula o aluno automaticamente a todas as disciplinas
            var todasDisciplinas = _context.Disciplinas.ToList();
            aluno.Disciplinas = todasDisciplinas;

            _context.Alunos.Add(aluno);
            _context.SaveChanges();
        }

        public void Update(Aluno aluno)
        {
            var existente = _context.Alunos.Find(aluno.Id);
            if (existente == null)
            {
                return;
            }

            existente.Nome = aluno.Nome;
            existente.Email = aluno.Email;
            existente.Cpf = aluno.Cpf;
            existente.Idade = aluno.Idade;
            existente.Senha = aluno.Senha;

            _context.SaveChanges();
        }

        public void Delete(int id)
        {
            var aluno = _context.Alunos.Find(id);
            if (aluno != null)
            {
                _context.Alunos.Remove(aluno);
                _context.SaveChanges();
            }
        }
    }
}
