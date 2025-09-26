# 🎬 CineTeca - Plataforma de Maratonas de Filmes

Uma aplicação web moderna para descobrir filmes, criar maratonas personalizadas e explorar filmografias dos seus artistas favoritos.

## 🚀 Tecnologias Utilizadas

### Frontend
- **Angular 18.2.0** - Framework principal
- **TypeScript 5.5.2** - Linguagem de programação
- **SCSS** - Pré-processador CSS
- **RxJS 7.8.0** - Programação reativa
- **Angular Router** - Roteamento
- **Angular Forms** - Formulários reativos

### Backend
- **Node.js** - Runtime JavaScript
- **Express.js 5.1.0** - Framework web
- **TypeScript** - Linguagem de programação
- **Prisma 6.16.2** - ORM moderno
- **SQLite** - Banco de dados
- **JWT** - Autenticação
- **bcryptjs** - Criptografia de senhas
- **CORS** - Cross-Origin Resource Sharing

### Testes
- **Jasmine** - Framework de testes
- **Karma** - Test runner
- **Angular Testing Utilities** - Utilitários de teste

### Ferramentas de Desenvolvimento
- **Angular CLI 18.2.0** - Ferramentas de linha de comando
- **ts-node-dev** - Desenvolvimento com hot reload
- **Docker** - Containerização

## ✨ Funcionalidades

### 🔐 Autenticação
- **Login** com email e senha
- **Registro** de novos usuários
- **Autenticação JWT** com tokens seguros
- **Guards** para proteção de rotas
- **Interceptors** para requisições autenticadas

### 🎬 Descoberta de Filmes
- **Busca de filmes** por nome
- **Filtros avançados** por gênero, ano, popularidade
- **Integração com TMDB API** para dados de filmes
- **Interface responsiva** e moderna
- **Carrossel de filmes** interativo

### 🏃‍♂️ Maratonas Personalizadas
- **Criação de maratonas** personalizadas
- **Edição de maratonas** existentes
- **Exclusão de maratonas** com confirmação
- **Visualização detalhada** das maratonas
- **Cálculo automático** de duração total
- **Geração por artista** favorito

### 🎨 Interface Moderna
- **Design responsivo** para mobile e desktop
- **Tema escuro** elegante
- **Animações suaves** e transições
- **Componentes reutilizáveis**
- **UX otimizada** para melhor experiência

## 🛠️ Como Executar o Projeto

### Pré-requisitos
- **Node.js** (versão 18 ou superior)
- **npm** ou **yarn**
- **Git**

### 1. Clone o Repositório
```bash
git clone https://github.com/paulosouza-ec/selecaovlab.git
cd selecaovlab
```

### 2. Instale as Dependências

#### Frontend
```bash
npm install
# ou
yarn install
```

#### Backend
```bash
cd backend
npm install
# ou
yarn install
```

### 3. Configure o Banco de Dados

#### Inicialize o Prisma
```bash
cd backend
npx prisma generate
npx prisma db push
```

### 4. Configure as Variáveis de Ambiente

Crie um arquivo `.env` na pasta `backend`:
```env
DATABASE_URL="file:./prisma/dev.db"
JWT_SECRET="seu_jwt_secret_aqui"
```

### 5. Execute o Backend
```bash
cd backend
npm run dev
# ou
yarn dev
```

O servidor backend estará rodando em `http://localhost:3000`

### 6. Execute o Frontend
```bash
npm start
# ou
yarn start
```

Navegue para `http://localhost:4200/`. A aplicação será recarregada automaticamente se você alterar qualquer arquivo fonte.

## 🧪 Executando Testes

### Testes Unitários
```bash
ng test
```

Os testes serão executados via Karma em modo watch. Para executar uma única vez:
```bash
ng test --watch=false
```

### Testes de Cobertura
```bash
ng test --code-coverage
```

## 🏗️ Build do Projeto

### Build de Desenvolvimento
```bash
ng build
```

### Build de Produção
```bash
ng build --configuration production
```

Os artefatos de build serão armazenados no diretório `dist/`.

## 📁 Estrutura do Projeto

```
selecaovlab/
├── src/                          # Frontend Angular
│   ├── app/
│   │   ├── core/                 # Guards, Interceptors
│   │   ├── features/             # Módulos de funcionalidades
│   │   │   ├── auth/             # Autenticação
│   │   │   ├── movies/           # Filmes
│   │   │   └── marathons/        # Maratonas
│   │   ├── shared/               # Componentes compartilhados
│   │   └── environments/         # Configurações de ambiente
│   └── styles.scss              # Estilos globais
├── backend/                      # Backend Node.js
│   ├── src/
│   │   ├── controllers/          # Controladores
│   │   ├── middleware/          # Middlewares
│   │   ├── routes/              # Rotas
│   │   └── server.ts            # Servidor principal
│   └── prisma/                  # Schema e migrações do banco
├── public/                       # Assets estáticos
└── docker-compose.yml           # Configuração Docker
```

## 🔧 Comandos Úteis

### Angular CLI
```bash
# Gerar novo componente
ng generate component nome-do-componente

# Gerar novo serviço
ng generate service nome-do-servico

# Gerar novo guard
ng generate guard nome-do-guard

# Gerar nova interface
ng generate interface nome-da-interface
```

### Prisma
```bash
# Gerar cliente Prisma
npx prisma generate

# Aplicar migrações
npx prisma db push

# Visualizar banco de dados
npx prisma studio
```

## 🌐 API Endpoints

### Autenticação
- `POST /api/auth/register` - Registrar usuário
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Dados do usuário

### Maratonas
- `GET /api/marathons` - Listar maratonas
- `POST /api/marathons` - Criar maratona
- `PUT /api/marathons/:id` - Atualizar maratona
- `DELETE /api/marathons/:id` - Excluir maratona

## 🎨 Design System

### Cores
- **Primária**: `#e50914` (Vermelho Netflix)
- **Secundária**: `#181818` (Cinza escuro)
- **Acento**: `#f5c518` (Dourado)
- **Texto**: `#ffffff` (Branco)

### Componentes
- **Botões**: Estilo moderno com hover effects
- **Cards**: Sombras e bordas arredondadas
- **Formulários**: Validação em tempo real
- **Modais**: Overlay com animações

## 🚀 Deploy

### Frontend (Vercel/Netlify)
```bash
ng build --configuration production
```

### Backend (Railway/Heroku)
```bash
# Configure as variáveis de ambiente
# Deploy automático via Git
```

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença ISC. Veja o arquivo `LICENSE` para mais detalhes.

## 🐛 Reportar Bugs

Se encontrar algum bug, por favor abra uma issue no [GitHub Issues](https://github.com/paulosouza-ec/selecaovlab/issues).

## 📞 Contato

- **GitHub**: [@paulosouza-ec](https://github.com/paulosouza-ec)
- **Projeto**: [SelecaoVlab](https://github.com/paulosouza-ec/selecaovlab)

---

**Desenvolvido com ❤️ usando Angular 18.2.0**