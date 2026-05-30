using devWebAvancado.Data;
using devWebAvancado.Models;

namespace devWebAvancado.Repositories
{
    public class ProfessorRepository : IProfessorRepository
    {
        private readonly AppDbContext _context;

        public ProfessorRepository(AppDbContext context)
        {
            _context = context;
        }

        public List<Professor> GetAll()
        {
            return _context.Professores.ToList();
        }

        public Professor? GetById(int id)
        {
            return _context.Professores.Find(id);
        }

        public void Add(Professor professor)
        {
            if (string.IsNullOrWhiteSpace(professor.Nome))
            {
                throw new Exception("O nome do professor é obrigatório.");
            }

            _context.Professores.Add(professor);
            _context.SaveChanges();
        }

        public void Update(Professor professor)
        {
            var existente = _context.Professores.Find(professor.Id);
            if (existente == null)
            {
                return;
            }

            existente.Nome = professor.Nome;
            existente.Email = professor.Email;
            existente.Cpf = professor.Cpf;
            existente.Departamento = professor.Departamento;

            _context.SaveChanges();
        }

        public void Delete(int id)
        {
            var professor = _context.Professores.Find(id);
            if (professor != null)
            {
                _context.Professores.Remove(professor);
                _context.SaveChanges();
            }
        }
    }
}
