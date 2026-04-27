using devWebAvancado.Models;

namespace devWebAvancado.Repositories
{
    public interface IPresencaRepository
    {
        List<Presenca> GetAll();
        Presenca? GetById(int id);
        List<Presenca> GetByAlunoId(int alunoId);
        List<Presenca> GetByAlunoIdDisciplinaId(int alunoId, int disciplinaId);
        (double PercentualFaltas, bool AlertaReprovacao) GetPercentualFaltas(int alunoId, int disciplinaId);
        void Add(Presenca presenca);
        void Update(Presenca presenca);
        void Delete(int id);
    }
}
