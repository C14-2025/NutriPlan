# NutriPlan

*Seu assistente digital para um estilo de vida mais saudável.*

---

## 📝 Descrição do Projeto

O **NutriPlan** é uma aplicação web full-stack desenvolvida para auxiliar no acompanhamento nutricional diário. Com ela, é possível:

* Registrar refeições consumidas
* Visualizar histórico nutricional com gráficos interativos
* Calcular macronutrientes (proteínas, carboidratos e gorduras)
* Dashboard com métricas nutricionais

Este projeto foi desenvolvido como parte do curso **C14-2025** e visa promover hábitos alimentares mais saudáveis por meio da tecnologia.

---

## ⚙️ Funcionalidades

* **Dashboard Interativo**: Visualize suas métricas nutricionais com gráficos
* **Cadastro de Refeições**: Adicione refeições com detalhes nutricionais
* **Histórico Nutricional**: Acesse um histórico completo das refeições registradas.

* **Cálculo de Macronutrientes**: Obtenha o total de proteínas, carboidratos e gorduras consumidos.


---

## 🛠️ Tecnologias Utilizadas

### Frontend
* **React 19** com TypeScript
* **Tailwind CSS** para estilização
* **Vite** como bundler
* **Radix UI** para componentes
* **Recharts** para gráficos
* **Axios** para requisições HTTP

### Backend
* **Java 17** com Spring Boot 3.5.5
* **Spring Data JPA** para persistência
* **Maven** para gerenciamento de dependências
* **Spotless** para formatação de código

### Banco de Dados
* **MySQL** 8.0+

### DevOps & Qualidade
* **Jenkins** para CI/CD com pipeline automatizado
* **Cypress** para testes E2E
* **JUnit** para testes unitários
* **Google Java Format** para padronização de código

---

## 🚀 Como Rodar o Projeto

### Pré-requisitos

* [JDK 17 ou superior](https://www.oracle.com/java/technologies/javase-jdk17-downloads.html)
* [Node.js 18+ e npm](https://nodejs.org/)
* [Maven](https://maven.apache.org/install.html)
* [MySQL 8.0+](https://dev.mysql.com/downloads/mysql/)
* [Git](https://git-scm.com/)

### Passos

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/C14-2025/NutriPlan.git
   cd NutriPlan
   ```

2. **Configure o banco de dados MySQL:**
   - Crie um banco chamado `nutriplan`
   - Configure usuário `root` com senha `root`
   - Ou ajuste as credenciais em `src/main/resources/application.properties`

3. **Execute o backend:**
   ```bash
   mvn clean install
   mvn spring-boot:run
   ```

4. **Execute o frontend:**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

5. **Acesse a aplicação:**
   - **Frontend**: http://localhost:5173
   - **Backend API**: http://localhost:8080

---

## 🧪 Testes

### Testes unitários (Backend)
```bash
mvn test
```

### Testes E2E (Frontend)
```bash
cd frontend
npx cypress open
```

---

## 🔧 Desenvolvimento

### Formatação de código
```bash
mvn spotless:apply
```

### Build de produção
```bash
# Backend
mvn clean package

# Frontend
cd frontend
npm run build
```

---

## 🚀 CI/CD

O projeto utiliza **Jenkins** com pipeline automatizado que:
* Executa testes unitários
* Verifica formatação de código (Google Java Format)
* Gera builds automaticamente
* Falha se código não estiver bem formatado

Para corrigir formatação:
```bash
mvn spotless:apply
```



