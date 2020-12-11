describe('Open app', () => {
  it('Open app', () => {
    cy.visit('https://lab.tridnguyen.com/ledge/');
    cy.contains('Log In');
    cy.login();
  });
});
