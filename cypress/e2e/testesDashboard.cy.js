describe("NutritionDashboard UI Tests", () => {

  beforeEach(() => {
    cy.visit("http://localhost:5173");
  });

  it("Renderiza o dashboard", () => {
    cy.contains("Calorias").should("exist");
  });

  it("Exibe calorias totais", () => {
    cy.contains("Calorias")
      .closest("div")
      .find(".text-2xl")
      .should("exist");
  });

  it("Exibe proteína total", () => {
    cy.contains("Proteína")
      .closest("div")
      .find(".text-2xl")
      .should("contain", "g");
  });

  it("Exibe carboidratos totais", () => {
    cy.contains("Carboidratos")
      .closest("div")
      .find(".text-2xl")
      .should("contain", "g");
  });

  it("Exibe gordura total", () => {
    cy.contains("Gordura")
      .closest("div")
      .find(".text-2xl")
      .should("contain", "g");
  });

  it("Mostra o título Totais da Refeição", () => {
    cy.contains("Totais da Refeição").should("exist");
  });

  it("Legenda do gráfico semanal existe", () => {
    cy.get(".recharts-legend-item").should("have.length.at.least", 4);
  });

  it("Títulos dos cards principais existem", () => {
    ["Calorias", "Proteína", "Carboidratos", "Gordura"].forEach(t => {
      cy.contains(t).should("exist");
    });
  });

  it("Gráfico de macros renderiza corretamente", () => {
    cy.get(".recharts-pie-sector").first().should("exist");
  });

  it("Dashboard atualiza valores ao mudar estado (interação)", () => {
    // Ajuste caso tenha um botão ou ação que adiciona refeições:
    cy.contains("Adicionar").click({ force: true }).should("exist");
  });

  it("Dashboard é responsivo em diferentes tamanhos de tela", () => {
    cy.viewport(320, 480);
    cy.contains("Calorias").should("be.visible");
    cy.viewport(768, 1024);
    cy.contains("Calorias").should("be.visible");
    cy.viewport(1440, 900);
    cy.contains("Calorias").should("be.visible");
  });

  it("Dashboard carrega rapidamente", () => {
    cy.visit("http://localhost:5173", {
      onLoad: (contentWindow) => {
        const loadTime = contentWindow.performance.timing.loadEventEnd - contentWindow.performance.timing.navigationStart;
        expect(loadTime).to.be.lessThan(2000);
      }
    });
  });

  it("Mantém funcionalidade após recarregar a página", () => {
    cy.reload();
    cy.contains("Calorias").should("exist");
  });

  it("Exibe carboidratos totais maiores que 100g", () => {
    cy.contains("Carboidratos")
    .closest("div")
    .find(".text-2xl")
    .should(($el) => {
     const value = parseInt($el.text());
    expect(value).to.be.greaterThan(100);
    });
    });
    
});
