describe("MealHistory - Histórico de Refeições", () => {
  beforeEach(() => {
    // simula usuário logado
    window.localStorage.setItem('usuarioId', '1');
    window.localStorage.setItem('usuarioNome', 'Teste');

    // mock da rota principal
    cy.intercept("GET", "/refeicao/usuario/1", {
      statusCode: 200,
      body: [
        {
          id: 1,
          tipo: "Almoço",
          dataHora: "2025-12-01T12:00:00",
          alimentos: [
            {
              id: 10,
              nome: "Arroz",
              calorias: 130,
              proteinas: 3,
              carboidratos: 28,
              gorduras: 1
            }
          ],
          quantidadePorAlimento: {
            10: 150
          }
        }
      ]
    }).as("getMeals");

    cy.visit("http://localhost:5173");
    cy.wait("@getMeals");
    cy.contains("Histórico").click();
  });


  it("Deve exibir o histórico da refeição corretamente", () => {
    cy.contains("Almoço").should("exist");
    cy.contains("Arroz").should("exist");

    // verifica quantidade vinda do backend
    cy.contains("150").should("exist");

  });


  it("Deve filtrar por tipo de refeição", () => {
    cy.contains("Tipo de Refeição").click();
    cy.contains("Almoço").click();

    cy.contains("Almoço").should("exist");
  });


  it("Deve filtrar por data", () => {
    cy.get("input[type='date']").type("2025-12-01");
    cy.contains("Almoço").should("exist");
  });


  it("Deve abrir o diálogo de edição da refeição", () => {
    cy.contains("Almoço")
      .parents("[data-meal-item]")
      .find("button")
      .contains("Editar")
      .click();

    cy.contains("Editar Refeição").should("exist");

    cy.get("[role='combobox']").click();
    cy.contains("Jantar").click();
  });


  it("Deve excluir uma refeição", () => {
    cy.intercept("DELETE", "/refeicao/1", {
      statusCode: 204
    }).as("deleteMeal");

    cy.contains("Almoço")
      .parents("[data-meal-item]")
      .find("button")
      .contains("Excluir")
      .click();

    cy.on("window:confirm", () => true);

    cy.wait("@deleteMeal");
  });
});
