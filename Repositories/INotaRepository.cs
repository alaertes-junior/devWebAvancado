using devWebAvancado.Models;

namespace devWebAvancado.Repositories
{
    public interface INotaRepository
    {
        List<Nota> GetAll();
        Nota? GetById(int id);
        List<Nota> GetByIdAluno(int alunoId);
        List<Nota> GetByIdAlunoIdDisciplina(int alunoId, int disciplinaId);
        (double Media, StatusDisciplina Status) GetMediaByIdAlunoIdDisciplina(int alunoId, int disciplinaId);
        void Add(Nota nota);
        void Update(Nota nota);
        void Delete(int id);
    }
}