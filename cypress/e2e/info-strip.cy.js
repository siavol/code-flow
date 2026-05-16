const setup = (opts = {}) => {
  cy.intercept('GET', 'flows.json', { fixture: 'basic.json' });
  cy.intercept('GET', 'settings.json', { fixture: 'settings-vscode.json' });
  cy.visit('index.html', opts);
  cy.get('.flow-item').should('have.length', 2);
};

describe('Info strip', () => {
  it('is hidden by default', () => {
    setup();
    cy.get('#info-strip').should('not.be.visible');
  });

  it('shows with package name after clicking a node', () => {
    setup();
    cy.window().then(win => win.eval('cy').getElementById('auth').emit('tap'));
    cy.get('#info-strip').should('be.visible');
    cy.get('#info-strip-name').should('have.text', 'Auth');
  });

  it('hides after clicking the same node again', () => {
    setup();
    cy.window().then(win => win.eval('cy').getElementById('auth').emit('tap'));
    cy.get('#info-strip').should('be.visible');
    cy.window().then(win => win.eval('cy').getElementById('auth').emit('tap'));
    cy.get('#info-strip').should('not.be.visible');
  });

  it('updates when clicking a different node', () => {
    setup();
    cy.window().then(win => win.eval('cy').getElementById('auth').emit('tap'));
    cy.get('#info-strip-name').should('have.text', 'Auth');
    cy.window().then(win => win.eval('cy').getElementById('email').emit('tap'));
    cy.get('#info-strip').should('be.visible');
    cy.get('#info-strip-name').should('have.text', 'Email');
  });

  it('shows step label after clicking a visible step edge', () => {
    setup();
    cy.contains('.flow-item', 'Invite new user').click();
    cy.window().then(win => win.eval('cy').getElementById('invite-user__1').emit('tap'));
    cy.get('#info-strip').should('be.visible');
    cy.get('#info-strip-name').should('have.text', '1. validate admin token');
  });

  it('shows no nav link for a no-location step', () => {
    setup();
    cy.contains('.flow-item', 'Invite new user').click();
    cy.window().then(win => win.eval('cy').getElementById('invite-user__3').emit('tap'));
    cy.get('#info-strip').should('be.visible');
    cy.get('#info-strip-link').should('not.be.visible');
  });
});
