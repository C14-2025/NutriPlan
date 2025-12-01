describe("UserProfile Component", () => {

  beforeEach(() => {
    cy.intercept("POST", "/auth/login", {
      statusCode: 200,
      body: {
        id: 1,
        nome: "Teste",
        email: "teste@teste.com",
        idade: 25,
        peso: 70,
        altura: 170,
        objetivo: "Ganhar massa",
        sexo: "F",
        nivelAtividade: "Moderado"
      }
    }).as("loginMock");

    
    cy.visit("http://localhost:5173");

    // preenche login
    cy.get("#email").type("teste@teste.com");
    cy.get("#senha").type("123456");

    
    cy.contains("Entrar").click();

    cy.wait("@loginMock");

    cy.contains('Perfil').click();
  });

  it("Renderiza Perfil do Usuário", () => {
    cy.contains("Perfil do Usuário").should("exist");
  });

  it("Alterna estado de edição ao clicar em Editar Perfil", () => {
    cy.contains("Editar Perfil").click();
    cy.contains("Cancelar").should("exist");
  });

  it("Habilita inputs ao entrar no modo edição", () => {
    cy.contains("Editar Perfil").click();
    cy.get("input[type='number']").first().should("not.be.disabled");
  });

  it("Desabilita inputs quando não está editando", () => {
    cy.get("input[type='number']").first().should("be.disabled");
  });

  it("Permite alterar sexo", () => {
    cy.contains("Editar Perfil").click();
    cy.contains("Sexo").parent().find("button").click();
    cy.contains("Feminino").click();
    cy.contains("Feminino").should("exist");
  });

  it("Abre select de nível de atividade", () => {
    cy.contains("Editar Perfil").click();
    cy.contains("Nível de Atividade").parent().find("button").click();
    cy.contains("Moderadamente ativo").should("exist");
  });

  it("Permite alterar idade", () => {
    cy.contains("Editar Perfil").click();
    cy.contains("Idade").parent().find("input").clear().type("30");
    cy.contains("Salvar").click();
  });


  it("Salva ao clicar em salvar", () => {
    cy.contains("Editar Perfil").click();
    cy.contains("Salvar").click();
  });


  it("Cancelar restaura valores anteriores", () => {
    cy.contains("Editar Perfil").click();
    cy.contains("Idade").parent().find("input").clear().type("10");
    cy.contains("Cancelar").click();
    cy.contains("Idade").parent().find("input").should("not.have.value", "10");
  });

});
