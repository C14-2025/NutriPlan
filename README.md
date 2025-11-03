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

* **Cadastro de Refeições**: Adicione refeições com detalhes como nome, calorias e macronutrientes.
* **Histórico Nutricional**: Acesse um histórico completo das refeições registradas.
* **Cálculo de Macronutrientes**: Obtenha o total de proteínas, carboidratos e gorduras consumidos.

---

## 🛠️ Tecnologias Utilizadas

* **Frontend**: HTML, CSS, JavaScript
* **Backend**: Java (Spring Boot)
* **Banco de Dados**: H2 Database
* **Ferramentas**: Maven, Git

---

## 🚀 Como Rodar o Projeto

### Pré-requisitos

* [JDK 17 ou superior](https://www.oracle.com/java/technologies/javase-jdk17-downloads.html)
* [Maven](https://maven.apache.org/install.html)
* [Git](https://git-scm.com/)

### Passos

1. Clone o repositório:

   ```bash
   git clone https://github.com/C14-2025/NutriPlan.git
   cd NutriPlan
   ```

2. Compile o projeto:

   ```bash
   mvn clean install
   ```

3. Execute a aplicação:

   ```bash
   mvn spring-boot:run
   ```

4. Acesse a aplicação no seu navegador:

   ```
   http://localhost:8080
   ```
   
# PostgreSQL + pgAdmin Docker

Este projeto usa Docker para rodar **PostgreSQL** e **pgAdmin 4**, permitindo que o grupo trabalhe com o mesmo banco (via backup/importação) sem precisar compartilhar a pasta de dados diretamente.

---
## Comandos Docker básicos

### Subir os containers

```bash
docker-compose up -d
```

### Parar os containers

```bash
docker-compose down
```

### Verificar containers rodando

```bash
docker ps
```
---
## Criar backup do banco (export)

Sempre que precisar compartilhar os dados com o grupo:

```bash
docker exec -t postgres pg_dump -U admin jenkins_db > backup.sql
```

* Isso gera o arquivo `backup.sql` na máquina local.
---
## Restaurar backup do banco (import)

No outro computador do grupo:

```bash
docker exec -i postgres psql -U admin -d jenkins_db < backup.sql
```

* Isso popula o banco com os dados do backup.



