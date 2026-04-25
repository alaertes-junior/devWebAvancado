using devWebAvancado.Data;
using devWebAvancado.Models;

namespace devWebAvancado.Repositories {
    public class DisciplinaRepository : IDisciplinaRepository {
        private readonly AppDbContext _context;

        public DisciplinaRepository(AppDbContext context) {
            _context = context;
        }

        public List<Disciplina> GetAll() {
            return _context.Disciplinas.ToList();
        }

        public Disciplina GetById(int Id) {
            return _context.Disciplinas.Find(Id);
        }

        public void Add(Disciplina disciplina) {
            _context.Disciplinas.Add(disciplina);
            _context.SaveChanges();
        }
        
        public void Update(Disciplina disciplina) {
            var existente = _context.Disciplinas.Find(disciplina.Id);

            if (existente == null)
                return;

            existente.Nome = disciplina.Nome;
            existente.CargaHoraria = disciplina.CargaHoraria;
            existente.Nivel = disciplina.Nivel;
            
            _context.SaveChanges();
        }

        public void Delete(int Id) {
            var disciplina = _context.Disciplinas.Find(Id);
            if (disciplina != null) {
                _context.Disciplinas.Remove(disciplina);
                _context.SaveChanges();
            }
        }
    }
}
