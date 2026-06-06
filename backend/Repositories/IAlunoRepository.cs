using devWebAvancado.Models;

namespace devWebAvancado.Repositories
{
    public interface IAlunoRepository
    {
        List<Aluno> GetAll();
        List<Aluno> GetAllByCourse(int courseId);
        Aluno? GetById(int id);
        void Add(Aluno aluno);
        void Update(Aluno aluno);
        void Delete(int id);
    }
}
