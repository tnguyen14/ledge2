describe('Open app', () => {
  beforeEach(() => {
    cy.restoreLocalStorage();
    // cy.visit('https://lab.tridnguyen.com/ledge/');
    cy.visit('http://localhost:4003');
  });
  it('Show login button, perform login', () => {
    cy.contains('Log In');
    cy.login();
    cy.saveLocalStorage();
  });
  it('Display logged in content', () => {
    cy.contains('Add a new transaction');
    cy.contains('Weekly Averages');
  });
});
