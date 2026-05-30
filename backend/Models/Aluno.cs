namespace devWebAvancado.Models
{
    public class Aluno
    {
        public int Id { get; set; }
        public string Nome { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Cpf { get; set; } = string.Empty;
        public int Idade { get; set; }
        public ICollection<Disciplina> Disciplinas { get; set; } = new List<Disciplina>();
        public ICollection<Nota> Notas { get; set; } = new List<Nota>();
        public ICollection<Presenca> Presencas { get; set; } = new List<Presenca>();
    }
}