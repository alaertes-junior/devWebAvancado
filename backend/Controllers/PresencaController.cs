using Microsoft.AspNetCore.Mvc;
using devWebAvancado.Models;
using devWebAvancado.Repositories;
using Microsoft.AspNetCore.Authorization;

namespace devWebAvancado.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class PresencaController : ControllerBase
    {
        private readonly IPresencaRepository _repo;

        public PresencaController(IPresencaRepository repo)
        {
            _repo = repo;
        }

        [HttpGet]
        public IActionResult GetAll()
        {
            return Ok(_repo.GetAll());
        }

        [HttpGet("{id}")]
        public IActionResult GetById(int id)
        {
            var presenca = _repo.GetById(id);
            if (presenca == null)
            {
                return NotFound("Registro de presença não encontrado.");
            }
            return Ok(presenca);
        }

        [HttpGet("aluno/{alunoId}")]
        public IActionResult GetByAlunoId(int alunoId)
        {
            var presencas = _repo.GetByAlunoId(alunoId);
            if (!presencas.Any())
            {
                return NotFound("Nenhum registro de presença encontrado para este aluno.");
            }

            return Ok(presencas);
        }

        [HttpGet("disciplina/{id}")]
        public IActionResult GetByDisciplinaId(int id)
        {
            return Ok(_repo.GetByDisciplinaId(id));
        }

        [HttpGet("aluno/{alunoId}/disciplina/{disciplinaId}")]
        public IActionResult GetByAlunoIdDisciplinaId(int alunoId, int disciplinaId)
        {
            var presencas = _repo.GetByAlunoIdDisciplinaId(alunoId, disciplinaId);
            if (!presencas.Any())
            {
                return NotFound("Nenhum registro de presença encontrado para este aluno nesta disciplina.");
            }

            return Ok(presencas);
        }

        [HttpGet("faltas/{alunoId}/{disciplinaId}")]
        public IActionResult GetPercentualFaltas(int alunoId, int disciplinaId)
        {
            var (percentualFaltas, alertaReprovacao) = _repo.GetPercentualFaltas(alunoId, disciplinaId);
            return Ok(new
            {
                PercentualFaltas = percentualFaltas,
                AlertaReprovacao = alertaReprovacao,
                Mensagem = alertaReprovacao ? "Aluno em risco de reprovação por falta." : "Aluno dentro do limite de faltas permitido."
            });
        }

        [HttpPost]
        public IActionResult Post(Presenca presenca)
        {
            try
            {
                _repo.Add(presenca);
                return Ok(presenca);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut("{id}")]
        public IActionResult Put(int id, Presenca presenca)
        {
            try
            {
                presenca.Id = id;
                _repo.Update(presenca);
                return Ok("Registro de presença atualizado com sucesso.");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            try
            {
                _repo.Delete(id);
                return Ok("Registro de presença removido com sucesso.");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
