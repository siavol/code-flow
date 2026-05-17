const setup = (opts = {}) => {
  cy.intercept('GET', 'flows.json', { fixture: 'services.json' });
  cy.intercept('GET', 'settings.json', { statusCode: 404 });
  cy.visit('index.html', opts);
  cy.get('.flow-item').should('have.length', 2);
};

describe('Service compound nodes', () => {
  beforeEach(() => setup());

  it('renders a compound node for each service plus Shared', () => {
    cy.window().then(win => {
      const parents = win.eval('cy').nodes(':parent');
      expect(parents.length).to.equal(3); // backend, notifications, shared
    });
  });

  it('places packages inside their service compound node', () => {
    cy.window().then(win => {
      const cy = win.eval('cy');
      expect(cy.getElementById('api-gateway').parent().id()).to.equal('backend');
      expect(cy.getElementById('auth').parent().id()).to.equal('backend');
      expect(cy.getElementById('users').parent().id()).to.equal('backend');
      expect(cy.getElementById('email').parent().id()).to.equal('notifications');
    });
  });

  it('places packages with no serviceId inside the Shared compound node', () => {
    cy.window().then(win => {
      expect(win.eval('cy').getElementById('utils').parent().id()).to.equal('shared');
    });
  });
});

describe('Cross-service edges', () => {
  beforeEach(() => setup());

  it('marks steps crossing service boundaries with cross-service class', () => {
    cy.contains('.flow-item', 'Invite new user').click();
    cy.window().then(win => {
      // users (backend) → email (notifications) crosses a service boundary
      expect(win.eval('cy').getElementById('invite-user__3').hasClass('cross-service')).to.be.true;
    });
  });

  it('does not mark in-service steps as cross-service', () => {
    cy.contains('.flow-item', 'Invite new user').click();
    cy.window().then(win => {
      // api-gateway → auth are both in backend
      expect(win.eval('cy').getElementById('invite-user__1').hasClass('cross-service')).to.be.false;
    });
  });
});

describe('Service info panel', () => {
  it('is hidden by default', () => {
    setup();
    cy.get('#service-info').should('not.be.visible');
  });

  it('shows service name, path, tech stack and description when a service node is tapped', () => {
    setup();
    cy.window().then(win => {
      win.eval('cy').getElementById('backend').emit('tap');
    });
    cy.get('#service-info').should('be.visible');
    cy.get('#service-info').should('contain.text', 'Backend');
    cy.get('#service-info').should('contain.text', 'services/backend');
    cy.get('#service-info').should('contain.text', 'Node.js');
    cy.get('#service-info').should('contain.text', 'Handles API requests and business logic');
  });

  it('does not navigate when a service node is tapped', () => {
    setup({
      onBeforeLoad(win) { cy.stub(win, 'open').as('navigate'); }
    });
    cy.intercept('GET', 'settings.json', { fixture: 'settings-vscode.json' });
    cy.window().then(win => {
      win.eval('cy').getElementById('backend').emit('tap');
    });
    cy.get('@navigate').should('not.have.been.called');
  });

  it('hides service info when background is tapped', () => {
    setup();
    cy.window().then(win => {
      win.eval('cy').getElementById('backend').emit('tap');
    });
    cy.get('#service-info').should('be.visible');
    cy.window().then(win => {
      win.eval('cy').emit('tap');
    });
    cy.get('#service-info').should('not.be.visible');
  });
});
