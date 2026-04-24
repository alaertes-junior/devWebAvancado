namespace devWebAvancado.Models
{
    public class Nota
    {
        public int Id {get; set;}
        public double Valor {get; set;}
        public string Descricao {get; set;}

        public int AlunoId {get; set;}
        public Aluno Aluno {get; set;}

        public int DisciplinaId {get; set;}
        public Disciplina Disciplina {get; set;}
    }
}