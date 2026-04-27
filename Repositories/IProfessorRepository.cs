using devWebAvancado.Models;

namespace devWebAvancado.Repositories
{
    public interface IProfessorRepository
    {
        List<Professor> GetAll();
        Professor? GetById(int id);
        void Add(Professor professor);
        void Update(Professor professor);
        void Delete(int id);
    }
}
