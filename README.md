# Sistema de Gestão Acadêmica - devWebAvancado

Este é um sistema de backend desenvolvido em **ASP.NET Core (Web API)** para gestão acadêmica, focado na administração de alunos, professores, disciplinas, notas e frequências.

## 🚀 Tecnologias Utilizadas

- **C# / .NET 10**
- **Entity Framework Core**: Mapeamento Objeto-Relacional (ORM).
- **SQLite**: Banco de dados relacional leve e eficiente.
- **Injeção de Dependência**: Para desacoplamento entre Controllers e Repositories.
- **Repository Pattern**: Padronização do acesso a dados.

## 🛠️ Arquitetura e Padrões

O projeto segue padrões modernos de desenvolvimento:
- **Model-View-Controller (MVC)**: Focado em API.
- **Clean Code**: Nomenclatura clara e responsabilidades bem definidas.
- **Many-to-Many**: Relação complexa entre Alunos e Disciplinas.
- **Eager Loading**: Carregamento de entidades relacionadas via `.Include()`.

---

## 📡 Lista de Endpoints

A URL base padrão é: `http://localhost:5195/api`

### 🎓 Alunos
- `GET /Aluno` - Lista todos os alunos (básico).
- `GET /Aluno/{id}` - Detalhes completos do aluno (com disciplinas, notas e presenças).
- `POST /Aluno` - Cadastra um novo aluno.
- `PUT /Aluno/{id}` - Atualiza dados do aluno.
- `DELETE /Aluno/{id}` - Remove um aluno.
- `POST /Aluno/{alunoId}/matricular/{disciplinaId}` - Matricula um aluno em uma disciplina.

### 👨‍🏫 Professores
- `GET /Professor` - Lista todos os professores.
- `GET /Professor/{id}` - Detalhes de um professor.
- `POST /Professor` - Cadastra um professor.
- `PUT /Professor/{id}` - Atualiza um professor.
- `DELETE /Professor/{id}` - Remove um professor.

### 📚 Disciplinas
- `GET /Disciplina` - Lista todas as disciplinas.
- `GET /Disciplina/{id}` - Detalhes da disciplina (inclui professor vinculado).
- `POST /Disciplina` - Cadastra uma disciplina.
- `PUT /Disciplina/{id}` - Atualiza uma disciplina.
- `DELETE /Disciplina/{id}` - Remove uma disciplina.

### 📝 Notas
- `GET /Nota` - Lista todas as notas.
- `GET /Nota/{id}` - Detalhes de uma nota.
- `POST /Nota` - Registra uma nota.
- `PUT /Nota/{id}` - Atualiza uma nota.
- `DELETE /Nota/{id}` - Remove uma nota.
- `GET /Nota/aluno/{alunoId}` - Lista notas de um aluno específico.
- `GET /Nota/media/aluno/{alunoId}/disciplina/{disciplinaId}` - Calcula a média e status de aprovação.

### 📅 Presenças
- `GET /Presenca` - Lista todos os registros de presença.
- `GET /Presenca/{id}` - Detalhes de uma presença.
- `POST /Presenca` - Registra uma nova presença/falta.
- `PUT /Presenca/{id}` - Atualiza um registro de presença.
- `GET /Presenca/faltas/aluno/{alunoId}/disciplina/{disciplinaId}` - Relatório de faltas e alerta de reprovação (25%).

---

## 🏗️ Como Rodar o Projeto

1. Certifique-se de ter o **SDK do .NET 10** instalado.
2. Clone o repositório.
3. Execute o comando para restaurar os pacotes:
   ```bash
   dotnet restore
   ```
4. Aplique as migrations no banco de dados:
   ```bash
   dotnet ef database update
   ```
5. Inicie a aplicação:
   ```bash
   dotnet run
   ```
