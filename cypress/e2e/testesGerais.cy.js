describe('NutriPlan App', () => {
  beforeEach(() => {
    cy.visit('http://localhost:5173');
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
    cy.contains('Refeição').should('exist'); 

    cy.contains('Perfil').click();
    cy.contains('Altura').should('exist'); 
  });

  it('deve ajustar o layout para diferentes tamanhos de tela', () => {
    cy.viewport(320, 480);
    cy.contains('NutriPlan').should('be.visible');
    cy.viewport(768, 1024);
    cy.contains('NutriPlan').should('be.visible');
    cy.viewport(1440, 900);
    cy.contains('NutriPlan').should('be.visible');
  });

  it('deve carregar a aplicação rapidamente', () => {
        onLoad: (contentWindow) => {
        const loadTime = contentWindow.performance.timing.loadEventEnd - contentWindow.performance.timing.navigationStart;
        expect(loadTime).to.be.lessThan(2000);
      } 
  });

  it('deve manter a funcionalidade após recarregar a página', () => {
    cy.reload();
    cy.contains('NutriPlan').should('be.visible');
    cy.contains('Adicionar Refeição').click();
    cy.contains('Adicionar Nova Refeição').should('be.visible');
  });
});


