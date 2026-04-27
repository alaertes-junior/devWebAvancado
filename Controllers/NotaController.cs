using Microsoft.AspNetCore.Mvc;
using devWebAvancado.Models;
using devWebAvancado.Repositories;

namespace devWebAvancado.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class NotaController : ControllerBase
    {
        private readonly INotaRepository _repo;

        public NotaController(INotaRepository repo)
        {
            _repo = repo;
        }

        [HttpGet("aluno/{alunoId}")]
        public IActionResult GetByAlunoId(int alunoId)
        {
            return Ok(_repo.GetByIdAluno(alunoId));
        }

        [HttpGet("aluno/{alunoId}/disciplina/{disciplinaId}")]
        public IActionResult GetByAlunoIdDisciplinaId(int alunoId, int disciplinaId)
        {
            var nota = _repo.GetByIdAlunoIdDisciplina(alunoId, disciplinaId);
            if (nota == null)
            {
                return NotFound($"Nenhuma nota encontrada para o Aluno {alunoId} na Disciplina {disciplinaId}");
            }

            return Ok(nota);
        }

        [HttpGet("media/{alunoId}/{disciplinaId}")]
        public IActionResult GetMedia(int alunoId, int disciplinaId)
        {
            var (media, status) = _repo.GetMediaByIdAlunoIdDisciplina(alunoId, disciplinaId);
            return Ok(new
            {
                MediaFinal = media,
                Situacao = status.ToString()
            });
        }

        [HttpPost]
        public IActionResult Post(Nota nota)
        {
            try
            {
                _repo.Add(nota);
                return Ok(nota);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut("{id}")]
        public IActionResult Put(int id, Nota nota)
        {
            nota.Id = id;
            _repo.Update(nota);
            return Ok("Nota atualizada com sucesso");
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            _repo.Delete(id);
            return Ok("Nota removida com sucesso");
        }
    }
}