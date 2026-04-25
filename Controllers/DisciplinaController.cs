using Microsoft.AspNetCore.Mvc;
using devWebAvancado.Models;
using devWebAvancado.Repositories;

namespace devWebAvancado.Controllers {
    [ApiController]
    [Route("api/[controller]")]
    public class DisciplinaController : ControllerBase {
        private readonly IDisciplinaRepository _repo;

        public DisciplinaController(IDisciplinaRepository repo) {
            _repo = repo;
        }

        [HttpGet]
        public IActionResult Get()
        {
            return Ok(_repo.GetAll());
        }

        [HttpGet("{Id}")]
        public IActionResult GetById(int Id)
        {
            var disciplina = _repo.GetById(Id);

            if (disciplina == null)
                return NotFound("Disciplina não encontrada");

            return Ok(disciplina);
        }

        [HttpPost]
        public IActionResult Post([FromBody] Disciplina disciplina)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                _repo.Add(disciplina);
                return Ok(disciplina);
            }
            catch (Exception Ex)
            {
                return BadRequest(Ex.Message);
            }
        }

        [HttpPut("{Id}")]
        public IActionResult Put(int Id, [FromBody] Disciplina disciplina)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            disciplina.Id = Id;
            _repo.Update(disciplina);

            return Ok("Disciplina atualizada com sucesso");
        }

        [HttpDelete("{Id}")]
        public IActionResult Delete(int Id)
        {
            _repo.Delete(Id);
            return Ok("Disciplina removida com sucesso");
        }
    }
}
