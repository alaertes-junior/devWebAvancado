// aluno controller
using Microsoft.AspNetCore.Mvc;
using devWebAvancado.Models;
using devWebAvancado.Repositories;

namespace devWebAvancado.Controllers {
    [ApiController]
    [Route("api/Aluno")]
    public class AlunoController : ControllerBase {
        private readonly IAlunoRepository _Repo;

        public AlunoController(IAlunoRepository Repo) {
            _Repo = Repo;
        }

        [HttpGet]
        public IActionResult Get()
        {
            return Ok(_Repo.GetAll());
        }

        [HttpGet("{Id}")]
        public IActionResult GetById(int Id)
        {
            var Aluno = _Repo.GetById(Id);

            if (Aluno == null)
                return NotFound("Aluno não encontrado");

            return Ok(Aluno);
        }

        [HttpPost]
        public IActionResult Post(Aluno Aluno)
        {
            try
            {
                _Repo.Add(Aluno);
                return Ok(Aluno);
            }
            catch (Exception Ex)
            {
                return BadRequest(Ex.Message);
            }
        }

        [HttpPut("{Id}")]
        public IActionResult Put(int Id, Aluno Aluno)
        {
            Aluno.Id = Id;
            _Repo.Update(Aluno);

            return Ok("Aluno atualizado com sucesso");
        }

        [HttpDelete("{Id}")]
        public IActionResult Delete(int Id)
        {
            _Repo.Delete(Id);
            return Ok("Aluno removido com sucesso");
        }
    }
}