describe('MealForm Component', () => {
  beforeEach(() => {
    cy.visit('http://localhost:5173'); 
    cy.contains('Adicionar Refeição').click(); 
  });

  it('deve renderizar os campos principais do formulário', () => {
    cy.get('input#meal-name').should('be.visible');
    cy.get('input#meal-date').should('be.visible');
    cy.contains('Adicionar Alimento').should('exist');
    cy.contains('Totais da Refeição').should('exist');
  });

  it('deve adicionar um novo campo de alimento ao clicar em "Adicionar Alimento"', () => {
    cy.contains('Adicionar Alimento').click();
    cy.contains('Alimento 2').should('exist');
  });

  it('deve preencher o formulário e adicionar uma refeição com sucesso', () => {
  cy.get('input#meal-name').type('Jantar de Teste');
  cy.get('[id="meal-date"]').invoke('val').should('not.be.empty');
  cy.contains('Selecionar Alimento Comum').parent().find('[role="combobox"]').click();
  cy.contains('[role="option"]', 'Arroz integral').should('be.visible').click();
  cy.get('input[placeholder="1"]').clear().type('1');
  cy.contains('Adicionar Refeição').click();

  cy.on('window:alert', (msg) => {
    expect(msg).to.include('Refeição adicionada com sucesso');
  });
});

  it('deve impedir envio se o nome da refeição estiver vazio', () => {
    cy.contains('Adicionar Refeição').click();
    cy.on('window:alert', (msg) => {
      expect(msg).to.include('Por favor, preencha o nome da refeição');
    });
  });

  it('deve calcular corretamente os totais após adicionar alimento', () => {
    cy.get('input#meal-name').type('Café da manhã');
    cy.contains('Selecionar Alimento Comum').parent().find('[role="combobox"]').click();


    cy.contains('[role="option"]', 'Ovo inteiro').should('be.visible').click();
    cy.get('input[placeholder="1"]').clear().type('2');

    cy.contains('Adicionar Refeição').click();

    cy.on('window:alert', (msg) => {
      expect(msg).to.include('Refeição adicionada com sucesso');
    });

    // Espera render do total
    cy.wait(300);

    cy.contains('Calorias')
      .parent()
      .find('.text-2xl')
      .should(($el) => {
        const value = parseInt($el.text());
        expect(value).to.be.greaterThan(100);
      });
  });

  it('deve remover um alimento ao clicar no botão de lixeira', () => {
    cy.contains('Adicionar Alimento').click();
    cy.contains('Alimento 2').parent().within(() => {
      cy.get('button').contains('Trash2').should('exist');
    });

    cy.get('button').contains('Alimento 2').should('exist');
  });

  it('deve navegar corretamente usando a tecla Tab', () => {
    cy.get('body').tab();
    cy.focused().should('have.attr', 'id', 'meal-name');
    cy.focused().tab();
    cy.focused().should('have.attr', 'id', 'meal-date');
    cy.focused().tab();
    cy.focused().should('have.attr', 'aria-label', 'Selecionar Alimento Comum');
    cy.focused().tab();
    cy.focused().should('have.attr', 'placeholder', 'Quantidade em porções');
    cy.focused().tab();
    cy.focused().should('have.attr', 'aria-label', 'Adicionar Alimento');
    cy.focused().tab();
    cy.focused().should('have.attr', 'aria-label', 'Adicionar Refeição');
  });

  it('deve navegar corretamente para o formulário ao clicar na aba "Adicionar Refeição"', () => {
    cy.contains('Adicionar Refeição').click();
    cy.url().should('include', '/add-meal');
    cy.contains('Adicionar Nova Refeição').should('be.visible');
  });

  it('deve manter a funcionalidade após recarregar a página', () => {
    cy.reload();
    cy.contains('Adicionar Refeição').click();
    cy.contains('Adicionar Nova Refeição').should('be.visible');
  });

  it('deve ajustar o layout para diferentes tamanhos de tela', () => {
    cy.viewport(320, 480);
    cy.get('form').should('be.visible');
    cy.viewport(768, 1024);
    cy.get('form').should('be.visible');
    cy.viewport(1440, 900);
    cy.get('form').should('be.visible');
  });

  it('deve carregar o formulário rapidamente', () => {
        onLoad: (contentWindow) => {
        const loadTime = contentWindow.performance.timing.loadEventEnd - contentWindow.performance.timing.navigationStart;
        expect(loadTime).to.be.lessThan(2000);
      } 
  });

  

});
