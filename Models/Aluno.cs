// model aluno
namespace devWebAvancado.Models
{
    public class Aluno
    {
        public int Id { get; set; }
        public string Nome { get; set; }
        public string Email { get; set; }
        public int Cpf { get; set; }
        public int Idade { get; set; }
        public int CursoId { get; set; }
        public Curso Curso { get; set; }
        public int FrequenciaId { get; set; }
        public Frequencia Frequencia { get; set; }
        public int NotaId { get; set; }
        public Nota Nota { get; set; }
    }
}