describe('Sidebar', () => {
  it('lists all flow names', () => {
    cy.intercept('GET', 'flows.json', { fixture: 'basic.json' });
    cy.visit('index.html');
    cy.get('.flow-item').should('have.length', 2);
    cy.get('.flow-item').eq(0).should('contain.text', 'Invite new user');
    cy.get('.flow-item').eq(1).should('contain.text', 'Log in');
  });

  it('shows correct flow count', () => {
    cy.intercept('GET', 'flows.json', { fixture: 'basic.json' });
    cy.visit('index.html');
    cy.get('#flow-count').should('contain.text', '2 flows');
  });

  it('shows 0 flows when data has no flows', () => {
    cy.intercept('GET', 'flows.json', { fixture: 'empty-flows.json' });
    cy.visit('index.html');
    cy.get('#flow-count').should('contain.text', '0 flows');
    cy.get('.flow-item').should('not.exist');
  });
});
