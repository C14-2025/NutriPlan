describe('Página de Login - NutriPlan', () => {

  beforeEach(() => {
    cy.visit('http://localhost:5173'); 
  });

  it('Deve renderizar a tela de login corretamente', () => {
    cy.contains('NutriPlan');
    cy.contains('Acesse sua conta para continuar');
    cy.get('input#email').should('exist');
    cy.get('input#senha').should('exist');
    cy.contains('Entrar');
  });

  it('Deve permitir digitar email e senha', () => {
    cy.get('#email').type('teste@email.com').should('have.value', 'teste@email.com');
    cy.get('#senha').type('123456').should('have.value', '123456');
  });

  it('Deve fazer login com sucesso e salvar dados no localStorage', () => {
    cy.intercept('POST', '/auth/login', {
      statusCode: 200,
      body: {
        id: 1,
        nome: "Giovana",
        email: "giovana@test.com",
        idade: 20,
        peso: 60,
        altura: 170,
        objetivo: "Emagrecer",
        sexo: "F",
        nivelAtividade: "Moderado"
      }
    }).as('loginRequest');

    cy.get('#email').type('giovana@test.com');
    cy.get('#senha').type('123456');

    cy.contains('Entrar').click();

    cy.wait('@loginRequest');

    cy.window().then((win) => {
      expect(win.localStorage.getItem('usuarioId')).to.eq('1');
      expect(win.localStorage.getItem('usuarioNome')).to.eq('Giovana');
      expect(win.localStorage.getItem('usuarioEmail')).to.eq('giovana@test.com');
    });
  });

  it('Deve exibir mensagem de erro quando o login falhar', () => {
    cy.intercept('POST', '/auth/login', {
      statusCode: 401,
      body: { message: 'Credenciais inválidas' }
    }).as('loginErro');

    cy.get('#email').type('errado@test.com');
    cy.get('#senha').type('senhaerrada');
    cy.contains('Entrar').click();

    cy.wait('@loginErro');

    cy.contains('Credenciais inválidas').should('exist');
  });

  it('Deve chamar o botão "Cadastre-se"', () => {
    const onSwitchSpy = cy.spy().as('switchRegister');

    // ⚠️ Você precisa montar o componente no cypress/gui ou usar a app rodando com esse callback.
    cy.contains('Cadastre-se').should('exist');
  });
});
