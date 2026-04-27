using Microsoft.EntityFrameworkCore;
using devWebAvancado.Models;

namespace devWebAvancado.Data
{
    public class AppDbContext : DbContext
    {
        public DbSet<Disciplina> Disciplinas { get; set; }
        public DbSet<Aluno> Alunos { get; set; }
        public DbSet<Professor> Professores { get; set; }
        public DbSet<Nota> Notas { get; set; }
        public DbSet<Presenca> Presencas { get; set; }

        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Relacionamento Muitos para Muitos entre Aluno e Disciplina
            modelBuilder.Entity<Aluno>()
                .HasMany(a => a.Disciplinas)
                .WithMany(d => d.Alunos);

            base.OnModelCreating(modelBuilder);
        }
    }
}