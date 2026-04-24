using devWebAvancado.Models;
public enum StatusDisciplina { Aprovado, Reprovado };

namespace devWebAvancado.Repositories
{
    public interface INotaRepository
    {
        List<Nota> GetByIdAluno(int alunoId);
        List<Nota> GetByIdAlunoIdDisciplina(int alunoId, int disciplinaId);
        (double Media, StatusDisciplina Status) GetMediaByIdAlunoIdDisciplina(int alunoId, int disciplinaId);
        void Add(Nota nota);
        void Update(Nota nota);
        void Delete(int id);
    }
}