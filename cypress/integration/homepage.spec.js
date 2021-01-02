describe('Open app', () => {
  beforeEach(() => {
    cy.restoreLocalStorage();
    cy.visit('/');
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
