describe("NutritionDashboard UI Tests", () => {

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
    cy.contains('Dashboard').click();
  });

  it("Deve exibir corretamente os valores de macros do dia", () => {
  cy.wait("@getMacros");

  cy.contains("500").should("exist");        // calorias
  cy.contains("40g").should("exist");        // proteína
  cy.contains("60g").should("exist");        // carbs
  cy.contains("20g").should("exist");        // gordura
  });

  it("Deve renderizar as barras de progresso", () => {
  cy.get(".progress").should("have.length", 4);
  });

  it("Renderiza o gráfico de distribuição de macronutrientes", () => {
  cy.wait("@getDistrib");

  cy.get("svg").should("exist"); // SVG do gráfico
  cy.contains("Proteína").should("exist");
  cy.contains("Carboidratos").should("exist");
  cy.contains("Gordura").should("exist");
  });

  it("Renderiza o gráfico de tendência semanal", () => {
  cy.wait("@getWeekly");

  cy.contains("Tendência Semanal").should("exist");
  cy.get("svg").should("exist"); // linha do gráfico
  });

  it("Carrega tudo e exibe o dashboard completo", () => {
  cy.wait("@getMacros");
  cy.wait("@getWeekly");
  cy.wait("@getDistrib");

  cy.contains("Distribuição de Macronutrientes").should("exist");
  cy.contains("Tendência Semanal").should("exist");

  cy.get("svg").its("length").should("be.gte", 2); // um do pie e um do line chart
  });

  it("Calcula corretamente valores restantes", () => {
  const goals = {
    dailyCalories: 2000,
    dailyProtein: 120,
    dailyCarbs: 250,
    dailyFat: 70
  };

  // Inserir metas fixas no localStorage, igual no seu App.tsx
  window.localStorage.setItem("userGoals", JSON.stringify(goals));

  cy.wait("@getMacros");

  cy.contains("1500 restantes").should("exist"); // 2000 - 500
  cy.contains("80.0g restantes").should("exist"); // 120 - 40
  });

});
