describe("MealHistory - Histórico de Refeições", () => {
  const mealsMock = [
    {
      id: '1',
      name: 'Refeição',
      date: '2025-12-01',
      usuario: { id: 1 }
    }
  ];

  const alimentosMock = [
    { id: 10, nome: 'Arroz branco cozido', calorias: 130, proteinas: 2.4, carboidratos: 28.2, gorduras: 0.3 }
  ];

  beforeEach(() => {
    
    window.localStorage.setItem('usuarioId', '1');
    window.localStorage.setItem('usuarioNome', 'Teste');

    
    cy.intercept('GET', '/alimento', { statusCode: 200, body: alimentosMock }).as('getFoods');
    cy.intercept('GET', '/refeicao/usuario/1', { statusCode: 200, body: mealsMock }).as('getMeals');
    cy.intercept('GET', '/refeicao/1/alimentos', {
      statusCode: 200,
      body: [{ alimentoId: 10, quantidade: 150 }]
    }).as('getMealFoods');
    cy.intercept('DELETE', '/refeicao/1', { statusCode: 204 }).as('deleteMeal');
    cy.intercept('PUT', '/refeicao/1', { statusCode: 200 }).as('updateMeal');

    cy.visit('http://localhost:5173');

    cy.contains('Histórico').click();

  });

  it("Deve exibir o histórico da refeição corretamente", () => {
    cy.contains("Refeição").should("exist");
    cy.contains("Arroz").should("exist");
    cy.contains("150").should("exist");
  });

  it("Deve filtrar por tipo de refeição", () => {
    cy.contains("Tipo de Refeição").click();
    cy.contains("Refeição").click();
    cy.contains("Refeição").should("exist");
  });

  it("Deve filtrar por data", () => {
    cy.get("input[type='date']").invoke('val', '2025-12-01').trigger('change');
    cy.contains("Refeição").should("exist");
  });

  it("Deve editar uma refeição", () => {
    cy.contains("Editar").click();
    cy.get("[role='combobox']");
    cy.contains("Almoço").click({ force: true });
    cy.get("button").contains("Salvar").click({ force: true });
    cy.contains("Almoço").should("exist");
  });

  it("Deve editar e excluir uma refeição", () => {
    cy.contains("Editar").click();
    cy.get("[role='combobox']");
    cy.contains("Almoço").click({ force: true });
    cy.get("button").contains("Salvar").click({ force: true });
    cy.contains("Almoço").should("exist");
    cy.contains("Excluir").click();
    cy.on('window:confirm', () => true);
    cy.wait('@deleteMeal');
    cy.contains("Almoço").should("not.exist");
  });

});