# NutriPlan

*Seu assistente digital para um estilo de vida mais saudável.*

---

## 📝 Descrição do Projeto

O **NutriPlan** é uma aplicação web desenvolvida para auxiliar no acompanhamento nutricional diário. Com ela, é possível:

* **Sistema de Autenticação**: Login e cadastro de usuários
* **Registrar refeições consumidas** com alimentos e quantidades
* **Dashboard nutricional** com gráficos e métricas
* **Histórico nutricional** completo
* **Cálculo automático** de macronutrientes (proteínas, carboidratos e gorduras)
* **Perfil do usuário** com dados pessoais e metas nutricionais

Este projeto foi desenvolvido como parte do curso **C14-2025** e visa promover hábitos alimentares mais saudáveis por meio da tecnologia.

---

## ⚙️ Funcionalidades

### 🔐 Sistema de Autenticação
* **Cadastro de usuários** com dados pessoais (nome, idade, peso, altura, sexo, nível de atividade, objetivo)
* **Login seguro** com validação de credenciais
* **Sessão de usuário** mantida no localStorage

### 🍽️ Gestão de Refeições
* **Cadastro de refeições** com múltiplos alimentos
* **Busca de alimentos** na base de dados
* **Cálculo automático** de macronutrientes por refeição
* **Histórico completo** de refeições por usuário

### 📊 Dashboard Nutricional
* **Cards de progresso** diário (calorias, proteínas, carboidratos, gorduras)
* **Gráfico de pizza** com distribuição calórica dos macronutrientes
* **Gráfico de linha** com tendência semanal
* **Metas personalizadas** baseadas no perfil do usuário

### 👤 Perfil do Usuário
* **Dados pessoais** editáveis (nome, idade, peso, altura, sexo)
* **Nível de atividade** (sedentário, levemente ativo, moderadamente ativo, muito ativo, extremamente ativo)
* **Objetivos** (perder peso, manter peso, ganhar peso, ganhar massa muscular)
* **Metas nutricionais** personalizáveis

---

## 🛠️ Tecnologias Utilizadas

### Backend
* **Java 17** com Spring Boot 3.5.5
* **Spring Data JPA** para persistência
* **MySQL** como banco de dados
* **Maven** para gerenciamento de dependências
* **Jenkins** para CI/CD com pipeline automatizado
* **Spotless** para formatação automática de código

### Frontend
* **React 19** com TypeScript
* **Vite** como bundler
* **Tailwind CSS** para estilização
* **Radix UI** para componentes
* **Recharts** para gráficos
* **Axios** para requisições HTTP

---

## 🚀 Como Rodar o Projeto

### Pré-requisitos

* [JDK 17 ou superior](https://www.oracle.com/java/technologies/javase-jdk17-downloads.html)
* [Maven](https://maven.apache.org/install.html)
* [Node.js 18+](https://nodejs.org/)
* [MySQL 8.0+](https://dev.mysql.com/downloads/mysql/)
* [Git](https://git-scm.com/)

### Configuração do Banco de Dados

1. Crie um banco MySQL:
   ```sql
   CREATE DATABASE nutriplan;
   ```

2. Configure as credenciais em `src/main/resources/application.properties`

### Backend (Spring Boot)

1. Clone o repositório:
   ```bash
   git clone https://github.com/C14-2025/NutriPlan.git
   cd NutriPlan
   ```

2. Compile e execute o backend:
   ```bash
   mvn clean install
   mvn spring-boot:run
   ```

3. O backend estará rodando em: `http://localhost:8080`

### Frontend (React)

1. Navegue para a pasta frontend:
   ```bash
   cd frontend
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Execute o frontend:
   ```bash
   npm run dev
   ```

4. Acesse a aplicação em: `http://localhost:5173`

---

## 🔧 Pipeline CI/CD

O projeto utiliza **Jenkins** com pipeline automatizado que:

* ✅ Executa testes automatizados
* ✅ Compila e empacota a aplicação
* ✅ Falha o build se o código não estiver formatado corretamente
* Para rodar jenkins, no cmd:
  
```bash
cd "C:\Program Files\Jenkins"
```

```bash
 java -jar jenkins.war --httpPort=8081
```

### Formatação de Código

Para formatar o código automaticamente:
```bash
mvn spotless:apply
```

Para verificar formatação:
```bash
mvn spotless:check
```

---

## 📱 Funcionalidades por Tela

### 🏠 Dashboard
* Visão geral dos macronutrientes do dia
* Progresso em relação às metas diárias
* Gráfico de distribuição calórica
* Tendência semanal de consumo

### ➕ Adicionar Refeição
* Busca e seleção de alimentos
* Definição de quantidades
* Cálculo automático de macronutrientes
* Salvamento da refeição

### 📋 Histórico
* Lista de todas as refeições registradas
* Filtros por data e tipo de refeição
* Edição e exclusão de refeições
* Detalhes nutricionais por refeição

### 👤 Perfil
* Dados pessoais do usuário
* Configuração de metas nutricionais
* Nível de atividade física
* Objetivos de saúde

---

## 🧪 Testes

O projeto inclui testes automatizados com **Cypress** para:

* ✅ Testes de interface do usuário
* ✅ Fluxos de autenticação
* ✅ Funcionalidades do dashboard
* ✅ Gestão de perfil do usuário

Para executar os testes:
```bash
npx cypress run
```

---
### Estrutura do Projeto
```
NutriPlan/
├── src/main/java/          # Código fonte Java (Backend)
├── src/test/java/          # Testes unitários Java
├── frontend/src/           # Código fonte React (Frontend)
├── cypress/                # Testes E2E
├── Jenkinsfile            # Pipeline CI/CD
└── README.md              # Este arquivo
```



