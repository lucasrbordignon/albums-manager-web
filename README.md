# Visão Geral do Projeto

Este é um projeto front-end moderno para gerenciamento de álbuns e fotos, desenvolvido para ser escalável, performático e fácil de manter.

## Objetivo da Aplicação

A aplicação tem como objetivo fornecer uma interface intuitiva para visualização, cadastro, edição e exclusão de álbuns e fotos, integrando-se a uma API externa para persistência dos dados. O front-end é responsável por toda a experiência do usuário, autenticação, gerenciamento de estado e comunicação com o backend.

## Principais Responsabilidades do Front-end

- Autenticação de usuários
- Consumo e exibição de dados da API
- Gerenciamento de estado global
- Experiência responsiva e acessível
- Suporte a temas (dark/light)
- Padronização visual e de componentes

# Stack Tecnológica

- **Vite**: Ferramenta de build e desenvolvimento rápido.
- **React**: Biblioteca principal para construção da interface.
- **TypeScript**: Tipagem estática para maior robustez e manutenção.
- **Tailwind CSS**: Utilitário para estilização rápida e responsiva.
- **Shadcn UI**: Design system de componentes React modernos.
- **Docker**: Containerização para facilitar deploy e ambiente de desenvolvimento.

## Papel de Cada Tecnologia

- **Vite**: Gerencia o build, hot reload e otimizações de desenvolvimento.
- **React**: Estrutura os componentes e o fluxo de dados da interface.
- **TypeScript**: Garante segurança de tipos e facilita refatorações.
- **Tailwind CSS**: Permite estilização customizada e responsiva via classes utilitárias.
- **Shadcn UI**: Fornece componentes prontos, acessíveis e customizáveis.
- **Docker**: Padroniza o ambiente, facilitando testes e deploy.

# Arquitetura do Projeto

```
src/
  assets/           # Imagens e arquivos estáticos
  components/       # Componentes reutilizáveis
    ui/             # Componentes de UI (botões, cards, etc)
    layout/         # Componentes de layout
  config/           # Configurações globais (ex: API)
  contexts/         # Contextos globais (ex: Auth)
  hooks/            # Hooks customizados
  layouts/          # Layouts de páginas
  lib/              # Funções utilitárias
  pages/            # Páginas da aplicação
    private/        # Páginas protegidas (ex: álbuns, fotos)
    public/         # Páginas públicas (ex: login, registro)
  routes/           # Definição de rotas
  services/         # Integração com API externa
```

## Separação de Responsabilidades

- **components/**: Elementos visuais reutilizáveis
- **services/**: Comunicação com API externa
- **contexts/**: Gerenciamento de estado global
- **hooks/**: Lógica reutilizável
- **pages/**: Páginas principais da aplicação
- **layouts/**: Estrutura visual das páginas

## Padrões Adotados

- **Services**: Funções para requisições HTTP, centralizando integração com API
- **Hooks**: Lógica de estado e efeitos reutilizáveis
- **Context**: Estado global (ex: autenticação)
- **Components**: UI modular e reutilizável
- **Pages**: Containers de alto nível
- **Layouts**: Estrutura visual e navegação

## Convenções de Nomenclatura

- PascalCase para componentes e arquivos React
- camelCase para funções e variáveis
- kebab-case para arquivos estáticos

# Gerenciamento de Estado e Autenticação

- **Estado Global**: Utilização de Context API para autenticação e health check.
- **Autenticação**: Fluxo de login, logout e persistência de sessão via localStorage.
- **Proteção de Rotas**: Layouts privados para páginas protegidas.

# Estilização e Design System

- **Tailwind CSS**: Classes utilitárias para estilização rápida.
- **Shadcn UI**: Componentes acessíveis e customizáveis.
- **Temas**: Suporte a dark e light mode via context e variáveis CSS.
- **Customizações**: Possibilidade de sobrescrever estilos e temas.

# Configurações do Projeto

## Vite

- Build rápido e hot reload
- Configuração em `vite.config.ts`
- Suporte a path aliases

## Path Aliases

- Configurados em `tsconfig.json` e `vite.config.ts`
- Exemplo:
  ```ts
  import { Button } from '@/components/ui/button'
  ```

## Variáveis de Ambiente

- Utilização de arquivos `.env` para configuração de endpoints e chaves
- Exemplo:
  ```env
  VITE_API_URL=https://api.exemplo.com
  ```

# Integração com API

- **Client HTTP**: Configurado em `src/config/api.ts` usando `fetch` ou `axios`
- **Tratamento de Erros**: Centralizado nos services
- **Padronização de Responses**: Tipos definidos em TypeScript

# Docker

## Dockerfile

- Define ambiente Node.js, instala dependências e executa build
- Exemplo de build:
  ```dockerfile
  FROM node:18-alpine
  WORKDIR /app
  COPY package*.json ./
  RUN npm install
  COPY . .
  RUN npm run build
  EXPOSE 5173
  CMD ["npm", "run", "preview"]
  ```

## Como Rodar via Docker

1. Build da imagem:
   ```sh
   docker build -t albuns-frontend .
   ```
2. Rodar o container:
   ```sh
   docker run -p 5173:5173 albuns-frontend
   ```

## Comandos Principais

- `docker-compose up` para subir serviços integrados
- `docker build` e `docker run` para build e execução manual

# Scripts Disponíveis

Scripts definidos no `package.json`:

- `dev`: Inicia ambiente de desenvolvimento
- `build`: Gera build de produção
- `preview`: Executa build local
- `lint`: Executa linter

Exemplo:

```sh
npm run dev
npm run build
npm run preview
npm run lint
```

# Como Rodar o Projeto Localmente

## Pré-requisitos

- Node.js >= 18
- npm >= 9
- Docker (opcional)

## Passo a Passo

1. Instale as dependências:
   ```sh
   npm install
   ```
2. Configure o arquivo `.env` conforme necessário
3. Inicie o ambiente de desenvolvimento:
   ```sh
   npm run dev
   ```
4. Acesse `http://localhost:5173`

# Boas Práticas e Padrões

- Organização modular de código
- Padronização de componentes e serviços
- Utilização de tipagem estática
- Separação clara de responsabilidades
- Facilitar escalabilidade e manutenção

# Próximas feats

- Internacionalização (i18n)
- Integração com novos providers de autenticação
- Otimização de performance
- Documentação de componentes e serviços

---

Para dúvidas, sugestões ou contribuições, consulte os arquivos de configuração e siga as convenções do projeto.
