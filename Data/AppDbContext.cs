using Microsoft.EntityFrameworkCore;
using devWebAvancado.Models;

namespace devWebAvancado.Data
{
    public class AppDbContext : DbContext
    {
        public DbSet<Curso> Cursos { get; set; }
        public DbSet<Aluno> Aluno { get; set; }
        public DbSet<Professor> Professores { get; set; }
        public DbSet<Nota> Notas { get; set; }
        public DbSet<Frequencia> Frequencias { get; set; }

        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options)
        {
        }
    }
}