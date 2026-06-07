# Sistema de Gestão Acadêmica - devWebAvancado

Este é um sistema web completo (Full Stack) para gestão acadêmica, focado na administração de alunos, professores, disciplinas, notas e frequências. O projeto é dividido em um Backend construído com **ASP.NET Core (Web API)** e um Frontend interativo desenvolvido em **React** (utilizando Vite).

Integrantes da equipe:

- **ALAERTES RIBEIRO DOS SANTOS JÚNIOR**
- **CAIO RENCZECZEN AZEVEDO**
- **JONAS KUSS NETO**
- **LORENZO SORRENTINO LASKAWSKI**
- **VINICIUS GRZYB OLIVEIRA**

## 🚀 Tecnologias Utilizadas

### Backend
- **C# / .NET 10**
- **Entity Framework Core**: Mapeamento Objeto-Relacional (ORM).
- **SQLite**: Banco de dados relacional leve e eficiente.
- **Injeção de Dependência**: Para desacoplamento entre Controllers e Repositories.
- **Autenticação JWT (JSON Web Token)**: Para segurança e controle de acesso das rotas.

### Frontend
- **React 18**
- **Vite**: Ferramenta de build extremamente rápida.
- **React Router DOM**: Para navegação e roteamento das páginas.
- **CSS3 / Flexbox / Grid**: Para estilização das telas (estilo dark mode moderno).

## 🛠️ Arquitetura e Padrões

O projeto segue padrões modernos de desenvolvimento:
- **Model-View-Controller (MVC)** (no backend): Focado na construção da API.
- **Clean Code**: Nomenclatura clara e responsabilidades bem definidas.
- **Repository Pattern**: Padronização e encapsulamento do acesso aos dados.
- **Single Page Application (SPA)** (no frontend): Experiência fluida e sem recarregamento da página.

## 🔐 Autenticação JWT (JSON Web Token)

O sistema utiliza JWT para garantir a segurança das requisições entre o cliente e o servidor. 
- Ao realizar o **login**, o Backend valida as credenciais do usuário e gera um token JWT assinado criptograficamente.
- O Frontend recebe esse token e o armazena de forma segura no `localStorage` do navegador.
- Para todas as requisições subsequentes para a API (como listar alunos, cadastrar notas, etc.), o Frontend anexa esse token no cabeçalho HTTP: `Authorization: Bearer <token>`.
- O Backend (através da anotação `[Authorize]` nos controllers) intercepta a requisição, valida a integridade e validade do token e concede o acesso ao endpoint protegido. Caso o token seja inválido, expirado ou não enviado, a requisição é negada com o status `401 Unauthorized`.

---

## 📡 Lista de Endpoints Principais (Backend)

A URL base padrão da API é: `http://localhost:5195/api` *(O acesso é protegido por JWT em todas as rotas, exceto no login)*

### 🔑 Autenticação
- `POST /Auth/login` - Autentica o usuário e retorna o token JWT.

### 🎓 Alunos
- `GET /Aluno` - Lista todos os alunos.
- `GET /Aluno/{id}` - Detalhes completos do aluno.
- `POST /Aluno` - Cadastra um novo aluno.
- `PUT /Aluno/{id}` - Atualiza dados do aluno.
- `DELETE /Aluno/{id}` - Remove um aluno.

### 👨‍🏫 Professores
- `GET /Professor` - Lista todos os professores.
- `POST /Professor` - Cadastra um professor.
- `PUT /Professor/{id}` - Atualiza um professor.
- `DELETE /Professor/{id}` - Remove um professor.

### 📚 Disciplinas
- `GET /Disciplina` - Lista todas as disciplinas.
- `POST /Disciplina` - Cadastra uma disciplina.
- `PUT /Disciplina/{id}` - Atualiza uma disciplina.
- `DELETE /Disciplina/{id}` - Remove uma disciplina.

### 📝 Notas & 📅 Presenças
- `GET /Nota`, `POST /Nota`, `PUT /Nota`, `DELETE /Nota/{id}` - Gestão de notas.
- `GET /Presenca`, `POST /Presenca`, `PUT /Presenca`, `DELETE /Presenca/{id}` - Gestão de presenças.

---

## 🏗️ Como Executar o Projeto

O projeto é dividido em duas pastas principais: `backend` e `frontend`. Para executar o sistema completo, você precisará rodar os dois projetos simultaneamente.

### Pré-requisitos
- **SDK do .NET 10**
- **Node.js** (v18+ recomendado)

### Passo 1: Executando o Backend
1. Abra um terminal e navegue até a pasta `backend`:
   ```bash
   cd backend
   ```
2. Restaure os pacotes do .NET:
   ```bash
   dotnet restore
   ```
3. Aplique as migrations para criar e atualizar o banco de dados SQLite:
   ```bash
   dotnet ef database update
   ```
4. Inicie o servidor da API:
   ```bash
   dotnet run
   ```
O backend estará rodando em `http://localhost:5195`.

### Passo 2: Executando o Frontend
1. Abra um **novo terminal** e navegue até a pasta `frontend`:
   ```bash
   cd frontend
   ```
2. Instale as dependências do Node.js:
   ```bash
   npm install
   ```
3. Inicie o servidor de desenvolvimento do Vite:
   ```bash
   npm run dev
   ```
O frontend estará acessível no navegador na URL exibida no terminal (geralmente `http://localhost:5173`).
