# NutriPlan

*Seu assistente digital para um estilo de vida mais saudável.*

---

## 📝 Descrição do Projeto

O **NutriPlan** é uma aplicação web desenvolvida para auxiliar no acompanhamento nutricional diário. Com ela, é possível:

* Registrar refeições consumidas.
* Visualizar histórico nutricional.
* Calcular macronutrientes (proteínas, carboidratos e gorduras).

Este projeto foi desenvolvido como parte do curso **C14-2025** e visa promover hábitos alimentares mais saudáveis por meio da tecnologia.

---

## ⚙️ Funcionalidades

### 🍽️ Gestão de Refeições
* **Cadastro de Refeições**: Adicione refeições com detalhes como nome, calorias e macronutrientes.
* **Controle de Porções**: Defina quantidades específicas para cada alimento
* **Tipos de Refeição**: Café da manhã, almoço, jantar e lanches
* **Histórico Nutricional**: Acesse um histórico completo das refeições registradas.
* **Cálculo Automático**: Totais nutricionais calculados em tempo real

### 📈 Dashboard Nutricional
* **Visualizações Gráficas**: Gráficos interativos com Recharts
* **Relatórios Semanais**: Análise de tendências nutricionais
* **Macronutrientes**: Proteínas, carboidratos, gorduras e calorias

### 👤 Perfil Personalizado
* **Dados Biométricos**: Idade, peso, altura e objetivos
* **Metas Customizáveis**: Defina suas próprias metas nutricionais
* **Histórico Completo**: Acesso a todas as refeições registradas

---

## 🛠️ Tecnologias Utilizadas

### Backend
* **Java 17** com **Spring Boot 3.5.5**
* **Spring Data JPA** para persistência
* **MySQL** como banco principal
* **Nutritionix API** para dados nutricionais
* **Maven** para gerenciamento de dependências

### Frontend
* **React 19** com **TypeScript**
* **Vite** como build tool
* **Tailwind CSS** + **Radix UI** para interface
* **Recharts** para gráficos e visualizações
* **Axios** para comunicação com API

### DevOps & Testes
* **Docker Compose** (Jenkins + PostgreSQL para CI/CD)
* **Cypress** para testes E2E
* **JUnit + Mockito** para testes unitários
* **Jenkins** para CI/CD

---

## 🚀 Como Rodar o Projeto

### Pré-requisitos

* [JDK 17 ou superior](https://www.oracle.com/java/technologies/javase-jdk17-downloads.html)
* [Node.js 18+](https://nodejs.org/) e npm
* [Maven](https://maven.apache.org/install.html)
* [MySQL](https://dev.mysql.com/downloads/) ou [Docker](https://www.docker.com/)
* [Git](https://git-scm.com/)

### Passos

1. Clone o repositório:
   ```bash
   git clone https://github.com/C14-2025/NutriPlan.git
   cd NutriPlan
   ```

2. **Configure o banco MySQL:**
   - Crie um banco chamado `nutriplan`
   - Usuário: `root`, Senha: `root`

3. **Execute o Backend:**
   ```bash
   mvn clean install
   mvn spring-boot:run
   ```

4. **Execute o Frontend:**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

5. **Acesse a aplicação:**
   - Frontend: `http://localhost:5173`
   - Backend API: `http://localhost:8080`
   
---

## 📦 Docker & CI/CD

### Jenkins + PostgreSQL (apenas para CI/CD)

```bash
# Subir todos os serviços
docker-compose up -d

# Parar os containers
docker-compose down

# Verificar status
docker ps
```

### Backup Jenkins

```bash
# Criar backup do Jenkins
docker exec -t postgres pg_dump -U admin jenkins_db > backup.sql

# Restaurar backup do Jenkins
docker exec -i postgres psql -U admin -d jenkins_db < backup.sql
```

---

## 🧪 Testes

### Testes Unitários (Backend)
```bash
mvn test
```

### Testes E2E (Frontend)
```bash
cd frontend
npx cypress open
# ou
npx cypress run
```

---

## 📚 API Externa

O projeto integra com a **Nutritionix API** para buscar informações nutricionais:
- Busca automática de alimentos
- Dados nutricionais precisos
- Configuração em `application.properties`



