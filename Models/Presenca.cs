namespace devWebAvancado.Models
{
    public class Presenca
    {
        public int Id { get; set; }
        public int AlunoId { get; set; }
        public Aluno Aluno { get; set; }
        public int DisciplinaId { get; set; }
        public Disciplina Disciplina { get; set; }
        public DateTime DataAula { get; set; }
        public bool Presente { get; set; }
    }
}
