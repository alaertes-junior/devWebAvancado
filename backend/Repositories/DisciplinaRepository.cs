using devWebAvancado.Data;
using devWebAvancado.Models;
using Microsoft.EntityFrameworkCore;

namespace devWebAvancado.Repositories
{
    public class DisciplinaRepository : IDisciplinaRepository
    {
        private readonly AppDbContext _context;

        public DisciplinaRepository(AppDbContext context)
        {
            _context = context;
        }

        public List<Disciplina> GetAll()
        {
            return _context.Disciplinas.ToList();
        }

        public Disciplina? GetById(int id)
        {
            return _context.Disciplinas.Include(d => d.Professor).FirstOrDefault(d => d.Id == id);
        }

        public void Add(Disciplina disciplina)
        {
            ValidarDisciplina(disciplina);
            _context.Disciplinas.Add(disciplina);
            _context.SaveChanges();
        }

        public void Update(Disciplina disciplina)
        {
            var existente = _context.Disciplinas.Find(disciplina.Id);
            if (existente == null)
            {
                return;
            }

            ValidarDisciplina(disciplina);

            existente.Nome = disciplina.Nome;
            existente.CargaHoraria = disciplina.CargaHoraria;
            existente.Nivel = disciplina.Nivel;

            _context.SaveChanges();
        }

        public void Delete(int id)
        {
            var disciplina = _context.Disciplinas.Find(id);
            if (disciplina != null)
            {
                _context.Disciplinas.Remove(disciplina);
                _context.SaveChanges();
            }
        }

        private void ValidarDisciplina(Disciplina disciplina)
        {
            if (string.IsNullOrWhiteSpace(disciplina.Nome))
            {
                throw new Exception("O nome da disciplina é obrigatório.");
            }

            if (disciplina.CargaHoraria < 30)
            {
                throw new Exception("A carga horária mínima permitida é de 30 horas.");
            }

            var niveisValidos = new List<string> { "Iniciante", "Intermediário", "Avançado" };
            if (!niveisValidos.Contains(disciplina.Nivel))
            {
                throw new Exception("A classificação de nível deve ser 'Iniciante', 'Intermediário' ou 'Avançado'.");
            }
        }
    }
}
