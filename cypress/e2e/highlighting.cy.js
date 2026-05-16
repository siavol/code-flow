describe('Highlighting', () => {
  beforeEach(() => {
    cy.intercept('GET', 'flows.json', { fixture: 'basic.json' });
    cy.visit('index.html');
  });

  it('marks the clicked flow item as active', () => {
    cy.contains('.flow-item', 'Invite new user').click();
    cy.contains('.flow-item', 'Invite new user').should('have.class', 'active');
  });

  it('highlights all packages involved in the selected flow', () => {
    cy.contains('.flow-item', 'Invite new user').click();
    // invite-user touches api-gateway, auth, users, email
    cy.window().then(win => {
      ['api-gateway', 'auth', 'users', 'email'].forEach(id => {
        expect(win.eval('cy').getElementById(id).hasClass('highlighted'), id).to.be.true;
      });
    });
  });

  it('dims packages not involved in the selected flow', () => {
    cy.contains('.flow-item', 'Log in').click();
    // log-in touches api-gateway, auth, users — email is not involved
    cy.window().then(win => {
      expect(win.eval('cy').getElementById('email').hasClass('dimmed')).to.be.true;
    });
  });

  it('shows only the selected flow edges', () => {
    cy.contains('.flow-item', 'Invite new user').click();
    cy.window().then(win => {
      const visible = win.eval('cy').edges('.visible');
      expect(visible.length).to.equal(3); // invite-user has 3 steps
      visible.forEach(edge => {
        expect(edge.data('flowId')).to.equal('invite-user');
      });
    });
  });

  it('selecting a different flow switches the highlight', () => {
    cy.contains('.flow-item', 'Invite new user').click();
    cy.contains('.flow-item', 'Log in').click();
    cy.contains('.flow-item', 'Invite new user').should('not.have.class', 'active');
    cy.contains('.flow-item', 'Log in').should('have.class', 'active');
    cy.window().then(win => {
      expect(win.eval('cy').edges('.visible').length).to.equal(2); // log-in has 2 steps
    });
  });
});
