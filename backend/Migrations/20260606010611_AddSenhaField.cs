using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace devWebAvancado.Migrations
{
    /// <inheritdoc />
    public partial class AddSenhaField : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Senha",
                table: "Professores",
                type: "TEXT",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Senha",
                table: "Alunos",
                type: "TEXT",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Senha",
                table: "Professores");

            migrationBuilder.DropColumn(
                name: "Senha",
                table: "Alunos");
        }
    }
}
