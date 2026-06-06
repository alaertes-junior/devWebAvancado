using Microsoft.AspNetCore.Mvc;
using devWebAvancado.Models;
using devWebAvancado.Repositories;
using Microsoft.AspNetCore.Authorization;

namespace devWebAvancado.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class DisciplinaController : ControllerBase
    {
        private readonly IDisciplinaRepository _repo;

        public DisciplinaController(IDisciplinaRepository repo)
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
            var disciplina = _repo.GetById(id);
            if (disciplina == null)
            {
                return NotFound("Disciplina não encontrada");
            }

            return Ok(disciplina);
        }

        [HttpPost]
        public IActionResult Post(Disciplina disciplina)
        {
            try
            {
                _repo.Add(disciplina);
                return Ok(disciplina);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut("{id}")]
        public IActionResult Put(int id, Disciplina disciplina)
        {
            try
            {
                disciplina.Id = id;
                _repo.Update(disciplina);
                return Ok("Disciplina atualizada com sucesso");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            _repo.Delete(id);
            return Ok("Disciplina removida com sucesso");
        }
    }
}
