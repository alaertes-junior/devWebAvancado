using Microsoft.AspNetCore.Mvc;
using devWebAvancado.Models;
using devWebAvancado.Repositories;

namespace devWebAvancado.Controllers
{
    [ApiController]
    [Route("api/Nota")]
    public class NotaController : ControllerBase
    {
        private readonly INotaRepository _Repo;

        public NotaController(INotaRepository Repo)
        {
            _Repo = Repo;
        }

        // GET Nota by ID Aluno
        [HttpGet("{Id}")]
        public IActionResult GetByIdAluno(int Id)
        {
            return Ok(_Repo.GetByIdAluno(Id));
        }

        // GET Nota by ID Aluno & ID Disciplina
        [HttpGet("{IdAluno}/{IdDisciplina}")]
        public IActionResult GetByIdAlunoIdDisciplina(int IdAluno, int IdDisciplina)
        {
            var nota = _Repo.GetByIdAlunoIdDisciplina(IdAluno, IdDisciplina);

            if (nota == null)
                return NotFound($"Nenhuma nota encontrada para o Aluno {IdAluno} na Disciplina {IdDisciplina}");

            return Ok(nota);
        }

        // GET Media do Aluno por Disciplina
        [HttpGet("/Media/{IdAluno}/{IdDisciplina}")]
        public IActionResult GetMedia(int IdAluno, int IdDisciplina)
        {
            var (Media, Status) = _Repo.GetMediaByIdAlunoIdDisciplina(IdAluno, IdDisciplina);

            return Ok(new 
            { 
                MediaFinal = Media, 
                Situacao = Status.ToString() 
            });
        }

        // POST Inserção de Nota
        [HttpPost]
        public IActionResult Post(Nota nota)
        {
            try
            {
                _Repo.Add(nota);
                return Ok(nota);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // PUT Alteração de Nota via Id da Nota
        [HttpPut("{Id}")]
        public IActionResult Put(int Id, Nota Nota)
        {
            Nota.Id = Id;
            _Repo.Update(Nota);

            return Ok("Nota atualizada com sucesso");
        }

        // DELETE Deletar Nota
        [HttpDelete("{Id}")]
        public IActionResult Delete(int Id)
        {
            _Repo.Delete(Id);
            return Ok("Nota removida com sucesso");
        }
    }
}