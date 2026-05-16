describe('Deselect', () => {
  beforeEach(() => {
    cy.intercept('GET', 'flows.json', { fixture: 'basic.json' });
    cy.visit('index.html');
    cy.contains('.flow-item', 'Invite new user').click();
  });

  it('removes active class when clicking the active flow again', () => {
    cy.contains('.flow-item', 'Invite new user').click();
    cy.contains('.flow-item', 'Invite new user').should('not.have.class', 'active');
  });

  it('restores all nodes to default state', () => {
    cy.contains('.flow-item', 'Invite new user').click();
    cy.window().then(win => {
      win.eval('cy').nodes().forEach(node => {
        expect(node.hasClass('highlighted'), node.id()).to.be.false;
        expect(node.hasClass('dimmed'), node.id()).to.be.false;
      });
    });
  });

  it('hides all edges', () => {
    cy.contains('.flow-item', 'Invite new user').click();
    cy.window().then(win => {
      expect(win.eval('cy').edges('.visible').length).to.equal(0);
    });
  });
});
