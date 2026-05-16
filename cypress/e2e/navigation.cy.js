const setup = (settingsFixture, opts = {}) => {
  cy.intercept('GET', 'flows.json', { fixture: 'basic.json' });
  if (settingsFixture) {
    cy.intercept('GET', 'settings.json', { fixture: settingsFixture });
  } else {
    cy.intercept('GET', 'settings.json', { statusCode: 404 });
  }
  cy.visit('index.html', opts);
  cy.get('.flow-item').should('have.length', 2);
};

describe('Navigation warning', () => {
  it('shows warning when settings.json is missing', () => {
    setup(null);
    cy.get('#nav-warning').should('be.visible');
  });
});

describe('Package navigation', () => {
  it('opens vscode URL to entryFile when clicking the strip link after selecting a node with entryFile', () => {
    setup('settings-vscode.json', {
      onBeforeLoad(win) { cy.stub(win, 'open').as('navigate'); }
    });
    cy.window().then(win => win.eval('cy').getElementById('auth').emit('tap'));
    cy.get('#info-strip-link').click();
    cy.get('@navigate').should('have.been.calledWith',
      'vscode://file//Users/me/project/src/auth/index.js'
    );
  });

  it('opens vscode URL to path when clicking the strip link after selecting a node without entryFile', () => {
    setup('settings-vscode.json', {
      onBeforeLoad(win) { cy.stub(win, 'open').as('navigate'); }
    });
    cy.window().then(win => win.eval('cy').getElementById('users').emit('tap'));
    cy.get('#info-strip-link').click();
    cy.get('@navigate').should('have.been.calledWith',
      'vscode://file//Users/me/project/src/users'
    );
  });

  it('opens github tree URL when clicking the strip link after selecting a node', () => {
    setup('settings-github.json', {
      onBeforeLoad(win) { cy.stub(win, 'open').as('navigate'); }
    });
    cy.window().then(win => win.eval('cy').getElementById('auth').emit('tap'));
    cy.get('#info-strip-link').click();
    cy.get('@navigate').should('have.been.calledWith',
      'https://github.com/acme/myrepo/tree/main/src/auth'
    );
  });
});

describe('Step navigation', () => {
  it('opens vscode file:line URL when clicking the strip link after selecting a step edge', () => {
    setup('settings-vscode.json', {
      onBeforeLoad(win) { cy.stub(win, 'open').as('navigate'); }
    });
    cy.contains('.flow-item', 'Invite new user').click();
    cy.window().then(win => {
      win.eval('cy').getElementById('invite-user__1').emit('tap');
    });
    cy.get('#info-strip-link').click();
    cy.get('@navigate').should('have.been.calledWith',
      'vscode://file//Users/me/project/src/api-gateway/routes/users.js:15'
    );
  });
});

describe('No-location steps', () => {
  it('applies no-location class to steps without a location', () => {
    setup('settings-vscode.json');
    cy.window().then(win => {
      expect(win.eval('cy').getElementById('invite-user__3').hasClass('no-location')).to.be.true;
    });
  });

  it('does not navigate when clicking a no-location step', () => {
    setup('settings-vscode.json', {
      onBeforeLoad(win) { cy.stub(win, 'open').as('navigate'); }
    });
    cy.contains('.flow-item', 'Invite new user').click();
    cy.window().then(win => {
      win.eval('cy').getElementById('invite-user__3').emit('tap');
    });
    cy.get('@navigate').should('not.have.been.called');
  });
});
