describe('Graph', () => {
  beforeEach(() => {
    cy.intercept('GET', 'flows.json', { fixture: 'basic.json' });
    cy.visit('index.html');
    // wait for init() to complete before querying Cytoscape
    cy.get('.flow-item').should('have.length', 2);
  });

  it('renders a node for each package', () => {
    cy.window().then(win => {
      expect(win.eval('cy').nodes().length).to.equal(4);
    });
  });

  it('shows no edges by default', () => {
    cy.window().then(win => {
      expect(win.eval('cy').edges('.visible').length).to.equal(0);
    });
  });

  it('no node is highlighted or dimmed by default', () => {
    cy.window().then(win => {
      win.eval('cy').nodes().forEach(node => {
        expect(node.hasClass('highlighted')).to.be.false;
        expect(node.hasClass('dimmed')).to.be.false;
      });
    });
  });
});
