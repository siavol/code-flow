const setup = () => {
  cy.intercept('GET', 'flows.json', { fixture: 'basic.json' });
  cy.intercept('GET', 'settings.json', { fixture: 'settings-vscode.json' });
  cy.visit('index.html');
  cy.get('.flow-item').should('have.length', 2);
};

describe('Selection state', () => {
  it('adds selected class to a clicked node', () => {
    setup();
    cy.window().then(win => {
      win.eval('cy').getElementById('auth').emit('tap');
      expect(win.eval('cy').getElementById('auth').hasClass('selected')).to.be.true;
    });
  });

  it('removes selected class when clicking the same node again', () => {
    setup();
    cy.window().then(win => {
      const graph = win.eval('cy');
      graph.getElementById('auth').emit('tap');
      graph.getElementById('auth').emit('tap');
      expect(graph.getElementById('auth').hasClass('selected')).to.be.false;
    });
  });

  it('moves selected class when clicking a different node', () => {
    setup();
    cy.window().then(win => {
      const graph = win.eval('cy');
      graph.getElementById('auth').emit('tap');
      graph.getElementById('email').emit('tap');
      expect(graph.getElementById('auth').hasClass('selected')).to.be.false;
      expect(graph.getElementById('email').hasClass('selected')).to.be.true;
    });
  });

  it('adds selected class to a clicked visible step edge', () => {
    setup();
    cy.contains('.flow-item', 'Invite new user').click();
    cy.window().then(win => {
      win.eval('cy').getElementById('invite-user__1').emit('tap');
      expect(win.eval('cy').getElementById('invite-user__1').hasClass('selected')).to.be.true;
    });
  });

  it('clears selected edge when clicking a node', () => {
    setup();
    cy.contains('.flow-item', 'Invite new user').click();
    cy.window().then(win => {
      const graph = win.eval('cy');
      graph.getElementById('invite-user__1').emit('tap');
      graph.getElementById('auth').emit('tap');
      expect(graph.getElementById('invite-user__1').hasClass('selected')).to.be.false;
      expect(graph.getElementById('auth').hasClass('selected')).to.be.true;
    });
  });
});
