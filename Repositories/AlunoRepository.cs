using devWebAvancado.Data;
using devWebAvancado.Models;

namespace devWebAvancado.Repositories {
    public class AlunoRepository : IAlunoRepository {
        private readonly AppDbContext _Context;

        public AlunoRepository(AppDbContext context) {
            _Context = context;
        }

        public List<Aluno> GetAll() {
            return _Context.Aluno.ToList();
        }

        public List<Aluno> GetAllByCourse(int Id) {
            return _Context.Aluno.Where(A => A.CursoId == Id).ToList();
        }

        public Aluno GetById(int Id) {
            return _Context.Aluno.Find(Id);
        }

        public void Add(Aluno Aluno) {
            if (Aluno.Idade > 17 || Aluno.Idade < 6)
                throw new Exception("Idade do aluno deve ser entre 6 e 17 anos.");
            
            if (Aluno.Nome.Length < 3 || Aluno.Nome.Length > 40)
                throw new Exception("O nome deve ter entre 3 a 40 caracteres.");
        }
        
        public void Update(Aluno Aluno) {
            var Existente = _Context.Aluno.Find(Aluno.Id);

            if (Existente == null)
                return;

            Existente.Nome = Aluno.Nome;
            Existente.Nota = Aluno.Nota;
        }

        public void Delete(int Id) {
            var Aluno = _Context.Aluno.Find(Id);
            if (Aluno != null) {
                _Context.Aluno.Remove(Aluno);
            }
        }
    }
}