# ✂️ RaphaBarber — Interface Premium (React)

<div align="center">

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-0055FF?style=for-the-badge&logo=framer&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Axios](https://img.shields.io/badge/Axios-5A29E4?style=for-the-badge&logo=axios&logoColor=white)

**Interface premium e responsiva para agendamentos e portfólio, integrada com API Spring Boot.** 💈✨

[![Acesse o Sistema](https://img.shields.io/badge/Acesse_o_Sistema-Clique_Aqui-blue?style=for-the-badge&logo=vercel)](https://raphabarbercg-front.vercel.app/)

</div>

---

## 📖 Sobre o Projeto

Este é o front-end do **RaphaBarber**. A aplicação foi construída para automatizar o sistema de agendamentos e exibição de trabalhos de um barbeiro profissional em Campina Grande - PB. O foco principal foi criar uma **experiência visual de alto impacto (Premium Dark Mode)**, garantindo que o cliente finalize o agendamento em poucos segundos.

---

## ✨ Funcionalidades Principais

- 🔐 **Login e Cadastro:** Autenticação única para cliente e admin, com redirecionamento automático por perfil (`ADMIN` → painel, cliente → agendamento).
- 🔐 **Painel Administrativo:** Controle total de agendamentos, serviços e portfólio (Protegido por JWT).
- 📅 **Agendamento em Tempo Real:** Validação de horários e datas integrada ao backend Java.
- 🗓️ **Meus Agendamentos:** Área do cliente logado para acompanhar o status e cancelar agendamentos.
- 📱 **Totalmente Responsivo:** Experiência otimizada para o cliente agendar via celular ou tablet.
- 🔄 **Consumo de API:** Comunicação segura com o backend Java Spring Boot via Axios.
- 🎨 **Estilização Moderna:** Design contemporâneo com animações fluidas usando Framer Motion.

---

## 🚀 Tecnologias Utilizadas

| Tecnologia | Descrição |
|---|---|
| **React** | Biblioteca principal para a construção da interface SPA |
| **Tailwind CSS** | Framework de estilização utilitário para design Dark Mode |
| **Framer Motion** | Biblioteca para animações e transições de tela fluidas |
| **Axios** | Cliente HTTP para integração com a API REST |
| **React Router DOM** | Roteamento das páginas e proteção de rotas privadas (AuthGuard) |
| **Lucide React** | Ícones utilizados em toda a interface |
| **Vite** | Ferramenta de build para alta performance em desenvolvimento |
| **Vercel** | Plataforma de hospedagem do Front-end |

---

## 📦 Como Rodar Localmente

### Pré-requisitos
- Node.js instalado
- Backend do RaphaBarber (Spring Boot) rodando, ou a URL de uma API já publicada

### Passos
```bash
# Clone o repositório
git clone https://github.com/claudiondev/raphabarber-front

# Entre na pasta
cd raphabarber-front

# Instale as dependências
npm install

# Configure a URL da API (crie um arquivo .env na raiz)
echo "VITE_API_URL=http://localhost:8080" > .env

# Inicie o servidor de desenvolvimento
npm run dev
```

> Sem o `VITE_API_URL`, a aplicação tenta acessar `http://localhost:8080` por padrão — é necessário ter o backend rodando nesse endereço ou apontar a variável para a API em produção.

👨‍💻 Autor
Claudio Nascimento

🔗 GitHub: @claudiondev

💼 LinkedIn: linkedin.com/in/claudionascimento-dev

⭐ Se este projeto foi útil, deixe uma star! ⭐
