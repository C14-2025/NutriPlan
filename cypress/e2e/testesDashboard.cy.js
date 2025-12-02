describe("NutritionDashboard UI Tests", () => {

  beforeEach(() => {
    // simular usuário autenticado
    window.localStorage.setItem("usuarioId", "1");
    window.localStorage.setItem("usuarioNome", "Giovana");

    cy.intercept("GET", "/dashboard/macros-por-dia/1/2025-12-01", {
      statusCode: 200,
      body: {
        calorias: 1500,
        proteinas: 100,
        carboidratos: 180,
        gorduras: 50
      }
    }).as("getMacros");

    cy.intercept("GET", "/dashboard/relatorio-semanal/1", {
      statusCode: 200,
      body: [
        { day: "2025-11-25", calories: 1800, protein: 120, carbs: 200, fat: 60 },
        { day: "2025-11-26", calories: 1700, protein: 115, carbs: 195, fat: 55 }
      ]
    }).as("getWeekly");

    cy.intercept("GET", "/dashboard/distribuicao-calorica/1/2025-12-01", {
      statusCode: 200,
      body: {
        caloriasProteina: 400,
        caloriasCarboidrato: 700,
        caloriasGordura: 400
      }
    }).as("getDistrib");
        
    cy.visit("http://localhost:5173"); 

    cy.contains('Dashboard').click();
  });

  it("Deve exibir os cards principais com dados corretos", () => {
    cy.wait("@getMacros");
    cy.wait("@getWeekly");
    cy.wait("@getDistrib");

    cy.contains("Calorias").should("exist");
    cy.contains("1500").should("exist");

    cy.contains("Proteína").should("exist");
    cy.contains("100.0g").should("exist");

    cy.contains("Carboidratos").should("exist");
    cy.contains("180.0g").should("exist");

    cy.contains("Gordura").should("exist");
    cy.contains("50.0g").should("exist");
  });

  it("Deve renderizar o gráfico de pizza com 3 fatias", () => {
    cy.wait("@getDistrib");

    cy.get("svg").should("exist"); // PieChart
    cy.contains("Proteína").should("exist");
    cy.contains("Carboidratos").should("exist");
    cy.contains("Gordura").should("exist");
  });

  it("Deve renderizar o gráfico de linha com dados semanais", () => {
    cy.wait("@getWeekly");

    cy.get("svg").should("exist"); // LineChart
    cy.contains("2025-11-25").should("exist");
    cy.contains("2025-11-26").should("exist");
  });

  it("Carrega tudo e exibe o dashboard completo", () => {
  cy.wait("@getMacros");
  cy.wait("@getWeekly");
  cy.wait("@getDistrib");

  cy.contains("Distribuição de Macronutrientes").should("exist");
  cy.contains("Tendência Semanal").should("exist");

  cy.get("svg").its("length").should("be.gte", 2); // um do pie e um do line chart
  });
});