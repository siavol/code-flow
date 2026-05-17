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
  it('shows package info panel when a node is tapped', () => {
    setup('settings-vscode.json');
    cy.window().then(win => win.eval('cy').getElementById('auth').emit('tap'));
    cy.get('#service-info').should('be.visible');
  });

  it('panel link has vscode URL to entryFile for a node with entryFile', () => {
    setup('settings-vscode.json');
    cy.window().then(win => win.eval('cy').getElementById('auth').emit('tap'));
    cy.get('#service-info a').should('have.attr', 'href',
      'vscode://file//Users/me/project/src/auth/index.js'
    );
  });

  it('panel link has vscode URL to path for a node without entryFile', () => {
    setup('settings-vscode.json');
    cy.window().then(win => win.eval('cy').getElementById('users').emit('tap'));
    cy.get('#service-info a').should('have.attr', 'href',
      'vscode://file//Users/me/project/src/users'
    );
  });

  it('panel link has github URL when provider is github', () => {
    setup('settings-github.json');
    cy.window().then(win => win.eval('cy').getElementById('auth').emit('tap'));
    cy.get('#service-info a').should('have.attr', 'href',
      'https://github.com/acme/myrepo/tree/main/src/auth'
    );
  });

  it('does not navigate immediately when a node is tapped', () => {
    setup('settings-vscode.json', {
      onBeforeLoad(win) { cy.stub(win, 'open').as('navigate'); }
    });
    cy.window().then(win => win.eval('cy').getElementById('auth').emit('tap'));
    cy.get('@navigate').should('not.have.been.called');
  });

  it('shows no link in panel when settings.json is missing', () => {
    setup(null);
    cy.window().then(win => win.eval('cy').getElementById('auth').emit('tap'));
    cy.get('#service-info').should('be.visible');
    cy.get('#service-info a').should('not.exist');
  });
});

describe('Step navigation', () => {
  it('step card link has correct vscode URL for a step with location', () => {
    setup('settings-vscode.json');
    cy.contains('.flow-item', 'Invite new user').click();
    cy.get('.step-card[data-order="1"] .step-fileref')
      .should('have.attr', 'href', 'vscode://file//Users/me/project/src/api-gateway/routes/users.js:15');
  });
});

describe('No-location steps', () => {
  it('applies no-location class to steps without a location', () => {
    setup('settings-vscode.json');
    cy.window().then(win => {
      expect(win.eval('cy').getElementById('invite-user__3').hasClass('no-location')).to.be.true;
    });
  });

  it('does not navigate when clicking a no-location step edge', () => {
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
