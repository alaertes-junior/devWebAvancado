namespace devWebAvancado.Models
{
    public class Disciplina
    {
        public int Id { get; set; }
        public string Nome { get; set; } = string.Empty;
        public int CargaHoraria { get; set; }
        public string Nivel { get; set; } = string.Empty;
        public int ProfessorId { get; set; }
        public Professor? Professor { get; set; }
        public ICollection<Aluno> Alunos { get; set; } = new List<Aluno>();
        public ICollection<Nota> Notas { get; set; } = new List<Nota>();
        public ICollection<Presenca> Presencas { get; set; } = new List<Presenca>();
    }
}
