describe('NutriPlan App', () => {
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

  });

it('deve renderizar o título e as abas principais', () => {
    cy.contains('h1', 'NutriPlan').should('be.visible');

    cy.contains('Dashboard').should('be.visible');
    cy.contains('Adicionar Refeição').should('be.visible');
    cy.contains('Histórico').should('be.visible');
    cy.contains('Perfil').should('be.visible');
  });
  
  it('deve trocar entre as abas corretamente', () => {
    cy.contains('Adicionar Refeição').click();
    cy.contains('Adicionar Nova Refeição').should('be.visible');

    cy.contains('Histórico').click();
    cy.contains('Histórico').should('exist'); 

    cy.contains('Perfil').click();
    cy.contains('Perfil do Usuário').should('exist'); 
  });

  it('deve ajustar o layout para diferentes tamanhos de tela', () => {
    cy.viewport(320, 480); // mobile
    cy.contains('NutriPlan').should('be.visible');

    cy.viewport(768, 1024); // tablet
    cy.contains('NutriPlan').should('be.visible');

    cy.viewport(1440, 900); // desktop
    cy.contains('NutriPlan').should('be.visible');
  });

  it('deve carregar a aplicação rapidamente', () => {
    cy.window().then((win) => {
      const perf = win.performance;

      const loadTime =
        perf.timing.loadEventEnd - perf.timing.navigationStart;

      expect(loadTime).to.be.lessThan(2000); // 2 segundos
    });
  });

  it('deve manter a funcionalidade após recarregar a página', () => {
    cy.reload();

    cy.contains('NutriPlan').should('be.visible');

    cy.contains('Adicionar Refeição').click();
    cy.contains('Adicionar Nova Refeição').should('be.visible');
  });
});


