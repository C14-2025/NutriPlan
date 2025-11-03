



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
});

// -------------------------------------------------------------------------

describe('Navegação entre abas', () => {
  beforeEach(() => {
    cy.visit('http://localhost:5173');
  });
  
it('deve trocar entre as abas corretamente', () => {
  cy.contains('Adicionar Refeição').click();
  cy.contains('Adicionar Nova Refeição').should('be.visible');

  cy.contains('Histórico').click();
  cy.contains('Refeição').should('exist'); 

  cy.contains('Perfil').click();
  cy.contains('Altura').should('exist'); 
});

});

// -------------------------------------------------------------------------  

describe('Responsividade', () => {

  beforeEach(() => {
    cy.visit('http://localhost:5173');
  });

  it('deve ajustar o layout para diferentes tamanhos de tela', () => {
    cy.viewport(320, 480);
    cy.contains('NutriPlan').should('be.visible');
    cy.viewport(768, 1024);
    cy.contains('NutriPlan').should('be.visible');
    cy.viewport(1440, 900);
    cy.contains('NutriPlan').should('be.visible');
  });
});

describe('Acessibilidade', () => {

  beforeEach(() => {
    cy.visit('http://localhost:5173');
  });

  it('deve ter elementos acessíveis via teclado', () => {
    cy.get('body').tab();
    cy.focused().should('have.attr', 'aria-label', 'Dashboard');
    cy.focused().tab();
    cy.focused().should('have.attr', 'aria-label', 'Adicionar Refeição');
    cy.focused().tab();
    cy.focused().should('have.attr', 'aria-label', 'Histórico');
    cy.focused().tab();
    cy.focused().should('have.attr', 'aria-label', 'Perfil');
  });
});

// -------------------------------------------------------------------------

describe('Desempenho', () => {
  it('deve carregar a aplicação rapidamente', () => {
    cy.visit('http://localhost:5173', {
      onLoad: (contentWindow) => {
        const loadTime = contentWindow.performance.timing.loadEventEnd - contentWindow.performance.timing.navigationStart;
        expect(loadTime).to.be.lessThan(2000);
      } 
    });
  });
});

// -------------------------------------------------------------------------
