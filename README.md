# Upple 🍏

> Uma plataforma mobile para descobrir, avaliar e discutir projetos de software de código aberto e gratuitos.

Upple é um aplicativo construído com React Native e Supabase, projetado para ser um hub comunitário onde desenvolvedores e entusiastas de tecnologia podem compartilhar e descobrir novos projetos open-source, votar nos seus favoritos e participar de discussões.

---

### ✨ Funcionalidades

O aplicativo possui um conjunto robusto de funcionalidades tanto para usuários quanto para administradores.

#### Para Usuários:
- ✅ **Autenticação Completa:** Cadastro, Login e Logout.
- ✅ **Feed Principal:** Ranking semanal dos posts mais votados e uma lista de posts recentes.
- ✅ **Criação de Posts:** Formulário para criar novos posts com nome, descrição, tipo (App/Software), links e logo.
- ✅ **Interação Social:**
    - **Votos:** Sistema de upvote/downvote em posts.
    - **Comentários:** Adicionar e visualizar comentários em cada post.
- ✅ **Sistema de Denúncias:** Usuários podem denunciar posts que violem as diretrizes.
- ✅ **Busca:** Funcionalidade para pesquisar posts por nome ou descrição.
- ✅ **Visualização de Detalhes:** Tela dedicada para cada post com todas as informações.
- ✅ **Perfil de Usuário:**
    - Visualizar todos os posts criados pelo próprio usuário.
    - Editar e Excluir seus próprios posts.

#### 👑 Para Administradores:
- ✅ **Painel de Controle Exclusivo:** Rota de acesso exclusiva para administradores dentro do app.
- ✅ **Gerenciamento de Usuários:**
    - Visualizar e pesquisar todos os usuários.
    - Promover usuários a administradores ou rebaixá-los.
    - Excluir usuários da plataforma (com exclusão em cascata de todos os seus dados).
- ✅ **Gerenciamento de Posts:**
    - Visualizar e pesquisar todos os posts da plataforma.
    - Excluir qualquer post.
- ✅ **Moderação de Conteúdo:**
    - Visualizar todas as denúncias feitas por usuários.
    - Acessar e excluir posts denunciados.

---

### 🚀 Tecnologias Utilizadas

- **Linguagem:** TypeScript
- **Frontend:** React Native com Expo
- **Navegação:** Expo Router
- **Backend & Banco de Dados:** Supabase (Autenticação, PostgreSQL, Storage)

---

### 🏁 Começando (Getting Started)

Siga os passos abaixo para configurar e rodar o projeto localmente.

#### **Pré-requisitos**

- [Node.js](https://nodejs.org/) (versão LTS recomendada)
- [Git](https://git-scm.com/)
- Conta no [Supabase](https://supabase.com/)
- App [Expo Go](https://expo.dev/go) no seu celular ou um emulador/simulador configurado.

#### **1. Configuração do Backend (Supabase)**

1.  **Crie o Projeto:** Crie um novo projeto no seu painel do Supabase.
2.  **Execute o SQL:** Vá para o **SQL Editor** e execute todo o script SQL do seu projeto (tabelas, views, policies, functions, triggers). É recomendado ter um arquivo `schema.sql` com todos os comandos que criamos.
3.  **Crie o Bucket:** Vá para a seção **Storage** e crie um bucket público chamado `images`. Aplique as políticas de segurança que definimos para permitir uploads de usuários autenticados e leitura pública.
4.  **Copie as Chaves:** Em **Project Settings > API**, copie sua `URL` e sua `anon public key`.

#### **2. Configuração do Frontend (Local)**

1.  **Clone o Repositório:**
    ```bash
    git clone https://github.com/isaac-const/upple.git
    cd upple
    ```
2.  **Instale as Dependências:**
    ```bash
    npm install
    ```
3.  **Configure as Variáveis de Ambiente:**
    * Crie um arquivo chamado `.env` na raiz do projeto.
    * Copie o conteúdo abaixo para dentro dele e substitua com as suas chaves do Supabase:
      ```
      EXPO_PUBLIC_SUPABASE_URL=SUA_URL_DO_SUPABASE_AQUI
      EXPO_PUBLIC_SUPABASE_ANON_KEY=SUA_ANON_KEY_DO_SUPABASE_AQUI
      ```
4.  **Adicione sua Logo:**
    * Coloque o arquivo da sua logo em `assets/images/logo.png`.

5.  **Rode o Aplicativo:**
    ```bash
    npx expo start
    ```
    - Escaneie o QR code com o Expo Go ou rode em um emulador.

---

### 📁 Estrutura de Pastas

O projeto está organizado da seguinte forma:

```
/
|-- assets/         # Imagens e fontes
|-- src/
|   |-- app/        # Arquivos de rota (Expo Router)
|   |   |-- (admin)/  # Grupo de rotas do painel admin
|   |   |-- (auth)/   # Grupo de rotas de autenticação
|   |   |-- (tabs)/   # Grupo de rotas principal (com abas)
|   |   |-- _layout.tsx # Layout raiz do app
|   |-- components/   # Componentes reutilizáveis (botões, cards, etc.)
|   |-- constants/    # Constantes (cores, etc.)
|   |-- lib/          # Lógica auxiliar (cliente Supabase, AuthContext)
|-- .env            # Variáveis de ambiente (NÃO ENVIAR PARA O GIT)
|-- README.md       # Este arquivo
|-- package.json
```

### 📬 Contato

isaac-const - [isaaccs.code@gmail.com](mailto:isaaccs.code@gmail.com)

Link do Projeto: [https://github.com/isaac-const/upple](https://github.com/isaac-const/upple)
