using Microsoft.AspNetCore.Mvc;
using devWebAvancado.Models;
using devWebAvancado.Repositories;
using Microsoft.AspNetCore.Authorization;

namespace devWebAvancado.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class AlunoController : ControllerBase
    {
        private readonly IAlunoRepository _repo;

        public AlunoController(IAlunoRepository repo)
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
            var aluno = _repo.GetById(id);
            if (aluno == null)
            {
                return NotFound("Aluno não encontrado");
            }

            return Ok(aluno);
        }

        [HttpGet("disciplina/{id}")]
        public IActionResult GetByDisciplinaId(int id)
        {
            return Ok(_repo.GetAllByCourse(id));
        }

        [HttpPost]
        public IActionResult Post(Aluno aluno)
        {
            try
            {
                _repo.Add(aluno);
                return Ok(aluno);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut("{id}")]
        public IActionResult Put(int id, Aluno aluno)
        {
            aluno.Id = id;
            _repo.Update(aluno);
            return Ok("Aluno atualizado com sucesso");
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            _repo.Delete(id);
            return Ok("Aluno removido com sucesso");
        }
    }
}
