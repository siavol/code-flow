describe('Steps panel', () => {
  beforeEach(() => {
    cy.intercept('GET', 'flows.json', { fixture: 'basic.json' });
    cy.visit('index.html');
  });

  it('shows empty state when no flow is selected', () => {
    cy.get('#steps-empty').should('be.visible');
    cy.get('.step-card').should('not.exist');
  });

  it('shows step cards when a flow is selected', () => {
    cy.contains('.flow-item', 'Invite new user').click();
    cy.get('.step-card').should('have.length', 3);
  });

  it('step cards are collapsed by default when a flow is selected', () => {
    cy.contains('.flow-item', 'Invite new user').click();
    cy.get('.step-card').should('have.length', 3);
    cy.get('.step-card.expanded').should('not.exist');
    cy.get('.step-card.active').should('not.exist');
  });

  it('clicking a step card expands it', () => {
    cy.contains('.flow-item', 'Invite new user').click();
    cy.get('.step-card[data-order="1"]').click();
    cy.get('.step-card[data-order="1"]').should('have.class', 'expanded');
  });

  it('clicking an expanded step card collapses it', () => {
    cy.contains('.flow-item', 'Invite new user').click();
    cy.get('.step-card[data-order="1"]').click();
    cy.get('.step-card[data-order="1"]').click();
    cy.get('.step-card[data-order="1"]').should('not.have.class', 'expanded');
  });

  it('activates and expands the matching step card when a visible edge is tapped', () => {
    cy.contains('.flow-item', 'Invite new user').click();
    cy.window().then(win => win.eval('cy').getElementById('invite-user__2').emit('tap'));
    cy.get('.step-card[data-order="2"]').should('have.class', 'active');
    cy.get('.step-card[data-order="2"]').should('have.class', 'expanded');
    cy.get('.step-card[data-order="1"]').should('not.have.class', 'active');
  });

  it('resets to empty state when the active flow is deselected', () => {
    cy.contains('.flow-item', 'Invite new user').click();
    cy.get('.step-card').should('have.length', 3);
    cy.contains('.flow-item', 'Invite new user').click();
    cy.get('#steps-empty').should('be.visible');
    cy.get('.step-card').should('not.exist');
  });
});
