const setup = () => {
  cy.intercept('GET', 'flows.json', { fixture: 'basic.json' });
  cy.intercept('GET', 'settings.json', { statusCode: 404 });
  cy.visit('index.html');
  cy.get('.flow-item').should('have.length', 2);
};

describe('Node filter — activation', () => {
  beforeEach(() => {
    setup();
    cy.contains('.flow-item', 'Invite new user').click();
  });

  it('filter bar is hidden when no node is selected', () => {
    cy.get('#node-filter').should('not.be.visible');
  });

  it('clicking an in-flow node shows the filter bar with the node name', () => {
    cy.window().then(win => win.eval('cy').getElementById('auth').emit('tap'));
    cy.get('#node-filter').should('be.visible');
    cy.get('#node-filter-name').should('contain.text', 'Node: Auth');
  });

  it('steps referencing the node get the highlighted class and are expanded', () => {
    cy.window().then(win => win.eval('cy').getElementById('auth').emit('tap'));
    // auth is source in step 1 and target in step 2 — both highlight
    cy.get('.step-card[data-order="1"]').should('have.class', 'highlighted').and('have.class', 'expanded');
    cy.get('.step-card[data-order="2"]').should('have.class', 'highlighted').and('have.class', 'expanded');
  });

  it('steps not referencing the node get the de-emphasised class', () => {
    cy.window().then(win => win.eval('cy').getElementById('auth').emit('tap'));
    // auth does not appear in step 3 (users → email)
    cy.get('.step-card[data-order="3"]').should('have.class', 'de-emphasised');
  });

  it('clicking a node that is not part of the flow does not show the filter bar', () => {
    // Log in flow only uses api-gateway and auth; switch to it then tap email (not in that flow)
    cy.contains('.flow-item', 'Log in').click();
    cy.window().then(win => win.eval('cy').getElementById('email').emit('tap'));
    cy.get('#node-filter').should('not.be.visible');
    cy.get('#service-info').should('be.visible');
  });
});

describe('Node filter — dismissal', () => {
  beforeEach(() => {
    setup();
    cy.contains('.flow-item', 'Invite new user').click();
    cy.window().then(win => win.eval('cy').getElementById('auth').emit('tap'));
    cy.get('#node-filter').should('be.visible');
  });

  it('× button hides the filter bar and restores collapsed steps', () => {
    cy.get('#node-filter-clear').click();
    cy.get('#node-filter').should('not.be.visible');
    cy.get('.step-card.highlighted').should('not.exist');
    cy.get('.step-card.de-emphasised').should('not.exist');
    cy.get('.step-card.expanded').should('not.exist');
  });

  it('× button clears the canvas node selection', () => {
    cy.get('#node-filter-clear').click();
    cy.window().then(win => {
      expect(win.eval('cy').nodes('.selected').length).to.equal(0);
    });
  });

  it('clicking canvas background hides the filter bar and keeps the flow active', () => {
    cy.window().then(win => win.eval('cy').emit('tap'));
    cy.get('#node-filter').should('not.be.visible');
    cy.get('.flow-item.active').should('exist');
    cy.get('.step-card').should('have.length', 3);
  });

  it('selecting a different flow clears the filter bar', () => {
    cy.contains('.flow-item', 'Log in').click();
    cy.get('#node-filter').should('not.be.visible');
    cy.get('.step-card.highlighted').should('not.exist');
  });

  it('tapping the same node again clears the filter bar', () => {
    cy.window().then(win => win.eval('cy').getElementById('auth').emit('tap'));
    cy.get('#node-filter').should('not.be.visible');
  });
});
