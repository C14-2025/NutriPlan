describe("MealForm - Cadastro de Refeição", () => {
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

    cy.contains('Adicionar Refeição').click();
  });

  it("Deve renderizar todos os elementos da página de refeições", () => {
    cy.contains("Tipo de Refeição");
    cy.contains("Alimentos");
    cy.contains("Adicionar Alimento");
    cy.contains("Totais da Refeição");
    cy.contains("Adicionar Refeição");
  });

  it("Deve permitir trocar o tipo de refeição", () => {
    cy.get("[role='combobox']").first().click({ force: true });
    cy.get("[role='option']")
  .contains("Almoço", { matchCase: false })
  .click({ force: true });
  });

  it("Deve adicionar um novo alimento", () => {
    cy.contains("Adicionar Alimento").click({ force: true });
    cy.contains("Alimento 2").should("exist");
  });

  it("Deve selecionar um alimento comum", () => {
  
  cy.get("[role='combobox']").eq(1).click({ force: true });
  cy.get("div[role='listbox']", { timeout: 5000 })
    .should("be.visible")
    .within(() => {
      cy.contains("Arroz branco cozido").click({ force: true });
    });

  cy.get("input[placeholder='Ex: Arroz branco']")
    .first()
    .should("have.value", "Arroz branco cozido");

  cy.get("input[type='number']").eq(1).should("have.value", "130");
  });


  it("Deve preencher manualmente os campos", () => {
  cy.get("input[placeholder='Ex: Arroz branco']")
    .clear()
    .type("Ovo cozido");

  cy.get("input[type='number']").eq(1).clear().type("50");  // quantidade
  cy.get("input[type='number']").eq(2).clear().type("155"); // calorias

  cy.get("input[placeholder='Ex: Arroz branco']")
    .should("have.value", "Ovo cozido");
  });
});
