using Microsoft.AspNetCore.Mvc;
using devWebAvancado.Models;
using devWebAvancado.Repositories;

namespace devWebAvancado.Controllers
{
    [ApiController]
    [Route("api/Presenca")]
    public class PresencaController : ControllerBase
    {
        private readonly IPresencaRepository _Repo;

        public PresencaController(IPresencaRepository Repo)
        {
            _Repo = Repo;
        }

        [HttpGet]
        public IActionResult GetAll()
        {
            return Ok(_Repo.GetAll());
        }

        [HttpGet("aluno/{alunoId}")]
        public IActionResult GetByAlunoId(int alunoId)
        {
            var presencas = _Repo.GetByAlunoId(alunoId);

            if (!presencas.Any())
                return NotFound("Nenhum registro de presença encontrado para este aluno.");

            return Ok(presencas);
        }

        [HttpGet("aluno/{alunoId}/disciplina/{disciplinaId}")]
        public IActionResult GetByAlunoIdDisciplinaId(int alunoId, int disciplinaId)
        {
            var presencas = _Repo.GetByAlunoIdDisciplinaId(alunoId, disciplinaId);

            if (!presencas.Any())
                return NotFound("Nenhum registro de presença encontrado para este aluno nesta disciplina.");

            return Ok(presencas);
        }

        [HttpGet("faltas/{alunoId}/{disciplinaId}")]
        public IActionResult GetPercentualFaltas(int alunoId, int disciplinaId)
        {
            var (PercentualFaltas, AlertaReprovacao) = _Repo.GetPercentualFaltas(alunoId, disciplinaId);

            return Ok(new
            {
                PercentualFaltas = PercentualFaltas,
                AlertaReprovacao = AlertaReprovacao,
                Mensagem = AlertaReprovacao
                    ? "ALERTA: Aluno em risco de reprovação por falta (>= 25% de ausências)."
                    : "Aluno dentro do limite de faltas permitido."
            });
        }

        [HttpPost]
        public IActionResult Post(Presenca presenca)
        {
            try
            {
                _Repo.Add(presenca);
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
                _Repo.Update(presenca);
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
                _Repo.Delete(id);
                return Ok("Registro de presença removido com sucesso.");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
