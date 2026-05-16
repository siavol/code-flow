describe('Error state', () => {
  it('shows error panel when flows.json fails to load', () => {
    cy.intercept('GET', 'flows.json', { statusCode: 500 });
    cy.visit('index.html');
    cy.get('#error-panel').should('be.visible');
    cy.get('#hint').should('not.be.visible');
  });

  it('shows error panel when flows.json returns invalid JSON', () => {
    cy.intercept('GET', 'flows.json', { body: 'not valid json', headers: { 'content-type': 'text/plain' } });
    cy.visit('index.html');
    cy.get('#error-panel').should('be.visible');
  });

  it('does not render the graph on error', () => {
    cy.intercept('GET', 'flows.json', { statusCode: 500 });
    cy.visit('index.html');
    cy.get('.flow-item').should('not.exist');
  });
});
