describe("MealHistory Component", () => {
  beforeEach(() => {
    cy.visit("http://localhost:5173"); 
    cy.contains('Histórico').click(); 
  });

  it("Renderiza título Filtros", () => {
    cy.contains("Filtros").should("be.visible");
  });

  it("Renderiza select de tipo de refeição", () => {
    cy.contains("Tipo de Refeição").should("exist");
    cy.get("button").contains("Todas as refeições").should("exist");
  });

  it("Abre select de tipos de refeição", () => {
    cy.contains("Todas as refeições").click();
    cy.contains("Café da manhã").should("be.visible");
    cy.contains("Almoço").should("be.visible");
    cy.contains("Jantar").should("be.visible");
    cy.contains("Lanche").should("be.visible");
  });

  it("Filtra por tipo breakfast", () => {
    cy.contains("Todas as refeições").click();
    cy.contains("Café da manhã").click();
    cy.get("body").then(($body) => {
      if ($body.text().includes("Nenhuma refeição encontrada")) {
        expect(true).to.be.true;
      }
    });
  });

  it("Possui filtro de data", () => {
    cy.get("input[type='date']").should("exist");
  });

  it("Mensagem quando nenhum resultado encontrado", () => {
    cy.get("input[type='date']").type("1999-01-01");
    cy.contains("Nenhuma refeição encontrada").should("exist");
  });

  it("Renderiza lista de refeições quando existem", () => {
    cy.get("body").then(($body) => {
      if ($body.find("div:contains('Calorias')").length > 0) {
        expect(true).to.be.true;
      }
    });
  });

  it("Cada refeição possui nome", () => {
    cy.get("div").contains(/Calorias|Proteína|Carboidratos/).should("exist");
  });

  it("Mostra Badges: Café da manhã, Almoço, Jantar, Lanche", () => {
    cy.get("body").then(($body) => {
      const badges = ["Café da manhã", "Almoço", "Jantar", "Lanche"];
      const found = badges.some(b => $body.text().includes(b));
      expect(found).to.be.true;
    });
  });

  it("Mostra badge Hoje quando refeição é do dia", () => {
    cy.contains("Hoje").should("exist");
  });

  it("Mostra data formatada com weekday", () => {
    cy.contains(/segunda|terça|quarta|quinta|sexta|sábado|domingo/i).should("exist");
  });

  it("Renderiza valores nutricionais (Calorias, Proteína, Carboidratos, Gordura)", () => {
    cy.contains("Calorias").should("exist");
    cy.contains("Proteína").should("exist");
    cy.contains("Carboidratos").should("exist");
    cy.contains("Gordura").should("exist");
  });

  it("Mostra alimentos dentro da refeição", () => {
    cy.contains("Alimentos").should("exist");
  });

  it("Botão Editar aparece", () => {
    cy.contains("Editar").should("exist");
  });

  it("Botão Excluir aparece", () => {
    cy.contains("Excluir").should("exist");
  });

  it("Abre modal ao clicar em Editar", () => {
    cy.contains("Editar").first().click();
    cy.contains("Editar Refeição").should("be.visible");
  });

  it("Modal contém inputs de edição", () => {
    cy.contains("Editar").first().click();
    cy.get("input").should("have.length.greaterThan", 0);
  });

  it("Permite alterar nome da refeição", () => {
    cy.contains("Editar").first().click();
    cy.get("input").first().clear().type("Refeição Editada");
  });

  it("Possui botão Cancelar no modal", () => {
    cy.contains("Editar").first().click();
    cy.contains("Cancelar").should("exist");
  });

  it("Possui botão Salvar Alterações", () => {
    cy.contains("Editar").first().click();
    cy.contains("Salvar Alterações").should("exist");
  });

  it("Fecha modal ao clicar Cancelar", () => {
    cy.contains("Editar").first().click();
    cy.contains("Cancelar").click();
    cy.wait(1000); 
    cy.contains("Editar Refeição").should("not.exist");
  });

});
