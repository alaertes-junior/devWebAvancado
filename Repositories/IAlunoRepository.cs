// repository aluno 
using devWebAvancado.Models;

namespace devWebAvancado.Repositories {

    public interface IAlunoRepository {
        List<Aluno> GetAll();
        List<Aluno> GetAllByCourse(int Id);
        Aluno GetById(int Id);
        void Add(Aluno Aluno);
        void Update(Aluno Aluno);
        void Delete(int Id);
    }
}

