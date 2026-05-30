using devWebAvancado.Models;

namespace devWebAvancado.Repositories
{
    public interface IDisciplinaRepository
    {
        List<Disciplina> GetAll();
        Disciplina? GetById(int id);
        void Add(Disciplina disciplina);
        void Update(Disciplina disciplina);
        void Delete(int id);
    }
}
