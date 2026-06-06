using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using devWebAvancado.Data;
using devWebAvancado.Models.DTOs;

namespace devWebAvancado.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IConfiguration _configuration;

        public AuthController(AppDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDTO loginDto)
        {
            // Busca no Aluno
            var aluno = await _context.Alunos
                .FirstOrDefaultAsync(a => a.Email == loginDto.Email && a.Senha == loginDto.Senha);

            if (aluno != null)
            {
                return Unauthorized("Acesso negado: apenas o professor administrador pode acessar o sistema.");
            }

            // Busca no Professor
            var professor = await _context.Professores
                .FirstOrDefaultAsync(p => p.Email == loginDto.Email && p.Senha == loginDto.Senha);

            if (professor != null)
            {
                var adminEmail = _configuration.GetValue<string>("AdminSettings:Email") ?? "rosario.laerte@up.edu.br";
                if (professor.Email.Equals(adminEmail, StringComparison.OrdinalIgnoreCase))
                {
                    return Ok(new LoginResponseDTO
                    {
                        Token = GenerateJwtToken(professor.Email, "Professor"),
                        Nome = professor.Nome,
                        Role = "Professor"
                    });
                }
                else
                {
                    return Unauthorized("Acesso negado: apenas o professor administrador pode acessar o sistema.");
                }
            }

            return Unauthorized("Credenciais inválidas");
        }

        private string GenerateJwtToken(string email, string role)
        {
            var jwtSettings = _configuration.GetSection("JwtSettings");
            var secretKey = jwtSettings.GetValue<string>("SecretKey") ?? "SuaChaveSecretaSuperSeguraComPeloMenos32Caracteres";
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(ClaimTypes.Email, email),
                new Claim(ClaimTypes.Role, role),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };

            var token = new JwtSecurityToken(
                issuer: jwtSettings.GetValue<string>("Issuer"),
                audience: jwtSettings.GetValue<string>("Audience"),
                claims: claims,
                expires: DateTime.Now.AddHours(2),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}