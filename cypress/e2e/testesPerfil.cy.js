describe("UserProfile Component", () => {

  beforeEach(() => {
    cy.visit("http://localhost:5173");
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
    cy.contains("Mulher").click();
    cy.contains("Mulher").should("exist");
  });

  it("Abre select de nível de atividade", () => {
    cy.contains("Editar Perfil").click();
    cy.contains("Nível de Atividade").parent().find("button").click();
    cy.contains("Moderadamente ativo").should("exist");
  });

  it("Exibe descrição do nível de atividade quando não está editando", () => {
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


  it("Exibe IMC corretamente", () => {
    cy.contains("IMC").should("exist");
  });


  it("Exibe categoria do IMC", () => {
  cy.contains(/Abaixo do peso|Peso normal|Sobrepeso|Obesidade/)
    .should("be.visible");
});


  it("Renderiza taxa metabólica basal", () => {
    cy.contains("TMB").should("exist");
  });


  it("Exibe calorias/dia com atividade", () => {
    cy.contains("Calorias/dia").should("exist");
  });


  it("Botão Calcular Automaticamente preenche metas", () => {
    cy.contains("Editar Perfil").click();
    cy.contains("Calcular Automaticamente").click();
    cy.contains("Calorias Diárias").parent().find("input").should("not.have.value", "");
  });


  it("Permite alterar metas nutricionais", () => {
    cy.contains("Editar Perfil").click();
    cy.contains("Calorias Diárias").parent().find("input").clear().type("2000");
    cy.contains("Salvar Metas").click();
  });


  it("Renderiza distribuição de macronutrientes", () => {
    cy.contains("Proteína").should("exist");
    cy.contains("Carboidratos").should("exist");
    cy.contains("Gordura").should("exist");
  });

  it("Smoke test geral do UserProfile", () => {
    cy.contains("Perfil do Usuário").should("exist");
    cy.contains("Métricas de Saúde").should("exist");
    cy.contains("Metas Nutricionais").should("exist");
  });

});
