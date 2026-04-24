using devWebAvancado.Data;
using devWebAvancado.Models;
using Microsoft.EntityFrameworkCore;

namespace devWebAvancado.Repositories
{
    public class NotaRepository : INotaRepository
    {
        private readonly AppDbContext _Context;

        public NotaRepository(AppDbContext context)
        {
            _Context = context;
        }

        public List<Nota> GetByIdAluno(int AlunoId)
        {
            return _Context.Notas.ToList();
        }

        public List<Nota> GetByIdAlunoIdDisciplina(int AlunoId, int DisciplinaId)
        {
            return _Context.Notas.ToList();
        }

        public (double Media, StatusDisciplina Status) GetMediaByIdAlunoIdDisciplina(int AlunoId, int DisciplinaId)
        {
            var consulta = _Context.Notas.Where(n => n.AlunoId == AlunoId && n.DisciplinaId == DisciplinaId);
            if (!consulta.Any())
            {
                return (0, StatusDisciplina.Reprovado);                
            }

            double media = consulta.Average(n => n.Valor);
            var status = media >= 6 ? StatusDisciplina.Aprovado : StatusDisciplina.Reprovado;
            return (media, status);
        }

        public void Add(Nota nota)
        {
            if (nota.Valor < 0 || nota.Valor > 10)
            {
                throw new Exception("A nota deve estar entre 0 e 10.");
            }

            _Context.Notas.Add(nota);
            _Context.SaveChanges();
        }

        public void Update(Nota nota)
        {
            var existente = _Context.Notas.Find(nota.Id);
            if (existente == null) 
            {
                return;
            }
            
            if (nota.Valor < 0 || nota.Valor > 10)
            {
                throw new Exception("A nota deve estar entre 0 e 10.");
            }

            existente.Valor = nota.Valor;
            _Context.SaveChanges();
        }

        public void Delete(int id)
        {
            var nota = _Context.Notas.Find(id);
            if (nota == null)
            {
                return;
            }
            _Context.Notas.Remove(nota);
            _Context.SaveChanges();
        }
    }
}