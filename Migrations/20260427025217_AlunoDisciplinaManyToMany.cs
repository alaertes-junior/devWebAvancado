using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace devWebAvancado.Migrations
{
    /// <inheritdoc />
    public partial class AlunoDisciplinaManyToMany : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Alunos_Disciplinas_DisciplinaId",
                table: "Alunos");

            migrationBuilder.DropIndex(
                name: "IX_Alunos_DisciplinaId",
                table: "Alunos");

            migrationBuilder.DropColumn(
                name: "DisciplinaId",
                table: "Alunos");

            migrationBuilder.CreateTable(
                name: "AlunoDisciplina",
                columns: table => new
                {
                    AlunosId = table.Column<int>(type: "INTEGER", nullable: false),
                    DisciplinasId = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AlunoDisciplina", x => new { x.AlunosId, x.DisciplinasId });
                    table.ForeignKey(
                        name: "FK_AlunoDisciplina_Alunos_AlunosId",
                        column: x => x.AlunosId,
                        principalTable: "Alunos",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_AlunoDisciplina_Disciplinas_DisciplinasId",
                        column: x => x.DisciplinasId,
                        principalTable: "Disciplinas",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_AlunoDisciplina_DisciplinasId",
                table: "AlunoDisciplina",
                column: "DisciplinasId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AlunoDisciplina");

            migrationBuilder.AddColumn<int>(
                name: "DisciplinaId",
                table: "Alunos",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_Alunos_DisciplinaId",
                table: "Alunos",
                column: "DisciplinaId");

            migrationBuilder.AddForeignKey(
                name: "FK_Alunos_Disciplinas_DisciplinaId",
                table: "Alunos",
                column: "DisciplinaId",
                principalTable: "Disciplinas",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
