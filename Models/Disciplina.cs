using System.ComponentModel.DataAnnotations;

namespace devWebAvancado.Models
{

    public class CargaHorariaMinimaAttribute : ValidationAttribute
    {
        private readonly int _minima;

        public CargaHorariaMinimaAttribute(int minima)
        {
            _minima = minima;
        }

        protected override ValidationResult? IsValid(object? value, ValidationContext validationContext)
        {
            if (value is int cargaHoraria)
            {
                if (cargaHoraria < _minima)
                {
                    return new ValidationResult($"A carga horária mínima permitida é de {_minima} horas para disciplinas de Engenharia de Software.");
                }
            }
            return ValidationResult.Success;
        }
    }

    public class Disciplina
    {
        public int Id { get; set; }

        [Required(ErrorMessage = "O nome da disciplina é obrigatório.")]
        public string Nome { get; set; } = string.Empty;

        [CargaHorariaMinima(30)]
        public int CargaHoraria { get; set; }

        [Required(ErrorMessage = "O nível de classificação da disciplina é obrigatório.")]
        [RegularExpression("Iniciante|Intermediário|Avançado", ErrorMessage = "A classificação de nível deve ser 'Iniciante', 'Intermediário' ou 'Avançado'.")]
        public string Nivel { get; set; } = string.Empty;
    }
}
